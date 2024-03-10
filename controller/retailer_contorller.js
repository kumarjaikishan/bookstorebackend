const book = require('../modals/book_schema');
const purchase = require('../modals/purchase_schema');

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
        const query = await book.findByIdAndDelete({ _id:bookId });
        if (!query) {
            return next({ status: 400, message: "Book Id is not Valid" });
        }
        res.status(200).json({
           message:'Book Deleted Successfully'
        })
    } catch (error) {
        return next({ status: 500, message: error });
    }
}

const getpurchasebook = async (req, res, next) => {
    try {
        const query = await purchase.find({ buyerId:req.userid}).sort({purchaseDate:-1}).populate({
            path: 'bookId', 
            select: 'book_title author_name slug_value' // Specify the fields you want to select from the 'User' model
        });
        if (!query) {
            return next({ status: 400, message: "No purchase found" });
        }
        res.status(200).json({
           data:query
        })
    } catch (error) {
        return next({ status: 500, message: error });
    }
}

const buybook = async (req, res, next) => {
    const bookId = req.params.bookid;
    const coupon = req.body.coupon;
    const buydate = req.body.date;
    // console.log(buydate);
    if (bookId == "") {
        return next({ status: 400, message: "please send book ID" });
    }


    try {
        const lastPurchase = await purchase.findOne().sort({ createdAt: -1 }); //to findout last unique ID
        const bookselected = await book.findOne({ bookId }); // to findout book price
        const finalprice = bookselected.price;
        const bookObjectIdId= bookselected._id


        if (coupon != "") {
            const coupon = await coupon.findOne({ coupon }); // checking and coupon applied
            finalprice = bookselected.price - coupon.amount;
        }

        if (lastPurchase) {
            let purchaseID = GeneratePurchaseId(lastPurchase.purchaseId,buydate);
            const newPurchase = new purchase({authorId:bookselected.creator ,bookId:bookObjectIdId,purchaseDate:buydate, bookUniqueId:bookId, buyerId: req.userid, purchaseId: purchaseID, price: finalprice });
            const result = await newPurchase.save();
        } else {
            let firstId = currentyearandmonth(buydate);
            const newPurchase = new purchase({authorId:bookselected.creator ,bookId:bookObjectIdId,purchaseDate:buydate,bookUniqueId:bookId, buyerId: req.userid, purchaseId: firstId, price: finalprice });
            const result = await newPurchase.save();
        }

        await book.findOneAndUpdate({ bookId },{sellCount :bookselected.sellCount + 1 }) // updating sellcount
        return res.status(201).json({
            message: "Book Buy Successfully"
        })

    } catch (error) {
        console.log(error.message);
        return next({ status: 500, message: error });
    }
}
const GeneratePurchaseId = (lastPurchaseId,buydate) => {
    let purchaseId = '';
    let splite = lastPurchaseId.split('-');
    let lastno = splite[2];
    let lastdate = splite[0] + '-' + splite[1]; // findout last purchase year and month

    // const date = new Date(); // use this for auto pick today date
    const date = new Date(buydate);
    let currentyear = date.getFullYear().toString();
    let currentmonth = pad(date.getMonth() + 1);
    let currentdate = currentyear + '-' + currentmonth; // getting present year and month

    if (lastdate == currentdate) {
        purchaseId = lastdate + '-' + (parseInt(lastno) + 1); //updating if purchase made in sam year and month
    } else {
        purchaseId = currentdate + "-1"; // updating if purcahse made in different year or month
    }
    // console.log(purchaseId);
    return purchaseId;
}
const currentyearandmonth = (customdate) => {
    const date = new Date();
    let currentyear = date.getFullYear().toString();
    let currentmonth = pad(date.getMonth() + 1);
    let currentdate = currentyear + '-' + currentmonth + '-1';
    // console.log(currentdate);
    return currentdate;
}
const pad = (num) => {
    num = num.toString();
    if (num.length < 2) {
        return "0" + num;
    } else {
        return num;
    }
}


module.exports = {deletebook,getpurchasebook, getbook, getbooks, buybooks, buybook };