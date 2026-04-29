import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com";

/**
 * Policy:
 * - Search engines & LLM crawlers: full access (we want indexing + attribution)
 * - /api/: blocked (internal endpoints only, no public data)
 * - Legal pages (mentions-legales, confidentialite, cgu): ALLOWED.
 *
 * LLM-specific bots explicitly allowed:
 * - GPTBot (OpenAI training)
 * - ChatGPT-User (OpenAI live queries)
 * - OAI-SearchBot (OpenAI search)
 * - ClaudeBot (Anthropic training)
 * - Claude-Web (Anthropic live)
 * - anthropic-ai (Anthropic legacy)
 * - PerplexityBot (Perplexity search)
 * - Perplexity-User (Perplexity live)
 * - Google-Extended (Gemini training opt-in)
 * - CCBot (Common Crawl — used by many open-source LLMs)
 * - Meta-ExternalAgent (Meta AI)
 * - Applebot-Extended (Apple Intelligence training)
 * - DuckAssistBot (DuckDuckGo AI)
 * - YouBot (You.com)
 * - Bytespider (ByteDance / TikTok — used cautiously)
 */
export default function robots(): MetadataRoute.Robots {
  const COMMON_DISALLOW = ["/api/"];

  return {
    rules: [
      // Everyone
      {
        userAgent: "*",
        allow: "/",
        disallow: COMMON_DISALLOW,
      },
      // Major LLM crawlers — explicit allow (signals we're AI-friendly)
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "ClaudeBot",
          "Claude-Web",
          "anthropic-ai",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "CCBot",
          "Meta-ExternalAgent",
          "Applebot-Extended",
          "DuckAssistBot",
          "YouBot",
          "Bytespider",
        ],
        allow: "/",
        disallow: COMMON_DISALLOW,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
