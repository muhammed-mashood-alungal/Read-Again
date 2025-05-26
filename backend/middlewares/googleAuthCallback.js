// middlewares/authMiddleware.js
const passport = require("passport");

const googleAuthCallback = (req, res, next) => {
  passport.authenticate("google", (err, data, info) => {
    if (err) {
      const errorMessage = encodeURIComponent("Authentication error occurred");
      return res.redirect(
        `${process.env.CLIENT_URL}/register?error=${errorMessage}`
      );
    }
    const { user, token } = data;

    if (!user) {
      const errorMessage = encodeURIComponent(
        info?.message || "Authentication failed"
      );
      return res.redirect(
        `${process.env.CLIENT_URL}/register?error=${errorMessage}`
      );
    }
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      domain: process.env.NODE_ENV === "production" ? ".mashood.site" : undefined,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.redirect(`${process.env.CLIENT_URL}`);
  })(req, res, next);
};

module.exports = {
  googleAuthCallback,
};
