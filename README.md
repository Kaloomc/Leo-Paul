# SportFlash — Actu sport (Astro + Decap CMS)

Site d'actualité sportive : une rubrique par sport, articles en Markdown, administration sur `/admin` avec **identifiant + mot de passe**.

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
| Nom du site, e-mail, liens Instagram/TikTok, menu | `src/consts.ts` |
| URL du site (SEO, sitemap, RSS) | `astro.config.mjs` (`site`) + `public/robots.txt` + `public/admin/config.yml` |
| Couleurs, polices, effets | `src/styles/global.css` (variables `:root`) |
| Sports (nom, emoji, couleur, accroche) | `src/content/sports/*.md` (ou `/admin` → Sports) |
| Articles | `src/content/blog/*.md` (ou `/admin` → Articles) |
| Textes Accueil / À propos / Contact | `src/content/pages/*.md` (ou `/admin` → Pages du site) |
| Mentions légales | `src/pages/mentions-legales.astro` (⚠️ à compléter) |
| Config de l'admin | `public/admin/config.yml` |
| Connexion à l'admin | `netlify/functions/cms-auth.mjs` |

## Accès à l'admin : créer et donner les accès

L'admin (`/admin/`) se connecte avec un **identifiant + mot de passe**. Personne n'a besoin de compte GitHub, sauf toi (le propriétaire du dépôt) pour la mise en place.

Fonctionnement : quand quelqu'un se connecte, une fonction Netlify vérifie l'identifiant et le mot de passe, puis donne à l'admin un jeton GitHub qui ne peut modifier **que** le dépôt `Kaloomc/Leo-Paul`.

### Étape 1 — Créer le jeton GitHub (une seule fois)

1. Sur GitHub, en haut à droite : ta photo → **Settings**.
2. Tout en bas du menu de gauche : **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
3. Remplir :
   - **Token name** : `SportFlash admin`
   - **Expiration** : la plus longue proposée (noter la date quelque part, il faudra le renouveler)
   - **Repository access** : **Only select repositories** → choisir `Kaloomc/Leo-Paul`
   - **Permissions** → **Repository permissions** → **Contents** : **Read and write**
4. **Generate token**, puis **copier** le jeton (`github_pat_…`). Il ne sera plus jamais affiché.

### Étape 2 — Créer un compte (identifiant + mot de passe)

Dans le dossier du projet, sur ton ordinateur :

```bash
npm run hash-password -- leopaul
```

- `leopaul` = l'identifiant (lettres minuscules, sans espace).
- Taper le mot de passe deux fois (12 caractères minimum ; rien ne s'affiche pendant la saisie, c'est normal).
- La commande affiche une ligne du type `leopaul:3f9a…:8c1d…` → la **copier**. Ce n'est pas le mot de passe : c'est une empreinte, le mot de passe n'est stocké nulle part.

Pour **plusieurs personnes**, refaire la commande pour chacune (`npm run hash-password -- marie`…) et garder toutes les lignes.

### Étape 3 — Enregistrer dans Netlify

1. [app.netlify.com](https://app.netlify.com) → le site → **Site configuration** → **Environment variables** → **Add a variable**.
2. Ajouter :
   | Key | Value |
   |---|---|
   | `GITHUB_TOKEN` | le jeton de l'étape 1 (cocher **Contains secret values**) |
   | `CMS_USERS` | la ou les lignes de l'étape 2, **séparées par une virgule** si plusieurs : `leopaul:…:…,marie:…:…` |
3. **Deploys** → **Trigger deploy** → **Deploy site** (les variables ne sont prises en compte qu'après un nouveau déploiement).

### Étape 4 — Donner l'accès

Envoyer à la personne :
- l'adresse : `https://leo-paul-site.netlify.app/admin/`
- son identifiant (ex. `leopaul`) et son mot de passe — de préférence par un canal privé, pas en public.

Elle se connecte, et peut écrire, modifier et publier des articles.

### Gérer les accès ensuite

| Besoin | Que faire |
|---|---|
| Ajouter quelqu'un | Étape 2 pour la nouvelle personne, ajouter sa ligne à `CMS_USERS` (après une virgule), redéployer. |
| Changer un mot de passe / mot de passe oublié | Étape 2 avec le même identifiant, remplacer sa ligne dans `CMS_USERS`, redéployer. |
| Retirer un accès | Supprimer sa ligne de `CMS_USERS`, **régénérer le jeton GitHub** (étape 1) et remplacer `GITHUB_TOKEN`, redéployer. |
| Le jeton expire | Refaire l'étape 1, remplacer `GITHUB_TOKEN`, redéployer. |

**Sécurité :** mots de passe hachés (scrypt), jamais en clair ; 8 essais ratés max par adresse IP et par 15 min ; le jeton reste dans Netlify, jamais dans le code. Les articles publiés apparaissent sur GitHub comme des commits du propriétaire du jeton.

## Mise en ligne (Netlify)

1. Netlify → *Add new site* → *Import from Git* → `Kaloomc/Leo-Paul` (build et dossier lus depuis `netlify.toml`).
2. Créer les accès à l'admin (section ci-dessus).
3. Le formulaire de contact passe par **Netlify Forms** : activer la détection des formulaires (*Forms*) et la notification e-mail.
4. Activer la 2FA sur GitHub et Netlify.

## Guide du rédacteur

1. Aller sur `https://leo-paul-site.netlify.app/admin/` et se connecter avec son **identifiant et mot de passe**.
2. **Articles** → **Nouveau** : titre, **sport**, date, résumé, image (+ sa description), texte.
3. Cocher **À la une** pour afficher l'article en grand sur l'accueil.
4. Laisser **Brouillon** coché tant que ce n'est pas prêt ; le décocher pour mettre en ligne.
5. **Publier**, puis attendre environ 1 minute que le site se mette à jour.
6. **Sports** : ajouter ou modifier une rubrique (nom, emoji, couleur, accroche).
7. **Pages du site** : textes de l'Accueil, À propos et Contact. Dans un titre, un passage entre `*étoiles*` s'affiche en menthe.
8. Les articles d'exemple (marqués « Article d'exemple ») sont à supprimer une fois les vrais articles publiés.
