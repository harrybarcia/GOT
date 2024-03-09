

const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const app = express();
const myRoutes = require('./api');

app.use(cors());
app.use('/', myRoutes); // Prefix routes with '/api'


client = new Client({
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