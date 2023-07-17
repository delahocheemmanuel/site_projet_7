const Book = require('../models/Book');
const fs = require('fs');



// POST a book
exports.postBook = (req, res, next) => {
    try {
      const bookObject = JSON.parse(req.body.book);
      console.log(bookObject);
      delete bookObject._id;
      delete bookObject._userId;
  
      const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        ratings: [
          {
            userId: req.auth.userId,
            grade: bookObject.ratings[0].grade,
          },
        ],
        averageRating: bookObject.ratings[0].grade,
      });
  
      book
        .save()
        .then(() => {
          res.status(201).json({ message: "Objet enregistré !" });
        })
        .catch((error) => {
          res.status(400).json({ error });
        });
    } catch (error) {
      res.status(400).json({ error });
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
                // Vérification de nullité
                res.status(401).json({ message: 'Not authorized' });
            } else {
                Book.updateOne(
                    { _id: req.params.id },
                    { ...bookObject, _id: req.params.id }
                )
                    .then(() =>
                        res.status(200).json({ message: 'Objet modifié!' })
                    )
                    .catch((error) => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book && book.userId != req.auth.userId) {
                
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



// GET best rated books
exports.getBestRating = (req, res, next) => {
    Book.find({ rating: { $gte: 4 } })
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }));
};

// POST a rating
exports.postRating = (req, res, next) => {
    const bookId = req.params.id;
    const { userId, rating } = req.body;
  
    // Vérifier si la note est valide (comprise entre 0 et 5)
    if (rating < 0 || rating > 5) {
      return res
        .status(400)
        .json({ message: "La note doit être comprise entre 0 et 5" });
    }
    Book.findById(bookId)
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: "Livre non trouvé" });
      }

      // Vérifier si l'utilisateur a déjà noté ce livre
      const userRatingIndex = book.ratings.findIndex(
        (r) => r.userId === userId
      );
      if (userRatingIndex !== -1) {
        return res
          .status(400)
          .json({ message: "L'utilisateur a déjà noté ce livre" });
      }

      // Ajouter la nouvelle note dans le tableau "ratings"
      book.ratings.push({ userId, grade: rating });


      // Enregistrer les modifications du livre
      book
        .save()
        .then((updatedBook) => {
          res.status(200).json(updatedBook);
        })
        .catch((error) => {
          res.status(500).json({ error });
        });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};
