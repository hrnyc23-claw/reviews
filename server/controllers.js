const { readReviews, readMetadata, updateReviewHelpfulness, updateReviewReported, createReview } = require('./dbModel');

const isValidCharacteristics = (characteristics) => {
  let counter = 0;
  for (let key in characteristics) {
    counter++;
    if (key !== 'Fit' && key !== 'Size' && key !== 'Comfort' && key !== 'Quality' && key !== 'Length' && key !== 'Width') {
      return false;
    }
  }
  if (counter === 0) {
    return false;
  }
  return true;
}

const isConforming = (review) => {
  if (!Array.isArray(review.photos)) {
    console.log('Photo ', review.photos)
    return false;
  }
  if (review.rating === undefined || review.rating < 0 || review.rating > 5) {
    console.log('Rating ', review.rating)
    return false;
  }
  if (isNaN(Date.parse(review.date))) {
    console.log('Date ', review.date)
    return false;
  }
  if (review.summary === undefined) {
    console.log('Summary ', review.summary)
    return false;
  }
  if (review.body === undefined) {
    console.log('Body ', review.body)
    return false;
  }
  if (review.reviewer_name === undefined) {
    console.log('Name ', review.reviewer_name)
    return false;
  }
  if (review.reviewer_email === undefined) {
    console.log('email ', review.reviewer_email)
    return false;
  }
  if (review.recommended !== true && review.recommended !== false) {
    console.log('Recommended ', review.recommended)
    return false;
  }
  if (!isValidCharacteristics(review.characteristics)) {
    return false
  }
  return true;
};

const handlePut = (req, res, handler) => {
  let reviewId = parseInt(req.params.review_id);
  if (isNaN(parseInt(reviewId)) || reviewId === undefined) {
    res.status(400).send('Parameters are invalid');
  } else {
    handler(reviewId).then(success => {
      if (success === false) {
        res.status(400).send('Invalid id');
      } else if (success === true) {
        res.sendStatus(204);
      }
    }).catch(err => {
      console.error(err);
      res.sendStatus(500);
    })
  }
}

module.exports = {
  getReviews: (req, res) => {
    let productId = parseInt(req.params.product_id);
    if (isNaN(parseInt(productId)) || productId === undefined) {
      res.status(400).send('Parameters are invalid');
    } else {
      readReviews(productId).then(list => {
        res.send(list);
      }).catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
    }
  },
  getMeta: (req, res) => {
    let productId = parseInt(req.params.product_id);
    if (isNaN(parseInt(productId)) || productId === undefined) {
      res.status(400).send('Parameters are invalid');
    } else {
      readMetadata(productId).then(meta => {
        res.send(meta);
      }).catch(err => {
        console.error(err);
        res.sendStatus(500);
      });
    }
  },
  postReview: (req, res) => {
    let productId = parseInt(req.params.product_id);
    let review = req.body;
    if (isConforming(review)) {
      if (isNaN(parseInt(productId)) || productId === undefined) {
        res.status(400).send('Parameters are invalid');
      } else {
        createReview(productId, review).then(success => {
          console.log(success);
          if (success === true) {
            res.sendStatus(201);
          } else {
            res.sendStatus(500);
          }
        }).catch(err => {
          console.error(err);
          res.sendStatus(500)
        })
      }
    } else {
      res.status(400).send('Review is invalid');
    }
  },
  putHelpfulness: (req, res) => {
    handlePut(req, res, updateReviewHelpfulness);
  },
  putReported: (req, res) => {
    handlePut(req, res, updateReviewReported);
  }
}