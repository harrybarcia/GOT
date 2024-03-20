const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const app = express();
const myRoutes = require('./api');
const cache = require('./cache');
const bodyParser=require('body-parser');

// Apply CORS config
const origin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin }))

// Set up middleware
app.use(cache.checkResponseCache); // Check cache before handling routes
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', myRoutes); // Register your routes
// This middleware will add the response to the cache after the route handlers
// have finished processing the request

app.use(cache.addResponseToCache);
// Database connection setup
const client = new Client({
  host: '127.0.0.1',
  port: 5432,
  database: 'atlas_of_thrones',
  user: 'patrick',
  password: 'the_best_passsword',
});

// Connect to the database
client.connect()
  .then(() => {
    console.log('Connected to the database');
    const port = 5000;
    app.listen(port, () => console.log(`Server listening at port ${port}`));
  })
  .catch(error => console.error('Error connecting to the database:', error));
