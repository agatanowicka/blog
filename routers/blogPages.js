const express = require('express');
const router = express.Router();
const postModel = require("../models/post")
const User = require('../models/user');

router.get("/", function (req, res) {
    res.render("amazingTravel")
});

router.get("/home", function (req, res) {
    User.find({}, function (err, foundUsers) {
        res.render("home", { allUsers: foundUsers });
    })
});

router.get("/home/:id", function (req, res) {
    User.findById(req.params.id)
        .populate('idPosts')
        .exec(function (err, user) {
            console.log(user);
            if (err) {
                return res.redirect('/errorpage.html');
            }
            else {
                return res.render('userHome', {
                    allPosts: user.idPosts
                });
            }
        })

});

router.get("/postDetails/:postId", function (req, res) {
    postModel.findById(req.params.postId, function (err, postToView) {
        if (err) {
            return res.redirect('/errorpage.html');
        }
        if (!postToView) {
            return res.status(404).send();;
        }
        else {
            let isOwner = false;
            if (req.user) {
                for (let i = 0; i < req.user.idPosts.length; i++) {
                    if (req.user.idPosts[i].toString() === req.params.postId) {
                        isOwner = true;
                    }
                }
            }
            res.render("postDetails", {
                postTitle: postToView.title,
                postText: postToView.text,
                postImage: postToView.image,
                postId: postToView._id,
                isOwner: isOwner
            });
        }
    });
});

router.route("/postForm")
    .get(function (req, res) {
        res.render("postForm", {
            editPost: false
        });
    })

    .post(function (req, res) {
        var post = new postModel({
            title: req.body.title,
            text: req.body.text,
            image: req.body.image,
            autor: req.user._id
        });
        post.save({}, function (err, savedPost) {
            if (err) {
                return res.redirect('/errorpage.html');
            }
            else {
                User
                    .findById(req.user._id, function (err, user) {
                        if (err) {
                            return res.redirect('/errorpage.html');
                        }
                        else {
                            user.idPosts.push(savedPost._id);
                            user.save({}, function (err, updatedUser) {
                                if (err) {
                                    return res.redirect('/errorpage.html');
                                }
                                else {
                                    res.redirect(`/home/${updatedUser._id}`);
                                }
                            })
                        }
                    })
            }
        });

    }
    );

router.get((req, res) => {
    res.redirect('/errorpage.html');
});



module.exports = router;