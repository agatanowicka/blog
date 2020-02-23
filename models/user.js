const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
 
const userSchema = new Schema({
    username: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    googleId: String,
    facebookId: String
});
 
userSchema.plugin(passportLocalMongoose);
 
module.exports = mongoose.model('User', userSchema);