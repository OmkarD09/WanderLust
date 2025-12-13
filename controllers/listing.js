const { response } = require('express');
const Listing = require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });

module.exports.index = async (req, res) => {
    const listings =  await Listing.find({});
    res.render('listings/index.ejs', { listings });
}

module.exports.renderNewForm =  (req, res) => {
    res.render('listings/new.ejs');
}

module.exports.createListing =  async (req, res, next) => {

    let coordinates = await geocodingClient.forwardGeocode({
        query: `${req.body.listing.location}, ${req.body.listing.country}`,
        limit: 1,
    }).send();
    
    
    const listingData = { ...req.body.listing, owner: req.user._id };
    
    // Handle image upload from Cloudinary
    if (req.file) {
        listingData.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    listingData.geometry = coordinates.body.features[0].geometry;

    console.log(listingData.geometry);
    
    const newListing = new Listing(listingData);
    await newListing.save();
    req.flash('success', 'Successfully created a new listing!');
    res.redirect('/listings');
}

module.exports.showListing =  async (req, res) => {

    const listing = await Listing.findById(req.params.id)
        .populate({ path: 'reviews', populate: { path: 'author' } })
        .populate('owner');
    if (!listing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('listings/show.ejs', { listing });
};

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('error', 'Successfully deleted listing!');
    res.redirect('/listings');
}

module.exports.renderEditForm = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash('error', 'Cannot find that listing!');
        return res.redirect('/listings');
    }
    res.render('listings/edit.ejs', { listing });
}

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    // Handle image upload from Cloudinary
    if(typeof req.file !== 'undefined') {
        req.body.listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true, runValidators: true });
    req.flash('success', 'Successfully updated listing!');

    res.redirect(`/listings/${listing._id}`);
}