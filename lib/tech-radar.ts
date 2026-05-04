/**
 * Tech Radar editions registry — drives permalink stability and the archive
 * page. Add a new entry each quarter. The current edition is the one with
 * `current: true`; the bare /[lang]/insights/tech-radar route redirects
 * to it (so external backlinks to the canonical archive URL keep working).
 *
 * The radar content itself (items, rationale per item) lives in the dict
 * `techRadar.items`. When we publish an archive of past editions we'll
 * snapshot the items per edition into a json file similar to article-bodies.
 */

export type TechRadarEdition = {
  slug: string; // e.g. "2026-q2" — stable permalink segment
  publishedAt: string; // ISO date — visible on the page + JSON-LD datePublished
  title: string; // e.g. "Tech Radar Q2 2026"
  current: boolean; // the edition the homepage section + the bare URL points to
};

export const TECH_RADAR_EDITIONS: TechRadarEdition[] = [
  {
    slug: "2026-q2",
    publishedAt: "2026-04-15",
    title: "Tech Radar Q2 2026",
    current: true,
  },
];

export function getCurrentEdition(): TechRadarEdition {
  return (
    TECH_RADAR_EDITIONS.find((e) => e.current) ?? TECH_RADAR_EDITIONS[0]
  );
}

export function getEdition(slug: string): TechRadarEdition | undefined {
  return TECH_RADAR_EDITIONS.find((e) => e.slug === slug);
}
