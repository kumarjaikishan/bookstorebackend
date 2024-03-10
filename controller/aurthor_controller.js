const book = require('../modals/book_schema');
const purchase = require('../modals/purchase_schema');

const getAurthorBook = async (req, res, next) => {
    try {
        const query = await book.find({ creator: req.userid }).sort({createdAt: -1});
        const booksale = await purchase.find({authorId:req.userid}).sort({createdAt: -1}).populate({
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
            salerecord:booksale
        })
    } catch (error) {
        console.log(error);
        return next({ status: 500, message: error });
    }
}
const createAurthorBook = async (req, res, next) => {
    // console.log(req.body);
    const { book_title, author_name, price, description } = req.body
    if (book_title == "" || author_name == "" || price == "" || description == "") {
        return next({ status: 400, message: "All fields are Required" });
    }
    if (price > 1000 || price < 100) {
        return next({ status: 400, message: "Price must between 100 and 1000" });
    }
    const checkprevoius= await book.findOne().sort({createdAt:-1});
    // console.log(checkprevoius);
    let bookId="";
    if(!checkprevoius){
        bookId= 'book-1';
    }else{
        let lastBookNumber= parseInt(checkprevoius.bookId.split('-')[1])
        let latestnumber = lastBookNumber+ 1;
        bookId= "book-"+latestnumber;
    }

    let newtitle =  book_title.trim();
    let slug = newtitle.replaceAll(' ','')
    let slug2 = newtitle.replaceAll(' ','-')
    try {
        const newUser = new book({ creator: req.userid,bookId,slug_value:slug2 ,book_title:newtitle, author_name, price, description });
        const result = await newUser.save();

        return res.status(201).json({
            msg: "Book Created"
        })
    } catch (error) {
        console.log(error);
        return next({ status: 500, message: error });
    }
}

module.exports = { getAurthorBook, createAurthorBook };