const express = require('express');
const bookCtrl = require('../controllers/book');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/books',bookCtrl.getAllBooks)  //
router.get('/books/:id' ,bookCtrl.getOneBook)  //
router.get('bestrating',bookCtrl.getBestRating) //
router.post('/books',auth,multer,bookCtrl.postBook) //
router.post(':id/rating',auth,bookCtrl.postRating)  //
router.put('/books/:id',auth,multer,bookCtrl.putBook)  //
router.delete('/books/:id',auth,bookCtrl.deleteBook)  //


module.exports = router; // 