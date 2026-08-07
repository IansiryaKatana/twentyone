import { getSupabase } from "@/integrations/supabase/client";

type MailKind = "contact" | "newsletter";

/** Best-effort transactional email via Edge Function (requires RESEND_API_KEY). */
export async function sendTransactionalEmail(input: {
  email: string;
  firstName?: string;
  kind?: MailKind;
}): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  try {
    await sb.functions.invoke("send-contact-email", {
      body: {
        to: input.email,
        firstName: input.firstName ?? "",
        kind: input.kind ?? "contact",
      },
    });
  } catch {
    // Form already saved — never block UX on mail delivery.
  }
}

/** @deprecated Prefer sendTransactionalEmail({ kind: "contact" }) */
export async function sendContactThankYou(input: {
  email: string;
  firstName: string;
}): Promise<void> {
  return sendTransactionalEmail({
    email: input.email,
    firstName: input.firstName,
    kind: "contact",
  });
}
