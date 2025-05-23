const book = require('../modals/book_schema');
const purchase = require('../modals/purchase_schema');
const mongoose = require('mongoose');
const sendmail = require('../utils/sendemail');
const review = require('../modals/review_schema')
const revenuedetail = require('../utils/stat_email');
const addJobToQueue = require('../utils/producer');
const worker = require('../utils/worker');
const qr = require('qrcode');

const test = async (req, res, next) => {
    console.log("aaya");
    try {
        // for (let i = 0; i < 6; i++) {
        //     let test ="this is "+ i+ ' th email'
        //     await addJobToQueue('kumar.jaikishan0@gmail.com', test, 'hi');
        // }
        const stringData = JSON.stringify('');
        qr.toString('upi://pay?pa=battlefiesta0@ybl&pn=BATTLE FIESTA&am=299&tn=BattleFiesta-1 Week plan&cu=INR', { type: 'terminal' }, function (err, code) {
            if (err) return console.log(err);
            console.log(code);
        })
    } catch (error) {

    }
}

const getbooks = async (req, res, next) => {
    try {
        console.log(req.userid);

        let query = await book.find().sort({ createdAt: -1 }); // Fix typo in `createdAt`

        if (!query || query.length === 0) {
            return next({ status: 400, message: "Books not found" });
        }

        if (!req.userid) {
            // If no user ID is provided, return all books as usual
            return res.status(200).json({ data: query });
        }

        // Fetch books the user has purchased
        const bookPurchased = await purchase.find({ buyerId: req.userid }).select('bookId');
        const purchasedBookIds = new Set(bookPurchased.map((val) => val.bookId.toString())); // Use Set for fast lookup

        // Add purchase status to each book
        const booksWithStatus = query.map((book) => {
            let bookObj = book.toObject(); // Convert Mongoose doc to plain object
            bookObj.purchased = purchasedBookIds.has(book._id.toString()); // Check if purchased
            return bookObj;
        });

        res.status(200).json({ data: booksWithStatus });

    } catch (error) {
        console.error("Error fetching books:", error);
        return next({ status: 500, message: "Internal Server Error" });
    }
};


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
const bookdetail = async (req, res, next) => {
    const bookId = req.params.bookid;
    // console.log('Book ID:', bookId);
    if (bookId == "") {
        return next({ status: 400, message: "please send book ID" });
    }
    try {
        const query = await book.findOne({ slug_value: bookId });
        const rev = await review.find({ bookId: query._id }).sort({ createdAt: -1 }).populate({
            path: 'userId',
            select: 'name'
        })
        if (!query) {
            return next({ status: 400, message: "Book not Found" });
        }
        if (!req.userid) {
            return res.status(200).json({
                data: query,
                reviews: rev
            })
        }
        const bookPurchased = await purchase.find({ buyerId: req.userid, bookId: query._id }).select('bookId');
        // console.log(bookPurchased)
        let editstats = query.toObject();
        editstats.purchased = bookPurchased.length > 0;
        return res.status(200).json({
            data: editstats,
            reviews: rev
        })
    } catch (error) {
        return next({ status: 500, message: error });
    }
}
const buybooks = async (req, res, next) => {
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
const deletebook = async (req, res, next) => {
    const bookId = req.body.id;
    // console.log('Book ID:', bookId);
    if (bookId == "") {
        return next({ status: 400, message: "please send book ID" });
    }
    try {
        const query = await book.findByIdAndDelete({ _id: bookId });
        if (!query) {
            return next({ status: 400, message: "Book Id is not Valid" });
        }
        res.status(200).json({
            message: 'Book Deleted Successfully'
        })
    } catch (error) {
        return next({ status: 500, message: error });
    }
}

const getpurchasebook = async (req, res, next) => {
    try {
        const query = await purchase.find({ buyerId: req.userid }).sort({ purchaseDate: -1 }).populate({
            path: 'bookId',
            select: 'book_title author_name slug_value rating' // Specify the fields you want to select from the 'User' model
        });
        if (!query) {
            return next({ status: 400, message: "No purchase found" });
        }
        res.status(200).json({
            data: query
        })
    } catch (error) {
        return next({ status: 500, message: error });
    }
}

const buybook = async (req, res, next) => {
    // console.log("simple buybook me")
    const bookId = req.params.bookid;
    const coupon = req.body.coupon;
    const buydate = req.body.date;

    const date = new Date(buydate);
    let buyyear = date.getFullYear().toString();
    let buymonth = String(date.getMonth() + 1).padStart(2, '0');

    // console.log(buydate);
    if (bookId == "") {
        return next({ status: 400, message: "please send book ID" });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const latestpurchase = await purchase.findOne({ purchaseId: { $regex: `${buyyear}-${buymonth}-\\d+` } })
            .sort({ purchaseId: -1 })
            .limit(1)
            .session(session);

        const bookselected = await book.findOne({ bookId }).populate({
            path: 'creator',
            select: 'name email'
        }).session(session); // to findout book price
        const finalprice = bookselected.price;
        const bookObjectIdId = bookselected._id

        if (coupon != "") {
            const coupon = await coupon.findOne({ coupon }).session(session); // checking and coupon applied
            finalprice = bookselected.price - coupon.amount;
        }

        let increment = 1;
        if (latestpurchase) {
            const latestCounter = parseInt(latestpurchase.purchaseId.split('-')[2]);
            increment = latestCounter + 1;
        }
        const purchaseId = `${buyyear}-${buymonth}-${increment}`;
        // console.log("purchase iD",purchaseId);

        const newPurchase = new purchase({ authorId: bookselected.creator, bookId: bookObjectIdId, purchaseDate: buydate, bookUniqueId: bookId, buyerId: req.userid, purchaseId, price: finalprice });
        const result = await newPurchase.save({ session });


       const incrementhua= await book.findOneAndUpdate({ bookId }, { $inc: { sellCount: 1 } }, { session }) 
    //    console.log("incrementhua :",incrementhua)

        await session.commitTransaction();
        session.endSession();

        const message = `Hey ${bookselected.creator.name}, recently your book-${bookselected.book_title} is purchased by ${req.user.name} for Rs.${finalprice}`

        // addJobToQueue(bookselected.creator.email, "Sale Notification || BookStore", message)

        return res.status(201).json({
            message: "Book Buy Successfully"
        })

    } catch (error) {
        console.log(error.message);

        await session.abortTransaction();
        session.endSession();

        return next({ status: 500, message: error });
    }
}


module.exports = { test, deletebook, bookdetail, getpurchasebook, getbook, getbooks, buybooks, buybook };