const express = require('express');
const app = express();
const port = 3000;
const mongoose = require('mongoose');
const ejs = require('ejs');
const methodOverride = require('method-override');
const path = require('path');
const Listing = require('./models/listing.js');


async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set("views", path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
 
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

main().then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.log(err);
});



app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});

app.get('/testlistings',(req, res) => {
    let newListing = new Listing({
        title: "Test Listing",
        description: "This is a test listing",
        image: "",
        price: 100,
        location: "Test Location",
        country: "Test Country"
    });
    newListing.save().then(listing => {
        res.send(listing);
    }).catch(err => {
        res.send(err);
    });
});


