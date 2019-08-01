const { ProductCharacteristic, ProductReview, ReviewMap } = require('../db/index');

const sortReviews = (reviews, sort) => {
  if (sort === 'relevant') {
    reviews.sort((a, b) => {
      if (a.date === b.date) {
        return a.helpfulness - b.helpfulness;
      } else {
        let dateA = new Date(a.date);
        let dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      }
    });
  } else if (sort === 'new') {
    reviews.sort((a, b) => {
      let dateA = new Date(a.date);
      let dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  } else if (sort === 'helpfulness') {
    reviews.sort((a, b) => {
      return a.helpfulness - b.helpfulness;
    });
  }
};

const filterReviews = (reviews) => {
  reviews.filter(ele => {
    return ele.reported === false
  });
}

const getRatings = (reviews) => {
  let ratings = {};
  reviews.forEach((ele) => {
    ratings[ele.rating] = ratings[ele.rating] + 1 || 1;
    recommended[parseInt(ele.recommended)] = recommended[parseInt(ele.recommended)] + 1 || 1;
  });
  return ratings;
};

const getRecommended = (reviews) => {
  let recommended = {};
  reviews.forEach((ele) => {
    recommended[parseInt(ele.recommended)] = recommended[parseInt(ele.recommended)] + 1 || 1;
  });
  return recommended;
}

const averageAsString = (array) => {
  let average = array.reduce((memo, ele) => memo + ele, 0) / array.length;
  return average.toFixed(4).toString();
}

const getCharacteristicsAverages = (characteristics) => {
  let characteristicsAverages = {};
  for (let key in characteristics) {
    if (characteristics[key].length !== 0) {
      characteristicsAverages[key] = averageAsString(characteristics[key]);
    } else {
      characteristicsAverages[key] = (0).toFixed(4).toString();
    }
  }
  return characteristicsAverages;
}

const updateCharacteristics = (currentCharacteristics, newCharacteristics) => {
  for (let key in newCharacteristics) {
    currentCharacteristics[key].push(newCharacteristics[key]);
  }
}

const addReview = (currentReview, newReview, reviewId, productId) => {
  let collisionBuffer = .00001
  let newId = Math.floor((Math.random() + collisionBuffer) * Math.pow(10, 12))
  currentReview.push({
    photos: newReview.photos,
    id: newId,
    product_id: productId,
    rating: body.rating,
    date: new Date(body.date),
    summary: body.summary,
    body: body.body,
    recommended: false,
    reported: false,
    reviewer_name: body.name,
    reviewer_email: body.email,
    response: "",
    helpfulness: 0
  });
  return newId;
}

module.exports = {
  getReviews: (productId, page = 1, count = 5, sort = 'relevant') => {
    return ProductReview.findOne({id: productId})
    .then(({reviews}) => {
      sortReviews(reviews, sort);
      filterReviews(reviews);
      let pages = Math.ceil(reviews.length / count) - 1;
      return {
        product_id: productId,
        page: page,
        count: count,
        reviews: reviews.slice(Math.min(page - 1, pages) * count, Math.min(page * count - 1, reviews.length))
      }
    })
    .catch(() => false)
  },
  getMetadata: (productId) => {
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
    }).catch(() => false)
  },
  postReview: (productId, body) => {
    return Promise.all([
      ProductCharacteristic.findOne({product_id: productId}),
      ProductReview.findOne({id: productId})
    ]).then(results => {
      let newCharacteristics = updateCharacteristics(results[0].characteristics);
      let newId = addReview(results[1].reviews, body, results[2] + 1, productId);
      return Promise.all([
        ProductCharacteristic.updateOne({product_id: productId}, {characteristics: newCharacteristics}),
        ProductReview.updateOne({id: productId}, {reviews: results[1].reviews}),
        ReviewMap.create({id: newId, product_id: productId})
      ]).then(() => true)
      .catch(() => false)
    }).catch(() => false)
  },
  putReviewHelpfulness: (reviewId) => {
    return ReviewMap.findOne({id: reviewId})
    .then(review => {
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
        .catch(() => false)
      }).catch(() => false)
    }).catch(() => false)
  },
  putReviewReported: (reviewId) => {
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