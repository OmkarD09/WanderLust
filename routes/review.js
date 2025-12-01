const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { reviewSchema } = require('../schema.js');
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const { isLoggedIn } = require('./middlewares.js');
const { validateReview } = require('./middlewares.js');
const { isOwner } = require('./middlewares.js');
const { isReviewAuthor } = require('./middlewares.js');
const reviewController = require('../controllers/reviews.js');


// Create Review Route
router.post('/', isLoggedIn, validateReview, wrapAsync( reviewController.createReview ));

// Delete Review Route
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync( reviewController.deleteReview ));

module.exports = router;