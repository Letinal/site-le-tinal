# Le Tinal — Guide du site + app d'adhésion

Site de l'association **Le Tinal** (Ouveillan). Une seule base de code fournit :
- le **site public** (accueil, programme de la saison, page « Adhérer ») ;
- l'**adhésion en ligne** avec paiement **SumUp** ;
- l'**espace adhérents** (`/admin`) — le *tableau des inscrits*, **installable comme une app sur le téléphone de l'association**.

Stack : **Astro + Cloudflare (Pages/Workers) + base D1 + PWA**. Déploiement par `git push`.

---

## 1. Première installation (une seule fois)

Prérequis : Node.js (déjà installé), un compte **Cloudflare** (gratuit) et le dépôt Git relié à Cloudflare.

1. **Installer les dépendances** : ouvrez le dossier, double-cliquez `dev.bat` une première fois (il lance `npm install` puis un aperçu local sur http://localhost:4321).
2. **Créer la base de données** : double-cliquez `db-init.bat`.
   - Il affiche un `database_id`. **Copiez-le** dans `wrangler.toml` (ligne `database_id = "..."`).
   - Relancez `db-init.bat` : le schéma est appliqué en local **et** en production.
3. **Régler les variables secrètes** dans le dashboard Cloudflare (projet → *Settings → Variables and Secrets*) :
   - `ADMIN_TOKEN` — le code d'accès à l'espace `/admin` (mettez une longue phrase secrète).
   - `SUMUP_MERCHANT_CODE` et `SUMUP_API_KEY` — pour le paiement en ligne (voir §4). *Facultatif au démarrage.*
4. **Déployer** : double-cliquez `deploy.bat`. Cloudflare reconstruit le site. L'adresse est du type `https://site-le-tinal.pages.dev`.

---

## 2. Modifier le contenu

- **Textes / infos de l'asso** : `src/data/site.json` (nom, e-mail, adresse, montant de la cotisation…).
- **Programme de la saison** : `src/data/programme.json`. Chaque événement :

  ```json
  { "date": "2026-05-10", "heure": "18:30", "titre": "Ouverture de saison",
    "type": "Concert", "lieu": "Place du village", "description": "…", "gratuit": true }
  ```

  Ajoutez / modifiez / supprimez des blocs, enregistrez, puis `deploy.bat`. Les événements passés disparaissent automatiquement de l'accueil.
- **Logo** : remplacez `public/favicon.svg` et les fichiers `public/icons/*.png` par vos visuels (mêmes noms).

> ⚠️ Le contenu livré (programme) est un **exemple**. Remplacez-le par le vrai programme.

---

## 3. L'espace adhérents (le « tableau des inscrits »)

Adresse : `https://<votre-site>/admin`. Entrez le code `ADMIN_TOKEN`.

Vous pouvez : voir tous les adhérents, filtrer par saison / statut, chercher, **marquer « payé »** (pointage des règlements sur place), **ajouter** un adhérent, et **exporter en CSV** (ouvrable dans Excel).

### Installer l'app sur le téléphone de l'association
1. Ouvrez `https://<votre-site>/admin` dans **Chrome (Android)** ou **Safari (iPhone)**.
2. Menu du navigateur → **« Ajouter à l'écran d'accueil »** / **« Installer l'application »**.
3. Une icône « Le Tinal » apparaît : elle ouvre directement le tableau des inscrits, comme une vraie application. La coquille fonctionne même hors-ligne ; les données se chargent dès qu'il y a du réseau.

C'est **le même code que le site** : rien à recompiler, rien à publier sur un store.

---

## 4. Paiement de l'adhésion (SumUp)

Le site s'adapte à ce qui est configuré, dans cet ordre :

1. **API SumUp** (`SUMUP_API_KEY` + `SUMUP_MERCHANT_CODE`) → l'adhérent paie sur une page SumUp, et le statut passe **automatiquement à « payé »** via le webhook.
   - Dans le dashboard SumUp, activez les *Online Payments* et créez une **clé API** (Développeurs).
   - Réglez l'URL de webhook sur `https://<votre-site>/api/sumup-webhook`.
2. **Lien de paiement fixe** (`SUMUP_PAYMENT_LINK`) → créez un lien « Adhésion 10 € » dans SumUp, collez-le dans les variables Cloudflare. L'adhérent est redirigé vers ce lien ; vous **pointez « payé »** à la main dans `/admin`.
3. **Rien de configuré** → l'adhésion est enregistrée en **« à régler »** ; encaissez sur place avec le terminal SumUp et pointez « payé » dans `/admin`.

Dans tous les cas, **l'inscription et le tableau des inscrits fonctionnent dès le premier jour**.

---

## 5. Brancher le vrai nom de domaine (.fr)

1. Achetez le domaine (voir la reco fournie).
2. Cloudflare → projet → *Custom domains* → ajoutez `letinal-ouveillan.fr` (Cloudflare guide la configuration DNS).
3. Dans `astro.config.mjs`, remplacez `site: 'https://letinal.pages.dev'` par le vrai domaine, puis `deploy.bat`.

---

## 6. RGPD

Les données d'adhésion servent uniquement à la gestion des adhésions et à l'information des adhérents. Page `/mentions-legales` déjà en place. Pour une demande de suppression, retirez la ligne dans `/admin` (statut « annulé ») ou via l'export/ré-import.

---

## Aide-mémoire fichiers

| Quoi | Où |
|---|---|
| Infos asso, cotisation | `src/data/site.json` |
| Programme | `src/data/programme.json` |
| Pages du site | `src/pages/*.astro` |
| API (adhésion, admin) | `src/pages/api/*.ts` |
| Base de données (tableau) | table `adherents` (schéma `schema.sql`) |
| Déployer | `deploy.bat` |
| Aperçu local | `dev.bat` |
| Créer/màj la base | `db-init.bat` |
