const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userCtrl = require('../controllers/user');


exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // 1
        .then(hash => {
            const user = new User({ // 2
                email: req.body.email,
                password: hash
            });
            user.save() // 3
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' })) // 4
                .catch(error => res.status(400).json({ error })); // 5
        })
        .catch(error => res.status(500).json({ error })); // 6
}

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // 1
        .then(user => {
            if (!user) { // 2
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password) // 3
                .then(valid => {
                    if (!valid) { // 4
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({ // 5
                        userId: user._id,
                        token: jwt.sign( // 6
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error })); // 7
        }
        )
        .catch(error => res.status(500).json({ error }));
}






