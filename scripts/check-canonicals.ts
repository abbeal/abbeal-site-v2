/**
 * check-canonicals.ts — audit reseau des canonical + hreflang sur prod.
 *
 * Pour quoi ce script existe :
 *   - L'helper lib/seo.ts > pageAlternates() est cense produire :
 *       * 1 <link rel="canonical"> self-referencing
 *       * 5 <link rel="alternate" hreflang="..."> (fr, en, ja, fr-CA, x-default)
 *       * x-default → /en (lingua franca documentee Vague 1)
 *   - Une regression silencieuse sur n'importe quel layout / generateMetadata
 *     peut faire sauter ces tags → Google considere les locales comme
 *     duplicates → "Page is duplicate" + tank du ranking sur /en /ja /fr-ca.
 *   - Audit hebdo W24 a flagge 5 URLs canoniques avec snippets anciens
 *     (legacy www.abbeal.com). Code aujourd'hui clean mais il faut un
 *     filet pour les futures iterations.
 *
 * Invariants verifies par URL :
 *   1. HTTP 200 (200 OK, pas un 3xx final)
 *   2. canonical present, https://abbeal.com/{locale}/{path} exact
 *   3. canonical ne pointe JAMAIS vers www.abbeal.com (regression possible)
 *   4. 5 hreflang exacts : fr, en, ja, fr-CA, x-default
 *   5. x-default pointe vers /en{path}
 *
 * Usage :
 *   pnpm exec tsx scripts/check-canonicals.ts
 *   pnpm exec tsx scripts/check-canonicals.ts https://abbeal.com   # override base
 *
 * Exit codes :
 *   0 = tout vert
 *   1 = ≥1 anomalie
 */

const BASE = process.argv[2] ?? "https://abbeal.com";

// Localisations supportees (BCP-47 tags HTML, doivent matcher l'output
// emis par pageAlternates() dans lib/seo.ts).
const REQUIRED_HREFLANGS = ["fr", "en", "ja", "fr-CA", "x-default"] as const;

// URLs auditees : 4 locales × 3 pages cles + sitemap.
// Pour ajouter une URL : etendre cette liste. Format : "/{locale}/{path}"
// avec locale ∈ {fr, en, ja, fr-ca}.
const URLS_TO_CHECK: string[] = [
  // Home par locale
  "/fr",
  "/en",
  "/ja",
  "/fr-ca",
  // Careers (page strategique W22+)
  "/fr/careers",
  "/en/careers",
  "/ja/careers",
  "/fr-ca/careers",
  // Pages legales et contact (top GSC impressions W24)
  "/fr/about",
  "/fr/contact",
  "/fr/cgu",
  "/fr/insights",
  // Landing Tokyo (haut traffic non-brand W24)
  "/fr/tech-consulting-tokyo",
];

type Check = {
  url: string;
  ok: boolean;
  status: number;
  canonical: string | null;
  hreflangs: Array<{ lang: string; href: string }>;
  errors: string[];
};

/** Parse simpliste sans DOM. Suffit pour des tags <link> bien formes
 *  emis par Next.js (pas de cas tordu < dans une string). */
function extractLinks(html: string): Array<Record<string, string>> {
  const links: Array<Record<string, string>> = [];
  const linkRegex = /<link\b([^>]*)\/?>/gi;
  const attrRegex = /(\w[\w-]*)\s*=\s*"([^"]*)"/g;
  let match: RegExpExecArray | null;
  while ((match = linkRegex.exec(html))) {
    const attrs: Record<string, string> = {};
    let attrMatch: RegExpExecArray | null;
    while ((attrMatch = attrRegex.exec(match[1]!))) {
      attrs[attrMatch[1]!.toLowerCase()] = attrMatch[2]!;
    }
    links.push(attrs);
  }
  return links;
}

async function checkUrl(path: string): Promise<Check> {
  const url = `${BASE}${path}`;
  const errors: string[] = [];
  let status = 0;
  let canonical: string | null = null;
  const hreflangs: Array<{ lang: string; href: string }> = [];

  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "abbeal-canonical-audit/1.0" },
    });
    status = res.status;
    if (status !== 200) {
      errors.push(`HTTP ${status} (attendu 200)`);
    }
    const html = await res.text();
    const links = extractLinks(html);

    // 1. Canonical
    const canonLink = links.find((l) => l.rel === "canonical");
    if (!canonLink) {
      errors.push("canonical absent");
    } else {
      canonical = canonLink.href ?? null;
      if (!canonical) {
        errors.push("canonical sans href");
      } else {
        if (canonical.includes("www.abbeal.com")) {
          errors.push(`canonical pointe vers www : ${canonical}`);
        }
        const expected = `${BASE}${path}`;
        if (canonical !== expected) {
          errors.push(`canonical=${canonical} (attendu ${expected})`);
        }
      }
    }

    // 2. Hreflang (rel="alternate" hreflang="...")
    for (const link of links) {
      if (link.rel === "alternate" && link.hreflang && link.href) {
        hreflangs.push({ lang: link.hreflang, href: link.href });
      }
    }
    if (hreflangs.length !== REQUIRED_HREFLANGS.length) {
      errors.push(
        `hreflang count=${hreflangs.length} (attendu ${REQUIRED_HREFLANGS.length})`,
      );
    }
    for (const required of REQUIRED_HREFLANGS) {
      if (!hreflangs.find((h) => h.lang === required)) {
        errors.push(`hreflang "${required}" absent`);
      }
    }

    // 3. x-default → /en{path-sans-locale}
    const xdef = hreflangs.find((h) => h.lang === "x-default");
    if (xdef) {
      // Ordre `fr-ca` AVANT `fr` : regex alternation = left-to-right, sinon
      // /fr-ca matche "fr" et il reste "-ca" → URL cassee.
      const pathWithoutLocale = path.replace(/^\/(fr-ca|fr|en|ja)/, "");
      const expectedXdef = `${BASE}/en${pathWithoutLocale}`;
      if (xdef.href !== expectedXdef) {
        errors.push(
          `x-default=${xdef.href} (attendu ${expectedXdef})`,
        );
      }
    }
  } catch (err) {
    errors.push(`fetch failed : ${(err as Error).message}`);
  }

  return {
    url: path,
    ok: errors.length === 0,
    status,
    canonical,
    hreflangs,
    errors,
  };
}

async function main() {
  console.log(`\n🔍 Canonical + hreflang audit sur ${BASE}`);
  console.log(`   ${URLS_TO_CHECK.length} URLs a auditer\n`);

  const results = await Promise.all(URLS_TO_CHECK.map((p) => checkUrl(p)));

  // Output ligne par URL
  for (const r of results) {
    const mark = r.ok ? "✓" : "✗";
    const summary = r.ok
      ? `canon OK | ${r.hreflangs.length} hreflang`
      : r.errors.join(" ; ");
    console.log(`  ${mark} ${r.url.padEnd(40)} ${summary}`);
  }

  const failures = results.filter((r) => !r.ok);
  console.log("");
  if (failures.length === 0) {
    console.log(`✅ Tout vert : ${results.length}/${results.length} URLs OK\n`);
    process.exit(0);
  } else {
    console.log(
      `❌ ${failures.length}/${results.length} URLs en erreur :\n`,
    );
    for (const f of failures) {
      console.log(`  ${f.url} :`);
      f.errors.forEach((e) => console.log(`    - ${e}`));
    }
    console.log("");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("❌ Script failed :", err);
  process.exit(2);
});
