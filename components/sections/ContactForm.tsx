"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";

type FormDict = {
  name: string;
  email: string;
  company: string;
  role: string;
  message: string;
  messagePlaceholder: string;
  submit: string;
};

type ContactFormProps = {
  locale: Locale;
  form: FormDict;
  fallbackEmail: string;
};

const T = {
  fr: {
    sending: "Envoi…",
    success: "Message envoyé. On revient vers toi sous 24 h.",
    errorGeneric: "Impossible d'envoyer. Merci d'écrire directement à",
    errorRate: "Trop de tentatives. Réessaie dans 15 minutes.",
    required: "requis",
  },
  en: {
    sending: "Sending…",
    success: "Message sent. We'll reply within 24h.",
    errorGeneric: "Couldn't send. Please email us directly at",
    errorRate: "Too many attempts. Try again in 15 minutes.",
    required: "required",
  },
  ja: {
    sending: "送信中…",
    success: "メッセージを送信しました。24時間以内にご返信いたします。",
    errorGeneric: "送信できませんでした。直接メールでお願いします：",
    errorRate: "試行回数が多すぎます。15分後に再試行してください。",
    required: "必須",
  },
  "fr-ca": {
    sending: "Envoi…",
    success: "Message envoyé. On revient vers toi sous 24 h.",
    errorGeneric: "Impossible d'envoyer. Merci d'écrire directement à",
    errorRate: "Trop de tentatives. Réessaie dans 15 minutes.",
    required: "requis",
  },
} as const;

export function ContactForm({ locale, form, fallbackEmail }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const t = T[locale];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg(null);

    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("sent");
        (e.target as HTMLFormElement).reset();
        return;
      }
      const payload = (await res.json().catch(() => ({}))) as {
        error?: string;
        fallback?: string;
      };
      setStatus("error");
      if (res.status === 429) {
        setErrorMsg(t.errorRate);
      } else if (res.status === 503 && payload.fallback) {
        setErrorMsg(`${t.errorGeneric} ${fallbackEmail}`);
      } else {
        setErrorMsg(payload.error ?? `${t.errorGeneric} ${fallbackEmail}`);
      }
    } catch {
      setStatus("error");
      setErrorMsg(`${t.errorGeneric} ${fallbackEmail}`);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* Honeypot — hidden from humans, bots fill it */}
      <input
        type="text"
        name="_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", opacity: 0 }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label={form.name} name="name" required requiredLabel={t.required} />
        <Field
          label={form.email}
          name="email"
          type="email"
          required
          requiredLabel={t.required}
        />
        <Field label={form.company} name="company" />
        <Field label={form.role} name="role" />
      </div>

      <div>
        <label
          htmlFor="message"
          className="block font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)] mb-2"
        >
          {form.message}{" "}
          <span className="text-[var(--color-brand-teal)]">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          maxLength={5000}
          placeholder={form.messagePlaceholder}
          className="w-full border border-[var(--color-border)] bg-[var(--color-bg-paper)] px-4 py-3 text-[15px] focus:outline-none focus:border-[var(--color-brand-teal)] resize-none"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-2 h-12 px-6 text-base bg-[var(--color-ink)] text-[var(--color-bg-light)] hover:bg-[var(--color-brand-teal)] hover:text-[var(--color-ink)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "sending" ? t.sending : form.submit}
          <span aria-hidden>→</span>
        </button>

        {status === "sent" && (
          <p className="font-mono text-sm text-[var(--color-brand-teal)]">
            ✓ {t.success}
          </p>
        )}
        {status === "error" && errorMsg && (
          <p className="font-mono text-sm text-[var(--color-muted)]">
            {errorMsg}{" "}
            <a
              href={`mailto:${fallbackEmail}`}
              className="underline hover:text-[var(--color-brand-teal)]"
            >
              {fallbackEmail}
            </a>
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  requiredLabel,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  requiredLabel?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)] mb-2"
      >
        {label}{" "}
        {required && (
          <span
            className="text-[var(--color-brand-teal)]"
            aria-label={requiredLabel}
          >
            *
          </span>
        )}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        maxLength={type === "email" ? 200 : 120}
        className="w-full h-11 border border-[var(--color-border)] bg-[var(--color-bg-paper)] px-4 text-[15px] focus:outline-none focus:border-[var(--color-brand-teal)]"
      />
    </div>
  );
}
