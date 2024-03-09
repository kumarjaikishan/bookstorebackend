const book = require('../modals/book_schema');

const getbooks = async (req, res, next) => {
    try {
        const query = await book.find().sort({ cretedAt: -1 });
        if (!query) {
            return next({ status: 400, message: "Books not found" });
        }
        res.status(200).json({
            data: query
        })
    } catch (error) {
        console.log(error);
        return next({ status: 500, message: error });
    }
}
const getbook = async (req, res, next) => {
    const bookId = req.params.bookid;
    // console.log('Book ID:', bookId);
    if (bookId == "") {
        return next({ status: 400, message: "please send book ID" });
    }
    try {
        const query = await book.findOne({ bookId });
        if (!query) {
            return next({ status: 400, message: "Book Id is not Valid" });
        }
        res.status(200).json({
            data: query
        })
    } catch (error) {
        return next({ status: 500, message: error });
    }
}
const buybook = async (req, res, next) => {
    const bookId = req.params.bookid;
    // console.log('Book ID:', bookId);
    if (bookId == "") {
        return next({ status: 400, message: "please send book ID" });
    }
    try {
        const query = await book.findOne({ bookId });
        if (!query) {
            return next({ status: 400, message: "Book Id is not Valid" });
        }
        res.status(200).json({
            data: query
        })
    } catch (error) {
        return next({ status: 500, message: error });
    }
}


module.exports = { getbook, getbooks, buybook };