const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const mongoose = require('mongoose');
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
require('dotenv').config();

const User = require('./models/user');
const autorization = require("./routers/authorization");
const blogPages = require("./routers/blogPages");
const googleAuthorization = require("./routers/googleAuthorization");
const myEjsMiddleware = require("./middleware/myEjs");
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
app.use(blogPages);
app.use(autorization);
app.use(googleAuthorization);

mongoose.connect("mongodb://localhost:27017/blogDB", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('mongoose conected');
    })
    .catch((err) => {
        console.log(`mongoose connection error ${err}`);
    });
mongoose.set("useCreateIndex", true);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(3000, () => {
    console.log(`Server started on port 3000`);
})
