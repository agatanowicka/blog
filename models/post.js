const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = mongoose.Schema({
    image: String,
    title: String,
    text: String, 
    autor:{type: Schema.Types.ObjectId, ref: "user"}
});

module.exports = mongoose.model("post", postSchema);