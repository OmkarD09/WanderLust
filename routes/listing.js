const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema } = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');
const Review = require('../models/review.js');
const { isLoggedIn } = require('./middlewares.js');

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};



// router.get('/', (req, res) => {
//   res.send('Hello World!');
// });

router.get('/', wrapAsync(async (req, res) => {
    const listings =  await Listing.find({});
    res.render('listings/index.ejs', { listings });
}));

router.get('/new',isLoggedIn, (req, res) => {
    res.render('listings/new.ejs');
});

router.post('/', validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing({ ...req.body.listing, user: req.user._id });
  await newListing.save();
  req.flash('success', 'Successfully created a new listing!');
  res.redirect('/listings');
}));

// Mount review routes before /:id route to avoid route conflicts
const reviewRouter = require('./review.js');
router.use('/:id/reviews', reviewRouter);

router.get("/:id/edit",isLoggedIn, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('listings/edit.ejs', { listing });
}));

router.put('/:id',isLoggedIn, validateListing,  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true, runValidators: true });
    req.flash('success', 'Successfully updated listing!');

    res.redirect(`/listings/${listing._id}`);
}));

router.get('/:id', wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id)
        .populate({ path: 'reviews', populate: { path: 'author' } })
        .populate('user');
    if (!listing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('listings/show.ejs', { listing });
}));



router.delete('/:id', isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('error', 'Successfully deleted listing!');
    res.redirect('/listings');
}));


module.exports = router;