// Importer les dépendances nécessaires
const express = require("express"); // Importer le module Express
const router = express.Router(); // Créer un routeur avec Express

// Importer le contrôleur pour les utilisateurs
const userCtrl = require("../controllers/user"); // Importer le contrôleur user qui contient
// les fonctions de gestion des utilisateurs

// Définir les routes pour les utilisateurs

// Route pour l'inscription d'un nouvel utilisateur
router.post("/signup", userCtrl.signup); // Lorsqu'une requête POST est envoyée à "/signup",
// elle sera gérée par la fonction signup du contrôleur user

// Route pour la connexion d'un utilisateur existant
router.post("/login", userCtrl.login); // Lorsqu'une requête POST est envoyée à "/login",
// elle sera gérée par la fonction login du contrôleur user

// Exporter le routeur
module.exports = router; // Exporter le routeur pour pouvoir l'utiliser dans d'autres parties de l'application

