// Importer le module HTTP pour créer le serveur HTTP
const http = require("http");
// Importer l'application Express créée dans le fichier "app.js"
const app = require("./app");

// Fonction pour normaliser le numéro de port
const normalizePort = (val) => {
  const port = parseInt(val, 10); // Convertir le numéro de port en entier décimal

  if (isNaN(port)) {
    // Si le port n'est pas un nombre, le retourner tel quel
    return val;
  }
  if (port >= 0) {
    // Si le port est un nombre positif, le retourner
    return port;
  }
  // Sinon, retourner faux (port invalide)
  return false;
};

// Récupérer le numéro de port depuis les variables d'environnement ou utiliser le port 4000 par défaut
const port = normalizePort(process.env.PORT || "4000");
// Définir le numéro de port dans l'application Express
app.set("port", port);

// Fonction de gestion des erreurs liées au serveur
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Créer le serveur HTTP en utilisant l'application Express
const server = http.createServer(app);

// Gérer les erreurs liées au serveur en utilisant la fonction errorHandler
server.on("error", errorHandler);

// Gérer l'événement de mise en écoute du serveur (lorsqu'il démarre)
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind); // Afficher un message dans la console indiquant que le serveur écoute sur un certain port ou adresse
});

// Faire écouter le serveur sur le numéro de port spécifié
server.listen(port);
