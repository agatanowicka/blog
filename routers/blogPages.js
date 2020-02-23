const express = require('express');
const router = express.Router();
const passport = require("passport");
const postModel = require("../models/post")
const User = require('../models/user');

router.get("/", function (req, res) {
    res.render("amazingTravel", {loginUser: req.user})
});

router.get( "/home", function (req, res) {
    postModel.find({}, function (err, foundPosts) {
        res.render("home", { allPosts: foundPosts, loginUser:req.user });
    })
});

router.get("/about", function (req, res) {
    res.render("about", {loginUser:req.user});
});

router.get("/contact", function (req, res) {
    res.render("contact", {loginUser:req.user});
});

router.get("/home/:id", function (req, res) {
    User.findOne({ _id: req.params.id }, function (err, foundPosts) {
        if (req.isAuthenticated()) {
            res.render("userHome",{ allPosts: foundPosts, loginUser:req.user});
        } else {
            res.redirect('/login');
        };
    });
});

router.get("/postDetails/:postTitle", function (req, res) {
    postModel.findOne({ title: req.params.postTitle }, function (err, postToView) {
        if (err) {
            return res.redirect('/errorpage.html');
        }
        if (!postToView) {
            return res.status(404).send();;
        }
        else {
            res.render("postDetails", {
                postTitle: postToView.title,
                postText: postToView.text,
                postImage: postToView.image,
                loginUser: req.user
            });
        }
    });
});

router.route("/postForm")
.get(function (req, res) {
    res.render("postForm", {loginUser:req.user});
})

.post( function (req, res) {
    var post = new postModel({
        title: req.body.title,
        text: req.body.text,
        image: req.body.image
    });
    post.save({}, function (err, savedPost) {
        if (err) {
            return res.redirect('/errorpage.html');
        }
        else {
            return res.redirect('/home');
        }
    });
});

router.get((req, res) => {
    res.redirect('/errorpage.html');
});

module.exports = router;