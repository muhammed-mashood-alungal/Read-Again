// middlewares/authMiddleware.js
const passport = require('passport');

const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', (err, data, info) => {
    if (err) {
      const errorMessage = encodeURIComponent('Authentication error occurred');
      return res.redirect(`https://www.mashood.site/register?error=${errorMessage}`);
    }
    const { user, token } = data;
    
    if (!user) {
      const errorMessage = encodeURIComponent(info?.message || 'Authentication failed');
      return res.redirect(`https://www.mashood.site/register?error=${errorMessage}`);
    }
    res.cookie('token', token, {
      httpOnly: true,
      secure: true
    })
    
    return res.redirect('https://www.mashood.site');
    
  })(req, res, next);
};

module.exports = {
  googleAuthCallback
};