const express = require('express');
const router = express.Router();
const postModel = require("../models/post")
const User = require('../models/user');

router.get("/", function (req, res) {
    res.render("amazingTravel")
});

router.get("/home", function (req, res) {
    postModel.find({}, function (err, foundPosts) {
        res.render("home", { allPosts: foundPosts });
    })
});

router.get("/about", function (req, res) {
    res.render("about");
});

router.get("/contact", function (req, res) {
    res.render("contact");
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

router.post("/postDelete/:postId", function (req, res) {
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

router.post("/postEdit/:postId", function (req, res) {
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