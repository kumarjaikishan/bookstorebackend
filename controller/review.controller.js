const book = require('../modals/book_schema')
const reviewschema = require('../modals/review_schema')

const bookreview= async(req,res,next)=>{
    const {id,rating,review}= req.body
    console.log("book review",req.body);

    try {
        const latestrating = await book.findOne({_id:id});
        // console.log(latestrating.Noofrating);
    
        const averageRating = ((latestrating.rating * latestrating.Noofrating) + parseInt(rating)) / (latestrating.Noofrating + 1).toFixed(1);
        console.log(averageRating);
        const updaterating = await book.findByIdAndUpdate({_id:id},{rating:averageRating,  $inc: { Noofrating: 1 } });
    
        const query = new reviewschema({bookId:id,userId:req.user._id,review,rating})
        const save = await query.save();

        res.status(201).json({
            message:'Review Submitted'
        })
    } catch (error) {
        console.log(error.message);
        return next({ status: 500, message: error });
    }

   
}
module.exports = {bookreview}