const mongoose = require('mongoose');

const connect = () => {
  mongoose.connect('mongodb://ec2-54-165-148-25.compute-1.amazonaws.com/test', { useNewUrlParser: true, useCreateIndex: true }).then(() => {
    console.log('Connected to mongo')
  }).catch(err => {
    console.error(err);
    console.error(err.errorLabels);
    setTimeout(connect, 30000);
  })
};

connect();

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
