const passport = require('passport');
const MailruStrategy = require('passport-mail').Strategy;

const MAIL_APP_ID = '716208ac07a04f998f8484c828ee8c99';
const MAIL_APP_SECRET = 'cc4331af48f34937803d86b34ab7d92a';

passport.use(new MailruStrategy(
  {
    clientID: MAIL_APP_ID,
    clientSecret: MAIL_APP_SECRET,
    callbackURL: 'http://localhost:4200/auth/mail/callback',
  },
function(accessToken, refreshToken, profile, cb) {
/*    User.findOrCreate({ mailId: profile.id }, function (err, user) {
    return cb(err, user);
  });*/
},
));
