# Leo-Paul — Blog sport (Astro + Decap CMS)

Blog sport statique : une rubrique par sport, articles en Markdown, administration sur `/admin` avec **identifiant + mot de passe**.

## Démarrer en local

```bash
npm install
npm run dev          # http://localhost:4321
```

Tester l'admin **sans connexion** (écrit directement dans les fichiers locaux) :

```bash
npm run cms          # dans un 2e terminal
# puis ouvrir http://localhost:4321/admin/index.html et cliquer « Se connecter »
```

Autres commandes : `npm run build` (sortie dans `dist/`), `npm run preview`, `npm run check` (vérif TypeScript — nécessite Node ≥ 22.12), `npm run hash-password -- <identifiant>`.

> Node : Astro 5 est utilisé car il fonctionne avec Node 22.11. Pour passer à Astro 6/7, mettre à jour Node (≥ 22.23 pour Astro 7).

## Où modifier quoi

| Quoi | Où |
|---|---|
| Nom du site, e-mail, réseaux, menu | `src/consts.ts` |
| URL du site (SEO, sitemap, RSS) | `astro.config.mjs` (`site`) + `public/robots.txt` + `public/admin/config.yml` |
| Couleurs, polices, effets | `src/styles/global.css` (variables `:root`) |
| Sports (nom, emoji, couleur, accroche) | `src/content/sports/*.md` (ou `/admin` → Sports) |
| Articles | `src/content/blog/*.md` (ou `/admin` → Articles) |
| Textes Accueil / À propos / Contact | `src/content/pages/*.md` (ou `/admin` → Pages du site) |
| Mentions légales | `src/pages/mentions-legales.astro` (⚠️ à compléter) |
| Config de l'admin | `public/admin/config.yml` |
| Connexion à l'admin | `netlify/functions/cms-auth.mjs` |

## Connexion à l'admin (identifiant + mot de passe)

L'admin n'utilise pas de compte GitHub pour les rédacteurs. Une fonction Netlify (`/api/cms-auth`) vérifie l'identifiant et le mot de passe, puis donne à l'éditeur un jeton GitHub limité au dépôt. Les commits sont faits au nom du propriétaire de ce jeton.

**Mise en place (une seule fois) :**

1. **Créer le jeton GitHub** : GitHub → Settings → Developer settings → *Personal access tokens* → **Fine-grained tokens** → *Generate new token*
   - *Repository access* : **Only select repositories** → `Kaloomc/Leo-Paul`
   - *Permissions* : **Contents → Read and write** (Metadata → Read est ajouté automatiquement)
   - Durée : la plus longue possible ; noter la date d'expiration pour le renouveler.
2. **Créer le compte de l'ami** : en local, lancer
   ```bash
   npm run hash-password -- leopaul
   ```
   puis taper le mot de passe (12 caractères min). Copier la ligne `leopaul:…:…` affichée.
   Plusieurs comptes : séparer les lignes par une virgule.
3. **Netlify** → *Site configuration* → *Environment variables* :
   - `GITHUB_TOKEN` = le jeton de l'étape 1 (cocher « secret »)
   - `CMS_USERS` = la ligne de l'étape 2
4. Redéployer (*Deploys* → *Trigger deploy*). L'admin est sur `https://leo-paul-site.netlify.app/admin/`.

**Sécurité :** mots de passe hachés (scrypt), jamais stockés en clair ; 8 essais ratés max par IP et par 15 min ; le jeton reste dans les variables Netlify, jamais dans le dépôt. Pour retirer un accès : supprimer sa ligne dans `CMS_USERS` **et** régénérer le jeton GitHub. Mot de passe oublié : refaire l'étape 2 et remplacer la ligne.

## Mise en ligne (Netlify)

1. Netlify → *Add new site* → *Import from Git* → `Kaloomc/Leo-Paul` (build et dossier lus depuis `netlify.toml`).
2. Configurer la connexion à l'admin (section ci-dessus).
3. Le formulaire de contact passe par **Netlify Forms** : activer la détection des formulaires (*Forms*) et la notification e-mail.
4. Activer la 2FA sur GitHub et Netlify.

## Guide de l'ami (10 min)

1. Aller sur `https://leo-paul-site.netlify.app/admin/` et se connecter avec son **identifiant et mot de passe**.
2. **Articles** → *Nouveau* : titre, **sport**, date, description, image de couverture (+ sa description), contenu.
3. Cocher **À la une** pour mettre l'article en grand sur l'accueil.
4. Laisser **Brouillon** coché tant que ce n'est pas prêt ; le décocher pour mettre en ligne.
5. Cliquer sur **Publier** puis attendre ~1 min que le site se mette à jour.
6. **Sports** : ajouter un sport (nom, emoji, couleur, accroche). Il apparaît automatiquement dans le menu et sur l'accueil.
7. **Pages du site** : modifier les textes d'Accueil, À propos et Contact. Dans les titres, un passage entre `*étoiles*` s'affiche en contour.
