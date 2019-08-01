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

const ReviewsPhotosSchema = new Schema({id : {type: Number, index: true}, review_id: Number, url: String}, {collection: 'reviews_photos', _id: false});

const Review = mongoose.model('Review', ReviewsSchema);

const ReviewPhoto = mongoose.model('ReviewPhoto', ReviewsPhotosSchema);

const lowerLimit = 2742832;

// ReviewPhoto.find({id: {$gte: lowerLimit}}).then(async reviewPhotosArray => {
//   let reviewId = 5777921;
//   let values = [];
//   for (let {id, review_id, url} of reviewPhotosArray) {
//     if (id % 100000 === 0) {
//       console.log(`Added photos through ${id}`);
//     }
//     if (review_id === reviewId) {
//       values.push({id, url});
//     } else {
//       await Review.updateOne({id: reviewId}, {photos: [...values]});
//       while (reviewId < review_id - 1) {
//         reviewId++;
//         await Review.updateOne({id: reviewId}, {photos: []});
//       }
//       reviewId = review_id;
//       values = [{id, url}];
//     }
//   }
//   await Review.updateOne({id: reviewId}, {photos: [...values]});
//   console.log(`Completed batch`);
// }).catch(err => console.error(err));

// Review.find({id: {$gt: 5777921}}).then(async reviewArray => {
//   for (let i = reviewArray[0].id; i <= reviewArray[reviewArray.length - 1].id; i++) {
//     await Review.updateOne({id: i}, {photos: []});
//     console.log(i);
//   }
// })
