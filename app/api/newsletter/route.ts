import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * Newsletter subscription endpoint.
 *
 * MVP behavior: validates the email server-side then forwards a notification
 * to contact@abbeal.com so Sébastien can manually add the subscriber to the
 * Resend Audience or whatever distribution list he uses. We don't currently
 * write to a database — Resend Audiences API would be the right next step
 * once the subscriber volume justifies the wiring.
 *
 * Hard-fails gracefully:
 * - Invalid email → 400 with explicit message
 * - Resend not configured → 503 with mailto fallback
 * - Resend send error → 502
 */

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const email =
    typeof body === "object" &&
    body !== null &&
    "email" in body &&
    typeof (body as Record<string, unknown>).email === "string"
      ? ((body as Record<string, unknown>).email as string).trim().toLowerCase()
      : "";

  if (!email || !EMAIL_RX.test(email) || email.length > 254) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "Newsletter not configured. Email contact@abbeal.com directly.",
        fallback: "mailto:contact@abbeal.com",
      },
      { status: 503 },
    );
  }

  try {
    const resend = new Resend(apiKey);
    const from =
      process.env.RESEND_FROM ?? "Abbeal Newsletter <contact@abbeal.com>";
    const to = process.env.RESEND_TO ?? "contact@abbeal.com";

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `[Newsletter] New subscriber — ${email}`,
      text: [
        `Email: ${email}`,
        `IP: ${ip}`,
        `User-Agent: ${request.headers.get("user-agent") ?? "unknown"}`,
        ``,
        `Action required: add to Resend Audience or distribution list manually.`,
      ].join("\n"),
    });

    if (error) {
      console.error("Resend newsletter error:", error);
      return NextResponse.json(
        { error: "Failed to record subscription. Try again later." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Newsletter endpoint error:", err);
    return NextResponse.json(
      { error: "Unexpected error. Try again later." },
      { status: 500 },
    );
  }
}
