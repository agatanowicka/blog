const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require("passport");
const possportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const Schema = mongoose.Schema;


var User = require('./models/user');
User.createStrategy();

passport.use(new LocalStrategy(User.authenticate()));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use('/static', express.static('public'));

app.use(session({
    secret: process.env.PASSPORT_LOCAL_SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true,useUnifiedTopology: true })
    .then(() => {
        console.log('mongoose conected');
    })
    .catch((err) => {
        console.log(`mongoose connection error ${err}`);
    });
mongoose.set("useCreateIndex", true);

const postSchema = mongoose.Schema({
    image: String,
    title: String,
    text: String
});
const postModel = new mongoose.model("post", postSchema);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passport.serializeUser(function (User, done) {
//     done(null, User.id);
// });

// passport.deserializeUser(function (id, done) {
//     UserModel.findById(id, function (err, User) {
//         done(err, User);
//     });
// });

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

app.get("/auth/google", function (req, res) {
    passport.authenticate('google', { scope: ["profile"] })
});

app.get("/auth/google/blog",
    passport.authenticate("google", { failureRedirect: "/login" }),
    function (req, res) {
        res.redirect('/home/:id');
    });

app.get("/login", function (req, res) {
    res.render("login");
});

app.post("/login", function (req, res) {
    const user = new UserModel({
        email: req.body.email,
        password: req.body.password
    })
    req.login(user, function (err) {
        if (err) {
            res.redirect('/login');
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect('/home/:id');
            });
        }
    });
});

app.get("/logout", function (req, res) {
    res.logout();
    res.redirect('/');
});

app.get("/home/:id", function (req, res) {
    userModel.findOne({ _id: req.params._id }, function () {
        if (req.isAuthenticated()) {
            res.render("userHome");
        } else {
            res.redirect('/login');
        };
    });
});

app.get("/signUp", function (req, res) {
    console.log('singup get');
    res.render("signUp");
});

app.post("/signUp", function (req, res) {
    console.log('singup post');
    const passportUser = new User({ firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, username: req.body.email })
    User.register(passportUser, req.body.password, function (err, user) {
        if (err) {
            console.log(' err singup post' + err);
            res.redirect('/signUp');
            
        }
        else {
            passport.authenticate("local")(req, res, function () {
                res.redirect('/login');
                console.log(' succesfully singup post');
            })
        };
    });
})

app.get("/postDetails/:postTitle", function (req, res) {
    console.log('postTitle' + req.params.postTitle);
    postModel.findOne({ title: req.params.postTitle }, function (err, postToView) {
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
})
