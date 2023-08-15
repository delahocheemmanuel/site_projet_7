const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Extraction du jeton du header Authorization
    const token = req.headers.authorization.split(" ")[1];
    
    // Vérification et décodage du jeton
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    
    // Récupération de l'identifiant de l'utilisateur à partir du jeton décodé
    const userId = decodedToken.userId;
    
    // Ajout de l'identifiant de l'utilisateur à l'objet req.auth
    req.auth = {
      userId: userId,
    };
    
    // Passe la requête au middleware suivant
    next();
  } catch (error) {
    // Gestion des erreurs lors de la vérification du jeton
    res.status(401).json({ error, message: "Requête non authentifiée !" });
  }
};


