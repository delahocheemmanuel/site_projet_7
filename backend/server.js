const express = require('express');
const http = require('http');
const app = express();

require("dotenv").config({ path: './.env' });

require("./app.js"); // app.js est le fichier où toutes les routes sont définies



app.use("/", require("./routes/user")); // Middleware pour les routes des utilisateurs
app.use("/", require("./routes/book")); // Middleware pour les routes des livres

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

const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log(`Le serveur est en cours d'exécution sur le port ${process.env.PORT}.`);
});

