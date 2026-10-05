# Contexte — Brainhack Donostia website

## Objectif et domaine

Site statique public de l'événement annuel **Brainhack Donostia** (neurosciences, San Sebastián). Il présente le programme, les intervenants, les projets, l'équipe organisatrice, les sponsors et les modalités d'inscription/soumission de projet.

## Technologies et versions

- **Jekyll** 4.4.1, **Ruby** 3.3.8, **bundler** 4.0.22.
- Thème Bootstrap « Agency » personnalisé.
- Génération de site statique via Liquid + Markdown.
- Prévisualisation locale sur `http://127.0.0.1:4000/`.

> **Environnement de travail Windows/WSL** : Ruby/Jekyll ne sont **pas** installés sous Windows. Ils le sont dans **WSL Ubuntu 26.04, en root**.  
> Accès root qui fonctionne : `wsl -d Ubuntu -u root -e <cmd>`.

## Architecture et responsabilité des dossiers

- `index.html` : page mono-page assemblée par une suite de `{% include %}` avec `layout: default`.
- `_layouts/default.html` : ossature HTML (head, header, sections, footer, modals, js).
- `_includes/` : un fichier par section de la page d'accueil.
- `_posts/` : un fichier Markdown par intervenant/keynote (convention `yyyy-mm-dd-project-n.markdown`).
- `_config.yml` : données du site (team, social, adresse, titre, description, réglages Jekyll).
- `_data/template.yml` : couleurs du thème (hex sans `#`).
- `_includes/css/` : CSS du thème (`agency.css` + `light-theme.css` pour les personnalisations).
- `_plugins/hex_to_rgb.rb` : filtre Liquid `hex_to_rgb` utilisé par le thème.
- `img/` : assets images, avec des conventions de taille (voir section « Conventions »).
- `_site/` : sortie de build Jekyll, **entièrement retirée du suivi git** (commit `be1bfa5a`, `_site/*` dans `.gitignore`). Ne jamais l'éditer ni le committer ; le régénérer via `bundle exec jekyll build`.
- `registration.html`, `pre-registration.html` et `project-submission.html` : pages autonomes (formulaires d'inscription, de pré-inscription et de soumission de projet). Collecte des données : voir « Formulaires — collecte des données » ci-dessous et `docs/plan-formulaires.md`.
- `tools/make_bhd_template.py` : script générateur du template Word de projet (voir « Template Word de projet »). Dépendance de build `python-docx`, **hors** dépendances du site.
- `assets/` : fichiers statiques publiés tels quels par Jekyll (téléchargeables). Contient le template Word de projet.

## Points d'entrée et flux de données

- Pour modifier une section de la page d'accueil, éditer le fichier correspondant dans `_includes/`, pas `index.html` ni `_layouts/default.html` (sauf réordonnancement/ajout/suppression de sections entières).
- Fichiers `_includes` clés :
  - `header.html` : navigation + hero, CTA « Registration » et « Project submission ».
  - `services.html` : section « About us ».
  - `program.html` : tableau du programme (HTML codé en dur).
  - `projects.html` : présentation des projets de l'année (HTML codé en dur).
  - `portfolio_grid.html` : grille des intervenants, itère sur `site.posts`.
  - `modals.html` : modals Bootstrap des intervenants, itère aussi sur `site.posts`.
  - `team.html` : équipe organisatrice, alimentée par `_config.yml` (`people`).
  - `clients.html` : sponsors.
- Chaque post/intervenant dans `_posts/` doit avoir un `modal-id` unique et cohérent entre `portfolio_grid.html` et `modals.html`.
- `_config.yml` :
  - `url: https://brainhack-donostia.github.io`
  - `baseurl:` est **vide** → `{{ site.baseurl }}/x.html` produit `/x.html` (chemins absolus depuis la racine).
  - `exclude:` retire `CLAUDE.md`, `apps-script`, `docs` et `tools` du build. **Indispensable** : le builder GitHub Pages (`build_type: legacy`) rend les `.md` en Liquid et échouait sur les exemples `{% ... %}` de `docs/` (erreur « Invalid syntax for include tag »). Ne pas retirer ces exclusions.

## Formulaires — collecte des données (backend déployé, recette inscription réussie en production)

- `js/form-config.js` contient l'URL `/exec` Apps Script et la site key publique reCAPTCHA. `js/forms.js` charge reCAPTCHA v3 et active chaque formulaire seulement si sa clé `*Open` vaut `true`. État courant : seul le formulaire de **pré-inscription** est ouvert (`preregistrationOpen: true`) ; `registrationOpen` et `projectOpen` restent à `false`. Tant que `registrationOpen` est faux, `js/forms.js` **redirige `registration.html` vers `pre-registration.html`** (garde-fou auto-désactivable, voir la checklist d'ouverture ci-dessous). L'ouverture se fait en passant le flag concerné à `true` dans `js/form-config.js` puis en déployant.
- Le routage par onglet est piloté par les Script Properties : `registration`/`project` utilisent `REGISTRATION_SHEET_ID`/`PROJECT_SHEET_ID` ; `preregistration` utilise `PRE_REGISTRATION_SHEET_ID` (même classeur que `registration`) + `PRE_REGISTRATION_SHEET_NAME` (`Pre-registrations`). Unicité d'email activée **par formulaire** (`uniqueEmail: true`) : un email déjà présent pour un formulaire donné est rejeté (`DUPLICATE_EMAIL`).
- Décision retenue : réception via **Google Sheets + Apps Script** (Web App `doPost`), **1 projet Apps Script partagé** routant par champ caché `form_type` (`registration` / `project`) ; **2 classeurs séparés**.
- Compte : **Gmail gratuit dédié**. Anti-spam : **honeypot + reCAPTCHA v3 + âge minimal du formulaire**. Les valeurs à choix sont vérifiées côté serveur, un `submission_id` empêche les doublons et `retryPendingEmails` permet la reprise séparée des e-mails échoués. RGPD : **case de consentement obligatoire + `privacy.html` bilingue** ; conservation proposée : 12 mois après l'événement, à faire valider avant ouverture.
- Emission : notification aux organisateurs + accusé de réception bilingue EN/ES + redirection vers `thankyou.html?type=registration|project`.
- Intégration adoptée : **POST classique + redirection serveur** (évite les problèmes CORS). Source et procédure de déploiement : `apps-script/`.
- Détail complet, phases, risques et critères d'acceptation : **`docs/plan-formulaires.md`**.
- Le projet Apps Script, les propriétés privées, les deux classeurs, leurs en-têtes et le déclencheur horaire sont configurés.
- **Recette inscription réussie sur le domaine de production** (`brainhack-donostia.github.io`) : une ligne créée dans Registrations, notification organisateurs `sent`, accusé de réception `sent`, redirection vers `thankyou.html?type=registration`. Le test n'a activé l'inscription que dans le navigateur (interception de `js/form-config.js`), le site public restant fermé.
- **Recette projet réussie sur le domaine de production** : soumission réelle acceptée par le backend (réponse `successPage_('project')` → redirection `thankyou.html?type=project`), avec jeton reCAPTCHA v3 valide émis sur le domaine de production. `submission_id` de test : `96d3d06d-c58d-44d3-b8fb-993c8fb1e6b1` (données fictives « Test Project Submitter »). Chemins de sécurité vérifiés : jeton absent → page d'erreur, honeypot rempli → rejet silencieux, `submission_id` invalide → page d'erreur. Le POST a été envoyé via PowerShell (le contexte navigateur Playwright MCP plante sur la navigation vers `/exec`) ; la ligne dans Projects et la réception des e-mails restent à confirmer dans le compte Google.
- **Ne pas tester les formulaires via `localhost`** : reCAPTCHA v3 rejette le domaine local (`RECAPTCHA_SERVICE`). Utiliser le domaine public.
- **Restant avant ouverture durable** : retirer `localhost` de la configuration reCAPTCHA et de `ALLOWED_HOSTNAMES` ; valider juridiquement `privacy.html` ; confirmer la ligne dans Projects et la réception des e-mails de la recette projet ; supprimer les données de test ; puis activer le flag `*Open` concerné.
- **Gate de téléchargement** (`project-submission.html`) : le bouton `Download: Project Template / Descargar Template del Proyecto` (`<a data-template-download>` → `assets/brainhack_project_template.docx`) doit être cliqué pour que Submit (`#project-form button[type=submit]`) s'active. `js/forms.js` suit `templateDownloaded` dans `refreshSubmitState()` (cumulé avec `projectOpen` et le chargement reCAPTCHA). L'aide `#template-hint` (`.form-hint`) explique le bouton grisé : elle n'est **pas** dans le HTML par défaut, n'apparaît que si le formulaire est ouvert et est masquée dès le téléchargement.
- Les deux cases obligatoires « I read this! / ¡Leído! » (consigne du template, puis rappel « Submitting a project… ») vivent **hors** du `<form>`, dans l'encadré `.notice` : elles sont rattachées au formulaire par l'attribut `form="project-form"`, sans quoi `required` et l'envoi les ignoreraient.

### Checklist d'ouverture de l'inscription

À exécuter dans l'ordre le jour où l'inscription officielle ouvre (état actuel : pré-inscription ouverte, inscription fermée) :

1. `js/form-config.js` : passer `registrationOpen: true` et `preregistrationOpen: false`. Le garde-fou de `js/forms.js` qui redirige `registration.html` vers `pre-registration.html` **s'auto-désactive** dès que `registrationOpen` vaut `true` (rien à retirer).
2. `project-submission.html` : dans le `<nav class="form-nav">`, repasser le lien sur `registration.html` avec le libellé « Register / Inscribirse ».
3. `_includes/header.html` : repasser l'entrée de nav **et** le CTA du hero de `pre-registration.html` / « Pre-Registration » vers `registration.html` / « Registration ».
4. Apps Script (éditeur) : exécuter `notifyPreRegistrants()` — envoie l'email d'ouverture aux pré-inscrits (dédupliqué, marque `opening_notified_at`).
5. Retirer `localhost` de la console reCAPTCHA **et** de la Script Property `ALLOWED_HOSTNAMES`.
6. Vérifier `privacy.html` (validation juridique) et la durée de conservation des données.
7. Supprimer les données de test des onglets `Registrations` / `Pre-registrations` / `Projects`.
8. `commit` + `push` sur `master` (le déploiement GitHub Pages se déclenche au push).

## Commandes d'installation, exécution, test et build

### Installation des gems

```bash
bundle install          # après tout changement du Gemfile
bundle update           # si les gems sont désynchronisées
```

> Ne pas pousser les changements de `Gemfile.lock` sur `master` sans intention explicite (voir README).

### Prévisualisation locale (depuis WSL root)

Script WSL existant : `/root/serve_jekyll.sh`

```bash
# Contenu du script (dans WSL) :
# cd <chemin-du-dépôt>
# bundle exec jekyll serve --host 0.0.0.0 --port 4000 --no-watch >> /root/jekyll.log 2>&1
```

Lancement depuis Windows PowerShell :

```powershell
Start-Process -FilePath "wsl" -ArgumentList @('-d','Ubuntu','-u','root','-e','bash','/root/serve_jekyll.sh') -WindowStyle Hidden
```

URL de test : `http://127.0.0.1:4000/`.

Relance du serveur :

```powershell
wsl -d Ubuntu -u root -e bash -lc "pkill -f 'jekyll serve'"
# puis relancer le script Start-Process ci-dessus
```

Log : `/root/jekyll.log`.

### Build explicite

```bash
bundle exec jekyll build
```

À exécuter après modification d'includes ou de CSS pour régénérer `_site/` localement. `_site/` n'est **plus** versionné.

### Vérification

- **Aucune suite de tests ni linter** : la validation se fait par `jekyll serve` + inspection navigateur.
- Attention : un serveur statique Python (port 8000) ne rend **pas** Liquid ; il ne remplace pas Jekyll pour la prévisualisation.

## Conventions et contraintes métier

- `master` = branche de production déployée via GitHub Pages.
- GitHub Pages est configuré en `build_type: legacy` avec source `master` : **uniquement un push sur `master` déclenche un déploiement**.
- Modèle de branches : sous-branches par édition d'année (ex. `BHD2025`, `2026-update-for-launch-branch`), puis PR vers la branche d'année, puis merge vers `master`.
- Toujours `git pull` avant de commencer un travail local.
- `program.html` et `projects.html` sont réécrits en bloc chaque année (non data-driven).
- `registration_main.html` existe mais son inclusion/lien de nav sont commentés ; l'inscription passe par `registration.html`.
- Le lien « Project submission » dans `header.html` pointe vers `{{ site.baseurl }}/project-submission.html` (page distincte, plus d'ancre `page-scroll`).
- L'entrée de nav « Projects » (`#projects`) est volontairement désactivée/commentée (gardée pour usage futur).
- `</style>` orphelin préexistant dans `_includes/header.html` : inoffensif, ne pas corriger par effet de bord.

## Conventions d'images

Tailles attendues (README) :

- `img/team/*` : 620×820
- `img/portfolio/*` : thumbnails 400×289, images modales 600×450
- `img/about/*` : 200×200
- `img/logos/*` :
  - header background : 1900×1250
  - contact/register : 1469×725
  - sponsors : 295×86
- Logos de titre (header) : viser **~500 Ko**. Les exports sources (`ressources/`) peuvent arriver **non compressés** (~6 Mo) ; les recompresser **sans perte** avant intégration (Pillow : `Image.open(src).convert('RGBA').save(dst, 'PNG', optimize=True, compress_level=9)`), puis vérifier l'égalité des pixels (`ImageChops.difference(...).getbbox() is None`).
- Header responsive (`_includes/header.html`) : `logo_title.png` (≤479px), `donostia4title.png` (≤899px), `donostia3title.png` (≤1299px), `donostia2title.png` (au-delà). `logo_title.png` sert aussi de fond de hero aux pages autonomes (`registration.html`, `pre-registration.html`, `project-submission.html`, `privacy.html`, `thankyou.html`).

## Personnalisation du thème

- `light-theme.css` contient les overrides du thème clair.
- `agency.css` contient le thème de base (ex. `section h2.section-heading` 40px, `section h3.section-subheading` 24px).
- Les ajustements de taille ciblent de préférence `section#services` dans `light-theme.css` pour ne pas impacter les autres sections :
  - h1 : 37px
  - h3.section-heading : 24px
  - h3.section-subheading : 22px
  - mobile : sous-titre à 17px
- Les paragraphes de `services.html` utilisent une taille inline (`style="font-size: 18px"`) ; ajuster directement dans le HTML si besoin.
- Tailles actuelles du bandeau de nav : liens de scroll et pastilles « Registration » / « Project submission » à **15px**.
- Espacement de la nav : la pastille « Project submission » porte `margin-left: 7px` **et** `margin-right: 7px` → écart symétrique de **7px** de part et d'autre, pour que l'élément suivant (« About BHD ») ne la touche pas (règle `.navbar-default .nav li.project-submission-nav-item > a` dans `light-theme.css`).
- Le scrollspy (`js/agency.js` → `$('body').scrollspy({ target: '.navbar-fixed-top' })`) ajoute `.active` au `li` courant, ce qui transforme l'élément en « bulle » (`.navbar-default .navbar-nav > .active > a` : dégradé + `border-radius: 999px`). Tester les espacements de nav dans les deux états (normal et actif).

## Fichiers clés par type de tâche

| Tâche | Fichier(s) |
|-------|------------|
| Modifier la navigation ou le hero | `_includes/header.html` |
| Modifier « About us » | `_includes/services.html` |
| Modifier le programme | `_includes/program.html` |
| Modifier les projets | `_includes/projects.html` |
| Ajouter/modifier un intervenant | `_posts/yyyy-mm-dd-project-n.markdown`, vérifier `modal-id` |
| Modifier l'équipe | `_config.yml` → `people` |
| Modifier les sponsors | `_includes/clients.html` + `img/logos/` |
| Modifier les couleurs du thème | `_data/template.yml`, `_includes/css/light-theme.css` |
| Page d'inscription | `registration.html` |
| Page de pré-inscription | `pre-registration.html` |
| Page de soumission de projet | `project-submission.html` |
| Plan de collecte des formulaires | `docs/plan-formulaires.md` |
| Template Word de projet | `assets/brainhack_project_template.docx`, `tools/make_bhd_template.py` |
| Build/output | `_site/` (régénéré via `jekyll build`) |

## Template Word de projet

- Livrable : `assets/brainhack_project_template.docx`, en **anglais**, 4 pages, destiné aux participants pour rédiger leur projet. Copié tel quel dans `_site/assets/` par Jekyll (téléchargeable à l'URL `/assets/brainhack_project_template.docx`).
- Source du contenu : [Project guide](https://school-brainhack.github.io/project_guide/) du BrainHack School + [project_template](https://github.com/school-brainhack/project_template).
- Sections : couverture/consignes, tableau de métadonnées (titre, auteurs, affiliation, email, date, repo GitHub, site, tags, summary), 1. Project definition (Background, Objectives, Tools, Data, Deliverables), 2. Results (Progress overview, Tools/skills learned, Results + emplacements de figures), 3. Conclusion & acknowledgements, 4. References, annexe « Self-assessment checklist » reprenant les critères d'évaluation 1-3 + bonus.
- Chaque section porte un texte-guide gris (italique) à remplacer par le participant.
- Régénération : `python tools/make_bhd_template.py` — nécessite `python-docx` (`python -m pip install python-docx`), installé localement dans Python 3.13, **pas** dans le `Gemfile`. Le script écrit par défaut dans `assets/` ; il accepte un chemin de sortie en argument.
- Vérification : relecture via `python-docx` et rendu PDF via `C:\Program Files\LibreOffice\program\soffice.exe --headless --convert-to pdf`. Pas de contrôle dans Microsoft Word.
- `.gitignore` ignore `__pycache__/` et `*.pyc`, car `tools/` contient du Python.

## Limites, dette technique et zones sensibles

- `_site/` entièrement retiré du suivi git : plus de risque de committer un build local, mais le contenu sur disque peut être obsolète. Régénérer via `bundle exec jekyll build` avant toute inspection.
- **Piège `jekyll serve`** : le build lancé au démarrage du serveur réécrit l'URL des fichiers `_site/` en `http://0.0.0.0:4000/` (`_site/index.html` → `<link rel="canonical">` ; `_site/feed.xml` → `<link>` et `<guid>`). Sans conséquence sur le dépôt désormais (`_site/` ignoré) ; régénérer avec `jekyll build` pour restaurer les URLs de `_config.yml` si besoin.
- **Build GitHub Pages** : `build_type: legacy` rend les `.md` du dépôt en Liquid. Tout nouveau dossier documentaire doit être ajouté à `exclude:` de `_config.yml`, sinon le déploiement échoue (cf. erreur `docs/` corrigée par `5cecc0a9`).
- Absence de tests automatisés : tout changement doit être vérifié visuellement en local.
- Sections programme/projets codées en dur : maintenance manuelle à chaque édition.
- `modal-id` doit rester unique ; une duplication casse les modals des intervenants.
- Ne jamais commettre le dossier `.playwright-mcp/` (artefacts de test Playwright) ; vérifier `git status` avant commit.

## Informations manquantes ou incertaines

- Collecte des formulaires : backend Google déployé ; recettes **inscription** et **projet** réussies en production (soumission projet acceptée, `submission_id` `96d3d06d-c58d-44d3-b8fb-993c8fb1e6b1`). Restent à faire avant ouverture durable : confirmation de la ligne dans Projects et de la réception des e-mails, retrait de `localhost` (reCAPTCHA + `ALLOWED_HOSTNAMES`), validation juridique de `privacy.html` et de la conservation de 12 mois, suppression des données de test.
- `_site/` : plus suivi ni versionné ; build manuel documenté, pas de hook automatisé.
