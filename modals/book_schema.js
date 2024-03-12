const mongo = require('mongoose');

const bookschema = new mongo.Schema({
    creator: {
        type: mongo.Schema.Types.ObjectId,
        ref: 'user',
    },
    bookId: {
        type: String,
        required: true,
        unique:true
    },
    book_title: {
        type: String,
        required: true,
        unique:true
    },
    author_name: {
        type: String,
        required: true,
    },
    slug_value: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
        default:''
    },
    price:{
        type: Number,
        required: true,
    },
    rating:{
        type: Number,
        required: false,
        default:0
    },
    Noofrating: {
        type: Number,
        required: false,
        default:0,
    },
    sellCount:{
        type: Number,
        required: false,
        default:0
    }
   
}, { timestamps: true })


const Book = new mongo.model("book", bookschema);
module.exports = Book;