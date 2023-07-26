
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 100 requests per windowMs
    message: 'Vous avez atteint la limite de requêtes. Réessayez plus tard.', // Votre message d'erreur personnalisé
  });
  
  module.exports = limiter;