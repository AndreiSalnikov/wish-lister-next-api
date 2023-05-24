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
