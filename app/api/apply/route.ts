/**
 * POST /api/apply — endpoint candidature pour une job offer.
 *
 * Recoit { name, email, linkedin?, calendly?, message?, offerSlug,
 * offerTitle } + un honeypot _website (rempli par les bots seulement).
 *
 * Envoie un mail via Resend a RESEND_APPLY_TO (default :
 * recrutement@abbeal.com) avec le contenu structure. Repond {ok:true}
 * si envoye, sinon 4xx avec error.
 *
 * Rate limit : 5 candidatures / 15 min par IP (in-memory, OK pour site
 * marketing).
 */

import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const rateLimitMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

function getIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
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

type ApplyPayload = {
  name?: string;
  email?: string;
  linkedin?: string;
  calendly?: string;
  message?: string;
  offerSlug?: string;
  offerTitle?: string;
  _website?: string;
};

type ValidatedData = {
  name: string;
  email: string;
  linkedin?: string;
  calendly?: string;
  message?: string;
  offerSlug?: string;
  offerTitle?: string;
};

function validate(
  body: ApplyPayload,
): { ok: true; data: ValidatedData } | { ok: false; error: string } {
  if (body._website) return { ok: false, error: "Spam detected" };

  const name = body.name?.trim();
  const email = body.email?.trim();

  if (!name || name.length < 2 || name.length > 120) {
    return { ok: false, error: "Invalid name" };
  }
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 200) {
    return { ok: false, error: "Invalid email" };
  }

  // Au moins LinkedIn OU Calendly OU message — sinon la candidature est vide.
  const linkedin = body.linkedin?.trim();
  const calendly = body.calendly?.trim();
  const message = body.message?.trim();
  if (!linkedin && !calendly && !message) {
    return {
      ok: false,
      error: "Provide at least one of: LinkedIn URL, Calendly link, or message",
    };
  }

  // URL sanity check
  const urlOk = (u: string | undefined) =>
    !u || /^https?:\/\/[^\s]{4,}$/.test(u);
  if (!urlOk(linkedin)) return { ok: false, error: "Invalid LinkedIn URL" };
  if (!urlOk(calendly)) return { ok: false, error: "Invalid Calendly URL" };

  if (message && message.length > 5000) {
    return { ok: false, error: "Message too long" };
  }

  return {
    ok: true,
    data: {
      name,
      email,
      ...(linkedin ? { linkedin } : {}),
      ...(calendly ? { calendly } : {}),
      ...(message ? { message } : {}),
      ...(body.offerSlug ? { offerSlug: body.offerSlug.trim() } : {}),
      ...(body.offerTitle ? { offerTitle: body.offerTitle.trim() } : {}),
    },
  };
}

export async function POST(request: Request) {
  const ip = getIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in 15 minutes." },
      { status: 429 },
    );
  }

  let body: ApplyPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const v = validate(body);
  if (!v.ok) {
    return NextResponse.json({ error: v.error }, { status: 400 });
  }
  const data = v.data;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Email delivery not configured. Please reach out to recrutement@abbeal.com directly.",
        fallback: "mailto:recrutement@abbeal.com",
      },
      { status: 503 },
    );
  }

  try {
    const resend = new Resend(apiKey);
    const from =
      process.env.RESEND_APPLY_FROM ??
      process.env.RESEND_FROM ??
      "Abbeal Careers <recrutement@abbeal.com>";
    const to = process.env.RESEND_APPLY_TO ?? "recrutement@abbeal.com";

    const offerTag = data.offerTitle
      ? `[Site] Candidature — ${data.offerTitle}`
      : `[Site] Candidature spontanee`;
    const subject = `${offerTag} · ${data.name}`;

    const text = [
      data.offerTitle ? `Offre : ${data.offerTitle}` : null,
      data.offerSlug
        ? `URL : https://abbeal.com/fr/careers/${data.offerSlug}`
        : null,
      ``,
      `Candidat : ${data.name}`,
      `Email : ${data.email}`,
      data.linkedin ? `LinkedIn : ${data.linkedin}` : null,
      data.calendly ? `Calendly : ${data.calendly}` : null,
      ``,
      data.message ? `Message :\n${data.message}` : null,
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
      console.error("[apply] Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send. Please try again later." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[apply] route error:", err);
    return NextResponse.json(
      { error: "Unexpected error. Please try again later." },
      { status: 500 },
    );
  }
}
