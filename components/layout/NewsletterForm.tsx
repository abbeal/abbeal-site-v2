"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "ok" | "error";

type Labels = {
  placeholder: string;
  cta: string;
  ok: string;
  errorGeneric: string;
};

export function NewsletterForm({ labels }: { labels: Labels }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setErrorMsg(data.error || labels.errorGeneric);
        setStatus("error");
        return;
      }
      setStatus("ok");
      setEmail("");
    } catch {
      setErrorMsg(labels.errorGeneric);
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-3">
      <div className="flex items-stretch gap-0 max-w-sm">
        <input
          type="email"
          required
          aria-label={labels.placeholder}
          placeholder={labels.placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading" || status === "ok"}
          className="flex-1 min-w-0 h-10 px-3 text-sm bg-[var(--color-bg-paper)] border border-[var(--color-border)] focus:border-[var(--color-brand-teal)] focus:outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "ok" || !email}
          className="h-10 px-4 text-sm font-medium border border-l-0 border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-bg-light)] hover:bg-[var(--color-brand-teal)] hover:border-[var(--color-brand-teal)] disabled:opacity-50 transition-colors"
        >
          {status === "loading" ? "..." : labels.cta}
        </button>
      </div>
      <p
        aria-live="polite"
        className={`mt-2 font-mono text-xs ${
          status === "ok"
            ? "text-[var(--color-brand-teal)]"
            : status === "error"
              ? "text-red-600"
              : "text-[var(--color-muted)] opacity-0"
        }`}
      >
        {status === "ok"
          ? labels.ok
          : status === "error"
            ? errorMsg
            : "—"}
      </p>
    </form>
  );
}
