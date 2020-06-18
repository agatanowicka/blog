const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const fs = require('fs');
require('dotenv').config();


const User = require('./models/user');
const autorization = require("./routers/authorization");
const blogPages = require("./routers/blogPages");
const userProfile = require("./routers/addAndEditProfile")
const googleAuthorization = require("./routers/googleAuthorization");
const deleteAndEditPost= require("./routers/deleteAndEditPost");
const myEjsMiddleware = require("./middleware/myEjs");
const myUserMiddleware = require("./middleware/myUser");
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
app.use(myEjsMiddleware);
app.use(myUserMiddleware);
app.use(blogPages);
app.use(autorization);
app.use(googleAuthorization);
app.use(deleteAndEditPost);
app.use(userProfile);

mongoose.set("useCreateIndex", true);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('mongoose conected');
        app.listen(3000, () => {
            console.log(`Server started on port 3000`);
        })
    })
    .catch((err) => {
        console.log(`mongoose connection error ${err}`);
    });


