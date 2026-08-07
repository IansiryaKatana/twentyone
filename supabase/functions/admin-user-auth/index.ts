import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type AdminRole = "owner" | "admin" | "editor" | "viewer";

type RequestBody = {
  action: "create_user" | "set_password";
  email?: string;
  password?: string;
  role?: AdminRole;
  display_name?: string | null;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json({ ok: false, error: "Missing authorization" }, 401);
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const serviceClient = createClient(supabaseUrl, serviceRoleKey);

    const jwt = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await userClient.auth.getUser(jwt);
    if (userError || !userData.user) {
      return json({ ok: false, error: "Invalid session" }, 401);
    }

    const { data: adminRow, error: adminError } = await serviceClient
      .from("admin_users")
      .select("role, is_active, email")
      .or(
        `auth_user_id.eq.${userData.user.id},email.eq.${userData.user.email ?? ""}`,
      )
      .maybeSingle();

    if (
      adminError ||
      !adminRow?.is_active ||
      !["owner", "admin"].includes(adminRow.role)
    ) {
      return json({ ok: false, error: "Forbidden" }, 403);
    }

    const body = (await req.json()) as RequestBody;
    const email = body.email?.trim().toLowerCase();
    const password = body.password;

    if (!email) {
      return json({ ok: false, error: "Email is required" }, 400);
    }

    if (body.action === "create_user") {
      if (!password || password.length < 8) {
        return json({ ok: false, error: "Password must be at least 8 characters" }, 400);
      }

      const { data: created, error: createError } = await serviceClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (createError) {
        return json({ ok: false, error: createError.message }, 400);
      }

      const now = new Date().toISOString();
      const { error: insertError } = await serviceClient.from("admin_users").upsert(
        {
          id: crypto.randomUUID(),
          auth_user_id: created.user?.id ?? null,
          email,
          role: body.role ?? "editor",
          is_active: true,
          display_name: body.display_name ?? email.split("@")[0],
          created_at: now,
          updated_at: now,
        },
        { onConflict: "email" },
      );

      if (insertError) {
        return json({ ok: false, error: insertError.message }, 400);
      }

      return json({ ok: true });
    }

    if (body.action === "set_password") {
      if (!password || password.length < 8) {
        return json({ ok: false, error: "Password must be at least 8 characters" }, 400);
      }

      const { data: list } = await serviceClient.auth.admin.listUsers();
      const target = list.users.find((u) => u.email?.toLowerCase() === email);
      if (!target) {
        return json({ ok: false, error: "Auth user not found" }, 404);
      }

      const { error: updateError } = await serviceClient.auth.admin.updateUserById(
        target.id,
        { password },
      );

      if (updateError) {
        return json({ ok: false, error: updateError.message }, 400);
      }

      return json({ ok: true });
    }

    return json({ ok: false, error: "Unknown action" }, 400);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return json({ ok: false, error: message }, 500);
  }
});

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
