# CMS schema push Turso — playbook

**Contexte** : le boot serverless Payload en Vercel Fluid Compute **n'exécute pas** le drizzle push automatique, même quand `PAYLOAD_ALLOW_PUSH=1` est défini dans l'environnement. Le flag est lu, `sqliteAdapter({ push: true })` est bien retourné, mais aucun `CREATE TABLE` n'est envoyé à Turso. Cause : le push nécessite un contexte long-lived (dev server ou `drizzle-kit push` CLI) qui n'existe pas en serverless.

**Impact** : chaque nouvelle collection Payload demande une procédure manuelle en 3 étapes après merge. Sans quoi les writes sur cette collection renvoient **500 SQLite error: no such table** et les writes sur les collections voisines renvoient aussi 500 (à cause des colonnes de relation cross-collection dans `payload_locked_documents_rels`).

## Symptômes

- `GET /api/<new-collection>` → 500 + `SQLite error: no such table: <new-collection>`
- `PATCH /api/<other-collection>/<id>` (une collection existante) → 500 + `select ... from "payload_locked_documents_rels" ... where ... "new_collection_id" ...` — la nouvelle colonne de relation référence une table inexistante ou n'existe pas encore

## Procédure (3 étapes)

### 1. Créer la nouvelle table + ses index

Endpoint one-shot dans le repo (à créer par PR à chaque nouvelle collection), auth par `REVALIDATE_SECRET` :

```ts
// app/api/admin/<slug>-create-<collection>-table/route.ts
const ddl = [
  `CREATE TABLE IF NOT EXISTS <collection> (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     -- colonnes propres à la collection (snake_case)
     updated_at TEXT DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
     created_at TEXT DEFAULT (CURRENT_TIMESTAMP) NOT NULL
   )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS <collection>_<uniq_field>_idx ON <collection>(<uniq_field>)`,
  `CREATE INDEX IF NOT EXISTS <collection>_updated_at_idx ON <collection>(updated_at)`,
  `CREATE INDEX IF NOT EXISTS <collection>_created_at_idx ON <collection>(created_at)`,
];
for (const sql of ddl) await payload.db.drizzle.run(sql);
```

Naming convention : `snake_case` (Payload/Drizzle convertit `camelCase` → `snake_case`). Ex : `fromPath` → `from_path`.

### 2. Ajouter les colonnes de relation cross-collection

Chaque nouvelle collection ajoute une colonne `<collection>_id` dans les tables Payload de relations. Sans ces colonnes, `payload.update()` sur **n'importe quelle collection** échoue (le hook lock cleanup interroge toutes les colonnes du table de rels) :

```ts
// app/api/admin/<slug>-add-<collection>-rels/route.ts
const cmds = [
  `ALTER TABLE payload_locked_documents_rels ADD COLUMN <collection>_id INTEGER REFERENCES <collection>(id) ON DELETE CASCADE`,
  `CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_<collection>_id_idx ON payload_locked_documents_rels(<collection>_id)`,
  `ALTER TABLE payload_preferences_rels ADD COLUMN <collection>_id INTEGER REFERENCES <collection>(id) ON DELETE CASCADE`,
  `CREATE INDEX IF NOT EXISTS payload_preferences_rels_<collection>_id_idx ON payload_preferences_rels(<collection>_id)`,
];
// SQLite ADD COLUMN n'a pas de IF NOT EXISTS — try/catch et détecter "duplicate column" comme idempotent
```

### 3. Optionnel — tables `_locales`, `_rels`, `_v_*` pour les collections avec `localized`, `relationTo`, ou `versions`

Si la collection utilise `localized: true` sur des champs, Payload attend une table `<collection>_locales`. Idem pour `relationTo` (table `<collection>_rels`) et `versions` (tables `_<collection>_v`, `_<collection>_v_locales`, etc.).

Pour la collection `redirects` (fields non-localisés, pas de relations, pas de versions), seules les tables de l'étape 1 + les colonnes de l'étape 2 suffisent.

## Alternative "propre" (à faire un jour)

Écrire `scripts/payload-push-schema.ts` — un script standalone qui :
1. Boot Payload en mode long-lived (dev-like) avec `PAYLOAD_ALLOW_PUSH=1` + credentials Turso prod
2. Appelle explicitement `payload.db.drizzle.push()` ou l'équivalent public
3. Se termine après le push

Le user le lance en local avec un `.env.local` pointant Turso prod. Pas besoin d'endpoints one-shot jetables.

Preferrable long terme. Tickets à créer.

## Historique

- **2026-09-01 W37** : première rencontre du problème lors de l'ajout de la collection `redirects`. Résolu via endpoints one-shot `w37-create-redirects-table` + `w37-add-redirects-rels` (retirés dans PR #116).

## Références

- `payload.config.ts` : commentaires `⚠️ versions désactivé (revert urgence). Re-activer après schema push.` sur Articles / Cases / LandingPages — même cause racine, plus vieux (W22 revert).
- `push: process.env.PAYLOAD_ALLOW_PUSH === "1"` dans l'adapter — flag inefficace en serverless.
