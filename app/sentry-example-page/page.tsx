"use client";

import { useState } from "react";
import * as Sentry from "@sentry/nextjs";

export default function SentryExamplePage() {
  const [state, setState] = useState<
    "idle" | "client-throw" | "captured" | "server-ok" | "server-err"
  >("idle");
  const [eventId, setEventId] = useState<string | null>(null);
  const [apiMsg, setApiMsg] = useState<string | null>(null);

  async function triggerClientError() {
    try {
      throw new Error(
        `Sentry test (client) — ${new Date().toISOString()}`,
      );
    } catch (err) {
      const id = Sentry.captureException(err);
      setEventId(id);
      setState("captured");
    }
  }

  function triggerWindowError() {
    // Fire-and-forget: uncaught error → window.onerror → Sentry
    setState("client-throw");
    setTimeout(() => {
      // @ts-expect-error intentional ReferenceError
      myUndefinedFunction();
    }, 0);
  }

  async function triggerServerError() {
    try {
      const res = await fetch("/api/sentry-example-api", { method: "POST" });
      if (res.ok) {
        setState("server-ok");
        setApiMsg("Server endpoint returned 200 (no error)");
      } else {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setState("server-err");
        setApiMsg(
          data.error ?? `Server returned ${res.status} — Sentry should capture`,
        );
      }
    } catch (e) {
      setState("server-err");
      setApiMsg(String(e));
    }
  }

  return (
    <main className="mx-auto max-w-[760px] px-6 md:px-10 py-20 md:py-28">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
        // Sentry smoke test
      </p>
      <h1 className="mt-4 font-semibold tracking-[-0.025em] text-3xl md:text-4xl leading-tight">
        Sentry example page
      </h1>
      <p className="mt-4 text-[var(--color-ink-soft)] leading-relaxed">
        Page interne de diagnostic. Non indexée. Permet de valider que les 3
        runtimes Sentry capturent bien les erreurs : client React, window
        global, et serveur Next.
      </p>

      <section className="mt-10 space-y-6">
        <Card
          title="1 · Client explicit capture"
          body="Throw dans un try/catch puis Sentry.captureException. Le plus fiable."
          action={
            <button
              onClick={triggerClientError}
              className="inline-flex items-center gap-2 h-11 px-5 bg-[var(--color-ink)] text-[var(--color-bg-light)] hover:bg-[var(--color-brand-teal)] hover:text-[var(--color-ink)] transition-colors"
            >
              Trigger client error →
            </button>
          }
          status={
            state === "captured" && eventId ? (
              <p className="text-[var(--color-brand-teal)] font-mono text-sm">
                ✓ Captured as <code>{eventId.slice(0, 8)}…</code>
              </p>
            ) : null
          }
        />

        <Card
          title="2 · Client uncaught (window.onerror)"
          body="Appel d'une fonction non définie. Sentry capture via window.onerror. Adblockers peuvent bloquer — ouvre DevTools Network pour vérifier."
          action={
            <button
              onClick={triggerWindowError}
              className="inline-flex items-center gap-2 h-11 px-5 bg-[var(--color-ink)] text-[var(--color-bg-light)] hover:bg-[var(--color-brand-teal)] hover:text-[var(--color-ink)] transition-colors"
            >
              Trigger window error →
            </button>
          }
        />

        <Card
          title="3 · Server error (Next API route)"
          body="POST /api/sentry-example-api → throw côté serveur → Sentry server SDK."
          action={
            <button
              onClick={triggerServerError}
              className="inline-flex items-center gap-2 h-11 px-5 bg-[var(--color-ink)] text-[var(--color-bg-light)] hover:bg-[var(--color-brand-teal)] hover:text-[var(--color-ink)] transition-colors"
            >
              Trigger server error →
            </button>
          }
          status={
            apiMsg ? (
              <p className="font-mono text-sm text-[var(--color-ink-soft)]">
                {apiMsg}
              </p>
            ) : null
          }
        />

        <div className="mt-10 pt-8 border-t border-[var(--color-border)] text-sm text-[var(--color-ink-soft)] space-y-2">
          <p>
            Après chaque clic, va sur{" "}
            <a
              href="https://abbeal-xs.sentry.io/issues/"
              target="_blank"
              rel="noopener"
              className="underline hover:text-[var(--color-brand-teal)]"
            >
              abbeal-xs.sentry.io/issues
            </a>
            . Les events arrivent en 5-10 s.
          </p>
          <p>
            Si rien n'arrive : vérifier que les requêtes POST vers{" "}
            <code>o4511258049642496.ingest.de.sentry.io</code> ne sont pas
            bloquées par un adblocker (DevTools → Network, filter "sentry" ou
            "ingest").
          </p>
        </div>
      </section>
    </main>
  );
}

function Card({
  title,
  body,
  action,
  status,
}: {
  title: string;
  body: string;
  action: React.ReactNode;
  status?: React.ReactNode;
}) {
  return (
    <div className="border border-[var(--color-border)] bg-[var(--color-bg-paper)] p-6">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm text-[var(--color-ink-soft)] leading-relaxed">
        {body}
      </p>
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
        {action}
        {status}
      </div>
    </div>
  );
}

