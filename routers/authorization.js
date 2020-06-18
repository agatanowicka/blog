const express = require('express');
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

router.route("/signUp")
    .get(function (req, res) {
        res.render("signUp");
    })
    .post(function (req, res) {
        const passportUser = new User({ firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, username: req.body.email, info: '' })
        User.register(passportUser, req.body.password, function (err, user) {
            if (err) {
                res.redirect('/signUp');
            } else {
                res.redirect('/login');
            };
        });
    });

router.route("/login")
    .get(function (req, res) {
        res.render('login');
    })
    .post(passport.authenticate('local', { failureRedirect: '/login' }), function (req, res) {
        res.redirect('/');
    })

router.get("/logout", function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;