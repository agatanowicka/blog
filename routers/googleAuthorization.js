const express = require('express');
const router = express.Router();
const passport = require("passport");

// passport.use(new GoogleStrategy({
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/google/blog"
// },
//     function (accessToken, refreshToken, profile, cb) {
//         User.findOrCreate({ googleId: profile.id }, function (err, user) {
//             return cb(err, user);
//         });
//     }
// ));

router.get("/auth/google", function (req, res) {
    passport.authenticate('google', { scope: ["profile"] })
});

router.get("/auth/google/blog",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (req, res) {
        res.redirect('/home/:id');
    }
);

module.exports = router;


