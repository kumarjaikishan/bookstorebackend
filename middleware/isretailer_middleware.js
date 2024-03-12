const isretailer = async (req, res, next) => {
    try {
      if(req.usertype!="retailer"){
          return res.status(401).json({ message: "you must be Retailer user" });
      }
      next();
    } catch (error) {
      return next({ status: 500, message: error });
    }
  }
  
  module.exports = isretailer;