const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../utils/config');


const router = require('express').Router();
const passport = require('passport');
const auth = require('../middlewares/auth');
const NotFound = require('../errors/NotFound');
const authRouter = require('./auth');
const usersRouter = require('./users');
const giftListRouter = require('./giftList');
const {
  getList,
} = require('../controllers/giftList');
const {NOT_FOUND_PAGE} = require('../utils/constants');

router.get('/user/auth/vk', passport.authenticate('vkontakte', {
  scope: ['email', 'friends'],
}));

router.get('/user/auth/vk/callback', (req, res, next) => {
  passport.authenticate('vkontakte', (err, user, info) => {
    if (err) {
      console.error(err);
      return res.redirect('/error');
    }

    if (!user) {
      return res.redirect('/');
    }

    const userData = {
      email: user.email.toLowerCase(),
      name: user.displayName,
      avatar: user.ava,
      password: '-',
    };

    User.findOrCreate(user.email.toLowerCase(), userData)
      .then((user) => {
        const token = jwt.sign({_id: user._id}, config.JWT_SECRET);
        res.cookie('token', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        });

        res.send('<script>window.close()</script>');
      })
      .catch((error) => {
        next(error);
      });
  })(req, res, next);
});


// router.get('/auth/mailru', passport.authenticate('mailru'));
//
// router.get('/auth/mailru/callback', passport.authenticate('mailru', {
//   successRedirect: '/lists',
//   failureRedirect: '/',
// }));

router.use('', authRouter);
// router.use('/user', authRouter);
router.get('/lists/:id', getList);
router.use(auth);
router.get('/lists/edit/:id', getList);
router.use('/user', usersRouter);
router.use('/list', giftListRouter);
router.use('/lists', giftListRouter);
router.use('*', (req, res, next) => next(new NotFound(NOT_FOUND_PAGE)));

module.exports = router;
