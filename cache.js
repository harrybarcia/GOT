const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_PORT, process.env.REDIS_HOST);

module.exports = {
  /** Express middleware function to check cache before continuing to any endpoint handlers */
  checkResponseCache: async function (req, res, next) {
    try {
      const cachedResponse = await redis.get(req.path);
      if (cachedResponse) { // If cache hit
        console.log("cache hit");
        res.json(JSON.parse(cachedResponse)); // return the cached response
      } else {
        console.log("no cached on " + req.path);
        await next(); // only continue if result not in cache
      }
    } catch (error) {
      console.error('Error retrieving cached response:', error);
      res.status(500).send('Internal Server Error');
    }
  },

  addResponseToCache: async function (req, res, next) {
    await next(); // Wait until other handlers have finished
    console.log("cache miss?");
    console.log("res.locals.body", res.locals.body);
    // Check if response data is available in res.locals.body
    if (res.locals.body) {
      try {
        // Cache the response
        await redis.set(req.path, JSON.stringify(res.locals.body));
      } catch (error) {
        console.error('Error caching response:', error);
      }
    }
  }
}