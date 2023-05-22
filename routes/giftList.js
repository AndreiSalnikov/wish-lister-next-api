const router = require('express').Router();
const {
  giftListCreateValidation, giftAddValidation,
  giftListDeleteValidation, giftDeleteValidation, giftListUpdateValidation,
  giftReservationValidation,
} = require('../middlewares/serverDataValidation');

const {
  deleteGift, updateGift, reservationOn, reservationOff,
} = require('../controllers/gift');

const {
  createGiftList, updateGiftList, deleteGiftList, getLists,
} = require('../controllers/giftList');

// router.get('', getGiftList);

router.post(
  '',
  giftListCreateValidation,
  createGiftList,
);

router.patch(
  '/:giftListId',
  giftListUpdateValidation,
  updateGiftList,
);

router.delete(
  '/:giftListId/gifts/:giftId',
  giftDeleteValidation,
  deleteGift,
);

router.patch(
  '/:giftListId/gifts/:giftId',
  giftAddValidation,
  updateGift,
);

router.delete(
  '/:giftListId',
  giftListDeleteValidation,
  deleteGiftList,
);

router.put(
  '/:giftListId/gifts/:giftId/reservation',
  giftReservationValidation,
  reservationOn,
);

router.delete(
  '/:giftListId/gifts/:giftId/reservation',
  giftReservationValidation,
  reservationOff,
);

router.get('', getLists);

module.exports = router;
