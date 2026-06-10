/**
 * lib/translate-article.ts — auto-translation FR -> EN/JA/FR-CA via Claude API.
 *
 * Utilise par le hook afterChange sur la collection Articles dans
 * payload.config.ts pour traduire automatiquement chaque article FR save
 * dans /admin vers les 3 autres locales (si elles sont vides).
 *
 * Robust : si ANTHROPIC_API_KEY manquant ou si Claude crash, on log et
 * skip silencieusement — le doc FR reste sauvegarde, on n'interrompt pas
 * le flow editorial.
 *
 * Couts indicatifs (claude-sonnet-4-5) : ~$0.40 par article traduit dans
 * les 3 locales. Pour 10 articles/mois -> ~$4/mois.
 */

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5-20250929";

export type ArticleBlockLike = Record<string, unknown> & { type: string };

export type TranslateInput = {
  title: string;
  excerpt: string;
  metaDescription?: string | null;
  body: ArticleBlockLike[];
};

export type TranslateOutput = {
  title: string;
  excerpt: string;
  metaDescription?: string;
  body: ArticleBlockLike[];
};

type TargetLocale = "en" | "ja" | "fr-ca";

const LOCALE_NAMES: Record<TargetLocale, string> = {
  en: "English",
  ja: "Japanese",
  "fr-ca": "French (Canadian / Québécois)",
};

const TONE_GUIDELINES: Record<TargetLocale, string> = {
  en: "Direct, factual, anti-bullshit. Keep technical terms in English (no over-translation). Match the tri-geo Abbeal voice (Paris/Montréal/Tokyo engineering studio).",
  ja: "技術系のスタートアップらしい直接的でファクトベースな文体。Abbealは欧米企業向けエンジニアリングスタジオなので、過度な敬語は避ける。技術用語は英語で残す（例：React、Kubernetes、LLM、RAG）。",
  "fr-ca":
    "Reste direct, factuel. Adapte le vocabulaire au québécois : courriel/email, infonuagique/cloud, etc. selon le contexte. Tutoiement preservé.",
};

/**
 * Traduit un article FR vers une locale cible via Claude API.
 * Retourne null si erreur (clé manquante, parse fail, API error).
 *
 * Sebastien peut review la traduction post-save dans /admin avant publish.
 */
export async function translateArticle(
  source: TranslateInput,
  target: TargetLocale,
): Promise<TranslateOutput | null> {
  if (!ANTHROPIC_API_KEY) {
    console.warn(
      "[translate] ANTHROPIC_API_KEY not set — auto-translation skipped",
    );
    return null;
  }

  const targetName = LOCALE_NAMES[target];
  const tone = TONE_GUIDELINES[target];

  const systemPrompt = `You are a professional translator for Abbeal, a tri-geo engineering studio (Paris · Montréal · Tokyo). Translate the article from French to ${targetName}.

Constraints:
- ${tone}
- Preserve the JSON structure EXACTLY. Same number of blocks, same types, same field names.
- For block bodies (content, items), translate the text but keep technical English terms (e.g. React, Kubernetes, LLM, RAG, GreenOps, SLOs, CDI) untranslated.
- For inline markdown links [label](url), translate the label but keep the URL.
- Return ONLY a valid JSON object with the same keys as input. No markdown wrapper, no extra prose, just the JSON.`;

  const userPrompt = `Translate this article to ${targetName}. Return JSON only.

INPUT:
${JSON.stringify(source, null, 2)}`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 16000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `[translate] Anthropic API ${res.status} (${target}): ${errorText.slice(0, 400)}`,
      );
      return null;
    }

    const data = (await res.json()) as {
      content?: Array<{ text?: string }>;
    };
    const text = data?.content?.[0]?.text;
    if (!text) {
      console.error(`[translate] empty Claude response (${target})`);
      return null;
    }

    // Extract JSON : Claude peut wrap en ```json ... ``` malgre la consigne.
    const jsonMatch = text.match(/```json\s*([\s\S]+?)\s*```/);
    const jsonStr = (jsonMatch?.[1] ?? text).trim();

    const parsed = JSON.parse(jsonStr) as TranslateOutput;
    return parsed;
  } catch (err) {
    console.error(`[translate] failed (${target}) :`, err);
    return null;
  }
}
