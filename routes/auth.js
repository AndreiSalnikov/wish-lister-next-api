const router = require('express').Router();
const passport = require('passport');
const {userRegistrationValidation, userLoginValidation} = require('../middlewares/serverDataValidation');
const {
  login, createUser, logout,
} = require('../controllers/users');

router.get('/user/auth/vk', passport.authenticate('vkontakte', {
  scope: ['email', 'friends'],
}));

router.get('/user/auth/vk/callback',
  passport.authenticate('vkontakte',
    {
      successRedirect: '/lists',
      failureRedirect: '/',
    },
(err) => {
      if (err) {
        console.error(err)
      }
    },
));

/*
router.get('/auth/mailru', passport.authenticate('mailru'));

router.get('/auth/mailru/callback', passport.authenticate('mailru', {
  successRedirect: '/lists',
  failureRedirect: '/',
}));
*/

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/lists',
  failureRedirect: '/',
}));

router.post(
  '/signup',
  userRegistrationValidation,
  createUser,
);

router.post(
  '/signin',
  userLoginValidation,
  login,
);

router.get('/logout', logout);

module.exports = router;
