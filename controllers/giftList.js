const GiftList = require('../models/giftList');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');

const {
  BAD_REQUEST_MESSAGE, WRONG_ID, GIFT_LIST_NOT_FOUND,
} = require('../utils/constants');

module.exports.createGiftList = (req, res, next) => {
  GiftList.create( {...req.body, owner: req.user._id} )
    .then((giftList) => giftList.populate(['owner']))
    .then((giftList) => res.send(giftList))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(BAD_REQUEST_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.updateGiftList = (req, res, next) => {
  const {
    name, price, link, specification,
  } = req.body;
  let updateObject = {};

  // Check if any of the gift properties were provided
  if (name && price && link) {
    updateObject = {
      $push: {
        gifts: {
          name, specification, price, link,
        },
      },
    };
  }

  updateObject = {...updateObject, ...req.body};

  GiftList.findOneAndUpdate(
    {_id: req.params.giftListId, owner: req.user._id},
    updateObject,
    {new: true, runValidators: true},
  )
    .then((giftList) => {
      if (!giftList) {
        throw new NotFound(GIFT_LIST_NOT_FOUND);
      }
      res.send(giftList);

    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(BAD_REQUEST_MESSAGE));
      } else if (err.name === 'CastError') {
        next(new BadRequest(WRONG_ID));
      } else {
        next(err);
      }
    });
};

module.exports.deleteGiftList = (req, res, next) => {
  GiftList.findOneAndDelete({_id: req.params.giftListId, owner: req.user._id})
    .then((giftList) => {
      if (giftList === null) {
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

module.exports.getList = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Retrieve the wish list from the database using the ID
    const wishlist = await GiftList.findById(id);

    // If the wish list doesn't exist, return a 404 error
    if (!wishlist) {
      throw new NotFound(GIFT_LIST_NOT_FOUND);
    }

    // If the wish list exists, render the wish list page with the wish list data
    res.send(wishlist);
  } catch (err) {
    next(err.name === 'CastError' ? new BadRequest(WRONG_ID) : err);
  }
};

module.exports.getLists = async (req, res, next) => {
  try {
    const wishlists = await GiftList.find( {owner: req.user._id} ).populate(['owner']);

    // If the wish list doesn't exist, return a 404 error
    if (!wishlists) {
      throw new NotFound(GIFT_LIST_NOT_FOUND);
    }

    // If the wish list exists, render the wish list page with the wish list data
    res.send(wishlists);
  } catch (err) {
    next(err);
  }
};
