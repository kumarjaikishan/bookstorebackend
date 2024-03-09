const mongo = require('mongoose');

const purchaseSchema = new mongo.Schema({
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


const purchase = new mongo.model("purchase", purchaseSchema);
module.exports = purchase;