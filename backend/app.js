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

// Middleware pour gérer les en-têtes CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

// Middleware pour servir les fichiers statiques dans le répertoire 'images'
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes pour les livres
app.use('/api/books', bookRoutes);

// Routes pour les utilisateurs
app.use('/api/auth', userRoutes);

module.exports = app;
