const router = require('express').Router();
const {
  userUpdateValidation,
  passwordChangeValidation,
  aboutValidation,
  avatarValidation,
} = require('../middlewares/serverDataValidation');

const {
  getMe, updateUser, changePassword, updateAbout, updateAvatar, deleteGiftReservationUser,
} = require('../controllers/users');

const { addGiftReservationUser } = require('../controllers/gift');

router.get('/me', getMe);

router.patch(
  '/me',
  userUpdateValidation,
  updateUser,
);

router.patch(
  '/gift',
  // userUpdateValidation,
  addGiftReservationUser,
);

router.delete(
  '/gift',
  // userUpdateValidation,
  deleteGiftReservationUser,
);

router.patch(
  '/password',
  passwordChangeValidation,
  changePassword,
);

router.patch(
  '/about',
  aboutValidation,
  updateAbout,
);

router.patch(
  '/avatar',
  avatarValidation,
  updateAvatar,
);

module.exports = router;
