const mongoose = require("mongoose");
const Schema=mongoose.Schema;
const messageSchema = Schema({
    emitter:{
        type:Schema.ObjectId,
        ref:"User"
    },
    receiver:{
        type:Schema.ObjectId,
        ref:"User"
    },
    text:String,
    created_at:String
});

module.exports = mongoose.model("Message",messageSchema);