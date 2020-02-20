const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use('/static', express.static('public'));

mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true })
    .then(() => {
        console.log('mongoose conected');
    })
    .catch((err) => {
        console.log(`mongoose connection error ${err}`);
    });

const postSchema = mongoose.Schema({
    image: String,
    title: String,
    text: String
});
const postModel = mongoose.model("post", postSchema);


app.get("/home", function (req, res) {
    postModel.find({}, function (err, foundPosts) {
        console.log(JSON.stringify(foundPosts));
        res.render("home", { allPosts: foundPosts });
    })
});
app.get("/", function (req, res) {
    res.render("amazingTravel");
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.get("/contact", function (req, res) {
    res.render("contact");
});

app.get("/postDetails/:postTitle", function (req, res) {
    console.log( 'postTitle' + req.params.postTitle);
    postModel.findOne({title: req.params.postTitle }, function (err, postToView) {
        if (err) {
            console.log(`error while processing`);
            return res.redirect('/errorpage.html');
        }
        if (!postToView) {
            console.log(`no post`);
            return res.status(404).send();;
        }
        else {
            res.render("postDetails", {
                postTitle: postToView.title,
                postText: postToView.text,
                postImage: postToView.image
            });
        }
    });
})

app.get("/postForm", function (req, res) {
        res.render("postForm");
});

app.post("/postForm", function (req, res) {
    var post = new postModel({
        title: req.body.title,
        text: req.body.text,
        image: req.body.image
    });
    post.save({}, function (err, savedPost) {
        if (err) {
            console.log(`error while processing`);
            return res.redirect('/errorpage.html');
        }
        else {
            console.log(`saved object with id: ${savedPost._id}`);
            return res.redirect('/home');
        }
    });
});

app.get((req, res) => {
     res.redirect('/errorpage.html');
});

app.listen(3000, () => {
    console.log(`Server started on port 3000`);
});