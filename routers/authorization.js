const express = require('express');
const router = express.Router();
const passport = require("passport");

router.route("/signUp")
.get( function (req, res) {
    res.render("signUp",{loginUser: req.isAuthenticated()});
})
.post( function (req, res) {
    const passportUser = new User({ firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, username: req.body.email })
    User.register(passportUser, req.body.password, function (err, user) {
        if (err) {
            res.redirect('/signUp');
        }
        else {
            passport.authenticate("local")(req, res, function () {
                res.redirect('/login');
            })
        };
    });
});

router.route("/login")
.get( function (req, res) {
    res.render('login', {loginUser: req.isAuthenticated()});
})
.post( passport.authenticate('local', { failureRedirect: '/login' }), function (req, res) {
    res.redirect('/');
})

router.get("/logout", function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;