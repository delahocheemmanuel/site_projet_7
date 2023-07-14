const express = require('express');
const mongoose = require('mongoose');
mongoose.set("strictQuery", true);
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');
const path = require('path');

// Connexion à MongoDB
mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connexion à MongoDB réussie !');
  })
  .catch((error) => {
    console.log('Connexion à MongoDB échouée !', error);
  });

const app = express();

// Middleware pour parser les requêtes JSON
app.use(express.json());



// Middleware pour servir les fichiers statiques dans le répertoire 'images'
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes pour les livres
app.use('/api/books', bookRoutes);

// Routes pour les utilisateurs
app.use('/api/auth', userRoutes);

module.exports = app;
