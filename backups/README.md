# CMS Backups

Snapshots quotidiens des collections Payload (via GitHub Actions cron 03:00 UTC).

Format : `{collection}-YYYY-MM-DD.json`. Chaque fichier est la response
brute de `/api/{collection}?limit=1000&depth=0` avec :
- `docs[]` : array des documents
- `totalDocs` : count
- `limit`, `page`, etc.

## Restauration manuelle

Si une row disparait accidentellement, on peut :
1. Trouver la version dans le backup le plus recent
2. La re-POSTer via API admin (`curl -X POST /api/{collection} -H "Authorization: users API-Key <key>"`)
3. Ou re-creer manuellement via /admin

## Politique de retention

GitHub garde tout l historique git -> backups sont retroactivement
accessibles via `git log -p backups/`.

Pour nettoyer les vieux fichiers (>90 jours), un job manuel suffit
(pas auto pour eviter perte accidentelle).
