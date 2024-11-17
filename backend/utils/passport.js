const passport = require('passport');
const { findOrCreateGoogleUser } = require('../controller/userController');
const User = require('../models/Users');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
      const user = await User.findById(id);
      done(null, user);
  } catch (error) {
      done(error, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID, // Replace with your Google OAuth client ID
  clientSecret: process.env.CLIENT_SECRET, // Replace with your Google OAuth client secret
  callbackURL: '/api/users/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const response = await findOrCreateGoogleUser(profile);
    if (!response.success) {
      return done(null, false, { message: response.message });
    }
    done(null, response.user);
  } catch (error) {
    done(error, null);
  }

  }));

