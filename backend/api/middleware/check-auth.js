const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log("Token:", token); 

        if (global.tokenBlacklist.includes(token)) {
            return res.status(401).json({
                message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch (error) {
        console.error("Authentication error:", error); 
        return res.status(401).json({
            message: 'Vui lòng đăng nhập.'
        });
    }
};

