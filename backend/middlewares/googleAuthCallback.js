// middlewares/authMiddleware.js
const passport = require('passport');

const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) {
      const errorMessage = encodeURIComponent('Authentication error occurred');
      return res.redirect(`http://localhost:3000/register?error=${errorMessage}`);
    }
    
    if (!user) {
      const errorMessage = encodeURIComponent(info?.message || 'Authentication failed');
      return res.redirect(`http://localhost:3000/register?error=${errorMessage}`);
    }

    return res.redirect('http://localhost:3000/');
    
  })(req, res, next);
};

module.exports = {
  googleAuthCallback
};