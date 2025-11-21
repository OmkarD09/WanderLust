const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const { reviewSchema } = require('../schema.js');
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const { isLoggedIn } = require('./middlewares.js');

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

// Create Review Route
router.post('/', isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash('success', 'Successfully created a new review!');
    res.redirect(`/listings/${listing._id}`);
}));

// Delete Review Route
router.delete('/:reviewId', wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('error', 'Successfully deleted review!');
    res.redirect(`/listings/${id}`);
}));

module.exports = router;