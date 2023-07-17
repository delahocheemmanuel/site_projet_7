const limiterRate = require('express-rate-limit'); // 

const limiter = limiterRate({ 
    windowMs: 15 * 60 * 1000, // 15 minutes 
    max: 200 // limit each IP to 100 requests per windowMs
});

module.exports = limiterRate; //    