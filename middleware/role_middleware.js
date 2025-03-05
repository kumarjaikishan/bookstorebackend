const roleMiddlware = (allowedRoles) => {

    return async (req, res, next) => {
        try {
            if (!req.usertype) {
                return res.status(401).json({ message: "No Role Found" });
            }
            if (!Array.isArray(allowedRoles)) {
                return res.status(500).json({ message: "Internal Server Error: Invalid role configuration" });
            }
            if (!allowedRoles.includes(req.usertype)) {
                return res.status(403).json({ message: "Access Denied! Insufficient privileges" });
            }
            next();
        } catch (error) {
            console.log(`Error in role Middleware: ${error}`);
            return  res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
module.exports = roleMiddlware