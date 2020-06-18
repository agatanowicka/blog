const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();
const User = require('./models/user');
const Post = require('./models/post');

User.createStrategy();
mongoose.set("useCreateIndex", true);

const initDatabase_Users = async () => {
    const rawdata = fs.readFileSync('dataToMongoose/users.json');
    const users = JSON.parse(rawdata);
    const documents = users.map(user => {
        return new User(user);
    })
    return await User.insertMany(documents);
}
const initDatabase_Posts = async () => {
    const rawdata = fs.readFileSync('dataToMongoose/posts.json');
    const posts = JSON.parse(rawdata);
    const documents = posts.map(post => {
        return new Post(post);
    })
    return await Post.insertMany(documents);
}

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        return (
            initDatabase_Users(),
            initDatabase_Posts()
        )
    })
    .then(() => {
        console.log('database successfully init');
    })
    .catch((err) => {
        console.log(`mongoose error ${err}`);
    });


