const mongo = require('mongoose');

const reviewschema = new mongo.Schema({
    bookId: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'book',
    },
    userId: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'user',
    },
    review: {
        type: String,
        required: true,
        unique:true
    },
    rating: {
        type: Number,
        required: false,
        default:0,
    }
   
}, { timestamps: true })


const review = new mongo.model("review", reviewschema);
module.exports = review;