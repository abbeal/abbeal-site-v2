import { ImageResponse } from "next/og";
import { getGlossaryEntry } from "@/lib/glossary";
import { hasLocale, type Locale } from "@/lib/i18n";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "Abbeal · Glossary";

/**
 * OG image dynamique pour les entrees du glossaire /glossaire/[slug].
 *
 * Personnalisation par terme :
 *   - tape : "// GLOSSARY · {category}"
 *   - term : nom du terme (gros titre)
 *   - short : 1-line definition courte (sous-titre)
 *   - footer : brand + URL
 */
function pickI18n(
  field: { fr: string; en?: string; ja?: string },
  locale: Locale,
): string {
  if (locale === "ja" && field.ja) return field.ja;
  if (locale === "en" && field.en) return field.en;
  // fr-ca fallback fr
  return field.fr;
}

export default async function GlossaryOG({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = (hasLocale(lang) ? lang : "fr") as Locale;
  const entry = getGlossaryEntry(slug);
  const term = entry ? pickI18n(entry.term, locale) : "Abbeal · Glossary";
  const short = entry ? pickI18n(entry.short, locale) : "";
  const category = entry?.category ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#0C343D",
          backgroundImage:
            "radial-gradient(circle at 85% 15%, rgba(66, 178, 150, 0.22) 0%, transparent 55%)",
          color: "#FAFAF8",
          fontFamily: '"Geist", "Helvetica", "Arial", sans-serif',
        }}
      >
        {/* Top band: GLOSSARY · category */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            fontFamily: '"Geist Mono", monospace',
            fontSize: 20,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "3px",
              backgroundColor: "#80E8BA",
            }}
          />
          <span style={{ color: "#80E8BA" }}>
            // Glossary{category ? ` · ${category}` : ""}
          </span>
        </div>

        {/* Term — main display */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 88,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1.02,
              color: "#FAFAF8",
            }}
          >
            {term}
          </div>
          {short && (
            <div
              style={{
                display: "flex",
                fontSize: 28,
                fontWeight: 400,
                lineHeight: 1.35,
                color: "rgba(250, 250, 248, 0.78)",
                maxWidth: "1000px",
                letterSpacing: "-0.01em",
              }}
            >
              {short}
            </div>
          )}
        </div>

        {/* Bottom band: brand + URL */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(250, 250, 248, 0.18)",
            paddingTop: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <span
              style={{
                fontSize: 36,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                background:
                  "linear-gradient(135deg, #80E8BA 0%, #42B296 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Abbeal
            </span>
            <span
              style={{
                fontFamily: '"Geist Mono", monospace',
                fontSize: 16,
                color: "rgba(250, 250, 248, 0.65)",
                letterSpacing: "0.05em",
              }}
            >
              Paris · Montréal · Tokyo
            </span>
          </div>
          <span
            style={{
              fontFamily: '"Geist Mono", monospace',
              fontSize: 16,
              color: "rgba(250, 250, 248, 0.55)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            abbeal.com/{locale}/glossaire
          </span>
        </div>
      </div>
    ),
    size,
  );
}
