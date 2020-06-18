const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.route("/editProfile")
    .get(function (req, res) {
        if (!req.user) {
            return res.redirect('/login');
        }
        else {
            User.findById(req.user._id)
                .then(function (user) {
                    res.render("editProfile", {
                        editProfile: {
                            infoAboutUser: user.info,
                            imageUser: user.image,
                            facebookUser: user.facebook,
                            instagramUser: user.instagram,
                            youtubeUser: user.youtube,
                            visitedCountries: user.numberOfCountries,
                            twitterUser: user.twitter,
                            numberOfTrips:user.numberOfTrips
                        }
                    });
                }
                )
                .catch(function (err) {
                    res.redirect("/errorpage.html")
                })
        } 

    })
    .post(function (req, res) {
        if (!req.user) {
            return res.redirect('/login');
        }
        else if (req.user) {
            User.findById(req.user._id, function (err, findUser) {
                if (err) {
                    res.redirect('/errorpage.html');
                }
                else {
                    findUser.info= req.body.userInfo ;
                    findUser.image =req.body.userImage;
                    findUser.facebook=req.body.userFacebook;
                    findUser.instagram=req.body.userInstagram;
                    findUser.youtube=req.body.userYoutube;
                    findUser.numberOfCountries= req.body.visitedCountries;
                    findUser.twitter= req.body.userTwitter;
                    findUser.numberOfTrips= req.body.numberOfTrips;
                    findUser.save({}, function (err, savedUser) {
                        if (err) {
                            res.redirect('/errorpage.html');
                        }
                        else {
                            res.redirect('/home/' + req.user._id);
                        }
                    })
                }
            })
        }
    })
module.exports = router;