const sortReviews = (reviews, sort) => {
  if (sort === 'relevant') {
    reviews.sort((a, b) => {
      if (a.date.$date === b.date.$date) {
        return b.helpfulness - a.helpfulness;
      } else {
        return b.date.$date - a.date.$date;
      }
    });
  } else if (sort === 'newest') {
    reviews.sort((a, b) => {
      return b.date.$date - a.date.$date;
    });
  } else if (sort === 'helpful') {
    reviews.sort((a, b) => {
      return b.helpfulness - a.helpfulness;
    });
  }
};

module.exports = {
  processReviewsData: (reviews, page = 1, count = 5, sort = 'relevant', productId) => {
    reviews = JSON.parse(reviews[0].array_reviews);
    sortReviews(reviews, sort);
    reviews = reviews.filter(ele => {
      return ele.reported === false
    });
    let pages = Math.min(Math.ceil(reviews.length / count) - 1, 0);
    return {
      product_id: productId,
      page: page,
      count: count,
      reviews: reviews.slice(Math.min(page - 1, pages) * count, Math.min(page * count - 1, reviews.length))
    }
  }
}