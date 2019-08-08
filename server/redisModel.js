const redis = require("redis");
const client = redis.createClient();
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

module.exports = {
  setCacheReview: (productId, response) => {
    client.set(`review${productId}`, response, 'EX', 30);
  },
  setCacheMeta: (productId, response) => {
    client.set(`meta${productId}`, response, 'EX', 30);
  },
  getCacheReview: (productId) => {
    return client.getAsync(`review${productId}`);
  },
  getCacheMeta: (productId) => {
    return client.getAsync(`meta${productId}`);
  }
};
