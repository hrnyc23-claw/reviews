const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useCreateIndex: true });

mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const ReviewsSchema = new Schema({id: {type: Number, index: true}, 
  product_id: Number, 
  date: Date, 
  summary: String, 
  body: String, 
  recommend: Boolean, 
  reported: Boolean,
  reviewer_name: String,
  reviewer_email: String,
  response: String,
  helpfulness: Number,
  photos: Array}, {collection: 'reviews', _id: false});

const ProductReviewsSchema = new Schema({id: {type: Number, index: true}, reviews: Array, reviewsMap: Map}, {collection: 'productreviews'});

const Review = mongoose.model('Review', ReviewsSchema);

const ProductReview = mongoose.model('ProductReview', ProductReviewsSchema);

const numberOfProducts = 1000011;

const mapReviewsToProduct = async () => {
  for (let i = 1; i <= numberOfProducts; i++) {
    if (i % 100000 === 0) {
      console.log(`Through product ${i}`);
    }
    let reviews = await ProductReview.findOne({id: i});
    await ProductReview.create({id: i, reviews: [...reviews]});
  }
  console.log(`Mapping reviews to products complete`);
};

// mapReviewsToProduct();

const convertToMap = (array) => {
  let map = new Map();
  array.forEach((ele) => {
    map.set(ele.id.toString(), ele);
  });
  return map;
}

const convertArraysToMaps = async () => {
  for (let i = 1; i <= numberOfProducts; i++) {
    if (i % 100000 === 0) {
      console.log(`Through product ${i}`);
    }
    let product = await ProductReview.findOne({id: i});
    let reviews = product.reviews;
    reviews = convertToMap(reviews);
    // console.log(reviews);
    await ProductReview.updateOne({id: i}, {reviewsMap: reviews});
  }
  console.log(`Converting arrays`);
};

convertArraysToMaps();