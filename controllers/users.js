const User = require('../models/user');

module.exports.renderSignupForm = (req, res) => {
    res.render('users/signup.ejs');
}

module.exports.signup = async (req, res, next) => {
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

}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login.ejs');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.redirectUrl || '/listings';
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success', "Goodbye!");
        res.redirect('/listings');
    });
    }