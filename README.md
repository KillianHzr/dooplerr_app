# Dooplerr

Bienvenue sur Dooplerr, votre nouvelle destination pour découvrir et écouter vos podcasts préférés. Dooplerr est une application de podcast construite avec passion pour offrir une expérience utilisateur immersive et intuitive. Avec son interface front-end élégante en Vue.js 3 et une architecture back-end robuste en Express, Dooplerr est conçu pour transformer votre manière d'écouter les podcasts.

## Fonctionnalités

- **Découverte de Podcasts** : Explorez une vaste collection de podcasts sur divers sujets et trouvez vos nouveaux favoris.
- **Lecteur Intégré** : Profitez d'une expérience d'écoute fluide avec notre lecteur intégré, conçu pour votre commodité.
- **Gestion des Abonnements** : Abonnez-vous à vos podcasts préférés et ne manquez jamais un épisode.
- **Listes de Lecture Personnalisées** : Créez des listes de lecture personnalisées pour organiser vos épisodes préférés.
- **Recommandations Intelligentes** : Découvrez des podcasts basés sur vos écoutes et préférences grâce à notre système de recommandations intelligent.

## Technologies

- **Front-End** : Vue.js 3
- **Back-End** : Express
- **Base de Données** : MySQL
- **Autres Dépendances** : ...

## Installation

Pour installer et exécuter Dooplerr localement, suivez ces étapes simples :

1. **Cloner le Répertoire** :
   ```
   git clone https://github.com/KillianHzr/dooplerr_app
   cd dooplerr
   ```

2. **Installer les Dépendances du Front-End** :
   ```
   cd front_dooplerr
   npm install
   ```

3. **Installer les Dépendances du Back-End** :
   ```
   cd ../back_dooplerr
   npm install
   ```

4. **Configurer l'Environnement** :
   - Créez un fichier `.env` dans le dossier back-end et configurez vos variables d'environnement DB_USER, DB_PASSWORD, DB_NAME, DB_HOST

5. **Lancer l'Application** :
   - Front-End :
     ```
     npm run dev
     ```
   - Back-End :
     ```
     npm start
     ```

5. **Build l'Application** :
   - Front-End :
     ```
     npm run build
     ```
