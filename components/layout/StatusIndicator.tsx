/**
 * StatusIndicator — small green-pulsing dot + label, footer-only.
 *
 * MVP: hardcoded "operational" (we deploy enough to have feedback if anything
 * breaks). Real Vercel Status API check would be the next step:
 *   GET https://www.vercel-status.com/api/v2/status.json
 *   then map to operational | minor | major | critical.
 */
export function StatusIndicator({ label }: { label: string }) {
  return (
    <div
      className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wide text-[var(--color-muted)]"
      role="status"
      aria-label={label}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      <span>{label}</span>
    </div>
  );
}
