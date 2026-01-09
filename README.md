## DESCRIPTION

Petite application React permettant de :
- Lister des films
- Rechercher un film
- Afficher les détails d’un film (casting, films similaires, bande-annonce YouTube)
- Ajouter / retirer des films d’une wishlist

Les données sont fournies par l'API de "The Movie Database" (TMDb).

---

## PRÉREQUIS

   - Node.js
   - Une clé API TMDb

---

## INSTALLATION ET LANCEMENT

1. # Cloner le repository

   git clone https://github.com/AntoineDI23/movies-react.git


2. # Installer les dépendances

   npm install


3. # Configurer la clé TMDb

   Créer un fichier .env.local à la racine du projet avec :

   VITE_TMDB_API_KEY=VOTRE_CLE_TMDB


4. # Lancer le serveur de dev

   npm run dev