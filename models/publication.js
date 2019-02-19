const mongoose = require("mongoose");
const Schema=mongoose.Schema;
const publicationSchema = Schema({
    text:String,
    file:String,
    created_at:String,
    user:{
        type:Schema.ObjectId,
        ref:"User"
    }
});

module.exports = mongoose.model("Publication",publicationSchema);