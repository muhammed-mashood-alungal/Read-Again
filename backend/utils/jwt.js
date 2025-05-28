const jwt = require('jsonwebtoken')
const { ReasonPhrases } = require("http-status-codes");
const generateToken = async (userInfo) => {
    try {
        const token = jwt.sign(userInfo, process.env.JWT_SECRET_KEY, {
            expiresIn: '1d'
        })
        return token
    } catch (err) {
        throw new Error(ReasonPhrases.INTERNAL_SERVER_ERROR)
    }

}

const verifyToken = async (token) => {
    try {
        const verified = await jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (verified) {
            return { success: true }
        } else {
            return { success: false }
        }
    } catch (err) {
        throw new Error(ReasonPhrases.INTERNAL_SERVER_ERROR)
    }

}
module.exports = { generateToken, verifyToken }