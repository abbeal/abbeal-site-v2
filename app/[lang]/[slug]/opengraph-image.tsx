import { ImageResponse } from "next/og";
import { getLandingPage } from "@/lib/landing-pages";
import { hasLocale, type Locale } from "@/lib/i18n";
import { pick } from "@/lib/articles";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "Abbeal · Landing";

/**
 * OG image dynamique pour les landing-pages /[slug] (follow-the-sun-delivery,
 * tech-consulting-tokyo, engineering-jobs-tokyo, etc.).
 *
 * Personnalisation :
 *   - tape : "// {tape de la landing}" (METHOD, SERVICE, HUB, etc.)
 *   - titre : H1 de la landing
 *   - footer : brand + URL
 */
export default async function LandingOG({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = (hasLocale(lang) ? lang : "fr") as Locale;
  const landing = getLandingPage(slug);
  // Si pas de landing match, fallback generique
  const title = landing
    ? pick(landing.h1, locale)
    : "Abbeal · Tri-geo engineering";
  const tape = landing
    ? pick(landing.tape, locale)
    : locale === "ja"
      ? "// アッビアル"
      : "// ABBEAL";

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
          backgroundColor: "#FAFAF8",
          backgroundImage:
            "radial-gradient(circle at 85% 15%, rgba(66, 178, 150, 0.12) 0%, transparent 55%), radial-gradient(circle at 15% 85%, rgba(66, 178, 150, 0.08) 0%, transparent 55%)",
          color: "#0C343D",
          fontFamily: '"Geist", "Helvetica", "Arial", sans-serif",',
        }}
      >
        {/* Top band: tape badge */}
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
              backgroundColor: "#42B296",
            }}
          />
          <span style={{ color: "#42B296" }}>{tape}</span>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 62,
            fontWeight: 600,
            letterSpacing: "-0.025em",
            lineHeight: 1.06,
            maxWidth: "1040px",
            color: "#0C343D",
          }}
        >
          {title}
        </div>

        {/* Bottom band: brand + locations */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(12, 52, 61, 0.12)",
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
                  "linear-gradient(135deg, #42B296 0%, #80E8BA 100%)",
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
                color: "#666",
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
              color: "#888",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            abbeal.com/{locale}/{slug}
          </span>
        </div>
      </div>
    ),
    size,
  );
}
