const express = require('express');
const router = express.Router();
const postModel = require("../models/post")
const User = require('../models/user');

router.get("/postDelete/:postId", function (req, res) {
    if (!req.user) {
        return res.redirect('/login');
    }
    User.findById(req.user)
        .then(function (user) {
            for (let i = 0; i < user.idPosts.length; i++) {
                if (user.idPosts[i].toString() === req.params.postId.toString()) {
                    user.idPosts.splice(i, 1);
                    return user.save({});
                }
            }
            return Promise.reject('error');
        })
        .then(function (user) {
            return postModel.findOneAndDelete({ _id: req.params.postId });

        })
        .then(function (post) {
            return res.redirect(`/`);
        })
        .catch(function (err) {
            return res.redirect('/errorpage.html');
        });
});

router.get("/postEdit/:postId", function (req, res) {
    if (!req.user) {
        return res.redirect('/login');
    }
    User.findOne({ _id: req.user._id, idPosts: req.params.postId })
        .then(function (user) {
            if (user) {
                return postModel.findById(req.params.postId);
            } else {
                return res.redirect('/login');
            }
        })
        .then(function (post) {
            console.log(post);
            res.render("postForm", {
                editPost: {
                    title: post.title,
                    text: post.text,
                    image: post.image,
                    id: post._id
                }
            });
        })
        .catch(function (err) {
            console.log(err);
            res.redirect('/errorpage.html');
        })
})

router.post("/postForm/:editPostId", function (req, res) {
    if (!req.user) {
        return res.redirect('/login');
    }
    User.findOne({ _id: req.user._id, idPosts: req.params.editPostId })
        .then(function (user) {
            if (user) {
                return postModel.findById(req.params.editPostId);
            } else {
                return res.redirect('/login');
            }
        })
        .then(function (post) {
            post.title = req.body.title;
            post.text = req.body.text;
            post.image = req.body.image;
            return post.save();
        })
        .then(function (editedPost) {
            res.redirect(`/`);
        })
        .catch(function (err) {
            res.redirect('/errorpage.html');
        })
})

module.exports = router;