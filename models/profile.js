const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = mongoose.Schema({
    info: String,
    image: String,
    facebook: String, 
    instagram: String,
    youtube:String,
    email:String,
    user:{type: Schema.Types.ObjectId, ref: "user"}
});

module.exports = mongoose.model("profile", profileSchema);