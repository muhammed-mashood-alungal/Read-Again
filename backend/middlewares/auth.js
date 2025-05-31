const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
module.exports = {
  async isAdmin(req, res, next) {
    try {
      console.log('Checking Is Admin')
      const token = req.cookies.token;
      console.log('token is'+ token)
      if (!token) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: ReasonPhrases.FORBIDDEN });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log('decoded =='+decoded)
      
      if (decoded.role == "ADMIN") {
        next();
      } else {
        res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: ReasonPhrases.FORBIDDEN });
      }
    } catch (err) {
      if (err) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: ReasonPhrases.UNAUTHORIZED });
      }
    }
  },
  async protect(req, res, next) {
    try {
        console.log('Checking Is User')
      const token = req.cookies.token;
      if (!token) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: ReasonPhrases.UNAUTHORIZED });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findOne({ _id: decoded.id });

      if (user?.isBlocked) {
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: ReasonPhrases.FORBIDDEN });
      }
      next();
    } catch (error) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ isLoggedIn: false, role: null });
    }
  },
};
