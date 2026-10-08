# Absolut

Absolut est un journal personnel pour retrouver les trades, annoter le ressenti et signaler les erreurs à revoir. Il contient les trois sections **Historique**, **Erreurs à revoir** et **Importer**.

## Installer comme une appli sur ton PC

Pour une vraie fenêtre d'application avec son icône, publie Absolut avec GitHub Pages, ouvre son adresse `https://…github.io/…` dans Chrome ou Edge, puis choisis **Installer Absolut** dans le menu du navigateur. Absolut pourra ensuite s'ouvrir depuis le menu Démarrer et rester accessible hors ligne après son premier chargement.

L'icône d'installation est fournie en PNG aux tailles 192 et 512 pixels pour une meilleure compatibilité Windows.

Ouvrir directement `index.html` depuis un dossier permet de voir l'application, mais ne permet pas de l'installer comme une PWA. Pour garder une copie locale, conserve aussi le dossier décompressé.

## Mettre sur GitHub

Décompresse le ZIP, puis ajoute tous les fichiers de ce dossier au dépôt GitHub de ton choix. Active ensuite **GitHub Pages** dans les réglages du dépôt pour obtenir l'adresse HTTPS qui permet l'installation. Les données saisies dans Absolut restent dans le navigateur de cet appareil : elles ne se synchronisent pas automatiquement entre le site et une copie locale.

## Données

- Les 16 trades présents dans `EmberSync/ember_history.csv` sont préchargés au premier lancement.
- Le résultat affiché est le profit brut auquel sont ajoutés commission et swap. Le profit brut et les frais restent visibles dans la fiche.
- Les notes et modifications sont enregistrées dans le stockage local du navigateur.
- L'onglet **Importer** accepte les fichiers CSV et HTML/HTM d'historique MT5. Les tickets déjà enregistrés sont ignorés.
- Le fichier source `EmberSync/ember_history.csv` n'est pas modifié.

Pour repartir de zéro dans un navigateur, efface les données de site stockées pour cette adresse. Les trades préchargés réapparaîtront au prochain lancement si le stockage Absolut est absent.
