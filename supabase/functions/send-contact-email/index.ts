const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type Kind = "contact" | "newsletter";

type Body = {
  to?: string;
  firstName?: string;
  kind?: Kind;
};

const BRAND = {
  black: "#0a0a0a",
  red: "#cc0001",
  white: "#ffffff",
  muted: "#b8b8b8",
  panel: "#141414",
};

function brandedShell(opts: {
  eyebrow: string;
  title: string;
  bodyHtml: string;
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${opts.title}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.black};font-family:Arial,Helvetica,sans-serif;color:${BRAND.white};">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND.black};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:${BRAND.panel};border:1px solid rgba(255,255,255,0.08);">
          <tr>
            <td style="height:4px;background:${BRAND.red};font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:36px 32px 16px;">
              <p style="margin:0 0 10px;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:${BRAND.red};">${opts.eyebrow}</p>
              <h1 style="margin:0;font-size:28px;line-height:1.05;letter-spacing:-0.03em;text-transform:uppercase;color:${BRAND.white};">${opts.title}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 28px;font-size:15px;line-height:1.65;color:${BRAND.muted};">
              ${opts.bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:0 32px 32px;">
              <a href="https://twentyone06.com/projects" style="display:inline-block;background:${BRAND.red};color:${BRAND.white};text-decoration:none;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;padding:14px 22px;">See Our Work</a>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px;border-top:1px solid rgba(255,255,255,0.08);font-size:12px;line-height:1.6;color:${BRAND.muted};">
              <strong style="color:${BRAND.white};">TwentyOne06</strong><br/>
              Pearl Coast — Office 304, 23rd St, Al Barsha First, Dubai<br/>
              <a href="mailto:info@twentyone06.com" style="color:${BRAND.white};">info@twentyone06.com</a> · 04 554 8082
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function contactThankYouHtml(firstName: string) {
  const greeting = firstName.trim() ? `Hello ${firstName.trim()},` : "Hello,";
  return brandedShell({
    eyebrow: "TwentyOne06",
    title: "Thank You for Getting in Touch",
    bodyHtml: `
      <p style="margin:0 0 16px;color:${BRAND.white};">${greeting}</p>
      <p style="margin:0 0 16px;">Thank you for reaching out to TwentyOne06, Interior and Branding Design Firm. Every great project starts with a conversation, and we're excited to learn more about yours.</p>
      <p style="margin:0 0 16px;">We've received your submission and will be in touch shortly. In the meantime, feel free to explore our latest projects and insights.</p>
      <p style="margin:0;">Warm regards,<br/><span style="color:${BRAND.white};">The TwentyOne06 Team</span></p>
    `,
  });
}

function contactThankYouText(firstName: string) {
  const greeting = firstName.trim() ? `Hello ${firstName.trim()},` : "Hello,";
  return [
    greeting,
    "",
    "Thank you for reaching out to TwentyOne06, Interior and Branding Design Firm.",
    "Every great project starts with a conversation, and we're excited to learn more about yours.",
    "",
    "We've received your submission and will be in touch shortly.",
    "In the meantime, feel free to explore our latest projects and insights.",
    "",
    "Warm regards,",
    "The TwentyOne06 Team",
    "",
    "TwentyOne06 · Pearl Coast — Office 304, Dubai",
    "info@twentyone06.com · 04 554 8082",
  ].join("\n");
}

function newsletterHtml() {
  return brandedShell({
    eyebrow: "Newsletter",
    title: "You're on the List",
    bodyHtml: `
      <p style="margin:0 0 16px;color:${BRAND.white};">Hello,</p>
      <p style="margin:0 0 16px;">Thanks for subscribing to TwentyOne06 updates. You'll receive news on new projects, press, and studio notes — curated, not cluttered.</p>
      <p style="margin:0;">If this wasn't you, you can ignore this email.</p>
    `,
  });
}

function newsletterText() {
  return [
    "Hello,",
    "",
    "Thanks for subscribing to TwentyOne06 updates.",
    "You'll receive news on new projects, press, and studio notes — curated, not cluttered.",
    "",
    "If this wasn't you, you can ignore this email.",
    "",
    "TwentyOne06 · Pearl Coast — Office 304, Dubai",
    "info@twentyone06.com · 04 554 8082",
  ].join("\n");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      return json(
        { ok: false, skipped: true, error: "RESEND_API_KEY not configured" },
        200,
      );
    }

    const body = (await req.json()) as Body;
    const to = body.to?.trim();
    if (!to || !to.includes("@")) {
      return json({ ok: false, error: "Valid email required" }, 400);
    }

    const kind: Kind = body.kind === "newsletter" ? "newsletter" : "contact";
    const firstName = body.firstName ?? "";
    const from =
      Deno.env.get("RESEND_FROM_EMAIL") ??
      "TwentyOne06 <info@twentyone06.com>";
    const notifyTo =
      Deno.env.get("CONTACT_INBOX_EMAIL") ?? "info@twentyone06.com";

    const subject =
      kind === "newsletter"
        ? "You're subscribed — TwentyOne06"
        : "Thank You for Getting in Touch";
    const html =
      kind === "newsletter" ? newsletterHtml() : contactThankYouHtml(firstName);
    const text =
      kind === "newsletter"
        ? newsletterText()
        : contactThankYouText(firstName);

    const thankYouRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        text,
      }),
    });

    if (!thankYouRes.ok) {
      const errText = await thankYouRes.text();
      return json(
        { ok: false, error: `Confirmation send failed: ${errText}` },
        502,
      );
    }

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [notifyTo],
        subject:
          kind === "newsletter"
            ? `New newsletter subscriber: ${to}`
            : `New inquiry from ${firstName || to}`,
        text:
          kind === "newsletter"
            ? `A new newsletter subscription was received from ${to}.\nReview it in the CMS admin under Submissions (form_name: newsletter).`
            : `A new contact form submission was received from ${to}.\nReview it in the CMS admin under Submissions.`,
      }),
    });

    return json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return json({ ok: false, error: message }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
