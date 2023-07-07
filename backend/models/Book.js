const mongoose = require('mongoose')

//création du modèle de base de donnée
const bookSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [
        {
            grade: Number,
            userId: String,
        }],
    averageRating: { type: Number }
})

module.exports = mongoose.model('Book', bookSchema);