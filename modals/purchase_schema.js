const mongo = require('mongoose');

const purchaseSchema = new mongo.Schema({
    buyerId: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'user',
        required:true
    },
    authorId: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'user',
        required:true
    },
    bookId: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'book',
        required:true
    },
    bookUniqueId: {
        type: String,
        required: true,
    },
    purchaseId: {
        type: String,
        required: false,
        default:'',
        unique:true
    },
    purchaseDate: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: false,
        default:'',
    }
   
}, { timestamps: true })


const purchase = new mongo.model("purchase", purchaseSchema);
module.exports = purchase;