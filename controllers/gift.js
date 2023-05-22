const GiftList = require('../models/giftList');
const User = require('../models/user');
const Forbidden = require('../errors/Forbidden');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const {
  BAD_REQUEST_MESSAGE, GIFT_NOT_FOUND, WRONG_OWNER, WRONG_ID, GIFT_LIST_NOT_FOUND, OWNER_CANT_RESERVATION,
} = require('../utils/constants');


module.exports.reservationOn = (req, res, next) => {

  GiftList.findOne({_id: req.params.giftListId, 'gifts._id': req.params.giftId})
    .populate('gifts.reservation')
    .then((giftList) => {
      if (!giftList) {
        throw new NotFound('Подарок с таким id не найден');
      }
      //Check if you owner
      if (giftList.owner?.toString() === req.user._id) {
        throw new Forbidden(OWNER_CANT_RESERVATION);
      }

      const gift = giftList.gifts.find(gift => gift._id.toString() === req.params.giftId);

      // Check if the gift is already reserved by another user
      if (gift.reservation[0]?._id.toString() !== req.user?._id && gift?.reservation[0] !== undefined) {
        throw new Forbidden(WRONG_OWNER);
      }

      return GiftList.findByIdAndUpdate(
        req.params.giftListId,
        {$set: {'gifts.$[gift].reservation': req.user._id}},
        {new: true, arrayFilters: [{'gift._id': req.params.giftId}]}
      ).populate(['owner', 'gifts.reservation'])
    })
    .then((giftList) => {
      res.send(giftList);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Передан некорректный id подарка'));
      } else {
        next(err);
      }
    });
};

module.exports.reservationOff = (req, res, next) => {
  GiftList.findOne({_id: req.params.giftListId, 'gifts._id': req.params.giftId})
    .populate('gifts.reservation')
    .then((giftList) => {
      if (!giftList) {
        throw new NotFound('Подарок с таким id не найден');
      }

      //Check if you owner
      if (giftList.owner?.toString() === req.user._id) {
        throw new Forbidden(OWNER_CANT_RESERVATION);
      }

      const gift = giftList.gifts.find(gift => gift._id.toString() === req.params.giftId);

      // Check if the gift is already reserved by another user
      if (gift.reservation[0]._id?.toString() !== req.user._id) {
        throw new Forbidden(WRONG_OWNER);
      }

      return GiftList.findByIdAndUpdate(
        req.params.giftListId,
        {$set: {'gifts.$[gift].reservation': []}},
        {new: true, arrayFilters: [{'gift._id': req.params.giftId}]}
      ).populate(['owner', 'gifts.reservation'])
    })
    .then((giftList) => {
      res.send(giftList);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Передан некорректный id подарка'));
      } else {
        next(err);
      }
    });
};

module.exports.addGiftReservationUser = (req, res, next) => {
  const { giftId, listId } = req.body;

  GiftList.findOne({ _id: listId, 'gifts._id': giftId })
    .populate('gifts')
    .then((giftList) => {
      if (!giftList) {
        throw new NotFound('Подарок с таким id не найден');
      }

      // Check if you are the owner
      if (giftList.owner?.toString() === req.user._id) {
        throw new Forbidden(OWNER_CANT_RESERVATION);
      }

      const gift = giftList.gifts.find((gift) => gift._id.toString() === giftId);

      // Check if the gift is already reserved by another user
      if (gift.reservation[0]?._id?.toString() !== req.user._id) {
        throw new Forbidden(WRONG_OWNER);
      }


      return User.findByIdAndUpdate(
        req.user._id,
        { $push: { reservedGifts: gift } },
        { new: true }
      )
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Передан некорректный id подарка'));
      } else {
        next(err);
      }
    });
};


module.exports.deleteGift = (req, res, next) => {
  GiftList.findOneAndUpdate(
    {_id: req.params.giftListId, owner: req.user._id},
    {$pull: {gifts: {_id: req.params.giftId}}},
    {new: true},
  )
    .populate('owner')
    .then((giftList) => {
      if (!giftList) {
        throw new NotFound(GIFT_LIST_NOT_FOUND);
      }
      res.send(giftList);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(WRONG_ID));
      } else {
        next(err);
      }
    });
};

module.exports.updateGift = async (req, res, next) => {
  try {
    const {
      name, specification, price, link,
    } = req.body;

    const updatedGift = await GiftList.findOneAndUpdate(
      {_id: req.params.giftListId, 'gifts._id': req.params.giftId, owner: req.user._id},
      {
        $set: {
          'gifts.$.name': name, 'gifts.$.specification': specification, 'gifts.$.price': price, 'gifts.$.link': link,
        },
      },
      {new: true},
    ).populate('owner');

    if (!updatedGift) {
      throw new NotFound(GIFT_NOT_FOUND);
    }

    const giftList = await GiftList.findById(req.params.giftListId);

    res.send(giftList);
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequest(WRONG_ID));
    } else if (err.name === 'ValidationError') {
      next(new BadRequest(BAD_REQUEST_MESSAGE));
    } else if (err.name === 'ForbiddenError') {
      next(new Forbidden(WRONG_OWNER));
    } else {
      next(err);
    }
  }
};
