const mongoose = require('mongoose');
const data = require('./data.js');
const Listing = require('../models/listing.js');

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main().then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.log(err);
});

let initDB = async () => {
    await Listing.deleteMany({}).then(() => {
        console.log('Cleared Listings collection');
    }).catch(err => {
        console.log(err);
    });
};
initDB().then(async () => {
    await Listing.insertMany(data).then(() => {
        console.log('Inserted initial data');
    }).catch(err => {
        console.log(err);
    });
});

module.exports = initDB;