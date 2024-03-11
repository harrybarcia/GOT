const express = require('express');
const router = express.Router();

const cacheMiddleware = require('./cache');
const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_PORT, process.env.REDIS_HOST);
const db = require('./db');


// Check that id param is valid number
const { validationResult } = require('express-validator');
const { param, query } = require('express-validator');

// Validator for validating ID parameter
const idValidator = [
  param('id').notEmpty().isInt({ min: 0, max: 1000 }).withMessage('ID must be an integer between 0 and 1000')
];

// Validator for validating type parameter
const typeValidator = [
  query('type').notEmpty().isIn(['castle', 'city', 'town', 'ruin', 'landmark', 'region']).withMessage('Invalid location type')
];

// Middleware function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get('/', (req, res) => {
    res.send('Hello from API');
});

// Hello World Test Endpoint
router.get('/hello', async (req, res) => {
    res.send('Hello World');
});

// Get time from DB
router.get('/time', async (req, res) => {
    try {
        const result = await db.queryTime();
        res.json(result);
    } catch (error) {
        console.error('Error querying time from database:', error);
        res.status(500).send('Internal server error');
    }
});

router.get('/locations/:type', typeValidator, async (req, res) => {
    try {
        const type = req.params.type;
        const results = await db.getLocations(type);
        if (results.length === 0) {
            res.status(404).send('No locations found');
            return;
        }

        // Add row metadata as geojson properties
        const locations = results.map((row) => {
            let geojson = JSON.parse(row.st_asgeojson);
            geojson.properties = { name: row.name, type: row.type, id: row.gid };
            return geojson;
        });

        res.json(locations);
    } catch (error) {
        console.error('Error querying locations from database:', error);
        res.status(500).send('Internal server error');
    }
});

// Respond with boundary geojson for all kingdoms
router.get('/kingdoms', async (req, res, next) => {
    try {
        const results = await db.getKingdomBoundaries();
        if (results.length === 0) {
            res.status(404).send('No boundaries found');
            return;
        }
        // Add row metadata as geojson properties
        const boundaries = results.map((row) => {
            let geojson = JSON.parse(row.st_asgeojson);
            geojson.properties = { name: row.name, id: row.gid };
            return geojson;
        });

        res.json(boundaries);
        res.locals.body = boundaries;
      next(); // Move to next middleware (caching)
    } catch (error) {
        console.error('Error querying boundaries from database:', error);
        res.status(500).send('Internal server error');
    }
});

router.get('/kingdoms/:id/size', cacheMiddleware.addResponseToCache, async (req, res) => {
    try {
        const id = req.params.id;
        const result = await db.getRegionSize(id);
        if (!result) {
            res.status(404).send('Region not found');
            return;
        }
      
        // Convert response (in square meters) to square kilometers
        const sqKm = result.size * (10 ** -6);
        res.send(sqKm.toString());
    } catch (error) {
        console.error('Error getting region size:', error);
        res.status(500).send('Internal server error');
    }
});

router.get('/kingdoms/:id/castles',cacheMiddleware.addResponseToCache, idValidator, async (req, res) => {
    try {
        const regionId = req.params.id;
        const result = await db.countCastles(regionId);
        if (!result) {
            return res.status(404).json({ error: "Record not found" });
        }
        res.send(result.count);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal server error' }); // Moved inside the catch block
    }
});

router.get('/kingdoms/:id/summary', async (req, res, next) => {
    try {
      const id = req.params.id;
      const result = await db.getSummary('kingdoms', id);
  
      // Send the response to the client
      res.json(result);
  
      // Set response data to res.locals for caching middleware
      res.locals.body = result;
      next(); // Move to next middleware (caching)
    } catch (error) {
      console.error('Error retrieving summary data:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  

  


module.exports = router;
