const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const GOOGLE_CLIENT_ID = '1010519177472-v6j59ssh7nmja5qltj96k6lakdfds6rg.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:4200/auth/google/callback"
},
function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
    return cb(err, user);
  });
},
));
