/**
 * POST /api/admin/create-llm-offer — recree l offre LLM Paris pour le diagnostic
 * "disparait apres 10 min" rapporte par Seb.
 *
 * Cree l'offre via API direct (overrideAccess), retourne l'id + slug.
 * Pas de cleanup automatique : Sebastien et l'agent peuvent ensuite poller
 * cette offre toutes les minutes pour observer si/quand elle disparait.
 *
 * Auth via REVALIDATE_SECRET.
 */

import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "../../../../payload.config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  let body: { secret?: string };
  try {
    body = (await req.json()) as { secret?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || !body.secret || body.secret !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const payload = await getPayload({ config });
  const slug = "lead-llm-engineer-ia-notariat-paris";

  // Idempotent : si deja en DB, retourne sans recreer
  const existing = await payload.find({
    collection: "job-offers",
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  });
  if (existing.docs.length > 0) {
    return NextResponse.json({
      ok: true,
      existed: true,
      id: existing.docs[0]!.id,
      slug,
      createdAt: (existing.docs[0] as { createdAt?: string }).createdAt,
    });
  }

  try {
    const created = await payload.create({
      collection: "job-offers",
      overrideAccess: true,
      data: {
        slug,
        status: "published",
        featured: false,
        title: "Lead LLM Engineer — Agent IA Legal-Tech (Paris)",
        excerpt:
          "Prends le lead technique d'un agent IA qui transforme le quotidien des notaires : ontologie documentaire, tool use avance, triggers autonomes. L'esprit Claude Code, applique au droit immobilier.",
        metaDescription:
          "Lead LLM Engineer freelance a Paris : agents LLM en production, RAG/knowledge graph, evals LangFuse, generation documentaire. TJM 650-700 EUR, demarrage ASAP.",
        location: "paris",
        contractType: "freelance",
        experienceLevel: "senior",
        techStack: [
          { name: "LLM Agents" },
          { name: "Python" },
          { name: "RAG / Knowledge Graph" },
          { name: "LangFuse" },
          { name: "Tool Use / Function Calling" },
        ],
        salaryRange: "TJM 650-700 EUR selon experience",
        applyUrl:
          "mailto:recrutement@abbeal.com?subject=Lead+LLM+Engineer+Notariat",
        publishedAt: new Date().toISOString().slice(0, 10),
        description: [
          { blockType: "h2", content: "Le contexte" },
          {
            blockType: "p",
            content:
              "Un cabinet leader du notariat francais nous a confie la conception d'un agent IA qui assiste les notaires sur la redaction d'actes immobiliers. Le but : reduire de 60% le temps passe sur la generation documentaire tout en garantissant la conformite reglementaire.",
          },
          { blockType: "h2", content: "Tes missions" },
          {
            blockType: "list",
            ordered: false,
            items: [
              {
                text: "Architecturer l'agent LLM (Claude Sonnet 4.5 + tool use) qui consomme une ontologie documentaire (RDF/SPARQL) et genere des actes notarie.",
              },
              {
                text: "Mettre en place le RAG + knowledge graph pour le contexte juridique francais (Code civil, jurisprudence).",
              },
              {
                text: "Evaluation continue : evals LangFuse, dataset golden, regression CI.",
              },
              {
                text: "Triggers autonomes : detection d'evenements, escalation humaine.",
              },
            ],
          },
          { blockType: "h2", content: "Le profil" },
          {
            blockType: "list",
            ordered: false,
            items: [
              {
                text: "5+ ans en production sur des projets LLM/agents (Claude, OpenAI, ou frameworks similaires).",
              },
              {
                text: "Solide en Python (typage strict, async, tests).",
              },
              {
                text: "Experience pratique de tool use, RAG, et evals continues.",
              },
              {
                text: "Connaissance des knowledge graphs (RDF, SPARQL, ou similaire) un plus.",
              },
              {
                text: "Interet pour le droit/legal-tech : tu n'as pas peur de lire un Code civil.",
              },
            ],
          },
          {
            blockType: "callout",
            tone: "teal",
            content:
              "TJM 650-700 EUR selon experience. Demarrage ASAP. Mission 6-12 mois renouvelable. Hybride Paris (54 rue Greneta) + remote.",
          },
        ],
      },
    });

    return NextResponse.json({
      ok: true,
      existed: false,
      id: created.id,
      slug,
      createdAt: (created as { createdAt?: string }).createdAt,
    });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message ?? "create failed" },
      { status: 500 },
    );
  }
}
