# Ember — Journal de trading

Application web complète (HTML/CSS/JS, aucune installation ni build requis) : dashboard, journal de trades, statistiques avancées, calendrier de performance, objectifs, coach IA, multi-comptes, multi-stratégies, captures d'écran, import/connexion MT5.

## Installer Ember comme une vraie application (téléphone + PC), gratuitement

Ember est une PWA (Progressive Web App) : une fois hébergée en ligne, elle s'installe comme une vraie app, avec icône, fonctionne hors-ligne, et n'a plus besoin de VS Code ni de Live Server ouvert.

### 1. Héberger les fichiers gratuitement (GitHub Pages)
1. Crée un compte gratuit sur [github.com](https://github.com) si tu n'en as pas.
2. Clique sur **"+"** en haut à droite → **"New repository"**. Nom au choix (ex : `ember`). Coche "Public". Crée-le.
3. Dans le repo créé, clique **"Add file" → "Upload files"**, puis glisse-dépose **tout le contenu** du dossier `ember` (le contenu, pas le dossier zip lui-même — `index.html`, `css/`, `js/`, `icons/`, `manifest.json`, `sw.js`, `README.md`). Clique **"Commit changes"**.
4. Va dans l'onglet **"Settings"** du repo → section **"Pages"** (menu de gauche) → sous "Build and deployment", **Source : "Deploy from a branch"**, Branch : **`main`** / dossier **`/ (root)`** → **Save**.
5. Attends 1 à 2 minutes, rafraîchis la page : une adresse apparaît, du style `https://tonpseudo.github.io/ember/`. C'est ton app, accessible depuis n'importe quel appareil connecté à internet.

### 2. Installer sur ton téléphone
- Ouvre cette adresse dans **Chrome** (Android) ou **Safari** (iPhone).
- Android/Chrome : menu **⋮** → **"Installer l'application"** (ou "Ajouter à l'écran d'accueil").
- iPhone/Safari : bouton **Partager** → **"Sur l'écran d'accueil"**.
- Une icône Ember apparaît sur ton téléphone, s'ouvre en plein écran comme une vraie app.

### 3. Installer sur ton PC (sans VS Code)
- Ouvre la même adresse dans **Chrome** ou **Edge**.
- Une icône d'installation apparaît dans la barre d'adresse (à droite), ou menu **⋮ → "Installer Ember..."**.
- L'app s'ouvre alors dans sa propre fenêtre, sans onglet de navigateur, sans VS Code ni Live Server à lancer.

Tes données restent stockées **dans le navigateur de chaque appareil séparément** (ce n'est toujours pas un compte cloud partagé) — pense à exporter des sauvegardes JSON régulièrement si tu veux transférer tes données d'un appareil à l'autre.

## Ouvrir le projet dans VS Code (pour le modifier)

1. Dézippe le dossier `ember` et ouvre-le dans VS Code (`Fichier > Ouvrir le dossier...`).
2. Installe l'extension **Live Server** (auteur : Ritwick Dey) depuis l'onglet Extensions.
3. Clic droit sur `index.html` → **Open with Live Server**. L'application s'ouvre dans ton navigateur, généralement sur `http://127.0.0.1:5500`.

> Tu peux aussi simplement double-cliquer sur `index.html` pour l'ouvrir directement dans ton navigateur (pas de serveur nécessaire, aucun module ES6 n'est utilisé). Live Server est juste plus confortable pour le développement (rechargement automatique).

## Structure du projet

```
journal-trading/
├── index.html          → structure de l'application (sidebar, pages, modales)
├── css/style.css        → design system complet
├── js/storage.js         → persistance (localStorage)
├── js/utils.js            → calculs, statistiques, parsing CSV, redimensionnement d'images
├── js/charts.js            → graphiques (Chart.js)
├── js/ai.js                  → appels au Coach IA (API Anthropic)
├── js/app.js                   → contrôleur principal, navigation, CRUD
└── README.md
```

## Stockage des données

Toutes les données (comptes, trades, stratégies, objectifs, analyses IA, captures d'écran) sont stockées **localement dans le navigateur** via `localStorage`. Rien n'est envoyé sur un serveur externe, à l'exception des appels volontaires au Coach IA (voir plus bas).

Conséquences importantes :
- Les données sont propres à ce navigateur et à cette machine. Si tu changes de navigateur, d'ordinateur, ou si tu vides le cache, elles disparaissent.
- **Fais des sauvegardes régulières** via *Réglages → Exporter (JSON)*. Le fichier peut être réimporté via *Réglages → Importer (JSON)*.
- Les captures d'écran sont stockées en base64 dans localStorage, qui a une limite d'environ 5 à 10 Mo selon les navigateurs. Si tu ajoutes beaucoup de captures haute résolution, tu peux atteindre cette limite — les images sont automatiquement redimensionnées et compressées à l'ajout pour limiter le risque.

## Coach IA (API Anthropic)

Le Coach IA appelle directement l'API Anthropic depuis ton navigateur.

1. Crée une clé API sur [console.anthropic.com](https://console.anthropic.com).
2. Colle-la dans *Réglages → Coach IA → Clé API Anthropic*. Elle est stockée uniquement dans le localStorage de ton navigateur.
3. Utilise les boutons dans l'onglet *Coach IA* pour lancer une analyse complète, un résumé de semaine ou de mois.

**Ne partage jamais** ce dossier ou une sauvegarde exportée si ta clé API a été enregistrée — vérifie toujours le champ avant de transmettre le projet à quelqu'un.

Si les appels échouent avec une erreur réseau/CORS selon la configuration de ton compte Anthropic, la solution la plus fiable est de faire transiter l'appel par un petit serveur relais (quelques lignes de Node/Express) plutôt que d'appeler l'API directement depuis le navigateur — ce projet ne l'inclut pas pour rester 100% statique et installable sans backend.

## Connecter un compte (synchronisation en un clic)

En plus de l'import CSV ponctuel, tu peux **connecter** ton fichier d'export une seule fois :

1. Bouton *Connecter un compte* en haut de l'application.
2. *Choisir le fichier* → sélectionne le CSV exporté depuis MT5 (voir section suivante pour l'export).
3. Les fois suivantes, un clic sur *Synchroniser maintenant* relit ce même fichier et n'ajoute que les trades qui ne sont pas encore dans ton journal (déduplication automatique par ticket, ou par actif+heure+P&L si le CSV n'a pas de colonne ticket). Toutes les statistiques et moyennes se recalculent instantanément.

**Important** : cette fonctionnalité utilise l'API native du navigateur pour accéder à un fichier local en toute sécurité. Elle nécessite :
- Chrome ou Edge (pas encore supporté par Firefox/Safari à ce jour).
- Que l'application soit servie via un serveur local (Live Server, `http://localhost`) — **pas** en double-cliquant directement sur `index.html` (le protocole `file://` bloque cette API). Si tu vois "Non disponible" dans la fenêtre de connexion, c'est le signe qu'il faut relancer via Live Server.

Ce n'est pas une synchronisation *en direct* avec ton broker (aucune app locale ne peut ouvrir une connexion permanente vers MT5 sans un pont côté broker) — mais tu n'as plus qu'à cliquer sur *Synchroniser* après une session de trading au lieu de re-sélectionner un fichier à chaque fois.

## Import automatique depuis MetaTrader 5

Une vraie synchronisation *en direct* avec MT5 nécessite un pont côté broker (Expert Advisor ou script qui pousse les trades vers un serveur) — ce n'est pas possible depuis une simple page web locale. Ce projet fournit à la place un **import CSV** qui couvre l'essentiel du besoin :

1. Dans MT5 : *Terminal → onglet Histoire → clic droit → Rapport*. Choisis soit un export **CSV**, soit **"Open XML (Excel)"**/enregistrement en **HTML** — Ember lit directement les deux formats, pas besoin d'Excel ni de LibreOffice pour convertir quoi que ce soit.
2. Dans Ember : bouton *Importer rapport (MT5)* en haut à droite (ou *Connecter un compte* pour une synchronisation réutilisable, voir plus haut), puis sélectionne le fichier.
3. Les colonnes courantes (date, symbole, type, volume, prix, S/L, T/P, profit) sont détectées automatiquement. Les trades importés atterrissent dans le compte actif ; tu peux ensuite les enrichir (stratégie, tags, notes, émotions, captures) en les éditant.

## Fonctionnalités couvertes

- **Dashboard** : profit total / jour / semaine / mois, win rate, nombre de trades, RR moyen, profit factor, drawdown, meilleur/pire trade, durée moyenne en position, alertes (série de pertes, sur-trading, risque excessif, plan non respecté), courbe de capital, P&L par trade, répartitions gains/pertes, achats/ventes, par actif, par session.
- **Journal** : ajout/édition/duplication/suppression de trades, recherche instantanée, filtres (actif, stratégie, session, résultat), tri, champs complets (prix, SL/TP, commission, swap, RR auto-calculé, durée auto-calculée, tags, notes, émotion, captures avant/après).
- **Statistiques** : win/loss/BE rate, expectancy, profit factor, RR moyen/max/min, plus gros gain/perte, meilleures/pires séries, drawdown max et actuel, performance mensuelle/annuelle/par jour de semaine/par heure/par actif/par stratégie.
- **Calendrier** : vue mensuelle colorée par performance quotidienne, clic pour voir le détail des trades du jour.
- **Objectifs** : nombre de trades, profit, win rate minimum, RR moyen, respect du plan, drawdown max, jours tradés — avec barre de progression par période (semaine/mois/année).
- **Coach IA** : analyse complète, résumé hebdomadaire, résumé mensuel.
- **Multi-comptes** et **multi-stratégies**, chacun avec ses propres statistiques.
- **Tous les marchés** : Forex, indices, or, argent, matières premières, actions, ETF, cryptomonnaies (champ libre + classe d'actif).

## Limites connues

- Pas de synchronisation temps réel avec un broker (voir section MT5 ci-dessus).
- Les données ne sont pas partagées entre appareils sans passer par export/import manuel — il n'y a pas de compte utilisateur ni de backend.
- Le calcul de session (Asie/Londres/New York) se base sur l'heure UTC du navigateur au moment de la saisie ; tu peux toujours forcer une session manuellement sur chaque trade.
