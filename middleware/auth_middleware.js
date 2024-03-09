const jwt = require('jsonwebtoken');
const User = require('../modals/user_schema'); // Import your User model

const authmiddleware = async (req, res, next) => {
    const bearertoken = req.header('Authorization');

    if (!bearertoken) {
        return res.status(401).json({ message: "Unauthorized: Token not provided" });
    }

    try {
        const token = bearertoken.replace("Bearer", "").trim();
        const verified = jwt.verify(token, process.env.jwt_token);
        if (!verified) {
            return res.status(401).json({ message: "invalid token" }); // Corrected message
        }
        const userdata = await User.findOne({ email: verified.email }).select({ password: 0 });
        if (!userdata) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }
        
        req.user = userdata;
        req.userid = userdata._id.toString();
        req.token = token;
        req.usertype = userdata.user_type;
        next();
    } catch (error) {
        console.error(error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Unauthorized: Token expired" });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "invalid token" }); // Added condition for JsonWebTokenError
        } else {
            return res.status(500).json({ message: "Server error during authentication" });
        }
    }
};


module.exports = authmiddleware;
