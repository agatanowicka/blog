const express = require('express');
const bodyParser = require("body-parser");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use('/static', express.static('public'));

var allPosts=[];

app.get("/", function (req, res) {
    console.log('get root');
    res.render("home", {allPosts:allPosts});
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.get("/contact", function (req, res) {
    res.render("contact");
});

app.get("/object", function (req, res) {
    console.log('get object');
    res.render("object");
});

app.post("/object", function (req, res) {
    console.log('post object');
    var newPost = {
        postTitle: req.body.title,
        postText: req.body.contents
    }
    allPosts.push(newPost);
    console.log(allPosts);
    res.redirect('/');
})

app.listen(3000, () => {
    console.log(`Server started on port 3000`);
});