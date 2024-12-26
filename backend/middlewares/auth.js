const jwt = require('jsonwebtoken')
const User = require('../models/Users')
module.exports = {
    async isAdmin(req, res, next) {
        try {
            const token = req.cookies.token
            if (!token) {
                return res.status(401).json({ message: "Access Denied" })
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            if (decoded.role == "ADMIN") {
                next()
            } else {
                res.status(401).json({ message: "UnAuthorized dsfas" })
            }
        } catch (err) {
            console.log(err)
            if (err) {
                res.status(401).json({ message: "UnAuthorized" })
            }
        }
    },
    async protect(req, res, next) {
        try {
            const token = req.cookies.token
            if (!token) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            const user = await User.findOne({ _id: decoded.id })
             
            if (user?.isBlocked) {
                return res.status(403).json({ message: 'Blocked' });
            }
            next()
        } catch (error) {
            res.status(403).json({ isLoggedIn: false, role: null });
        }
    }
}
