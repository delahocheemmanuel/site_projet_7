const mongoose = require('mongoose');

// création du modèle de base de données
const bookSchema = mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    title: { type: String, required: true, maxLength: 200 },
    author: { type: String, required: true, maxLength: 200 },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true, min: 0, max: new Date().getFullYear() },
    genre: { type: String, required: true, maxLength: 200 },
    ratings: [
        {
            grade: Number,
            userId: String,
        }
    ],
    averageRating: { type: Number, min: 0, max: 5 }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
