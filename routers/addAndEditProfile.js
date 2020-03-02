const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Profile = require("../models/profile")

router.route("/editProfile")
    .get(function (req, res) {
        console.log(req.user);
        if (!req.user) {
            return res.redirect('/login');
        }
        else if (req.user && req.user.idProfile) {
            Profile.findById(req.user.idProfile)
                .then(function (profile) {
                    res.render("editProfile", {
                        editProfile: {
                            infoAboutUser: profile.info,
                            imageUser: profile.image,
                            facebookUser: profile.facebook,
                            instagramUser: profile.instagram,
                            youtubeUser: profile.youtube,
                            emailUserrs: profile.email
                        }
                    });
                }
                )
                .catch(function (err) {
                    res.redirect("/errorpage.html")
                })
        } else {
            res.render("editProfile", {
                editProfile: {}
            });
        }

    })
    .post(function (req, res) {
        if (!req.user) {
            return res.redirect('/login');
        }
        else if (req.user.idProfile) {
            Profile.findById(req.user.idProfile, function (err, findProfile) {
                if (err) {
                    res.redirect('/errorpage.html');
                }
                else {
                    findProfile.info = req.body.userInfo;
                    findProfile.image = req.body.userImage;
                    findProfile.facebook = req.body.userFacebook;
                    findProfile.instagram = req.body.userInstagram;
                    findProfile.youtube = req.body.userYoutube;
                    findProfile.email = req.body.userEmail;
                    findProfile.save({}, function (err, savedProfile) {
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
        else {
            var profile = new Profile({
                info: req.body.userInfo,
                image: req.body.userImage,
                facebook: req.body.userFacebook,
                instagram: req.body.userInstagram,
                youtube: req.body.userYoutube,
                email: req.body.userEmail,
                user: req.user._id
            })
            console.log("new profile ")
            profile.save({}, function (err, savedProfile) {
                console.log("into save")
                if (err) {
                    return res.redirect('/errorpage.html');
                }
                else {

                    req.user.idProfile = savedProfile._id;
                    req.user.save({}, function (err) {
                        if (err) {
                            return res.redirect('/errorpage.html');
                        }
                        else {
                            console.log("saved profil in user ")
                            res.redirect(`/`);
                        }
                    })


                }

            }
            )

        }


    })
module.exports = router;