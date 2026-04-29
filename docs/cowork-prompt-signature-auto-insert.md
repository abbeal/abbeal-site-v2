# Prompt Cowork — Intégrer les signatures Abbeal dans les emails envoyés/répondus

> Quand Cowork rédige, envoie ou répond à des emails au nom de Sébastien (via API Gmail, browser automation, MCP ou autre), la signature Gmail configurée dans les Settings **ne s'applique pas automatiquement**. Cowork doit **ajouter manuellement** le HTML de la signature en fin de corps.
>
> Ce document fournit les instructions système + les snippets HTML à insérer.

---

## À mettre dans le System Prompt / Project Instructions de Cowork

Copie ce bloc dans les instructions permanentes de ton Project Cowork "Abbeal" :

```
RÈGLE DE SIGNATURE EMAIL (permanente) :

Quand tu rédiges, envoies, ou crées un draft d'email au nom de Sébastien Lonjon (sebastien@abbeal.com), tu DOIS inclure une signature Abbeal dans le corps HTML de l'email. La signature se place à la fin du corps, après deux sauts de ligne, avant le quote du message précédent (dans le cas d'une réponse).

CHOIX DE LA SIGNATURE :
- Nouveau message / premier contact / cold outreach / intro / proposition → utiliser "Abbeal Pro" (version complète avec logo)
- Réponse à un email existant / follow-up court / confirmation / thread interne → utiliser "Abbeal Reply" (version réduite)
- En cas de doute sur la longueur du thread, utiliser "Abbeal Reply"

RÈGLES DE FORMAT :
- Ne JAMAIS modifier le HTML de signature (couleurs, dimensions, liens, texte)
- Ne JAMAIS ajouter d'emoji, de phrase perso, de PS après la signature
- Ne JAMAIS changer les liens (mailto, calendly, abbeal.com, LinkedIn)
- Si l'email est envoyé en plain text : remplacer par la "Version plain text" fournie plus bas
- Si le client email cible ne supporte que le plain text (rare) : fallback automatique

DEUX HTML SIGNATURES DISPONIBLES : voir sections [SIG PRO] et [SIG REPLY] ci-dessous.
```

---

## SIG PRO — nouveaux emails (à coller dans la section du prompt)

```html
<!-- ABBEAL SIGNATURE PRO — NEW EMAILS -->
<table cellpadding="0" cellspacing="0" border="0" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #0C343D; line-height: 1.4; margin-top: 24px;">
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
```

---

## SIG REPLY — réponses / transferts (à coller dans la section du prompt)

```html
<!-- ABBEAL SIGNATURE REPLY — RESPONSES / FORWARDS -->
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #0C343D; line-height: 1.5; margin-top: 16px;">
  <div style="font-size: 16px; font-weight: 600; color: #0C343D;">Sébastien</div>
  <div style="font-size: 13px; color: #6B7A7E; margin-top: 2px;">
    Founder &amp; CEO <a href="https://abbeal.com" style="color: #42B296; text-decoration: none; font-weight: 500;">Abbeal</a>
    &nbsp;·&nbsp;
    <a href="https://calendly.com/sebastien-lonjon/meeting-with-sebastien" style="color: #6B7A7E; text-decoration: none; border-bottom: 1px solid #42B296;">book 30 min</a>
  </div>
</div>
```

---

## Version plain text — fallback (si impossible de formater en HTML)

**Pour SIG PRO :**

```
Sébastien Lonjon · Founder & CEO, Abbeal
sebastien@abbeal.com · Book 30 min: https://calendly.com/sebastien-lonjon/meeting-with-sebastien
abbeal.com · Paris · Montréal · Tokyo
```

**Pour SIG REPLY :**

```
Sébastien
Founder & CEO Abbeal · book 30 min: https://calendly.com/sebastien-lonjon/meeting-with-sebastien
```

---

## Exemples d'usage Cowork

### Exemple 1 — Cowork envoie un email froid (prospection)

```
Sujet : Intro — tri-geo engineering pour [entreprise]

Bonjour [Prénom],

Merci d'avoir pris le temps de regarder abbeal.com. [...]

Disponible pour un call de 30 min la semaine prochaine ?

Best,

[INSÉRER SIG PRO ICI]
```

### Exemple 2 — Cowork répond dans un thread existant

```
Sujet : Re: Our meeting

Thursday 4pm CET works for me. I'll send a Zoom link 30 min before.

[INSÉRER SIG REPLY ICI]

---
On Apr 20, 2026, at 10:32, John Smith wrote:
> Original message quoted...
```

### Exemple 3 — Draft Gmail via API (multipart/alternative)

Si Cowork crée un draft via l'API Gmail, utiliser `multipart/alternative` avec les 2 versions :

```
Content-Type: multipart/alternative; boundary="abbeal-sig"

--abbeal-sig
Content-Type: text/plain; charset=utf-8

Bonjour,

[corps plain text]

Sébastien Lonjon · Founder & CEO, Abbeal
sebastien@abbeal.com · Book 30 min: https://calendly.com/sebastien-lonjon/meeting-with-sebastien
abbeal.com · Paris · Montréal · Tokyo

--abbeal-sig
Content-Type: text/html; charset=utf-8

<html><body>
<p>Bonjour,</p>
<p>[corps HTML]</p>
[INSÉRER SIG PRO HTML]
</body></html>

--abbeal-sig--
```

---

## Checklist par email envoyé

Avant d'envoyer, Cowork doit vérifier :

```
☐ Signature présente en fin de corps
☐ Bonne version choisie (Pro pour nouveau, Reply pour réponse)
☐ Positionnée avant le quoted text (pas après)
☐ Liens mailto/calendly/abbeal.com actifs (clickable, pas en plain text)
☐ Image logo avec src="https://abbeal.com/brand/wordmark-teal.png" (URL absolue, pas cid: ou attachment)
☐ Dimensions width="160" height="35" préservées sur le logo
☐ Aucun emoji, PS perso, ou texte ajouté après la signature
```

---

## Cas particuliers

### Email envoyé en **HTML only** (recommandé)
→ Insérer le HTML tel quel de SIG PRO ou SIG REPLY selon contexte.

### Email envoyé en **plain text only**
→ Insérer la version plain text correspondante.

### Email envoyé en **multipart/alternative**
→ Les 2 versions (plain + HTML) dans les 2 parts du multipart.

### Réponse à un email reçu en **HTML**
→ Utiliser SIG REPLY (HTML).

### Draft **long form** (ex: tribune envoyée à un journaliste, pitch deck)
→ Utiliser SIG PRO à la fin.

### Message **très court** (1-2 phrases, confirmation)
→ Utiliser SIG REPLY.

### **Auto-reply** / vacation responder
→ Utiliser SIG REPLY.

---

## Détection automatique du contexte par Cowork

Pour choisir la bonne signature, Cowork peut suivre cette logique :

```
SI le message est une NOUVELLE CONVERSATION (pas de thread parent, pas de "Re:" dans le sujet) :
  → SIG PRO
SINON SI le thread contient déjà 3+ messages :
  → SIG REPLY
SINON SI le message fait moins de 200 caractères :
  → SIG REPLY
SINON :
  → SIG PRO
```

Cette logique favorise Pro pour les longues discussions professionnelles qualifiées et Reply pour les allers-retours courts.

---

## Variante pour Vianney

Si Cowork gère aussi les emails de `vianney@abbeal.com`, adapter les signatures en remplaçant :

| Champ | Sébastien | Vianney |
|---|---|---|
| Nom | Sébastien Lonjon | Vianney Blanquart |
| Role | Founder & CEO | Co-founder & COO |
| Email | sebastien@abbeal.com | vianney@abbeal.com |
| Calendly | calendly.com/sebastien-lonjon/... | (à fournir) |
| Prénom seul (Reply) | Sébastien | Vianney |

Tout le reste (logo, couleurs, "Paris · Montréal · Tokyo", style) reste identique.
