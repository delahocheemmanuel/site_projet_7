const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();

// Apply rate limiting middleware to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
});

app.use(limiter);

