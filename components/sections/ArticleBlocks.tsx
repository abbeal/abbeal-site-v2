import type { ReactNode } from "react";
import type { ArticleBlock } from "@/lib/articles";

/**
 * ArticleBlocks — renderer des blocs d'article/landing (h2/h3/p/list/quote/
 * callout/code/link/platformHeader/image/byline).
 *
 * W37 : passé en SERVER COMPONENT pur (retrait `motion/react`). L'audit W36
 * (Sebastien 2026-08-31) a mesuré LCP mobile 5.0s sur /en/tech-consulting-
 * tokyo — root cause : framer-motion rendait `opacity: 0` en SSR sur le
 * premier bloc body (list de 6 KPIs), le fade-in n'arrivait qu'après
 * hydratation + IntersectionObserver. Résultat : le LCP fires à 4-5s.
 * Mêmes symptômes que Hero home avant W22 (fix W22 : réécriture CSS pure
 * -> LCP 5.6 -> 2.1s). Ici on va plus loin : suppression totale du fade
 * animation (vanité sur du texte, coût LCP inacceptable). Les blocs
 * apparaissent instantanément — le texte étant l'élément LCP candidate
 * sur toutes les landings, il doit être opaque dès le premier paint.
 *
 * Bénéfice attendu : LCP mobile /en/tech-consulting-tokyo 5.0s -> ~2.6s
 * (cible <2.5s "Good" Google). Impact aussi sur toutes les autres landings,
 * articles, cases, glossaire qui utilisent ce composant.
 */

/**
 * renderInline — parse le markdown inline dans le texte d'un bloc :
 *   - `[label](url)` → <a> cliquable (externes : target=_blank rel=noopener)
 *   - `**text**`     → <strong> gras (W26 fix : etait rendu litteral avant)
 *   - `*text*`       → <em> italique (idem)
 *   - `` `text` ``   → <code> inline mono (idem)
 *
 * Tokenizer single-pass : un seul regex alternance pour eviter les conflits
 * (notamment ** vs *). L'ordre dans l'alternance est important : ** avant *
 * pour matcher correctement les marqueurs longs en premier.
 *
 * Retro-compatible : un texte sans aucun marqueur est renvoye inchange.
 * Utilise dans les blocs `p`, `callout` et les items de `list`.
 */
function renderInline(text: string): ReactNode {
  // Ordre important : ** avant *, et code/link encadres pour eviter overlap
  const re =
    /(\*\*[^*\n]+\*\*|`[^`\n]+`|\[[^\]]+\]\([^)]+\)|\*[^*\n]+\*)/g;
  const parts: ReactNode[] = [];
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const token = m[0];

    if (token.startsWith("**") && token.endsWith("**")) {
      // Pas de text-color force : le <strong> herite du parent (necessaire
      // pour les callouts tone="ink" qui ont texte clair sur fond sombre,
      // sinon le bold force a --color-ink devient invisible. Fix W26.)
      parts.push(
        <strong key={key++} className="font-semibold">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      // Code inline : bg semi-transparent + couleur heritee du parent pour
      // s'adapter aux callouts ink (fond sombre) comme aux p normaux (clair).
      parts.push(
        <code
          key={key++}
          className="font-mono text-[0.92em] px-1.5 py-0.5 rounded bg-current/10 ring-1 ring-current/15"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith("[")) {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        const external = /^https?:\/\//.test(href!);
        parts.push(
          <a
            key={key++}
            href={href}
            {...(external ? { target: "_blank", rel: "noopener" } : {})}
            className="text-[var(--color-brand-teal)] underline underline-offset-2 decoration-[var(--color-brand-teal)]/40 hover:decoration-[var(--color-brand-teal)] transition-colors"
          >
            {label}
          </a>,
        );
      } else {
        parts.push(token);
      }
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={key++} className="italic">
          {token.slice(1, -1)}
        </em>,
      );
    }
    last = m.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length === 0 ? text : parts;
}

export function ArticleBlocks({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="prose-article space-y-6">
      {blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} />
      ))}
    </div>
  );
}

function BlockRenderer({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="mt-14 mb-2 text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-[var(--color-ink)] leading-tight scroll-mt-24">
          {block.content}
        </h2>
      );

    case "h3":
      return (
        <h3 className="mt-8 mb-1 text-xl font-semibold tracking-tight text-[var(--color-ink)] leading-snug">
          {block.content}
        </h3>
      );

    case "p":
      return (
        <p className="text-[17px] leading-[1.65] text-[var(--color-ink)]">
          {renderInline(block.content)}
        </p>
      );

    case "byline":
      return (
        <div className="not-prose -mt-1 mb-2 flex items-start gap-4">
          {block.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={block.photo}
              alt={block.name}
              className="h-14 w-14 rounded-full object-cover border border-[var(--color-border)] shrink-0"
              loading="lazy"
            />
          )}
          {/* Sans photo : accent bordure teal à gauche (ex : Alex). Avec
              photo : l'avatar fait l'ancrage visuel, pas de bordure. */}
          <div
            className={
              block.photo
                ? "min-w-0"
                : "border-l-2 border-[var(--color-brand-teal)] pl-4"
            }
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-[15px] font-semibold text-[var(--color-ink)]">
                {block.name}
              </span>
              {block.linkedinUrl && (
                <a
                  href={block.linkedinUrl}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1.5 text-[13px] text-[var(--color-brand-teal)] hover:underline"
                >
                  <svg
                    aria-hidden
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-[15px] w-[15px]"
                  >
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68 1.69 1.69 0 0 0-1.68-1.69 1.69 1.69 0 0 0-1.69 1.69 1.69 1.69 0 0 0 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z" />
                  </svg>
                  LinkedIn
                </a>
              )}
            </div>
            <p className="mt-1 text-[14px] leading-relaxed text-[var(--color-ink-soft)]">
              {block.role}
            </p>
          </div>
        </div>
      );

    case "list":
      return block.ordered ? (
        <ol className="list-decimal pl-6 space-y-2 text-[17px] leading-[1.65] text-[var(--color-ink)] marker:text-[var(--color-brand-teal)] marker:font-mono">
          {block.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ol>
      ) : (
        <ul className="space-y-2.5 text-[17px] leading-[1.65] text-[var(--color-ink)]">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span aria-hidden className="mt-2.5 h-1.5 w-1.5 rounded-full bg-[var(--color-brand-teal)] shrink-0" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );

    case "quote":
      return (
        <figure className="my-10 border-l-2 border-[var(--color-brand-teal)] pl-6 py-1">
          <blockquote className="text-xl md:text-2xl italic font-medium text-[var(--color-ink)] leading-snug tracking-tight">
            « {block.content} »
          </blockquote>
          {block.author && (
            <figcaption className="mt-3 font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-muted)]">
              — {block.author}
            </figcaption>
          )}
        </figure>
      );

    case "callout": {
      const tone = block.tone ?? "default";
      const tones: Record<string, string> = {
        default:
          "bg-[var(--color-bg-cream)] border border-[var(--color-border)] text-[var(--color-ink)]",
        teal:
          "bg-[var(--color-brand-teal)]/10 border border-[var(--color-brand-teal)]/30 text-[var(--color-ink)]",
        ink:
          "bg-[var(--color-ink)] text-[var(--color-bg-light)]",
      };
      return (
        <aside
          className={`my-8 px-6 py-5 ${tones[tone]} text-[15px] leading-relaxed`}
        >
          <p>{renderInline(block.content)}</p>
        </aside>
      );
    }

    case "code":
      return (
        <pre className="my-6 overflow-x-auto bg-[var(--color-ink)] text-[var(--color-bg-light)] p-5 font-mono text-[13px] leading-[1.6] border-l-2 border-[var(--color-brand-teal)]">
          {block.lang && (
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
              {block.lang}
            </div>
          )}
          <code>{block.content}</code>
        </pre>
      );

    case "link":
      return (
        <div className="my-8">
          <a
            href={block.href}
            target={block.external === false ? undefined : "_blank"}
            rel={block.external === false ? undefined : "noopener"}
            className="inline-flex items-center gap-2 px-5 py-3 border border-[var(--color-brand-teal)] text-[var(--color-brand-teal)] hover:bg-[var(--color-brand-teal)]/10 transition-colors text-[15px] font-medium tracking-tight"
          >
            {block.label}
            <span aria-hidden>→</span>
          </a>
        </div>
      );

    case "platformHeader":
      return (
        <div
          className="mt-14 mb-2 flex items-baseline gap-4 flex-wrap scroll-mt-24"
          id={block.name.toLowerCase()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.logoSrc}
            alt={`${block.name} logo`}
            className="h-9 md:h-10 w-auto object-contain shrink-0"
            loading="lazy"
          />
          <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.02em] text-[var(--color-ink)] leading-tight">
            {block.name}
          </h2>
          <a
            href={block.href}
            target="_blank"
            rel="noopener"
            className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-brand-teal)] hover:underline"
          >
            {block.href.replace(/^https?:\/\//, "").replace(/\/$/, "")} ↗
          </a>
        </div>
      );

    case "image":
      return (
        <figure className="my-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.src}
            alt={block.alt}
            className="w-full h-auto rounded-sm border border-[var(--color-border)]"
            loading="lazy"
          />
          {block.caption && (
            <figcaption className="mt-3 font-mono text-xs text-[var(--color-muted)] italic text-center">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    default:
      return null;
  }
}
