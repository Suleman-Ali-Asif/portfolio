import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const RECAPTCHA_THRESHOLD = 0.5;

async function verifyRecaptcha(token: string, ip?: string) {
  const params = new URLSearchParams({
    secret: process.env.RECAPTCHA_SECRET_KEY ?? "",
    response: token,
  });
  if (ip) params.append("remoteip", ip);

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  return (await res.json()) as {
    success: boolean;
    score?: number;
    action?: string;
    "error-codes"?: string[];
  };
}

export async function POST(req: NextRequest) {
  const { name, email, subject, message, recaptchaToken } = await req.json();

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  if (!recaptchaToken) {
    return NextResponse.json({ error: "reCAPTCHA verification missing." }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const verification = await verifyRecaptcha(recaptchaToken, ip);
  console.log("[contact] reCAPTCHA verification:", JSON.stringify(verification));

  if (!verification.success || (verification.score ?? 0) < RECAPTCHA_THRESHOLD) {
    console.warn("[contact] reCAPTCHA rejected", {
      success: verification.success,
      score: verification.score,
      errorCodes: verification["error-codes"],
    });
    return NextResponse.json(
      { error: "reCAPTCHA verification failed." },
      { status: 400 },
    );
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";
  const to = process.env.CONTACT_TO_EMAIL ?? "a.suleman3757@gmail.com";
  console.log("[contact] sending via Resend", {
    from,
    to,
    replyTo: email,
    hasApiKey: Boolean(process.env.RESEND_API_KEY),
  });

  const { data, error } = await resend.emails.send({
    from,
    replyTo: email,
    to,
    subject: `[Portfolio] ${subject}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: `
      <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr />
      <p style="white-space:pre-wrap">${message}</p>
    `,
  });

  if (error) {
    console.error("[contact] Resend error:", JSON.stringify(error));
    return NextResponse.json({ error: "Failed to send message." }, { status: 502 });
  }

  console.log("[contact] Resend success:", JSON.stringify(data));
  return NextResponse.json({ ok: true });
}
