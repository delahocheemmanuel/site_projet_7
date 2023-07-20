const Book = require('../models/book');
const fs = require('fs');
const average = require('../utils/average');

// POST a book
exports.postBook = async (req, res, next) => {
  try {
    // Parsing du livre depuis la requête
    const bookObject = JSON.parse(req.body.book);

    // Création d'une nouvelle instance de Book avec les données fournies dans la requête
    const book = new Book({
      ...bookObject, // Copie toutes les propriétés du livre fournies dans le body de la requête
      userId: req.auth.userId, // Attribue l'ID de l'utilisateur authentifié comme propriétaire du livre
      imageUrl: `${req.protocol}://${req.get("host")}/images/resized-${req.file.filename.replace(/\.[^.]*$/, "")}.webp`, // Construit l'URL de l'image en fonction du protocole et de l'hôte de la requête, ainsi que du nom du fichier téléchargé
      ratings: {
        userId: req.auth.userId, // Attribue l'ID de l'utilisateur authentifié comme évaluateur du livre
        grade: bookObject.ratings[0].grade, // Utilise la note fournie dans le body de la requête comme note initiale du livre
      },
    });

    // Calculer la moyenne du rating du livre en utilisant la fonction averageRating
    book.average = average(book); // Appelle la fonction average avec le livre en tant que paramètre pour calculer la moyenne du rating

    // Sauvegarde du livre dans la base de données
    await book.save(); // Enregistre le livre dans la base de données MongoDB en utilisant la méthode save()

    // Répond avec un statut 201 (Created) et un message de succès
    res.status(201).json({ message: "Livre enregistré avec succès !" });
  } catch (error) {
    // En cas d'erreur lors du traitement de la requête
    // Répond avec un statut 400 (Bad Request) et un message d'erreur personnalisé
    res.status(400).json({ error, message: "Une erreur s'est produite lors de l'enregistrement du livre." });
  }
};

// GET all books
exports.getAllBooks = (req, res, next) => {
  // Recherche de tous les livres dans la collection "books" de la base de données MongoDB
  Book.find()
    .then((books) => res.status(200).json(books)) // Si la requête réussit, renvoyer les livres trouvés en tant que réponse JSON avec le statut 200 (OK).
    .catch((error) =>
      res
        .status(400)
        .json({
          error,
          message: "Une erreur s'est produite lors du chargement des livres.",
        })
    ); // Si une erreur se produit lors de la recherche des livres, renvoyer une réponse JSON avec le statut 400 (Bad Request) et un message d'erreur personnalisé.
};

// GET one book
exports.getOneBook = (req, res, next) => {
  // Recherche d'un livre par son ID dans la collection "books" de la base de données MongoDB
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (!book) {
        // Si aucun livre n'est trouvé avec l'ID donné, renvoyer une réponse JSON avec le statut 404 (Not Found) et un message d'erreur indiquant que le livre n'a pas été trouvé.
        return res.status(404).json({ error,message: "Livre non trouvé" });
      }
      // Si le livre est trouvé, renvoyer le livre en tant que réponse JSON avec le statut 200 (OK).
      res.status(200).json(book);
    })
    .catch((error) => res.status(500).json({ error,message: "le serveur a rencontré un problème inattendu qui l'empêche de répondre à la requête" })); // Si une erreur se produit lors de la recherche du livre, renvoyer une réponse JSON avec le statut 500 (Internal Server Error) et l'erreur retournée par MongoDB.
};


// put a book
exports.putBook = (req, res, next) => {
  const bookObject = req.file
      ? {
            ...JSON.parse(req.body.book),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        }
      : { ...req.body };

  delete bookObject._userId;

  // Rechercher le livre par son ID dans la base de données
  Book.findOne({ _id: req.params.id })
      .then((book) => {
          // Vérifier si le livre existe et s'il appartient à l'utilisateur authentifié
          if (book && book.userId != req.auth.userId) {
              // Si le livre n'appartient pas à l'utilisateur, renvoyer un statut 401 (Non autorisé) avec un message d'erreur
              res.status(401).json({ message: 'Not authorized' });
          } else {
              // Si le livre appartient à l'utilisateur, mettre à jour les propriétés du livre avec les nouvelles données fournies dans la requête
              Book.updateOne(
                  { _id: req.params.id },
                  { ...bookObject, _id: req.params.id }
              )
                  .then(() =>
                      // Renvoyer un statut 200 (OK) avec un message de succès
                      res.status(200).json({ message: 'Objet modifié!' })
                      .averageRating(book) // Note : Il semble y avoir une confusion ici, car la fonction averageRating n'a pas été définie pour mettre à jour le livre.
                  )
                  .catch((error) => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          // Renvoyer un statut 400 (Bad Request) avec un message d'erreur en cas d'erreur lors de la recherche du livre
          res.status(400).json({ error });
      });
};

// delete a book
exports.deleteBook = (req, res, next) => {
  // Rechercher le livre par son ID dans la base de données
  Book.findOne({ _id: req.params.id })
      .then((book) => {
          // Vérifier si le livre existe et s'il appartient à l'utilisateur authentifié
          if (book && book.userId != req.auth.userId) {
              // Si le livre n'appartient pas à l'utilisateur, renvoyer un statut 401 (Non autorisé) avec un message d'erreur
              res.status(401).json({ message: 'Not authorized' });
          } else {
              // Si le livre appartient à l'utilisateur, supprimer l'image associée au livre
              const filename = book.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  // Supprimer le livre de la base de données
                  Book.deleteOne({ _id: req.params.id })
                      .then(() =>
                          // Renvoyer un statut 200 (OK) avec un message de succès
                          res.status(200).json({ message: 'Objet supprimé !' })
                      )
                      .catch((error) => res.status(401).json({ error }));
              });
          }
      })
      .catch((error) => {
          // Renvoyer un statut 500 (Internal Server Error) avec un message d'erreur en cas d'erreur lors de la recherche du livre
          res.status(500).json({ error });
      });
};

// POST a rating
exports.postRating = (req, res, next) => {
  // On vérifie que la note est comprise entre 0 et 5
  if (0 <= req.body.rating <= 5) {
    // Stockage de la requête dans une constante
    const ratingObject = { ...req.body, grade: req.body.rating };
    // Suppression du faux _id envoyé par le front
    delete ratingObject._id;
    // Récupération du livre auquel on veut ajouter une note
    Book.findOne({_id: req.params.id})
        .then(book => {
            // Création d'un tableau regroupant toutes les userId des utilisateurs ayant déjà noté le livre en question
            const newRatings = book.ratings;
            const userIdArray = newRatings.map(rating => rating.userId);
            // On vérifie que l'utilisateur authentifié n'a jamais donné de note au livre en question
            if (userIdArray.includes(req.auth.userId)) {
                // Si l'utilisateur a déjà donné une note au livre, renvoyer un statut 403 (Forbidden) avec un message d'erreur
                res.status(403).json({ message : 'Not authorized' });
            } else {
                // Ajout de la note
                newRatings.push(ratingObject);
                // Création d'un tableau regroupant toutes les notes du livre, et calcul de la moyenne des notes
                const grades = newRatings.map(rating => rating.grade);
                const averageGrades = average.average(grades);
                book.averageRating = averageGrades;
                // Mise à jour du livre avec la nouvelle note ainsi que la nouvelle moyenne des notes
                Book.updateOne({ _id: req.params.id }, { ratings: newRatings, averageRating: averageGrades, _id: req.params.id })
                    .then(() => { 
                        // Renvoyer un statut 201 (Created) avec une réponse vide
                        res.status(201).json()
                    })
                    .catch(error => { 
                        // Renvoyer un statut 400 (Bad Request) avec un message d'erreur en cas d'erreur lors de la mise à jour du livre
                        res.status(400).json( { error })
                    });
                // Renvoyer le livre en tant que réponse JSON avec le statut 200 (OK)
                res.status(200).json(book);
            }
        })
        .catch((error) => {
            // Renvoyer un statut 404 (Not Found) avec un message d'erreur en cas d'erreur lors de la recherche du livre
            res.status(404).json({ error });
        });
} else {
    // Renvoyer un statut 400 (Bad Request) avec un message d'erreur si la note n'est pas comprise entre 1 et 5
    res.status(400).json({ message: 'La note doit être comprise entre 1 et 5' });
}
};

// GET best rating
exports.getBestRating = (req, res, next) => {
// Recherche des livres dans la collection "books" de la base de données
Book.find()
  // Trier les résultats en fonction de la propriété "averageRating" en ordre décroissant (les meilleures notes d'abord)
  .sort({ averageRating: -1 })
  // Limiter le nombre de résultats renvoyés à 3 (les trois livres ayant les meilleures notes)
  .limit(3)
  // Exécuter la requête et traiter les résultats
  .then((books) => {
    // Renvoyer une réponse JSON avec les livres ayant les meilleures notes (status HTTP 200 OK)
    res.status(200).json(books);
  })
  // Capturer les erreurs éventuelles lors de l'exécution de la requête
  .catch((error) => {
    // Renvoyer une réponse JSON avec l'erreur (status HTTP 500 Internal Server Error)
    res.status(500).json({ error, message: "le serveur a rencontré un problème inattendu qui l'empêche de répondre à la requête" });
  });
};


