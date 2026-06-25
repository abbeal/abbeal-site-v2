import { ImageResponse } from "next/og";
import { getJobOffer, locationLabel } from "@/lib/job-offers";
import { hasLocale, type Locale } from "@/lib/i18n";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "Abbeal · Careers";

/**
 * OG image generee dynamiquement pour les job-offers /careers/[slug].
 * Visible sur LinkedIn / Twitter / Slack / WhatsApp quand quelqu'un partage
 * le lien d'une offre. Visuel coherent avec insights/cases (meme grille
 * tape-band en haut, titre central, footer brand + URL).
 *
 * Personnalisation par offre :
 *   - tape : "// HIRING · {LocationLabel}" (ex : "// HIRING · Tokyo")
 *   - titre : title de l'offre
 *   - bas : tech stack top 3 (badges) + brand Abbeal + URL careers
 */
export default async function CareerOG({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = (hasLocale(lang) ? lang : "fr") as Locale;
  const offer = await getJobOffer(slug, locale);
  const title = offer?.title ?? "Abbeal · Careers";
  const loc = offer?.location
    ? locationLabel(offer.location, locale)
    : "Paris · Montréal · Tokyo";
  const techStack: string[] =
    Array.isArray(offer?.techStack) && offer.techStack.length > 0
      ? offer.techStack.slice(0, 4)
      : [];

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
            "radial-gradient(circle at 15% 85%, rgba(66, 178, 150, 0.14) 0%, transparent 55%)",
          color: "#0C343D",
          fontFamily: '"Geist", "Helvetica", "Arial", sans-serif',
        }}
      >
        {/* Top band: HIRING tag + location */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: '"Geist Mono", monospace',
            fontSize: 20,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <div
              style={{
                width: "44px",
                height: "3px",
                backgroundColor: "#42B296",
              }}
            />
            <span style={{ color: "#42B296" }}>// Hiring · {loc}</span>
          </div>
          <span style={{ color: "#888" }}>
            {offer?.contractType === "freelance"
              ? "Freelance"
              : offer?.contractType === "cdi"
                ? "CDI"
                : ""}
          </span>
        </div>

        {/* Title — the meat */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 60,
            fontWeight: 600,
            letterSpacing: "-0.025em",
            lineHeight: 1.08,
            maxWidth: "1000px",
            color: "#0C343D",
          }}
        >
          {title}
        </div>

        {/* Tech stack badges */}
        {techStack.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {techStack.map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: 18,
                  padding: "8px 16px",
                  border: "1px solid rgba(66, 178, 150, 0.4)",
                  borderRadius: "2px",
                  color: "#0C343D",
                  backgroundColor: "rgba(66, 178, 150, 0.08)",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        )}

        {/* Bottom band: brand + URL */}
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
            abbeal.com/{locale}/careers
          </span>
        </div>
      </div>
    ),
    size,
  );
}
