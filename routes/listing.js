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
const reviewRouter = require('./review.js');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });




// router.get('/', (req, res) => {
//   res.send('Hello World!');
// });

router.route("/new")
  .get(isLoggedIn, listingController.renderNewForm);

router.get('/category/:category', wrapAsync(listingController.filterByCategory));

router.route('/')
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));


router.route('/:id')
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing,  wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));



// Mount review routes before /:id route to avoid route conflicts

router.use('/:id/reviews', reviewRouter);

router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));



module.exports = router;