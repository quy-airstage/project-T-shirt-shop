const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        // console.log(token);
        // console.log(decoded);
        if (decoded.role === 2) {
            // Allow access for role 2
            req.userData = decoded;
            next();
        } else {
            // Deny access for other roles
            return res.status(401).json({
                message: 'Không đủ quyền hạn. '
            });
        }
    } catch (error) {
        return res.status(401).json({
            message: 'Có lỗi xảy ra.'+error
        });
    }
};