/**
 * lib/redirects.ts — resolution des redirections 301/302 pilotees par la
 * collection Payload `redirects` (payload.config.ts).
 *
 * Modele "check-before-404" : les pages dynamiques (careers/[slug],
 * [slug]) appellent `resolveRedirect(pathSansLocale)` juste AVANT
 * notFound(). Zero coût sur les pages qui existent (le lookup n'a lieu
 * que quand l'entite CMS n'existe pas). Les 4 locales sont couvertes par
 * UNE seule entree CMS (fromPath sans prefixe locale).
 *
 * Cache : Next fetch tag `redirects`, invalide par le hook afterChange
 * de la collection Redirects (revalidateTag). TTL 60s pour couper l'ISR
 * en cas d'edition manuelle qui shunterait le hook.
 *
 * SEO : `permanent: true` → 301 (transfert de signal Google). Par defaut.
 */

export type RedirectRule = {
  fromPath: string;
  toPath: string;
  permanent: boolean;
};

function siteBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000")
  );
}

/** Normalise un chemin pour le lookup : garantit le leading slash et
 *  vire le trailing (sauf "/"). "/careers/foo/" → "/careers/foo". */
function normalizePath(path: string): string {
  if (!path.startsWith("/")) path = `/${path}`;
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path;
}

export async function resolveRedirect(
  fromPath: string,
): Promise<RedirectRule | null> {
  try {
    const norm = normalizePath(fromPath);
    const base = siteBaseUrl();
    const url = `${base}/api/redirects?where[fromPath][equals]=${encodeURIComponent(norm)}&depth=0&limit=1`;

    const res = await fetch(url, {
      next: { revalidate: 60, tags: ["redirects"] },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      docs?: Array<{ fromPath?: string; toPath?: string; permanent?: boolean }>;
    };
    const doc = data.docs?.[0];
    if (!doc || typeof doc.toPath !== "string" || !doc.toPath) return null;
    return {
      fromPath: doc.fromPath ?? norm,
      toPath: doc.toPath,
      permanent: doc.permanent !== false,
    };
  } catch (err) {
    console.error("[redirects] resolveRedirect failed :", err);
    return null;
  }
}

/** Construit l'URL de destination pour un redirect. Si toPath est
 *  absolu (https://...) on renvoie tel quel, sinon on prefixe avec la
 *  locale courante. */
export function buildRedirectDestination(
  toPath: string,
  locale: string,
): string {
  if (/^https?:\/\//.test(toPath)) return toPath;
  const norm = normalizePath(toPath);
  return `/${locale}${norm === "/" ? "" : norm}`;
}
