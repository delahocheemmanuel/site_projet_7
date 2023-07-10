const express = require('express');
const app = express();
const mongoose = require('mongoose');

const mongoDBURI = 'mongodb+srv://delahochemanu:HUwo3jHeyWzAsFni@book.th4l1um.mongodb.net/?retryWrites=true&w=majority';

mongoose
  .connect(mongoDBURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connexion à MongoDB réussie !');
    // Votre code pour interagir avec la base de données MongoDB ici
  })
  .catch((error) => {
    console.log('Connexion à MongoDB échouée !', error);
  });

module.exports = app;



mongoose
    .connect(
        'mongodb+srv://:delahochemanuHUwo3jHeyWzAsFni@book-pme76.mongodb.net/test?retryWrites=true&w=majority',
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

module.exports = app;
