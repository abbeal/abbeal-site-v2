# Prompt Cowork — Installer 2 signatures Gmail (Abbeal Pro + Abbeal Reply)

> Colle ce prompt dans Cowork pour qu'il installe 2 signatures email dans `sebastien@abbeal.com` :
> - **Abbeal Pro** (logo + role gradient + Calendly + 3 hubs) → défaut pour nouveaux emails
> - **Abbeal Reply** (ultra réduit) → défaut pour réponses / transferts

---

## Prompt à coller dans Cowork

```
Tâche : installer 2 signatures email HTML dans Gmail sebastien@abbeal.com et les configurer comme défauts.
- Signature "Abbeal Pro" : pour les nouveaux emails
- Signature "Abbeal Reply" : pour les réponses et transferts

COMPTE CIBLE : Gmail sebastien@abbeal.com
Vérifier le compte actif avant toute modification.

─────────────────────────────────────────────────
ÉTAPE 1 — Préparer les 2 fichiers HTML localement
─────────────────────────────────────────────────

Créer /tmp/abbeal-sig-pro.html avec :

<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin: 40px; background: #FFFFFF;">
<table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #0C343D; line-height: 1.4;">
  <tr>
    <td valign="middle" style="padding: 0 22px 0 0; border-right: 1px solid #E5E2D8;">
      <a href="https://abbeal.com" style="text-decoration: none; display: block;">
        <img src="https://abbeal.com/brand/wordmark-teal.png" alt="Abbeal" width="160" height="35" style="display: block; border: 0; outline: none; max-width: 160px; height: auto;">
      </a>
    </td>
    <td valign="middle" style="padding: 0 0 0 22px;">
      <div style="font-size: 14px; font-weight: 600; color: #0C343D;">
        Sébastien Lonjon
        <span style="font-weight: 400; color: #42B296; font-style: italic;">&nbsp;· Founder &amp; CEO</span>
      </div>
      <div style="margin-top: 5px; font-size: 12px; color: #6B7A7E;">
        <a href="mailto:sebastien@abbeal.com" style="color: #0C343D; text-decoration: none;">sebastien@abbeal.com</a>
        &nbsp;·&nbsp;
        <a href="https://calendly.com/sebastien-lonjon/meeting-with-sebastien" style="color: #0C343D; text-decoration: none; border-bottom: 1px solid #42B296;">Book 30 min</a>
      </div>
      <div style="margin-top: 4px; font-family: 'SF Mono','Courier New',monospace; font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase; color: #6B7A7E;">
        Paris&nbsp;·&nbsp;Montréal&nbsp;·&nbsp;Tokyo
      </div>
    </td>
  </tr>
</table>
</body></html>

Créer /tmp/abbeal-sig-reply.html avec :

<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin: 40px; background: #FFFFFF;">
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #0C343D; line-height: 1.5;">
  <div style="font-size: 16px; font-weight: 600; color: #0C343D;">Sébastien</div>
  <div style="font-size: 13px; color: #6B7A7E; margin-top: 2px;">
    Founder &amp; CEO <a href="https://abbeal.com" style="color: #42B296; text-decoration: none; font-weight: 500;">Abbeal</a>
    &nbsp;·&nbsp;
    <a href="https://calendly.com/sebastien-lonjon/meeting-with-sebastien" style="color: #6B7A7E; text-decoration: none; border-bottom: 1px solid #42B296;">book 30 min</a>
  </div>
</div>
</body></html>

─────────────────────────────────────────────────
ÉTAPE 2 — Ouvrir Gmail Settings
─────────────────────────────────────────────────

1. Ouvrir https://mail.google.com
2. Vérifier compte actif : avatar top-right doit afficher sebastien@abbeal.com
3. Si différent : switch via "Manage your Google account" → sebastien@abbeal.com
4. Clic icône ⚙ (roue dentée) → "See all settings"
5. Tab "General" → scroller à la section "Signature"

─────────────────────────────────────────────────
ÉTAPE 3 — Créer signature "Abbeal Pro"
─────────────────────────────────────────────────

1. Clic "Create new" (ou "Créer une signature")
2. Nom : Abbeal Pro
3. Ouvrir /tmp/abbeal-sig-pro.html dans un nouvel onglet Chrome
4. Dans cet onglet : sélectionner tout le contenu visible (Cmd+A sur le body OU click-drag) → Cmd+C
5. Retour sur Gmail → cliquer dans l'éditeur de signature "Abbeal Pro" → Cmd+V
6. Vérifier visuellement le rendu :
   - Logo Abbeal wordmark teal à gauche (160×35px, PROPORTIONS CORRECTES non écrasé)
   - Séparateur vertical 1px muted
   - "Sébastien Lonjon" en 14px bold + "· Founder & CEO" en italique teal
   - Email + "Book 30 min" avec underline teal
   - "PARIS · MONTRÉAL · TOKYO" en mono uppercase muted

─────────────────────────────────────────────────
ÉTAPE 4 — Créer signature "Abbeal Reply"
─────────────────────────────────────────────────

1. Clic "Create new" à nouveau
2. Nom : Abbeal Reply
3. Ouvrir /tmp/abbeal-sig-reply.html dans un onglet Chrome
4. Select-all → Cmd+C
5. Retour Gmail → éditeur "Abbeal Reply" → Cmd+V
6. Vérifier rendu :
   - "Sébastien" en 16px bold
   - "Founder & CEO Abbeal · book 30 min" en 13px muted avec Abbeal en teal

─────────────────────────────────────────────────
ÉTAPE 5 — Configurer les défauts
─────────────────────────────────────────────────

Section "Signature defaults" (sous les 2 signatures créées) :
- "For new emails use" → sélectionner : Abbeal Pro
- "On reply/forward use" → sélectionner : Abbeal Reply
- Cocher "Insert signature before quoted text in replies" (optionnel mais recommandé)

─────────────────────────────────────────────────
ÉTAPE 6 — Sauvegarder
─────────────────────────────────────────────────

1. Scroller tout en bas de la page Settings
2. Clic "Save Changes" (ou "Enregistrer")
3. Attendre refresh Gmail

─────────────────────────────────────────────────
ÉTAPE 7 — Tester
─────────────────────────────────────────────────

Test A (nouveau message) :
1. Clic "Compose"
2. Vérifier que la signature "Abbeal Pro" apparaît (logo + Calendly + 3 hubs)
3. Envoyer à sebastien@abbeal.com (toi-même)

Test B (réponse) :
1. Ouvrir la réception, sélectionner l'email test reçu
2. Clic "Reply"
3. Vérifier que la signature "Abbeal Reply" apparaît (juste "Sébastien" + 1 ligne)
4. Fermer sans envoyer

─────────────────────────────────────────────────
ÉTAPE 8 — Rapport
─────────────────────────────────────────────────

Format :
[PLATEFORME] Gmail Signatures
[STATUT] ✅ 2 signatures actives / ⚠ partiel / ❌ échec
[DÉTAILS]
- Abbeal Pro : installée, rendu OK / KO
- Abbeal Reply : installée, rendu OK / KO
- Defaults configurés : oui / non
- Test nouveau email : signature Abbeal Pro affichée / pas affichée
- Test reply : signature Abbeal Reply affichée / pas affichée
[SCREENSHOTS] (si possible : 1 par signature)
[NOTES] Problèmes rencontrés, images bloquées, rendu dégradé, etc.

─────────────────────────────────────────────────
RÈGLES DE SÉCURITÉ
─────────────────────────────────────────────────

- Ne modifier que la section Signature. Ne toucher aux autres paramètres Gmail (filters, forwarding, vacation responder, etc.).
- Si compte actif ≠ sebastien@abbeal.com à l'étape 2 : STOPPER et demander confirmation.
- Ne supprimer aucune signature existante sans confirmation de Sébastien. Les nouvelles "Abbeal Pro" et "Abbeal Reply" sont créées en plus.
- Si le logo apparaît écrasé verticalement (hauteur trop faible par rapport à la largeur) : VÉRIFIER que les attributs width="160" et height="35" sont bien préservés par Gmail. Si Gmail les strip, ré-éditer manuellement dans l'éditeur pour redimensionner.
```

---

## Résumé du combo A + D

| Signature | Usage | Contenu | Taille |
|---|---|---|---|
| **Abbeal Pro** | Nouveaux emails | Logo + nom + role gradient + email + Calendly + 3 hubs | ~75px haut |
| **Abbeal Reply** | Réponses / transferts | "Sébastien" + role + Abbeal + Calendly | ~40px haut |

## Alternative manuelle (5 min, sans Cowork)

1. Ouvre `/Users/sebastienlonjon/Documents/Claude/abbeal-site-v2/docs/email-signature.html` dans Chrome
2. Pour chaque signature (Pro et Reply) :
   - Sélectionne la preview box
   - Cmd+C
   - Gmail → ⚙ → See all settings → Signature → Create new
   - Nom : "Abbeal Pro" ou "Abbeal Reply"
   - Cmd+V
3. Signature defaults → Abbeal Pro pour new, Abbeal Reply pour reply
4. Save changes

## Variante pour Vianney

Changements à faire dans les 2 HTML :
- `Sébastien Lonjon` → `Vianney Blanquart`
- `Founder & CEO` → `Co-founder & COO`
- `sebastien@abbeal.com` → `vianney@abbeal.com`
- `calendly.com/sebastien-lonjon/...` → son propre lien Calendly
- `Sébastien` (dans reply) → `Vianney`
