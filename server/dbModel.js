const { ProductCharacteristic, ProductReview, ReviewMap } = require('../db/index');

const sortReviews = (reviews, sort) => {
  if (sort === 'relevant') {
    reviews.sort((a, b) => {
      if (a.date === b.date) {
        return a.helpfulness - b.helpfulness;
      } else {
        let dateA = new Date(a.date);
        let dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      }
    });
  } else if (sort === 'newest') {
    reviews.sort((a, b) => {
      let dateA = new Date(a.date);
      let dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  } else if (sort === 'helpful') {
    reviews.sort((a, b) => {
      return b.helpfulness - a.helpfulness;
    });
  }
};

const getRatings = (reviews) => {
  let ratings = {};
  reviews.forEach((ele) => {
    ratings[ele.rating] = ratings[ele.rating] + 1 || 1;
  });
  return ratings;
};

const getRecommended = (reviews) => {
  let recommended = {};
  reviews.forEach((ele) => {
    let bool = ele.recommended ? 1 : 0;
    recommended[bool] = recommended[bool] + 1 || 1;
  });
  return recommended;
}

const averageAsString = (array) => {
  let average = array.reduce((memo, ele) => memo + ele, 0) / array.length;
  return average.toFixed(4).toString();
}

const getCharacteristicsAverages = (characteristics) => {
  let characteristicsAverages = {};
  characteristics.forEach((value, key) => {
    if (value.length !== 0) {
      characteristicsAverages[key] = averageAsString(value);
    } else {
      characteristicsAverages[key] = (0).toFixed(4).toString();
    }
  });
  return characteristicsAverages;
}

const updateCharacteristics = (currentCharacteristics, newCharacteristics) => {
  for (let key in newCharacteristics) {
    let values = currentCharacteristics.get(key)
    values = Array.isArray(values) ? values : [];
    values.push(newCharacteristics[key]);
    currentCharacteristics.set(key, values);
  }
}

const addReview = (currentReviews, newReview, productId) => {
  let collisionBuffer = .000002;
  let newId = Math.floor((Math.random() + collisionBuffer) * Math.pow(10, 12))
  currentReviews.push({
    photos: newReview.photos,
    id: newId,
    product_id: productId,
    rating: newReview.rating,
    date: new Date(newReview.date),
    summary: newReview.summary,
    body: newReview.body,
    recommended: newReview.recommended,
    reported: false,
    reviewer_name: newReview.name,
    reviewer_email: newReview.email,
    response: "",
    helpfulness: 0
  });
  return newId;
}

module.exports = {
  readReviews: (productId, page = 1, count = 5, sort = 'relevant') => {
    console.log(productId)
    return ProductReview.findOne({id: productId})
    .then(({reviews}) => {
      sortReviews(reviews, sort);
      reviews = reviews.filter(ele => {
        return ele.reported === false
      });
      let pages = Math.ceil(reviews.length / count) - 1;
      return {
        product_id: productId,
        page: page,
        count: count,
        reviews: reviews.slice(Math.min(page - 1, pages) * count, Math.min(page * count - 1, reviews.length))
      }
    })
    .catch((err) => err)
  },

  readMetadata: (productId) => {
    return Promise.all([
      ProductCharacteristic.findOne({product_id: productId}),
      ProductReview.findOne({id: productId})
    ]).then(results => {
      let ratings = getRatings(results[1].reviews);
      let recommended = getRecommended(results[1].reviews);
      let characteristicsAverages = getCharacteristicsAverages(results[0].characteristics);
      return {
        product_id: productId,
        ratings: ratings,
        recommended: recommended,
        characteristics: characteristicsAverages
      };
    }).catch((err) => err)
  },

  createReview: (productId, body) => {
    return Promise.all([
      ProductCharacteristic.findOne({product_id: productId}),
      ProductReview.findOne({id: productId})
    ]).then(results => {
      updateCharacteristics(results[0].characteristics, body.characteristics);
      let newId = addReview(results[1].reviews, body, productId);
      return Promise.all([
        ProductCharacteristic.updateOne({product_id: productId}, {characteristics: results[0].characteristics}),
        ProductReview.updateOne({id: productId}, {reviews: results[1].reviews}),
        ReviewMap.create({id: newId, product_id: productId})
      ]).then(() => true)
      .catch((err) => err)
    }).catch((err) => err)
  },

  updateReviewHelpfulness: (reviewId) => {
    return ReviewMap.findOne({id: reviewId})
    .then(review => {
      if (review === null || review === undefined) {
        return false;
      } else {
        let productId = review.product_id;
        return ProductReview.findOne({id: productId})
        .then(({reviews}) => {
          reviews.forEach(ele => {
            if (ele.id === reviewId) {
              ele.helpfulness += 1;
            }
          });
          return ProductReview.updateOne({id: productId}, {reviews: reviews})
          .then(() => true)
          .catch((err) => err)
        }).catch((err) => err)
    }}).catch((err) => err)
  },
  
  updateReviewReported: (reviewId) => {
    return ReviewMap.findOne({id: reviewId})
    .then(review => {
      let productId = review.product_id;
      return ProductReview.findOne({id: productId})
      .then(({reviews}) => {
        reviews.forEach(ele => {
          if (ele.id === reviewId) {
            ele.reported = true;
          }
        });
        return ProductReview.updateOne({id: productId}, {reviews: reviews})
        .then(() => true)
        .catch(() => false)
      }).catch(() => false)
    }).catch(() => false)
  }
}