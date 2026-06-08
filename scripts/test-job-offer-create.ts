/**
 * Test : cree une offre d'emploi exemple via le SDK Payload.
 * Verifie que la collection JobOffers fonctionne (schema + access + workflow).
 *
 * Local (SQLite) : creera l'offre dans payload.db local.
 * Avec env vars TURSO : creera dans Turso (avec push:false hardcode).
 *
 * Usage : PAYLOAD_SECRET=dev-only pnpm tsx scripts/test-job-offer-create.ts
 */

import { getPayload } from "payload";
import config from "../payload.config.js";

async function main() {
  const payload = await getPayload({ config });

  const slug = "senior-backend-engineer-tokyo-2026";

  // Check si existe deja (idempotent)
  const existing = await payload.find({
    collection: "job-offers",
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  });
  if (existing.docs.length > 0) {
    console.log(`✓ Job offer "${slug}" existe deja (id=${existing.docs[0]!.id})`);
    process.exit(0);
  }

  const created = await payload.create({
    collection: "job-offers",
    overrideAccess: true,
    data: {
      slug,
      status: "draft",
      featured: false,
      title: "Senior Backend Engineer — Tokyo",
      excerpt:
        "Rejoignez l'équipe Tokyo d'Abbeal pour construire des plateformes backend critiques pour des clients FinTech japonais.",
      metaDescription:
        "Senior Backend Engineer (Go, Kubernetes, PostgreSQL) basé à Tokyo. Équipe bilingue JLPT N2+. CDI ou freelance.",
      location: "tokyo",
      contractType: "cdi",
      experienceLevel: "senior",
      techStack: [{ name: "Go" }, { name: "Kubernetes" }, { name: "PostgreSQL" }, { name: "Pulumi" }],
      salaryRange: "8M-12M JPY selon experience",
      applyUrl: "mailto:recrutement@abbeal.com?subject=Senior+Backend+Tokyo",
      publishedAt: "2026-06-02",
      relatedCaseSlugs: [{ slug: "money-forward" }],
      description: [
        { blockType: "h2", content: "Le contexte" },
        { blockType: "p", content: "Abbeal est un pôle d'ingénierie tri-géo Paris · Montréal · Tokyo. Le hub Tokyo opère depuis Higashi-Azabu (Minato-ku) avec une équipe d'ingénieurs bilingues JLPT N2+ qui livre des plateformes critiques pour des clients FinTech japonais." },
        { blockType: "h2", content: "Tes missions" },
        { blockType: "list", items: [
          { text: "Concevoir et opérer des services Go critiques (>10k RPS)" },
          { text: "Mettre en place les SLO + observability (Datadog, Honeycomb)" },
          { text: "Participer aux design reviews bilingues (FR/EN/JP)" },
          { text: "Mentorer 2-3 ingénieurs sur les patterns cloud-native" },
        ], ordered: false },
        { blockType: "h2", content: "Le profil" },
        { blockType: "list", items: [
          { text: "6+ ans en backend production, idéalement Go ou Rust" },
          { text: "Solide expérience Kubernetes + observability" },
          { text: "JLPT N2 minimum (interaction quotidienne avec clients JP)" },
          { text: "Esprit Mobbeal : envie de bosser dans un contexte multi-culturel" },
        ], ordered: false },
        { blockType: "callout", tone: "teal", content: "Possibilité de mobilité internationale future via Mobbeal — programme Abbeal de visas tech (Paris/Montréal/Tokyo)." },
      ],
    },
  });

  console.log(`✅ Job offer cree (id=${created.id})`);
  console.log(`   slug: ${slug}`);
  console.log(`   status: ${(created as Record<string, unknown>).status}`);
  console.log(`   location: ${(created as Record<string, unknown>).location}`);
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Failed :", err);
  process.exit(1);
});
