const Book = require('../models/book');
const fs = require('fs');
const average = require('../utils/average');

// POST a book
exports.postBook = async (req, res, next) => {
  try {
    // Parsing du livre depuis la requête
    const bookObject = JSON.parse(req.body.book);

    // Création d'une nouvelle instance de Book
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/resized-${req.file.filename.replace(/\.[^.]*$/, "")}.webp`,
      ratings: {
        userId: req.auth.userId,
        grade: bookObject.ratings[0].grade,
      },
    });

    // Calculer la moyenne du rating du livre en utilisant la fonction averageRating
    book.average = average(book);

    // Sauvegarde du livre dans la base de données
    await book.save();

    res.status(201).json({ message: "Livre enregistré avec succès !" });
  } catch (error) {
    res.status(400).json({ error, message: "Une erreur s'est produite lors de l'enregistrement du livre." });
  }
};
  


  
  



// GET all books
exports.getAllBooks = (req, res, next) => {
  Book.find()
      .then((books) => res.status(200).json(books))
      .catch((error) => res.status(400).json({ error }));
};

// GET one book
exports.getOneBook = (req, res, next) => {
   Book.findOne({ _id: req.params.id })
       .then((book) => res.status(200).json(book))
       .catch((error) => res.status(404).json({ error }));

 }

// Put a book
exports.putBook = (req, res, next) => {
    const bookObject = req.file
        ? {
              ...JSON.parse(req.body.book),
              imageUrl: `${req.protocol}://${req.get('host')}/images/${
                  req.file.filename
              }`,
          }
        : { ...req.body };

    delete bookObject._userId;
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book && book.userId != req.auth.userId) {
                // Vérification d'autorisation
                res.status(401).json({ message: 'Not authorized' });
            } else {
                Book.updateOne(
                    { _id: req.params.id },
                    { ...bookObject, _id: req.params.id }
                )
                    .then(() =>
                        res.status(200).json({ message: 'Objet modifié!' })
                        .averageRating(book)
                    )
                    .catch((error) => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

// Delete a book
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book && book.userId != req.auth.userId) {
                // Vérification d'autorisation
                res.status(401).json({ message: 'Not authorized' });
            } else {
                const filename = book.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() =>
                            res
                                .status(200)
                                .json({ message: 'Objet supprimé !' })
                        )
                        .catch((error) => res.status(401).json({ error }));
                });
            }
        })
        .catch((error) => {
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
                      .then(() => { res.status(201).json()})
                      .catch(error => { res.status(400).json( { error })});
                  res.status(200).json(book);
              }
          })
          .catch((error) => {
              res.status(404).json({ error });
          });
  } else {
      res.status(400).json({ message: 'La note doit être comprise entre 1 et 5' });
  }
};

// GET best rated books
// Cette fonction de contrôleur récupère les trois livres ayant les meilleures notes (averageRating) dans la base de données MongoDB
exports.getBestRating = (req, res, next) => {
  // Étape 1: Recherche des livres dans la collection "books" de la base de données
  Book.find()
    // Étape 2: Trier les résultats en fonction de la propriété "averageRating" en ordre décroissant (les meilleures notes d'abord)
    .sort({ averageRating: -1 })
    // Étape 3: Limiter le nombre de résultats renvoyés à 3 (les trois livres ayant les meilleures notes)
    .limit(3)
    // Étape 4: Exécuter la requête et traiter les résultats
    .then((books) => {
      // Étape 5: Renvoyer une réponse JSON avec les livres ayant les meilleures notes (status HTTP 200 OK)
      res.status(200).json(books);
    })
    // Étape 6: Capturer les erreurs éventuelles lors de l'exécution de la requête
    .catch((error) => {
      // Étape 7: Renvoyer une réponse JSON avec l'erreur (status HTTP 500 Internal Server Error)
      res.status(500).json({ error });
    });
};

