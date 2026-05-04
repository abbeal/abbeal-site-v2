import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * Consent log endpoint.
 *
 * GDPR (FR/EU) and Loi 25 (QC) require organisations to be able to
 * demonstrate that consent was freely given, specific, informed, and
 * unambiguous — and that they can produce a record on demand if a
 * regulator (CNIL / CAI) asks.
 *
 * MVP behaviour: forward each consent change to contact@abbeal.com
 * with the user fingerprint (IP + UA), the consent state, and the
 * source page. Sébastien archives the inbox; that's the audit trail.
 *
 * Production-grade upgrade path: write to Vercel Postgres / KV with
 * a 7-year retention policy, expose a SAR endpoint to let users export
 * their own consent history. Skipped for now to ship fast.
 *
 * The endpoint is designed to silently no-op (return 204) if Resend
 * isn't configured — we don't want consent UX to fail because of a
 * missing env var.
 */

type ConsentEvent = {
  v: number;
  ts: string;
  action: "accept_all" | "reject_all" | "save_custom" | "withdraw";
  prefs: {
    necessary: true;
    analytics: boolean;
    ad: boolean;
    functional: boolean;
  };
  source?: string; // pathname where consent was given
  locale?: string;
};

function isConsentEvent(x: unknown): x is ConsentEvent {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  if (typeof o.v !== "number") return false;
  if (typeof o.ts !== "string") return false;
  if (
    o.action !== "accept_all" &&
    o.action !== "reject_all" &&
    o.action !== "save_custom" &&
    o.action !== "withdraw"
  )
    return false;
  if (typeof o.prefs !== "object" || o.prefs === null) return false;
  return true;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isConsentEvent(body)) {
    return NextResponse.json(
      { error: "Invalid consent event payload" },
      { status: 400 },
    );
  }
  const event = body;

  const apiKey = process.env.RESEND_API_KEY;
  // No Resend = silently no-op so the front-end never blocks on logging.
  if (!apiKey) return NextResponse.json({ ok: true, logged: false });

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const ua = request.headers.get("user-agent") ?? "unknown";
  const referer = request.headers.get("referer") ?? "unknown";

  try {
    const resend = new Resend(apiKey);
    const from =
      process.env.RESEND_FROM ?? "Abbeal Consent Log <contact@abbeal.com>";
    const to = process.env.RESEND_TO ?? "contact@abbeal.com";

    const subject = `[Consent] ${event.action.toUpperCase()} — ${event.locale ?? "??"} — ${ip}`;
    const text = [
      `Action       : ${event.action}`,
      `Timestamp    : ${event.ts}`,
      `Locale       : ${event.locale ?? "n/a"}`,
      `Source page  : ${event.source ?? "n/a"}`,
      `IP           : ${ip}`,
      `User-Agent   : ${ua}`,
      `Referer      : ${referer}`,
      ``,
      `Preferences  :`,
      `  necessary  : ${event.prefs.necessary}`,
      `  analytics  : ${event.prefs.analytics}`,
      `  ad         : ${event.prefs.ad}`,
      `  functional : ${event.prefs.functional}`,
      ``,
      `Schema version : ${event.v}`,
    ].join("\n");

    const { error } = await resend.emails.send({
      from,
      to: [to],
      subject,
      text,
    });

    if (error) {
      console.error("Consent log Resend error:", error);
      return NextResponse.json({ ok: true, logged: false });
    }

    return NextResponse.json({ ok: true, logged: true });
  } catch (err) {
    // We log the error but still 200 the response — consent UX must not
    // depend on the audit channel being up.
    console.error("Consent log error:", err);
    return NextResponse.json({ ok: true, logged: false });
  }
}
