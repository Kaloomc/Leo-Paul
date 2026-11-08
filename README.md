# Site Leo-Paul — Astro + Decap CMS

Site vitrine + blog statique. Contenu en Markdown, administration sur `/admin` (Decap CMS, backend GitHub).

## Démarrer en local

```bash
npm install
npm run dev          # http://localhost:4321
```

Tester l'admin **sans GitHub** (écrit directement dans les fichiers locaux) :

```bash
npm run cms          # dans un 2e terminal
# puis ouvrir http://localhost:4321/admin/index.html
```

Autres commandes : `npm run build` (sortie dans `dist/`), `npm run preview`, `npm run check` (vérif TypeScript — nécessite Node ≥ 22.12).

> Node : Astro 5 est utilisé car il fonctionne avec Node 22.11. Pour passer à Astro 6/7, mettre à jour Node (≥ 22.23 pour Astro 7).

## Où modifier quoi

| Quoi | Où |
|---|---|
| Nom du site, e-mail, réseaux, menu | `src/consts.ts` |
| URL du site (SEO, sitemap, RSS) | `astro.config.mjs` (`site`) + `public/robots.txt` |
| Couleurs, polices | `src/styles/global.css` (variables `:root`) |
| Articles | `src/content/blog/*.md` (ou `/admin`) |
| Textes Accueil / À propos / Services / Contact | `src/content/pages/*.md` (ou `/admin`) |
| Mentions légales | `src/pages/mentions-legales.astro` (⚠️ à compléter) |
| Config de l'admin | `public/admin/config.yml` |

## Mise en ligne (Netlify)

1. Créer un repo GitHub et pousser le projet.
2. Dans `public/admin/config.yml`, remplacer `repo: TON-USER/TON-REPO` et les URL `monsite.netlify.app`.
3. Netlify → *Add new site* → *Import from Git* → choisir le repo (build et dossier lus depuis `netlify.toml`).
4. GitHub → Settings → Developer settings → **OAuth Apps** → New :
   - Homepage URL : l'URL Netlify
   - Callback URL : `https://api.netlify.com/auth/done`
5. Netlify → *Site configuration* → *Access & security* → *OAuth* → installer le provider **GitHub** (Client ID + Client Secret).
6. Ajouter l'ami comme **collaborateur** du repo (accès en écriture). Activer la 2FA sur GitHub et Netlify.
7. Le formulaire de contact passe par **Netlify Forms** : activer la détection des formulaires dans Netlify (*Forms*) et configurer la notification e-mail.

> Les procédures d'authentification évoluent : vérifier la doc Decap CMS / Netlify au moment de la mise en place.

## Guide de l'ami (10 min)

1. Aller sur `https://<site>/admin/` et se connecter avec GitHub.
2. **Articles** → *Nouveau* : titre, date, description, image de couverture (+ sa description), contenu.
3. Laisser **Brouillon** coché tant que ce n'est pas prêt ; le décocher pour mettre en ligne.
4. Cliquer sur **Publier** puis attendre ~1 min que le site se mette à jour.
5. Pour modifier / supprimer : ouvrir l'article dans la liste.
6. **Pages du site** permet de modifier les textes d'Accueil, À propos, Services et Contact.
