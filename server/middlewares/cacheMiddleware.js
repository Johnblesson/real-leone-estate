import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl || req.url;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    console.log('Cache hit for', key);
    res.send(cachedResponse);
  } else {
    console.log('Cache miss for', key);
    res.sendResponse = res.send;
    res.send = (body) => {
      cache.set(key, body);
      res.sendResponse(body);
    };
    next();
  }
};

export default cacheMiddleware;

// import client from "../database/redisClient.js"

// const cacheMiddleware = async (req, res, next) => {
//     const key = req.originalUrl || req.url;
//     try {
//       const cachedResponse = await client.get(key);
      
//       if (cachedResponse) {
//         console.log('Cache hit for', key);
//         res.send(JSON.parse(cachedResponse));
//       } else {
//         console.log('Cache miss for', key);
//         res.sendResponse = res.send;
//         res.send = async (body) => {
//           await client.set(key, JSON.stringify(body), {
//             EX: 600, // Set expiration time to 600 seconds
//           });
//           res.sendResponse(body);
//         };
//         next();
//       }
//     } catch (error) {
//       console.error('Redis error:', error);
//       next();
//     }
//   };

//   export default cacheMiddleware;