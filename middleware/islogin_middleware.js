const jwt = require('jsonwebtoken');

const islogin = async (req, res, next) => {
    const bearertoken = req.header('Authorization');

    if (!bearertoken) {
        return res.status(401).json({ message: "Unauthorized: Token not provided" });
    }

    try {
        const token = bearertoken.replace("Bearer", "").trim();
        const verified = jwt.verify(token, process.env.jwt_token);
       
        // console.log("islogin:",verified)
        
        req.userid = verified.userId;
        next();
    } catch (error) {
        console.error(error.message);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Unauthorized: Token expired" });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "invalid token" }); // Added condition for JsonWebTokenError
        } else {
            return res.status(500).json({ message: "Server error during authentication" });
        }
    }
};


module.exports = islogin;
