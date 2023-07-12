const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const user = require('./models/user');
const path = require('path');

const mongoDBURI = 'mongodb+srv://delahochemanu:HUwo3jHeyWzAsFni@book.th4l1um.mongodb.net/?retryWrites=true&w=majority';

mongoose
  .connect(mongoDBURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connexion à MongoDB réussie !');
    
  })
  .catch((error) => {
    console.log('Connexion à MongoDB échouée !', error);
  });

  app.use(express.json())
  
  app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader(
          'Access-Control-Allow-Headers',
          'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
      )
      res.setHeader(
          'Access-Control-Allow-Methods',
          'GET, POST, PUT, DELETE, PATCH, OPTIONS'
      )
      next()
  })  

  app.use(bodyParser.json());
  app.use('/images', express.static(path.join(__dirname, 'images')));
  app.use('/api/books',bookRoutes);
  app.use('/api/auth', userRoutes);

module.exports = app;



