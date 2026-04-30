import { ImageResponse } from "next/og";
import { getCase } from "@/lib/cases";
import { pick } from "@/lib/articles";
import { hasLocale, type Locale } from "@/lib/i18n";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "Abbeal Case Study";

export default async function CaseOG({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = (hasLocale(lang) ? lang : "fr") as Locale;
  const c = getCase(slug);
  const title = c ? pick(c.title, locale) : "Abbeal · Case Study";
  const sector = c ? pick(c.sector, locale) : "Case study";
  const geo = c?.geo ?? "";
  const kpiValue = c?.kpi.value ?? "";
  const kpiLabel = c ? pick(c.kpi.label, locale) : "";

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
            "radial-gradient(circle at 10% 90%, rgba(66, 178, 150, 0.2) 0%, transparent 55%)",
          color: "#FAFAF8",
          fontFamily: '"Geist", "Helvetica", "Arial", sans-serif',
        }}
      >
        {/* Top band: sector · geo */}
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
                backgroundColor: "#80E8BA",
              }}
            />
            <span style={{ color: "#80E8BA" }}>// {sector}</span>
          </div>
          <span style={{ color: "rgba(250, 250, 248, 0.6)" }}>{geo}</span>
        </div>

        {/* Middle: title + huge KPI */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}
        >
          {kpiValue && (
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "24px",
              }}
            >
              <span
                style={{
                  fontSize: 140,
                  fontWeight: 600,
                  letterSpacing: "-0.035em",
                  lineHeight: 1,
                  background:
                    "linear-gradient(135deg, #42B296 0%, #80E8BA 100%)",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {kpiValue}
              </span>
              <span
                style={{
                  fontFamily: '"Geist Mono", monospace',
                  fontSize: 20,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(250, 250, 248, 0.7)",
                  maxWidth: "520px",
                  display: "flex",
                }}
              >
                {kpiLabel}
              </span>
            </div>
          )}
          <div
            style={{
              display: "flex",
              fontSize: 52,
              fontWeight: 600,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              maxWidth: "1000px",
              color: "#FAFAF8",
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom band: brand */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(250, 250, 248, 0.12)",
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
                color: "#FAFAF8",
              }}
            >
              Abbeal
            </span>
            <span
              style={{
                fontFamily: '"Geist Mono", monospace',
                fontSize: 16,
                color: "rgba(250, 250, 248, 0.6)",
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
              color: "rgba(250, 250, 248, 0.5)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            abbeal.com/{locale}/cases
          </span>
        </div>
      </div>
    ),
    size,
  );
}
