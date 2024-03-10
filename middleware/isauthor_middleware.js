const isauthor = async (req, res, next) => {
    try {
      if(req.usertype!="author"){
          return res.status(401).json({ message: "Access Denied! not Admin" });
      }
      next();
    } catch (error) {
      return next({ status: 500, message: error });
    }
  }
  
  module.exports = isauthor;