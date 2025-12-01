const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema } = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');
const Review = require('../models/review.js');
const { isLoggedIn } = require('./middlewares.js');
const { validateListing } = require('./middlewares.js');
const { isOwner } = require('./middlewares.js');
const listingController = require('../controllers/listing.js');





// router.get('/', (req, res) => {
//   res.send('Hello World!');
// });



router.get('/', wrapAsync(listingController.index));

router.get('/new',isLoggedIn, listingController.renderNewForm);

router.post('/', isLoggedIn, validateListing, wrapAsync( listingController.createListing ));

// Mount review routes before /:id route to avoid route conflicts
const reviewRouter = require('./review.js');
router.use('/:id/reviews', reviewRouter);

router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

router.put('/:id',isLoggedIn, isOwner, validateListing,  wrapAsync(listingController.updateListing));

router.get('/:id', wrapAsync(listingController.showListing));


router.delete('/:id', isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));


module.exports = router;