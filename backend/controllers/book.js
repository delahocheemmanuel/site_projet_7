const Book = require('../models/Book');
const fs = require('fs');



// POST a book
exports.postBook = async (req, res) => {
    try {
        const bookObject = JSON.parse(req.body.book)
        delete bookObject._id
        delete bookObject._userId

        const book = new Book({
            ...bookObject,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${
                req.file.filename
            }`,
        })

        await book.save()

        res.status(201).json({ message: 'Livre enregistré !' })
    } catch (error) {
        res.status(400).json({ error })
    }
}

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
    Book.updateOne({ _id: req.params.id }, { rating: req.body.rating })
        .then(() =>
            res.status(200).json({ message: 'Rating updated successfully!' })
        )
        .catch((error) => res.status(400).json({ error }));
};
