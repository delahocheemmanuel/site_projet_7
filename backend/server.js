// Charger les variables d'environnement depuis le fichier .env
require('dotenv').config();

// Importer les modules nécessaires
const http = require('http');

const app = require('./app'); // Assurez-vous que le chemin vers votre fichier Express.js est correct

// Fonction pour normaliser le numéro de port
const normalizePort = (val) => {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};

// Récupérer le numéro de port depuis les variables d'environnement ou utiliser le port 4000 par défaut
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

// Créer le serveur HTTP en utilisant l'application Express
const server = http.createServer(app);

// Gérer les erreurs liées au serveur en utilisant la fonction errorHandler
const errorHandler = (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
};
server.on('error', errorHandler);

// Gérer l'événement de mise en écoute du serveur (lorsqu'il démarre)
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + address.port;
    console.log('Listening on ' + bind);
});

// Faire écouter le serveur sur le numéro de port spécifié
server.listen(port);