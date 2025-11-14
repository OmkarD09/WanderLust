const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const ejs = require('ejs');
const methodOverride = require('method-override');
const path = require('path');
const Listing = require('./models/listing.js');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema } = require('./schema.js');

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

main().then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.log(err);
});

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/listings', wrapAsync(async (req, res) => {
    const listings =  await Listing.find({});
    res.render('listings/index.ejs', { listings });
}));

app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});

app.post('/listings', validateListing, wrapAsync(async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect('/listings');
}));

app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render('listings/edit.ejs', { listing });
}));

app.put('/listings/:id', validateListing,  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true, runValidators: true });
    res.redirect(`/listings/${listing._id}`);
}));

app.get('/listings/:id', wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render('listings/show.ejs', { listing });
}));

app.delete('/listings/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));

app.use((req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
  res.render('error.ejs', { err: err });
});


app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!"} = err;
  res.status(statusCode).render('error.ejs', { error: err });
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});