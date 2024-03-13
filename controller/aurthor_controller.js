const book = require('../modals/book_schema');
const purchase = require('../modals/purchase_schema');
const users = require('../modals/user_schema');
const moment = require('moment');
const sendmail = require('../utils/sendemail')
const bookreleasemail = require('../utils/bookreleasemail');
const addJobToQueue = require('../utils/producer');

const getAurthorBook = async (req, res, next) => {
    try {
        const query = await book.find({ creator: req.userid }).sort({ createdAt: -1 });
        const booksale = await purchase.find({ authorId: req.userid }).sort({ purchaseId: -1 }).populate({
            path: 'buyerId',
            select: 'name'
        }).populate({
            path: 'bookId',
            select: 'book_title'
        })
        if (!query) {
            return next({ status: 400, message: "Books not found" });
        }
        res.status(200).json({
            data: query,
            salerecord: booksale
        })
    } catch (error) {
        console.log(error);
        return next({ status: 500, message: error });
    }
}
const createAurthorBook = async (req, res, next) => {
    // console.log(req.body);
    let { book_title, author_name, price, description } = req.body
    if (book_title == "" || author_name == "" || price == "" || description == "") {
        return next({ status: 400, message: "All fields are Required" });
    }
    if (price > 1000 || price < 100) {
        return next({ status: 400, message: "Price must between 100 and 1000" });
    }
    book_title = book_title.replace(/\s+/g, ' ').trim().toLowerCase();
    //  console.log(book_title);
    try {
        const checkbooktitle = await book.findOne({ book_title })
        // console.log(checkbooktitle);
        if (checkbooktitle) {
            return next({ status: 400, message: "Book Title Already Exists" });
        }
        const checkprevoius = await book.findOne().sort({ createdAt: -1 });
        // console.log(checkprevoius);
        let bookId = "";
        if (!checkprevoius) {
            bookId = 'book-1';
        } else {
            let lastBookNumber = parseInt(checkprevoius.bookId.split('-')[1])
            let latestnumber = lastBookNumber + 1;
            bookId = "book-" + latestnumber;
        }

        let newtitle = book_title;
        let slug = newtitle.replaceAll(' ', '')
        let slug2 = newtitle.replaceAll(' ', '-')

        const newBook = new book({ creator: req.userid, bookId, slug_value: slug2, book_title: newtitle, author_name, price, description });
        const result = await newBook.save();

        if (result) {
            let allemails = [];
            const usermail = await users.find({ user_type: 'retail' }, { email: 1, name: 1 });
            usermail.map((val) => {
                allemails.push(val.email);
            })
            // console.log(allemails);
            
            if (allemails.length > 0) {
                for (let i = 0; i < allemails.length; i++) {
                    const message = `Dear ${usermail[i].name}, A new book -${book_title}, has been Published, book Author- ${author_name}`;
                    bookreleasemail(allemails[i], message);
                }
            }
        }

        return res.status(201).json({
            msg: "Book Created"
        })
    } catch (error) {
        console.log(error);
        return next({ status: 500, message: error });
    }
}

const revenuedetail = async (req, res, next) => {
    const query = await purchase.find({ authorId: req.userid });
    // console.log(query);

    let currentmonth = 0;
    let currentyear = 0;
    let total = 0

    // Get the current date
    const currentDate = moment();
    const currentDate2 = moment();
    const currentDate3 = moment();
    const currentDate4 = moment();

    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate2.endOf('month');
    const startOfYear = currentDate3.startOf('year');
    const endOfYear = currentDate4.endOf('year');

    // Format the dates if needed
    const formattedStartOfMonth = startOfMonth.format('YYYY-MM-DD');
    const formattedEndOfMonth = endOfMonth.format('YYYY-MM-DD');
    const formattedstartofyear = startOfYear.format('YYYY-MM-DD');
    const formattedEndofyear = endOfYear.format('YYYY-MM-DD');

    // console.log('Start of the current month:', formattedStartOfMonth);
    // console.log('End of the current month:', formattedEndOfMonth);
    // console.log('start of the current year:', formattedstartofyear);
    // console.log('End of the current year:', formattedEndofyear);

    query.map((val, ind) => {
        if (val.purchaseDate >= formattedStartOfMonth && val.purchaseDate <= formattedEndOfMonth) {
            currentmonth += val.price
        }
        if (val.purchaseDate >= formattedstartofyear && val.purchaseDate <= formattedEndofyear) {
            currentyear += val.price
        }
        total += val.price;
        return val;
    })
    const message = `Dear Author ${req.user.name}, your this month sale is - Rs.${currentmonth}.00 , this year sale is -
     Rs.${currentyear}.00 and the Total sale is -Rs.${total}.00 till now, `

    // console.log(currentmonth, currentyear, total);
    try {
        // await sendmail(req.user.email, message);
        await addJobToQueue(req.user.email,'Sale Stats bull || BookStore',message)
        return res.status(200).json({
            message: "Stat Email sent"
        })
    } catch (error) {
        console.log(error);
        return next({ status: 500, message: error });
    }

}
const sellhistory = async (req, res, next) => {
    //   console.log(req.userid);
    try {
        const booksale = await purchase.find({ authorId: req.userid }).sort({ purchaseId: -1 }).populate({
            path: 'buyerId',
            select: 'name'
        }).populate({
            path: 'bookId',
            select: 'book_title rating'
        })

        res.status(200).json({
            data: booksale
        })
    } catch (error) {

    }
}

module.exports = { sellhistory, revenuedetail, getAurthorBook, createAurthorBook };