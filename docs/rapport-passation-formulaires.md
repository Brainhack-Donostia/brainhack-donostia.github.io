# Rapport de passation — formulaires BrainHack Donostia 2026

**Date de passation :** 30 septembre 2026

**Branche :** `2026-update-for-launch-branch`

**Commit de base formulaires :** `7a23c99e` — `Implement secure form submissions`

**HEAD à la passation :** `1114678b` — `Ignore Python build artifacts`
**État :** backend Google déployé, formulaires publics fermés, recette production en attente

## 0. Mise à jour post-passation (30 septembre 2026)

Évolutions intégrées depuis la rédaction initiale (HEAD `1114678b`) :

| Commit | Objet |
|---|---|
| `abdc0bcf` | Configuration des formulaires pour les tests de production |
| `be1bfa5a` | Arrêt du suivi de `_site/` (`git rm -r --cached _site/`), désormais ignoré |
| `835678c8` | Fusion « 2026 launch updates » dans `master`, puis push |
| `5cecc0a9` | Exclusion de `apps-script`, `docs` et `tools` du build Jekyll (corrige l'échec GitHub Pages « Invalid syntax for include tag ») |

Recette réelle d'**inscription** réussie sur `brainhack-donostia.github.io` : une ligne
créée dans *Registrations*, notification organisateurs `sent`, accusé de réception
`sent`, redirection vers `thankyou.html?type=registration`. L'activation n'a eu lieu
que dans le navigateur de test (interception de `js/form-config.js`) ; le site public
est resté fermé. `master` est déployé et synchronisé avec `origin`.

**Non encore vérifié** : écriture réelle dans *Projects*, réception effective des
e-mails en boîte (statuts Sheets `sent` mais réception à confirmer), exécution horaire
réelle de `retryPendingEmails`, retrait de `localhost` de la configuration reCAPTCHA et
d'`ALLOWED_HOSTNAMES`.

## 1. Résumé exécutif

Les formulaires d'inscription et de soumission de projet disposent désormais
d'une chaîne de traitement complète prévue pour un site statique GitHub Pages :

- frontend HTML bilingue EN/ES ;
- consentement et notice de confidentialité ;
- honeypot, contrôle temporel et reCAPTCHA v3 ;
- backend Google Apps Script partagé ;
- stockage dans deux classeurs Google Sheets séparés ;
- notification des organisateurs et accusé de réception ;
- protection contre les doublons et reprise des e-mails échoués ;
- pages de confirmation adaptées aux deux formulaires.

L'infrastructure Google (deux classeurs, Apps Script, propriétés privées,
reCAPTCHA et déclencheur de reprise) est configurée. Les formulaires restent
fermés publiquement ; la recette activera l'inscription uniquement dans le
navigateur de test sur le domaine de production.

## 2. Livrables actuels

| Fichier | Responsabilité |
|---|---|
| `registration.html` | Formulaire d'inscription, champs de sécurité, consentement |
| `project-submission.html` | Formulaire de projet, sécurité, consentement et téléchargement préalable du template |
| `js/form-config.js` | URL publique Apps Script, clé publique reCAPTCHA et ouverture/fermeture |
| `js/forms.js` | Initialisation, validation navigateur, jeton reCAPTCHA et POST |
| `apps-script/Code.gs` | Validation serveur, stockage, e-mails, redirection et reprise |
| `apps-script/appsscript.json` | Manifest et permissions Apps Script |
| `apps-script/Code.test.js` | Tests Node des règles serveur et de l'idempotence |
| `apps-script/README.md` | Procédure détaillée de déploiement Google |
| `privacy.html` | Notice de confidentialité bilingue |
| `thankyou.html` | Confirmation selon `?type=registration` ou `?type=project` |
| `docs/plan-formulaires.md` | Architecture, phases, risques et critères d'acceptation |
| `assets/brainhack_project_template.docx` | Template Word proposé aux porteurs de projet |
| `tools/make_bhd_template.py` | Génération reproductible du template Word |

Historique des commits constituant l'état transmis :

| Commit | Objet |
|---|---|
| `7a23c99e` | Backend Apps Script, formulaires sécurisés, pages RGPD/confirmation |
| `fb73e43e` | Publication du template Word dans `assets/` |
| `1842b342` | Indication d'attente avant téléchargement du template |
| `1114678b` | Exclusion des artefacts Python |

## 3. Fonctionnement technique

### 3.1 Parcours d'une soumission

1. `js/forms.js` initialise un horodatage et un `submission_id` unique.
2. Le bouton reste désactivé si le formulaire est fermé ou mal configuré. Pour
   un projet, il reste également désactivé tant que le lien du template Word
   n'a pas été **cliqué** (le navigateur ne peut pas vérifier que le
   téléchargement a réellement abouti).
3. À l'envoi, le navigateur vérifie les champs obligatoires.
4. reCAPTCHA v3 produit un jeton associé à l'action `registration` ou `project`.
5. Le navigateur effectue un POST classique vers l'URL Apps Script `/exec`.
6. Apps Script contrôle le honeypot, l'âge du formulaire, le jeton, le score,
   l'hôte, les champs obligatoires et les valeurs autorisées.
7. La ligne est ajoutée dans le premier onglet du classeur correspondant.
8. Deux e-mails sont tentés : organisateurs et personne ayant soumis.
9. L'utilisateur est redirigé vers `thankyou.html`.

### 3.2 Mesures de sécurité et fiabilité

- Le secret reCAPTCHA reste dans les **Script Properties** et ne doit jamais
  être ajouté au dépôt.
- `ALLOWED_HOSTNAMES` est obligatoire côté serveur.
- Les valeurs de listes et cases sont contrôlées par liste blanche.
- Les chaînes commençant par `=`, `+`, `-` ou `@` sont neutralisées avant
  écriture afin d'éviter l'injection de formules dans Sheets/CSV.
- Le `submission_id` empêche l'ajout répété de la même ligne.
- Les états des deux e-mails sont enregistrés séparément ;
  `retryPendingEmails` ne retente que les messages non envoyés.
- Les erreurs techniques détaillées restent dans les journaux Apps Script et
  ne sont pas exposées publiquement.

## 4. État vérifié

Les vérifications suivantes ont été exécutées avec succès :

- `bundle exec jekyll build` sous WSL ;
- contrôle syntaxique de `js/form-config.js` et `js/forms.js` (`node --check`) ;
  `Code.gs` est lu puis exécuté par `apps-script/Code.test.js` via
  `vm.runInContext`, ce qui vaut contrôle syntaxique — `node --check` refuse
  l'extension `.gs` (`ERR_UNKNOWN_FILE_EXTENSION`) ;
- `node apps-script/Code.test.js` ;
- parcours Playwright avec endpoint Apps Script et reCAPTCHA simulés ;
- présence du `submission_id`, du consentement et du jeton dans le POST ;
- cohérence vérifiée après suppression volontaire de la question sur les jours
  de présence et de la validation `validateAttendance()` ;
- formulaire fermé correctement lorsque la configuration est vide ;
- blocage du formulaire projet avant téléchargement du template, affichage du
  texte d'aide, puis activation après clic avec reCAPTCHA simulé ;
- téléchargement effectif de `assets/brainhack_project_template.docx` ;
- vérification mobile sans débordement horizontal ;
- revue de code spécialisée, puis correction des constats techniques importants.

Le téléchargement préalable du template et son texte d'aide ont été ajoutés
dans des commits postérieurs au backend. Leur comportement local a été vérifié,
mais ils doivent également être inclus dans la recette finale en production.

### Non vérifié avant mise en production

- écriture réussie dans Google Sheets depuis le domaine de production ;
- acceptation d'un jeton reCAPTCHA émis sur le domaine de production ;
- réception réelle des deux e-mails après une soumission acceptée ;
- exécution horaire réelle de `retryPendingEmails` ;
- quotas et comportement sous charge.

## 5. Procédure de mise en service

La procédure détaillée reste dans `apps-script/README.md`. L'ordre ci-dessous
doit être respecté.

### Étape A — Comptes et ressources

- [ ] Créer ou identifier le Gmail dédié à l'événement.
- [ ] Activer la double authentification et documenter les modalités de reprise
      du compte sans mettre de mot de passe dans le dépôt.
- [ ] Créer un classeur vide **Registrations**.
- [ ] Créer un classeur vide **Projects**.
- [ ] Conserver l'onglet de destination comme **premier onglet** de chaque
      classeur : le code utilise `getSheets()[0]`.
- [ ] Créer une clé reCAPTCHA v3 autorisant
      `brainhack-donostia.github.io`.

### Étape B — Apps Script

- [ ] Créer un projet Apps Script autonome avec le Gmail dédié.
- [ ] Copier `apps-script/Code.gs` et `apps-script/appsscript.json`.
- [ ] Configurer les Script Properties suivantes :

| Propriété | Valeur attendue |
|---|---|
| `REGISTRATION_SHEET_ID` | ID du classeur Registrations |
| `PROJECT_SHEET_ID` | ID du classeur Projects |
| `ORGANIZER_EMAIL` | Adresse recevant les notifications |
| `RECAPTCHA_SECRET` | Clé secrète reCAPTCHA v3 |
| `RECAPTCHA_MIN_SCORE` | `0.5` au démarrage |
| `ALLOWED_HOSTNAMES` | `brainhack-donostia.github.io` en production |
| `SITE_URL` | `https://brainhack-donostia.github.io` |

- [ ] Exécuter manuellement `setupSheets()` et autoriser les permissions.
- [ ] Vérifier les lignes d'en-tête figées dans les deux classeurs.
- [ ] Créer un déclencheur temporel horaire pour `retryPendingEmails`.
- [ ] Déployer en **Web app**, exécutée par le compte dédié, accès **Anyone**.
- [ ] Copier l'URL terminant par `/exec` ; ne pas utiliser `/dev`.

### Étape C — Configuration du site

Dans `js/form-config.js` :

1. renseigner `endpoint` avec l'URL `/exec` ;
2. renseigner `recaptchaSiteKey` avec la clé publique ;
3. conserver `registrationOpen: false` et `projectOpen: false` pendant les tests ;
4. déployer la configuration fermée ;
5. tester chaque formulaire avec des données fictives ;
6. n'activer chaque indicateur `*Open` qu'après validation complète.

### Étape D — Recette réelle obligatoire

- [ ] Une inscription crée exactement une ligne dans Registrations.
- [ ] Un projet crée exactement une ligne dans Projects.
- [ ] Le formulaire projet reste désactivé avant clic sur le lien du template,
      puis devient disponible quand reCAPTCHA est prêt et les confirmations
      obligatoires sont cochées.
- [ ] Le fichier `/assets/brainhack_project_template.docx` est téléchargeable.
- [ ] Les deux e-mails sont reçus, correctement bilingues et expédiés depuis le
      compte attendu.
- [ ] Les statuts d'e-mail du Sheet valent `sent`.
- [ ] Le renvoi du même `submission_id` ne crée pas de doublon.
- [ ] Jeton absent/invalide, honeypot rempli, consentement absent et envoi trop
      rapide ne créent aucune ligne.
- [ ] Les pages de confirmation distinguent inscription et projet.
- [ ] Supprimer les données fictives après recette.

## 6. Validation juridique avant ouverture

`privacy.html` contient une proposition opérationnelle, mais elle doit être
validée par la personne ou le service compétent avant activation :

- identité juridique exacte du responsable du traitement ;
- rôle du BCBL et coordonnées institutionnelles ;
- utilisation de Google Sheets, Apps Script, Gmail et reCAPTCHA ;
- éventuels transferts internationaux ;
- base légale fondée sur le consentement ;
- durée de conservation proposée : **12 mois après l'événement** ;
- processus concret pour l'accès, la rectification, le retrait du consentement
  et la suppression.

Ne pas ouvrir les formulaires tant que cette validation n'est pas obtenue.

## 7. Exploitation et supervision

### Contrôles réguliers

- Vérifier les exécutions échouées dans la console Apps Script.
- Filtrer les deux colonnes de statut d'e-mail pour repérer les valeurs autres
  que `sent`.
- Vérifier que le déclencheur `retryPendingEmails` s'exécute chaque heure.
- Surveiller les scores reCAPTCHA avant de modifier `RECAPTCHA_MIN_SCORE`.
- Restreindre le partage des classeurs aux organisateurs autorisés.
- Supprimer les données conformément à la durée approuvée.

### Quota critique

Un Gmail gratuit permet généralement environ **100 destinataires Apps Script
par jour**. Deux e-mails étant envoyés par soumission, la capacité pratique est
d'environ **50 soumissions quotidiennes**. En cas de pic :

1. surveiller le quota et les statuts d'e-mail ;
2. ne pas relancer manuellement tous les messages sans vérifier leur statut ;
3. envisager Google Workspace ou une autre solution d'envoi avant l'ouverture
   si plus de 50 soumissions/jour sont plausibles.

## 8. Fermeture, incident et retour arrière

### Fermeture immédiate

Dans `js/form-config.js`, placer :

```text
registrationOpen: false
projectOpen: false
```

Puis déployer le site. Les boutons redeviennent inactifs et reCAPTCHA n'est plus
chargé. Cette action n'efface aucune donnée déjà reçue.

### Incident backend

1. Fermer les deux formulaires côté site.
2. Consulter **Apps Script → Executions**.
3. Vérifier les Script Properties et les quotas.
4. Corriger `Code.gs`, créer une nouvelle version et mettre à jour le
   déploiement Web App.
5. Refaire la recette avec les formulaires encore fermés publiquement.

## 9. Maintenance du schéma

Toute modification d'un champ HTML doit être répercutée dans
`FORM_DEFINITIONS` (`apps-script/Code.gs`) :

- `fields` pour la colonne ;
- `requiredFields` si obligatoire ;
- `multipleFields` pour les cases à choix multiples ;
- `allowedValues` pour les listes et options fermées ;
- tests dans `apps-script/Code.test.js`.

Un changement de `Code.gs` exige une **nouvelle version du déploiement Apps
Script**, puis une recette réelle.

## 10. État Git à la passation

L'état fonctionnel décrit est réparti sur les quatre commits listés en section
2. La branche est synchronisée avec `origin` (`HEAD` = `1114678b`). L'arbre
contient :

- des modifications de `docs/contexte.md` à préserver ;
- ce rapport, non commité ;
- `_site/` **retiré du suivi git** : `git rm -r --cached _site/` a retiré les
  51 fichiers de l'index (staged, non commité à la rédaction). Les fichiers
  restent sur disque et sont désormais couverts par `.gitignore` (`_site/*`).
  Ce retrait doit être commité pour prendre effet.

### Piège `_site/` — raison de ce retrait

Le build lancé au **démarrage de `jekyll serve`** réécrit l'URL des fichiers
`_site/` suivis en `http://0.0.0.0:4000/` (`_site/index.html` →
`<link rel="canonical">` ; `_site/feed.xml` → `<link>` et `<guid>` de chaque
post). Ces modifications ne doivent **jamais** être commitées : elles
publieraient une URL locale. Avant tout commit, restaurer
(`git checkout -- _site/`) ou régénérer avec `jekyll build`, qui conserve
l'`url:` de `_config.yml`.

Ne jamais ajouter `.playwright-mcp/` (artefacts de test Playwright, transitoires)
au dépôt.

## 11. Responsabilités à attribuer

| Responsabilité | Propriétaire à désigner |
|---|---|
| Compte Gmail dédié et récupération | À attribuer |
| Clés reCAPTCHA | À attribuer |
| Administration Apps Script | À attribuer |
| Accès aux deux Google Sheets | À attribuer |
| Validation RGPD | À attribuer |
| Surveillance des quotas et erreurs | À attribuer |
| Suppression des données à échéance | À attribuer |

## 12. Références

- Déploiement technique : `apps-script/README.md`
- Plan et critères d'acceptation : `docs/plan-formulaires.md`
- Contexte général du site : `docs/contexte.md`
- Commits livrés : `7a23c99e`, `fb73e43e`, `1842b342`, `1114678b`
- Contact public actuel : `info.bhg-donostia@bcbl.eu`
