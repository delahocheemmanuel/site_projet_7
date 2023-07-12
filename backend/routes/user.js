const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

router.post('/signup',userCtrl.signup) // Inscription
router.post('/login',userCtrl.login) // Connexion

module.exports = router; // 