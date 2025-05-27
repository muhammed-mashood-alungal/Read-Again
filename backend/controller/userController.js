const Otp = require("../models/Otps");
const User = require("../models/Users");
const { hashPassword } = require("../utils/bcrypt");
const { generateToken } = require("../utils/jwt");
const transporter = require("../utils/nodemailer");
const bcrypt = require("bcrypt");
const Address = require("../models/Address");
const Wallet = require("../models/Wallet");
const Transactions = require("../models/WalletTransactions");
const { getAddressString } = require("../services/userServices");
const Coupon = require("../models/Coupon");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
module.exports = {
  async sendOTP(req, res) {
    try {
      const { email } = req.params;
      await Otp.deleteOne({ email: email });
      const digits = "0123456789";
      const otpLength = 6;
      let otp = "";

      for (let i = 1; i <= otpLength; i++) {
        let index = Math.floor(Math.random() * digits.length);
        otp = otp + digits[index];
      }
      const data = {
        otp: otp,
        email: email,
      };
      await Otp.create(data);
      await transporter.sendMail({
        from: "muhdmashoodalungal@gmail.com",
        to: email,
        subject: "OTP for Read Again ✔",
        html: `Hello your OTP for <b>Read Again</b> bookstore is <b>${otp}</b>.This will expires after 1 minute`,
      });

      res.status(StatusCodes.OK).json({ success: true });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });
    }
  },
  async verifyOTP(req, res) {
    try {
      const { otp } = req.body;
      const { email } = req.params;
      const doc = await Otp.findOne({ email: email });
      if (!doc) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ success: false, message: "OTP verification failed" });
      }
      if (doc.otp == otp) {
        return res.status(StatusCodes.OK).json({ success: true });
      } else {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ success: false, message: "OTP verification failed" });
      }
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "OTP verification failed" });
    }
  },
  async createUser(req, res) {
    try {
      const { email } = req.body.userData;
      const password = await hashPassword(req.body.userData.password);
      const user = await User.findOne({ email });
      let userData = {};
      let response;
      if (user) {
        userData = {
          ...user.toObject(),
          password: password,
        };
        response = await User.updateOne(
          { email },
          { $set: userData },
          { upsert: true }
        );
      } else {
        userData = {
          ...req.body.userData,
          email: req.body.userData?.email?.toLowerCase(),
          role: "USER",
          password: password,
        };
        response = await User.create(userData);
      }

      if (response) {
        delete userData.password;
        const token = await generateToken({
          id: response._id,
          role: userData.role,
        });
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          path: "/",
          domain:
            process.env.NODE_ENV === "production" ? ".mashood.site" : undefined,
          maxAge: 24 * 60 * 60 * 1000,
        });
        return res
          .status(StatusCodes.OK)
          .json({ success: true, userData, token });
      } else {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ success: false, message: ReasonPhrases.BAD_REQUEST });
      }
    } catch (err) {
      console.log(err);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
          success: false,
          message: err ? err : ReasonPhrases.INTERNAL_SERVER_ERROR,
        });
    }
  },
  async isEmailExist(req, res) {
    try {
      const { email } = req.params;
      const user = await User.findOne({ email });
      if (user && user?.password) {
        return res.status(StatusCodes.CONFLICT).json({ exist: true, user });
      } else {
        return res.status(StatusCodes.OK).json({ exist: false, user });
      }
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ exist: false, message: err });
    }
  },

  async verifyEmailExist(req, res) {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (user) {
      return res.status(StatusCodes.CONFLICT).json({ exist: true });
    } else {
      return res.status(StatusCodes.OK).json({ exist: false });
    }
  },
  async login(req, res) {
    try {
      const { email, password } = req.body.userData;
      const doc = await User.findOne({
        email: { $regex: new RegExp(`^${email}$`, "i") },
      });
      if (doc.isBlocked) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ success: false, message: "You are temporarily Banned" });
      }
      if (doc) {
        const isMatched = await bcrypt.compare(password, doc.password);
        if (isMatched) {
          const { password, ...userInfo } = doc;
          const token = await generateToken({ id: doc._id, role: doc.role });
          res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/",
            domain:
              process.env.NODE_ENV === "production"
                ? ".mashood.site"
                : undefined,
            maxAge: 24 * 60 * 60 * 1000,
          });
          return res
            .status(StatusCodes.OK)
            .json({ success: true, userInfo, token });
        }
      }
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: "Invalid Credential" });
    } catch (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  },
  async setNewPassword(req, res) {
    try {
      const { email } = req.params;
      const { password } = req.body;
      const hashed = await hashPassword(password);
      const userData = await User.updateOne(
        { email },
        {
          $set: {
            password: hashed,
          },
        },
        { new: true }
      );
      const token = await generateToken({
        id: userData._id,
        role: userData.role,
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
        domain:
          process.env.NODE_ENV === "production" ? ".mashood.site" : undefined,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.status(StatusCodes.OK).json({ success: true });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  },
  async changePassword(req, res) {
    try {
      const { currentPass, newPass } = req.body;
      const { email } = req.params;
      const userDoc = await User.findOne({ email: email });
      const isMatched = await bcrypt.compare(currentPass, userDoc.password);
      if (isMatched) {
        const hashed = await hashPassword(newPass);
        userDoc.password = hashed;
        userDoc.save();
        return res.status(StatusCodes.OK).json({ success: true });
      } else {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ success: false, message: "Current Password Doesn't Match" });
      }
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });
    }
  },
  async findOrCreateGoogleUser(profile) {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });
      if (user && user.isBlocked) {
        return { success: false, message: "Your account is banned." };
      }

      if (!user) {
        user = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          username: profile.displayName,
          role: "USER",
        });
        await user.save();
      } else if (!user.googleId) {
        user = await User.findOneAndUpdate(
          { email: profile.emails[0].value },
          { googleId: profile.id },
          { new: true }
        );
      }
      const token = await generateToken({ id: user._id, role: user.role });

      return { success: true, user, token };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
  async getUserData(req, res) {
    try {
      if (req.user) {
        res.status(StatusCodes.OK).json({ success: true, userData: req.user });
      }
      const { userId } = req.params;
      const userData = await User.findOne({ _id: userId });
      const addresses = await Address.find({ userId });

      const data = {
        ...userData.toObject(),
        addresses,
      };

      res.status(StatusCodes.OK).json({ success: true, userData: data });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, error: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  },
  async blockUser(req, res) {
    try {
      const { userId } = req.params;
      await User.updateOne(
        { _id: userId },
        {
          $set: {
            isBlocked: true,
          },
        }
      );
      res.status(StatusCodes.OK).json({ success: true });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      throw new Error(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  },
  async unBlockUser(req, res) {
    try {
      const { userId } = req.params;
      await User.updateOne(
        { _id: userId },
        {
          $set: {
            isBlocked: false,
          },
        }
      );
      res.status(StatusCodes.OK).json({ success: true });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      throw new Error(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
  },
  async verifyToken() {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Token is invalid" });
      }

      res.status(StatusCodes.OK).json({ message: "Token is valid" });
    });
  },
  logout(req, res) {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: false,
      });

      return res
        .status(StatusCodes.OK)
        .json({ message: "Logged out successfully" });
    } catch (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Logged out Failed !" });
    }
  },
  async editProfile(req, res) {
    try {
      let newData = {};
      const { userId } = req.params;
      let { email, username } = req.body;
      if (email) newData.email = email;
      await User.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            username: username,
            email: newData.email,
          },
        },
        { new: true }
      );

      res.status(StatusCodes.OK).json({ success: true });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });
    }
  },
  async createAddress(req, res) {
    try {
      const addressData = req.body;
      const { userId } = req.params;
      const addresses = await Address.find({ userId });
      let newAddress;
      if (addresses.length > 0) {
        for (let address of addresses) {
          const existingAddress = getAddressString(address);
          const newAdd = getAddressString(addressData);
          if (existingAddress == newAdd) {
            return res
              .status(StatusCodes.BAD_REQUEST)
              .json({ success: false, message: "Address Should be Unique" });
          }
        }
      }
      if (!addresses) {
        newAddress = await Address.create({
          ...addressData,
          userId,
          isDefault: true,
        });
      } else {
        newAddress = await Address.create({ ...addressData, userId });
      }
      res
        .status(StatusCodes.OK)
        .json({ success: true, newAddress: newAddress });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });
    }
  },
  async getAddress(req, res) {
    try {
      const { userId } = req.params;
      const addresses = Address.find({ userId: userId });
      res.status(StatusCodes.OK).json({ addresses });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        succes: false,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });
    }
  },
  async editAddress(req, res) {
    try {
      const address = req.body;
      const { addressId } = req.params;
      await Address.findOneAndUpdate(
        { _id: addressId },
        {
          $set: address,
        }
      );
      res.status(StatusCodes.OK).json({ success: true });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        succes: false,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });
    }
  },
  async deleteAddress(req, res) {
    try {
      const { addressId } = req.params;
      await Address.deleteOne({ _id: addressId });
      res.status(StatusCodes.OK).json({ success: true });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        succes: false,
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });
    }
  },
  async changeDefaultAddress(req, res) {
    try {
      const { userId } = req.params;
      const { addressId } = req.body;
      await Address.findOneAndUpdate(
        { userId, isDefault: true },
        { isDefault: false }
      );
      await Address.findOneAndUpdate({ _id: addressId }, { isDefault: true });
      res.status(StatusCodes.OK).json({ success: true });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  },
  async getUserWallet(req, res) {
    try {
      const { userId } = req.params;
      let wallet = await Wallet.findOne({ userId }).populate("userId");
      if (!wallet) {
        return res
          .status(StatusCodes.OK)
          .json({ success: true, wallet: { balance: 0, transactions: [] } });
      }
      const transactions = await Transactions.find({ walletId: wallet._id })
        .populate("associatedOrder")
        .sort({ createdAt: -1 });
      const walletData = wallet.toObject();
      walletData.transactions = transactions;
      res.status(StatusCodes.OK).json({ success: true, wallet: walletData });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ succes: false, message: ReasonPhrases.INTERNAL_SERVER_ERROR });
    }
  },
  async getAvailableCoupons(req, res) {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);
      const availableCoupons = await Coupon.find({
        _id: { $nin: [user.usedCoupons] },
        isActive: true,
      });
      res.status(StatusCodes.OK).json({ success: true, availableCoupons });
    } catch (err) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, availableCoupons: [] });
    }
  },
  async getUserWalletBalance(req, res) {
    try {
      const { userId } = req.params;
      const wallet = await Wallet.findOne({ userId });
      res
        .status(StatusCodes.OK)
        .json({ success: true, balance: wallet?.balance || 0 });
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ succes: false, message: error?.message });
    }
  },
};
