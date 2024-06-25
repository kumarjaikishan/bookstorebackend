const Razorpay = require('razorpay');
const book = require('../modals/book_schema');
const purchase = require('../modals/purchase_schema');

const createorder = async (req, res, next) => {
    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        
        if (!req.body) {
            return res.status(400).json({ message: 'Bad request' });
        }
        
        const options = req.body;
        const order = await razorpay.orders.create(options);
        
        if (!order) {
            return next({ status: 400, message: "Order not created" });
        }

        return res.status(200).json(order);
    } catch (error) {
        return next({ status: 500, message: error });
    }
};

const purchesed = async (req, res, next) => {
    console.log('body',req.body);
    const { bookId, objectid, order_id, payment_id, date } = req.body;

    const datee = new Date(date);
    let buyyear = datee.getFullYear().toString();
    let buymonth = String(datee.getMonth() + 1).padStart(2, '0');

    try {
        const latestpurchase = await purchase.findOne({ purchaseId: { $regex: `${buyyear}-${buymonth}-\\d+` } })
            .sort({ purchaseId: -1 })
            .limit(1);

        const bookselected = await book.findOne({ bookId }).populate({
            path: 'creator',
            select: 'name email'
        });

        let increment = 1;
        if (latestpurchase) {
            const latestCounter = parseInt(latestpurchase.purchaseId.split('-')[2]);
            increment = latestCounter + 1;
        }
        const purchaseId = `${buyyear}-${buymonth}-${increment}`;

        const newPurchase = new purchase({
            authorId: bookselected.creator,
            order_id,
            payment_id,
            bookId: bookselected._id,
            purchaseDate: date,
            bookUniqueId: bookId,
            buyerId: req.userid,
            purchaseId,
            price: bookselected.price
        });
        const result = await newPurchase.save();

        return res.status(200).json(result);
    } catch (error) {
        return next({ status: 500, message: error });
    }
};

module.exports = { createorder, purchesed };
