require('dotenv').config();
if(process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

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
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');
const userRouter = require('./routes/user.js');
const reviewRouter = require('./routes/review.js');
const ListingRouter = require('./routes/listing.js');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const dbUrl = process.env.ATLASDB_URL;





async function main() {
  await mongoose.connect(dbUrl);
}

app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: 'thisshouldbeabettersecret!'
  }
});

store.on("error", function(e) {
  console.log("SESSION STORE ERROR", e)
})


const sessionOptions = {
  store: store,
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
  
};







app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// Custom LocalStrategy to allow login with username or email
passport.use(new LocalStrategy({
    usernameField: 'username', // This is the field name from the form
    passwordField: 'password'
}, async (input, password, done) => {
    try {
        // Check if input is an email (contains @)
        const isEmail = input.includes('@');
        
        let user;
        if (isEmail) {
            // Find user by email
            user = await User.findOne({ email: input });
            if (!user) {
                return done(null, false, { message: 'Invalid email or password' });
            }
            // Use the username for authentication (passport-local-mongoose uses username)
            const username = user.username;
            return User.authenticate()(username, password, (err, authenticatedUser) => {
                if (err) return done(err);
                if (!authenticatedUser) return done(null, false, { message: 'Invalid email or password' });
                return done(null, authenticatedUser);
            });
        } else {
            // Find user by username and authenticate directly
            user = await User.findOne({ username: input });
            if (!user) {
                return done(null, false, { message: 'Invalid username or password' });
            }
            return User.authenticate()(input, password, (err, authenticatedUser) => {
                if (err) return done(err);
                if (!authenticatedUser) return done(null, false, { message: 'Invalid username or password' });
                return done(null, authenticatedUser);
            });
        }
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

main().then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.log(err);
});

app.use('/listings', ListingRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/', userRouter);


app.use((req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error.ejs", { error: err });
});


app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});