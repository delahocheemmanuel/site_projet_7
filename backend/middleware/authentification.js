const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // 1
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); // 2
        const userId = decodedToken.userId; // 3
        if (req.body.userId && req.body.userId !== userId) { // 4
            throw 'Invalid user ID';
        } else {
            next(); // 5
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
}

