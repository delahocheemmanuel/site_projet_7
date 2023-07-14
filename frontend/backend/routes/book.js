const express = require('express');
const bookCtrl = require('../controllers/book');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', bookCtrl.getAllBooks);
router.get('/:id', bookCtrl.getOneBook);
router.get('/bestrating', bookCtrl.getBestRating);
router.post('/', auth, multer, bookCtrl.postBook);
router.post('/:id/rating', auth, bookCtrl.postRating);
router.put('/:id', auth, multer, bookCtrl.putBook);
router.delete('/:id', auth, bookCtrl.deleteBook);

module.exports = router;
