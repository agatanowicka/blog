const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const findOrCreate = require('mongoose-findorcreate');

const userSchema = new Schema({
    username: String,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    googleId: String,
    facebookId: String,
    idPosts:[{type:Schema.Types.ObjectId, ref:"post"}],
    idProfile:{type:Schema.Types.ObjectId, ref:"profile"}

});
 
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
module.exports = mongoose.model('user', userSchema);