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

const { NOT_FOUND_PAGE } = require('../utils/constants');

router.get('/user/auth/vk', passport.authenticate('vkontakte', {
  scope: ['email', 'friends'],
}));
/*router.get('/user/auth/vk/callback', passport.authenticate('vkontakte', {
  successRedirect: '/lists',
  failureRedirect: '/',
}));*/

router.get('/user/auth/vk/callback', (req, res, next) => {
  passport.authenticate('vkontakte', (err, user, info) => {
    if (err) {
      // Handle the error here
      console.error(err);
      return res.redirect('/error'); // Redirect to an error page or handle the error response
    }

    if (!user) {
      // Authentication failed, redirect to failureRedirect URL or handle the failure response
      return res.redirect('/');
    }

    // Authentication succeeded, redirect to successRedirect URL or handle the success response
    return res.redirect('/lists');
  })(req, res, next);
});

router.get('/auth/mailru', passport.authenticate('mailru'));

router.get('/auth/mailru/callback', passport.authenticate('mailru', {
  successRedirect: '/lists',
  failureRedirect: '/',
}));
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
