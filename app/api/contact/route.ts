import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Basic in-memory rate limiting per IP (resets on cold start, OK for marketing site)
const rateLimitMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 min
const RATE_LIMIT_MAX = 5; // 5 submits / 15 min per IP

function getIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.reset < now) {
    rateLimitMap.set(ip, { count: 1, reset: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count++;
  return false;
}

type ContactPayload = {
  name?: string;
  email?: string;
  company?: string;
  role?: string;
  message?: string;
  // Honeypot field (hidden in UI, only bots fill it)
  _website?: string;
};

function validate(
  body: ContactPayload,
): { ok: true; data: Required<Pick<ContactPayload, "name" | "email" | "message">> & Pick<ContactPayload, "company" | "role"> } | { ok: false; error: string } {
  if (body._website) return { ok: false, error: "Spam detected" };
  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();
  if (!name || name.length < 2 || name.length > 120) return { ok: false, error: "Invalid name" };
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 200) return { ok: false, error: "Invalid email" };
  if (!message || message.length < 10 || message.length > 5000) return { ok: false, error: "Invalid message" };
  return {
    ok: true,
    data: {
      name,
      email,
      message,
      company: body.company?.trim() || undefined,
      role: body.role?.trim() || undefined,
    },
  };
}

export async function POST(request: Request) {
  // Rate limit
  const ip = getIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in 15 minutes." },
      { status: 429 },
    );
  }

  // Parse body
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Validate
  const v = validate(body);
  if (!v.ok) {
    return NextResponse.json({ error: v.error }, { status: 400 });
  }
  const data = v.data;

  // If Resend not configured, return a graceful fallback instruction
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Email delivery not configured. Please email contact@abbeal.com directly or use Calendly.",
        fallback: "mailto:contact@abbeal.com",
      },
      { status: 503 },
    );
  }

  try {
    const resend = new Resend(apiKey);
    const from =
      process.env.RESEND_FROM ?? "Abbeal Contact <contact@abbeal.com>";
    const to = process.env.RESEND_TO ?? "contact@abbeal.com";

    const subject = `[Site] Contact — ${data.name}${data.company ? ` · ${data.company}` : ""}`;
    const text = [
      `Nom : ${data.name}`,
      `Email : ${data.email}`,
      data.company ? `Société : ${data.company}` : null,
      data.role ? `Rôle : ${data.role}` : null,
      ``,
      `Message :`,
      data.message,
      ``,
      `---`,
      `IP : ${ip}`,
      `User-Agent : ${request.headers.get("user-agent") ?? "unknown"}`,
    ]
      .filter(Boolean)
      .join("\n");

    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: data.email,
      subject,
      text,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email. Please try again later." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json(
      { error: "Unexpected error. Please try again later." },
      { status: 500 },
    );
  }
}
