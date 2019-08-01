const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useCreateIndex: true });

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const productCharacteristicsSchema = new Schema({product_id: {type: Number, index: true}, characteristics: Map}, {collection: 'productcharacteristics'});

const ProductReviewsSchema = new Schema({id: {type: Number, index: true}, reviews: Array}, {collection: 'productreviews'});

const ReviewMapSchema = new Schema({id: {type: Number, index: true}, product_id: Number}, {collection: 'reviews'})

const ProductCharacteristic = mongoose.model('ProductCharacteristic', productCharacteristicsSchema);

const ProductReview = mongoose.model('ProductReview', ProductReviewsSchema);

const ReviewMap = mongoose.model('ReviewMap', ReviewMapSchema);

module.exports = {
  ProductCharacteristic,
  ProductReview,
  ReviewMap
};