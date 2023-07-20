// Importer les modules nécessaires
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Fonction de redimensionnement des images en .webp avec une qualité de 90
const resizeImg = (req, res, next) => {
  if (!req.file) {
    // Si aucun fichier n'a été téléchargé, passer à la prochaine middleware
    next();
  } else {
    // Définir le nom du fichier sans l'extension
    const filename = req.file.filename.replace(/\.[^.]*$/, "");

    // Utiliser le module 'sharp' pour redimensionner l'image en conservant les proportions
    sharp(req.file.path)
      .resize(824, 1040, "contain") // Redimensionner l'image dans les proportions données par le frontend
      .webp({ quality: 90 }) // Convertir l'image en format .webp avec une qualité de 90
      .toFile(path.join("images", `resized-${filename}.webp`)) // Réécrire la nouvelle image en la renommant avec le préfixe "resized-" et l'extension .webp
      .then(() => {
        fs.unlink(req.file.path, () => {
          // Supprimer le fichier d'origine après le redimensionnement
          req.file.path = path.join("images", `resized-${filename}.webp`); // Remplacer le chemin de l'image initialement uploadée par celui de la nouvelle image redimensionnée
          next();
        });
      })
      .catch((err) => res.status(400).json({ err }));
  }
};

// Exporter la fonction de redimensionnement
module.exports = resizeImg;
