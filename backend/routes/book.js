const express = require('express');
const router = express.Router();
const bookCtrl = require('../controllers/book');


router.get('/books',bookCtrl.getAllBooks)  //
router.get('/books/:id' ,bookCtrl.getOneBook)  //
router.get('bestrating',bookCtrl.getBestRating) //
router.post('/books',bookCtrl.postBook) //
router.post(':id/rating',bookCtrl.postRating)  //
router.put('/books/:id',bookCtrl.putBook)  //
router.delete('/books/:id',bookCtrl.deleteBook)  //


module.exports = router; // 