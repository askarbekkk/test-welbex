const {Schema, model,} = require("mongoose")


const PostSchema =  new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },
    content: {type: String, required: true},
    title: String,
    boy: Schema.Types.ObjectId

})

module.exports = model("Post", PostSchema, "posts")