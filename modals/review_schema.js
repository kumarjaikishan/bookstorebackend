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
    bookId: {
        type: String,
        required: true,
        unique:true
    },
    review: {
        type: String,
        required: true,
        unique:true
    },
    rating: {
        type: string,
        required: false,
        default:'',
    },
    Noofrating: {
        type: Number,
        required: false,
        default:'',
    }
   
}, { timestamps: true })


const review = new mongo.model("review", reviewschema);
module.exports = review;