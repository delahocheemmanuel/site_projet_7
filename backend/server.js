const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const app = express();

require('dotenv').config({ path: './.env' });

// Connexion à la base de données MongoDB avec Mongoose
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connexion à la base de données réussie.');
  })
  .catch((error) => {
    console.error('Erreur lors de la connexion à la base de données:', error);
  });

require('./app.js'); // app.js est le fichier où toutes les routes sont définies

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

app.use('/users', require('./routes/user.js')); // Middleware pour les routes des utilisateurs
app.use('/books', require('./routes/book.js')); // Middleware pour les routes des livres

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log(`Le serveur est en cours d'exécution sur le port ${process.env.PORT}.`);
});
