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
- `_site/` : sortie de build Jekyll. **Ce dossier est versionné dans git** et peut être obsolète : il faut le régénérer (`jekyll build`) après les modifications d'includes/CSS.
- `registration.html` et `project-submission.html` : pages autonomes (formulaires d'inscription et de soumission de projet). Collecte des données : voir « Formulaires — collecte des données » ci-dessous et `docs/plan-formulaires.md`.
- `tools/make_bhd_template.py` : script générateur du template Word de projet (voir « Template Word de projet »). Dépendance de build `python-docx`, **hors** dépendances du site.

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

## Formulaires — collecte des données (décision, non implémentée)

- Les deux formulaires (`registration.html`, `project-submission.html`) sont **statiques** : `action` vide, `data-endpoint="unconfigured"`, boutons `disabled`, encart « not open yet », garde JS bloquant la soumission tant que `action` est vide.
- Décision retenue : réception via **Google Sheets + Apps Script** (Web App `doPost`), **1 projet Apps Script partagé** routant par champ caché `form_type` (`registration` / `project`) ; **2 classeurs séparés**.
- Compte : **Gmail gratuit dédié**. Anti-spam : **honeypot + reCAPTCHA v3**. RGPD : **case de consentement obligatoire + page `privacy.html` à créer**.
- Emission : notification aux organisateurs + accusé de réception bilingue EN/ES + redirection vers `thankyou.html` (à refondre, actuellement obsolète : message « volunteer », Bulma).
- Intégration pressentie : **POST classique + redirection serveur** (évite les problèmes CORS).
- Détail complet, phases, risques et critères d'acceptation : **`docs/plan-formulaires.md`**.
- Contraire : le plan est validé dans ses options, mais **aucune implémentation n'est commencée**.

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

À exécuter après modification d'includes ou de CSS pour mettre à jour `_site/` (qui est versionné).

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
| Page de soumission de projet | `project-submission.html` |
| Plan de collecte des formulaires | `docs/plan-formulaires.md` |
| Template Word de projet | `brainhack_project_template.docx`, `tools/make_bhd_template.py` |
| Build/output | `_site/` (régénéré via `jekyll build`) |

## Template Word de projet

- Livrable : `brainhack_project_template.docx` (racine du dépôt), en **anglais**, 4 pages, destiné aux participants pour rédiger leur projet.
- Source du contenu : [Project guide](https://school-brainhack.github.io/project_guide/) du BrainHack School + [project_template](https://github.com/school-brainhack/project_template).
- Sections : couverture/consignes, tableau de métadonnées (titre, auteurs, affiliation, email, date, repo GitHub, site, tags, summary), 1. Project definition (Background, Objectives, Tools, Data, Deliverables), 2. Results (Progress overview, Tools/skills learned, Results + emplacements de figures), 3. Conclusion & acknowledgements, 4. References, annexe « Self-assessment checklist » reprenant les critères d'évaluation 1-3 + bonus.
- Chaque section porte un texte-guide gris (italique) à remplacer par le participant.
- Régénération : `python tools/make_bhd_template.py` — nécessite `python-docx` (`python -m pip install python-docx`), installé localement dans Python 3.13, **pas** dans le `Gemfile`. Le script écrit par défaut à la racine du dépôt ; il accepte un chemin de sortie en argument.
- Vérification : relecture via `python-docx` et rendu PDF via `C:\Program Files\LibreOffice\program\soffice.exe --headless --convert-to pdf`. Pas de contrôle dans Microsoft Word.

## Limites, dette technique et zones sensibles

- `_site/` versionné : risque de divergence entre sources et sortie de build. Toujours rebuild après modification significative.
- Absence de tests automatisés : tout changement doit être vérifié visuellement en local.
- Sections programme/projets codées en dur : maintenance manuelle à chaque édition.
- `modal-id` doit rester unique ; une duplication casse les modals des intervenants.
- Ne jamais commettre le dossier `.playwright-mcp/` (artefacts de test Playwright) ; vérifier `git status` avant commit.

## Informations manquantes ou incertaines

- Collecte des formulaires : approche **décidée** (Google Sheets + Apps Script, cf. `docs/plan-formulaires.md`) mais **pas encore implémentée** ; restent à trancher : mode d'intégration exact, durée de conservation des données, texte du consentement.
- Stratégie de gestion de `_site/` versionné : rebuild systématique recommandée, mais pas de hook automatisé confirmé.
