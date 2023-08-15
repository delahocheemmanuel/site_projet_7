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




// const multer = require('multer');
// const { GridFsStorage } = require('multer-gridfs-storage');
// const sharp = require('sharp');

// // Créer une instance du stockage GridFS pour multer
// const storage = new GridFsStorage({
//   url: 'MONGODB_URI', // URL de connexion à la base de données MongoDB
//   file: async (req, file) => {
//     // Lire le fichier image en utilisant Sharp et le redimensionner en format WebP
//     const image = sharp(file.buffer);
//     const resizedImageBuffer = await image.resize(206, 260, { fit: 'contain' }).toFormat('webp').toBuffer();

//     // Retourner les informations du fichier à stocker dans MongoDB
//     return {
//       bucketName: 'images', // Nom de la collection où les images seront stockées
//       filename: `${Date.now()}-${file.originalname}`, // Nom du fichier dans la base de données (ici, j'utilise un timestamp pour le rendre unique)
//       contentType: 'image/webp', // Type de contenu pour l'image redimensionnée en format WebP
//       metadata: { originalName: file.originalname }, // Métadonnées facultatives, vous pouvez les personnaliser selon vos besoins
//       buffer: resizedImageBuffer, // Buffer de l'image redimensionnée à stocker dans MongoDB
//     };
//   },
// });

// // Utiliser multer avec le stockage GridFS pour gérer l'upload d'un seul fichier 'image'
// const upload = multer({ storage: storage }).single('image');

// module.exports = upload;
