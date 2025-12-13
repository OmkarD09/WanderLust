const mongoose = require('mongoose');
const Review = require('./review.js');
const user = require('./user.js');

// The main connection logic is in app.js, so you don't need it here.
// async function main() {
//  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
// }

const listingSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    filename: {
        type: String,
    },
    url: {
        type: String,
        default: "https://images.unsplash.com/photo-1762838896723-0d2fe5948fe0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=688",
        set: (v) => {
            if (v === '') {
                return 'https://images.unsplash.com/photo-1762838896723-0d2fe5948fe0?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=688';
            }
            return v;
        },
    }
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
      required: true,
    }
  ],
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

listingSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await Review.deleteMany({ _id: { $in: doc.reviews } });
  }
});
   

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;