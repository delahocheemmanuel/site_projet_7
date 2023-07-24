const fs = require('fs');

// Fonction pour supprimer une image
const eraseImg = (path) => {
  fs.unlink(path, (err) => {
    if (err) {
      console.error('Erreur lors de la suppression de l\'image :', err);
    }
  });
};

module.exports = eraseImg;
