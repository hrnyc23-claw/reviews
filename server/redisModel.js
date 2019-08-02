// const redis = require("redis");
// const client = redis.createClient();

// module.exports = {
//   setReview: (productId, response) => {
//     client.set(`review${productId}`, JSON.stringify(response), 'EX', 86400, redis.print);
//   },
//   setMeta: (productId, response) => {
//     client.set(`meta${productId}`, JSON.stringify(response), 'EX', 86400, redis.print);
//   }
// }