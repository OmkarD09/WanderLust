const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAP_TOKEN;

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  
  // Check if Mapbox token is available
  if (!mapboxToken) {
    console.error('MAP_TOKEN is not set in environment variables. Cannot geocode listings.');
    console.error('Please ensure your .env file exists in the project root and contains: MAP_TOKEN=your_token_here');
    process.exit(1);
  }
  
  // Initialize Mapbox geocoding client
  const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });
  
  // Geocode each listing and add geometry
  const listingsWithGeometry = await Promise.all(
    initData.data.map(async (obj) => {
      try {
        // Geocode using location and country
        const response = await geocodingClient.forwardGeocode({
          query: `${obj.location}, ${obj.country}`,
          limit: 1,
        }).send();
        
        // Extract geometry from the first result
        if (response.body.features && response.body.features.length > 0) {
          obj.geometry = response.body.features[0].geometry;
          console.log(`✓ Geocoded: ${obj.location}, ${obj.country}`);
        } else {
          console.log(`✗ No results for: ${obj.location}, ${obj.country}`);
          // Set a default geometry if geocoding fails (0,0 coordinates)
          obj.geometry = {
            type: 'Point',
            coordinates: [0, 0]
          };
        }
      } catch (error) {
        console.error(`✗ Error geocoding ${obj.location}, ${obj.country}:`, error.message);
        // Set a default geometry if geocoding fails
        obj.geometry = {
          type: 'Point',
          coordinates: [0, 0]
        };
      }
      
      return { ...obj, owner: "6920c1c2503baf285a939352" };
    })
  );
  
  await Listing.insertMany(listingsWithGeometry);
  console.log("data was initialized with geometry");
};

initDB();