/**
 * Bodies enrichis pour les 4 templates statiques /careers#senior-fullstack etc.
 *
 * Pourquoi ce fichier :
 *   - Les 4 templates dict.careers.roles (senior-fullstack, ai-engineer,
 *     cloud-devops, embedded-robotics) sont des "talent magnets" toujours
 *     ouverts, qui ne devraient pas necessairement etre saisis dans le
 *     CMS Payload (vu qu'ils sont stables, packageables avec le code).
 *   - Mais Sebastien veut quand meme une page detail riche par template
 *     (sections, FAQ, callouts) sans tout migrer en CMS.
 *   - Compromis : on stocke les bodies enrichis dans ce fichier statique.
 *     Si plus tard on bascule en CMS, on supprime ce fichier + migre.
 *
 * FR uniquement pour l'instant. Si une autre locale est demandee, on
 * fallback sur FR (mieux que rien). Traduction pleine si demande.
 */

import type { ArticleBlock } from "./articles";
import type { Locale } from "./i18n";
import bodies from "./career-bodies.json";

type CareerBody = {
  body: { fr: ArticleBlock[] };
  faq: { fr: { q: string; a: string }[] };
};

const CAREER_BODIES = bodies as Record<string, CareerBody>;

export function getCareerBody(
  slug: string,
  _locale: Locale,
): { body: ArticleBlock[]; faq: { q: string; a: string }[] } | null {
  const entry = CAREER_BODIES[slug];
  if (!entry) return null;
  // Fallback FR uniquement pour l'instant. Si on traduit plus tard, le
  // selecteur pourra utiliser _locale.
  return {
    body: entry.body.fr,
    faq: entry.faq.fr,
  };
}
