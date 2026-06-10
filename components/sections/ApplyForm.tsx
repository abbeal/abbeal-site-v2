"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";

type ApplyFormProps = {
  locale: Locale;
  offerSlug: string;
  offerTitle: string;
};

type FormState = "idle" | "sending" | "success" | "error";

const LABELS: Record<Locale, Record<string, string>> = {
  fr: {
    title: "Postuler",
    subtitle:
      "Laisse ton LinkedIn, un lien Calendly ou un message — on revient vers toi en 48h.",
    nameLabel: "Nom *",
    namePh: "Prénom Nom",
    emailLabel: "Email *",
    emailPh: "toi@example.com",
    linkedinLabel: "LinkedIn (URL)",
    linkedinPh: "https://www.linkedin.com/in/...",
    calendlyLabel: "Calendly (URL)",
    calendlyPh: "https://calendly.com/...",
    messageLabel: "Message (optionnel)",
    messagePh:
      "Quelques mots sur ce qui t'intéresse, ta dispo, tes attentes...",
    hint: "Au moins un parmi LinkedIn, Calendly ou message.",
    cta: "Envoyer ma candidature",
    sending: "Envoi…",
    success:
      "Reçu — on revient vers toi sous 48h. Si t'as pas de nouvelles, écris à recrutement@abbeal.com.",
    errorRetry: "Petite erreur — réessaie ou écris à recrutement@abbeal.com.",
  },
  en: {
    title: "Apply",
    subtitle:
      "Drop your LinkedIn, a Calendly link or a quick message — we'll get back within 48h.",
    nameLabel: "Name *",
    namePh: "Full name",
    emailLabel: "Email *",
    emailPh: "you@example.com",
    linkedinLabel: "LinkedIn (URL)",
    linkedinPh: "https://www.linkedin.com/in/...",
    calendlyLabel: "Calendly (URL)",
    calendlyPh: "https://calendly.com/...",
    messageLabel: "Message (optional)",
    messagePh: "A few words about your fit, availability, expectations...",
    hint: "At least one of LinkedIn, Calendly, or message.",
    cta: "Send my application",
    sending: "Sending…",
    success:
      "Got it — we'll get back within 48h. If you don't hear back, email recrutement@abbeal.com.",
    errorRetry: "Hiccup — retry or email recrutement@abbeal.com.",
  },
  ja: {
    title: "応募する",
    subtitle:
      "LinkedIn、Calendlyのリンク、またはメッセージをお送りください — 48時間以内にご連絡します。",
    nameLabel: "氏名 *",
    namePh: "山田 太郎",
    emailLabel: "メール *",
    emailPh: "you@example.com",
    linkedinLabel: "LinkedIn（URL）",
    linkedinPh: "https://www.linkedin.com/in/...",
    calendlyLabel: "Calendly（URL）",
    calendlyPh: "https://calendly.com/...",
    messageLabel: "メッセージ（任意）",
    messagePh: "ご関心、ご都合、ご期待など...",
    hint: "LinkedIn、Calendly、メッセージのうち少なくとも1つを入力してください。",
    cta: "応募する",
    sending: "送信中…",
    success:
      "受け付けました — 48時間以内にご連絡します。返信がない場合は recrutement@abbeal.com までご連絡ください。",
    errorRetry:
      "エラーが発生しました — 再試行するか recrutement@abbeal.com までご連絡ください。",
  },
  "fr-ca": {
    title: "Postuler",
    subtitle:
      "Laisse ton LinkedIn, un lien Calendly ou un message — on revient vers toi en 48h.",
    nameLabel: "Nom *",
    namePh: "Prénom Nom",
    emailLabel: "Courriel *",
    emailPh: "toi@example.com",
    linkedinLabel: "LinkedIn (URL)",
    linkedinPh: "https://www.linkedin.com/in/...",
    calendlyLabel: "Calendly (URL)",
    calendlyPh: "https://calendly.com/...",
    messageLabel: "Message (optionnel)",
    messagePh:
      "Quelques mots sur ce qui t'intéresse, ta dispo, tes attentes...",
    hint: "Au moins un parmi LinkedIn, Calendly ou message.",
    cta: "Envoyer ma candidature",
    sending: "Envoi…",
    success:
      "Reçu — on revient vers toi sous 48h. Si t'as pas de nouvelles, écris à recrutement@abbeal.com.",
    errorRetry: "Petite erreur — réessaie ou écris à recrutement@abbeal.com.",
  },
};

export function ApplyForm({ locale, offerSlug, offerTitle }: ApplyFormProps) {
  const l = LABELS[locale] ?? LABELS.fr;
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setErrorMsg(null);
    const fd = new FormData(e.currentTarget);
    const body = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      linkedin: String(fd.get("linkedin") ?? ""),
      calendly: String(fd.get("calendly") ?? ""),
      message: String(fd.get("message") ?? ""),
      _website: String(fd.get("_website") ?? ""), // honeypot
      offerSlug,
      offerTitle,
    };

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setState("success");
        return;
      }
      const data = (await res.json().catch(() => null)) as
        | { error?: string }
        | null;
      setErrorMsg(data?.error ?? l.errorRetry);
      setState("error");
    } catch {
      setErrorMsg(l.errorRetry);
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="mt-8 border border-[var(--color-brand-teal)] bg-[var(--color-brand-teal)]/5 p-6">
        <p className="text-[15px] text-[var(--color-ink)] leading-relaxed">
          ✓ {l.success}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
      {/* Honeypot — hidden field that bots fill */}
      <input
        type="text"
        name="_website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <label className="block">
          <span className="block font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)] mb-2">
            {l.nameLabel}
          </span>
          <input
            type="text"
            name="name"
            required
            placeholder={l.namePh}
            className="w-full px-4 h-11 border border-[var(--color-border)] bg-[var(--color-bg-light)] focus:outline-none focus:border-[var(--color-brand-teal)] transition-colors"
          />
        </label>
        <label className="block">
          <span className="block font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)] mb-2">
            {l.emailLabel}
          </span>
          <input
            type="email"
            name="email"
            required
            placeholder={l.emailPh}
            className="w-full px-4 h-11 border border-[var(--color-border)] bg-[var(--color-bg-light)] focus:outline-none focus:border-[var(--color-brand-teal)] transition-colors"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <label className="block">
          <span className="block font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)] mb-2">
            {l.linkedinLabel}
          </span>
          <input
            type="url"
            name="linkedin"
            placeholder={l.linkedinPh}
            className="w-full px-4 h-11 border border-[var(--color-border)] bg-[var(--color-bg-light)] focus:outline-none focus:border-[var(--color-brand-teal)] transition-colors"
          />
        </label>
        <label className="block">
          <span className="block font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)] mb-2">
            {l.calendlyLabel}
          </span>
          <input
            type="url"
            name="calendly"
            placeholder={l.calendlyPh}
            className="w-full px-4 h-11 border border-[var(--color-border)] bg-[var(--color-bg-light)] focus:outline-none focus:border-[var(--color-brand-teal)] transition-colors"
          />
        </label>
      </div>

      <label className="block">
        <span className="block font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)] mb-2">
          {l.messageLabel}
        </span>
        <textarea
          name="message"
          rows={4}
          placeholder={l.messagePh}
          className="w-full px-4 py-3 border border-[var(--color-border)] bg-[var(--color-bg-light)] focus:outline-none focus:border-[var(--color-brand-teal)] transition-colors resize-y"
        />
      </label>

      <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)]/80">
        {l.hint}
      </p>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex items-center gap-2 h-12 px-6 text-sm border border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-bg-light)] hover:bg-[var(--color-brand-teal)] hover:border-[var(--color-brand-teal)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state === "sending" ? l.sending : l.cta}
          <span aria-hidden>→</span>
        </button>
        {state === "error" && errorMsg ? (
          <p className="font-mono text-[11px] text-red-600">{errorMsg}</p>
        ) : null}
      </div>
    </form>
  );
}
