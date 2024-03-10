const user = require('../modals/user_schema')

const getusers = async (req, res, next) => {
    // console.log("yaha to aaya");
    try {
        const query = await user.find().sort({createdAt:-1})
        if (!query) {
            return next({ status: 400, message: "No user found" });
        }
        res.status(200).json({
           data:query
        })
    } catch (error) {
        return next({ status: 500, message: error });
    }
}
const edituser = async (req, res, next) => {
    const {id,name,type,verified}= req.body;
    try {
        const query = await user.findByIdAndUpdate({_id:id},{name,user_type:type,isverified:verified})
        if (!query) {
            return next({ status: 400, message: "Not Updated" });
        }
        res.status(200).json({
           message:"User Updated"
        })
    } catch (error) {
        return next({ status: 500, message: error });
    }
}

module.exports = {getusers,edituser};