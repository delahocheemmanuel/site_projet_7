// Importer les dépendances nécessaires
const express = require('express'); // Importer le module Express pour créer l'application
const cors = require('cors'); // Importer le module CORS pour gérer les requêtes cross-origin
const mongoose = require('mongoose'); // Importer le module Mongoose pour interagir avec la base de données MongoDB
const path = require('path'); // Importer le module Path pour gérer les chemins de fichiers



// Importer les routes
const userRoutes = require('./routes/user'); // Importer les routes liées aux utilisateurs
const booksRoutes = require('./routes/book'); // Importer les routes liées aux livres
require('dotenv').config(); // Charger les variables d'environnement depuis le fichier .env

// Établir la connexion à la base de données MongoDB
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connexion à MongoDB réussie !')) // En cas de succès, afficher un message de confirmation dans la console
    .catch(() => console.log('Connexion à MongoDB échouée !')); // En cas d'erreur, afficher un message d'erreur dans la console

// Créer l'application Express
const app = express();

// Utiliser CORS pour gérer les requêtes cross-origin
app.use(cors());


// Middleware pour parser les corps de requêtes en JSON
app.use(express.json());

// Utiliser les routes liées aux livres
app.use('/api/books', booksRoutes);

// Utiliser les routes liées aux utilisateurs (authentification)
app.use('/api/auth', userRoutes);

// Servir les fichiers images statiques depuis le dossier "images"
app.use('/images', express.static(path.join(__dirname, 'images')));

// Exporter l'application
module.exports = app;
