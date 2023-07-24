// Importer les dépendances nécessaires
const express = require("express");
const router = express.Router();

// Importer les middlewares et le contrôleur pour les livres
const auth = require("../middleware/auth"); // Middleware pour l'authentification
const multer = require("../middleware/multer-config"); // Middleware pour la gestion des fichiers uploadés
const resizeImg = require("../middleware/sharp"); // Middleware pour le redimensionnement des images
const bookCtrl = require("../controllers/book"); // Contrôleur pour les actions liées aux livres


// Définir les routes pour les livres

// Route pour récupérer tous les livres
router.get("/", bookCtrl.getAllBooks);

// Route pour récupérer les trois livres ayant les meilleures notes
router.get("/bestrating", bookCtrl.getBestRating);

// Route pour créer un nouveau livre (avec authentification et gestion des fichiers uploadés)
router.post("/", auth, multer, resizeImg, bookCtrl.postBook);

// Route pour récupérer un livre par son ID
router.get("/:id", bookCtrl.getOneBook);

// Route pour mettre à jour un livre par son ID (avec authentification et gestion des fichiers uploadés)
router.put("/:id", auth, multer, resizeImg, bookCtrl.putBook);

// Route pour supprimer un livre par son ID (avec authentification)
router.delete("/:id", auth, bookCtrl.deleteBook);

// Route pour ajouter une note à un livre par son ID (avec authentification)
router.post("/:id/rating", auth, bookCtrl.postRating);

// Exporter le routeur
module.exports = router;

