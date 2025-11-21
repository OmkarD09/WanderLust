const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const User = require('../models/user.js');
const passport = require('passport');
const {saveRedirectUrl} = require('./middlewares.js');

router.get('/signup', (req, res) => {
    res.render('users/signup.ejs');
});

router.post('/signup', wrapAsync(async (req, res, next) => {
    try {
    let { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.flash('success', 'Welcome to WanderLust!');
    req.login(registeredUser, err => {
        if (err) return next(err);
        res.redirect('/listings');
    });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }

}));

router.get('/login', (req, res) => {
    res.render('users/login.ejs');
});

router.post('/login', saveRedirectUrl,
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.redirectUrl || '/listings';
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/listings');
    });
});


module.exports = router;