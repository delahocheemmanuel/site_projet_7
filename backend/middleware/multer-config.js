// Importer le module 'multer' pour gérer les fichiers envoyés depuis le frontend
const multer = require('multer');

// Définir les types MIME acceptés et leurs extensions associées
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Définir le stockage des fichiers avec multer
const storage = multer.diskStorage({
  // Définir le dossier de destination où les fichiers seront enregistrés
  destination: (req, file, callback) => {
    callback(null, 'images'); // Le dossier 'images' sera utilisé comme destination
  },
  // Définir le nom du fichier enregistré
  filename: (req, file, callback) => {
    // Remplacer les espaces dans le nom de fichier original par des underscores pour éviter les problèmes d'encodage
    const name = file.originalname.split(' ').join('_');
    // Récupérer l'extension du fichier à partir de son type MIME
    const extension = MIME_TYPES[file.mimetype];
    // Concaténer le nom du fichier avec un timestamp pour le rendre unique, suivi de son extension
    callback(null, name + Date.now() + '.' + extension);
  }
});

// Exporter la configuration de multer en utilisant le stockage défini ci-dessus, permettant de gérer l'upload d'un seul fichier
module.exports = multer({ storage: storage }).single('image');
