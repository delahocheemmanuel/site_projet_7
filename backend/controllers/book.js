const Book = require('../models/Book');


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
};

// GET best rated books
exports.getBestRating = (req, res, next) => {
    Book.find({ rating: { $gte: 4 } })
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }));
};

// POST a book
exports.postBook = (req, res, next) => {
    const book = new Book({
        ...req.body,
    });
}

// POST a rating
exports.postRating = (req, res, next) => {
    Book.updateOne({ _id: req.params.id }, { rating: req.body.rating })
        .then(() => res.status(200).json({ message: 'Rating updated successfully!' }))
        .catch((error) => res.status(400).json({ error }));
};

// PUT a book
exports.putBook = (req, res, next) => {
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    } : { ...req.body };
    Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Modified!' }))
        .catch((error) => res.status(400).json({ error }));
};


// DELETE a book
exports.deleteBook = (req, res, next) => {
    Book.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Deleted!' }))
        .catch((error) => res.status(400).json({ error }));
};


module.exports = router;