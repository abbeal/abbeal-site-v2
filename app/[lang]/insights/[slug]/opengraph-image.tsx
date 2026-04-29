import { ImageResponse } from "next/og";
import { getArticle, pick } from "@/lib/articles";
import { hasLocale, type Locale } from "@/lib/i18n";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "Abbeal Insights";

export default async function ArticleOG({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = (hasLocale(lang) ? lang : "fr") as Locale;
  const article = getArticle(slug);
  const title = article
    ? pick(article.title, locale)
    : "Abbeal · Insights";
  const tag = article?.tag ?? "Insight";
  const readTime = article?.readTime ?? "";

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
            "radial-gradient(circle at 85% 15%, rgba(66, 178, 150, 0.12) 0%, transparent 55%)",
          color: "#0C343D",
          fontFamily: '"Geist", "Helvetica", "Arial", sans-serif',
        }}
      >
        {/* Top band: tag + read time */}
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
            <span style={{ color: "#42B296" }}>// {tag}</span>
          </div>
          <span style={{ color: "#888" }}>{readTime}</span>
        </div>

        {/* Title — the meat */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 64,
            fontWeight: 600,
            letterSpacing: "-0.025em",
            lineHeight: 1.06,
            maxWidth: "1000px",
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
            abbeal.com/{locale}/insights
          </span>
        </div>
      </div>
    ),
    size,
  );
}
