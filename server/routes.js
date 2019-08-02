const { getReviews, getMeta, postReview, putHelpfulness, putReported } = require('./controllers');
const router = require('express').Router();

router.get('/:product_id/list', getReviews);

router.get('/:product_id/meta', getMeta);

router.post('/:product_id', postReview);

router.put('/helpful/:review_id', putHelpfulness);

router.put('/report/:review_id', putReported);

module.exports = router;