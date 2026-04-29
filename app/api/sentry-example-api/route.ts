import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  // This error is auto-captured by @sentry/nextjs via onRequestError (instrumentation.ts)
  throw new Error(
    `Sentry test (server API) — ${new Date().toISOString()}`,
  );
  // unreachable
  return NextResponse.json({ ok: true });
}
