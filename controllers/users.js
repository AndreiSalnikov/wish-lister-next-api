const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const config = require('../utils/config');
const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const {
  NOT_FOUND_ID, WRONG_ID, BAD_REQUEST_MESSAGE, USER_NOT_FOUND,
  EMAIL_IS_BUSY,
} = require('../utils/constants');

module.exports.loginWithSocials = (req, res, next, user) => {
  console.log(user)
 /* const {email} = user;

  User.findOrCreate({email}, {email: user.email, name: user.displayName, avatar: user.ava, password: "-"})
    .then((user) => {
      const token = jwt.sign({_id: user._id}, config.JWT_SECRET);
      res.cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      }).json({message: 'Успешный вход'});
    })
    .catch((err) => {
      next(err);
    });*/
};


module.exports.getMe = (req, res, next) => {
  const {_id} = req.user;
  User.findById(_id)
    .then((user) => {
      if (user === null) {
        throw new NotFound(NOT_FOUND_ID);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(WRONG_ID));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password, reminder,
  } = req.body;

  const lowercaseEmail = email.toLowerCase(); // Convert email to lowercase
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email: lowercaseEmail, // Use the lowercase email
      reminder,
      password: hash,
    }))
    .then((user) => res.send({
      _id: user._id,
      name,
      email: lowercaseEmail, // Send the lowercase email in the response
      reminder,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(EMAIL_IS_BUSY));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest(BAD_REQUEST_MESSAGE));
      } else {
        next(err);
      }
    });
};


module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => {
      if (user === null) {
        throw new NotFound(USER_NOT_FOUND);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest(BAD_REQUEST_MESSAGE));
      } else if (err.code === 11000) {
        next(new ConflictError(EMAIL_IS_BUSY));
      } else if (err.name === 'CastError') {
        next(new BadRequest(WRONG_ID));
      } else {
        next(err);
      }
    });
};

module.exports.changePassword = (req, res, next) => {

  const userId = req.user._id;

  const {currentPassword, newPassword} = req.body;

  // Find the user by their ID
  User.findById(userId).select('+password')
    .then((user) => {
      if (!user) {
        throw new NotFound(USER_NOT_FOUND);
      }

      // Compare the user's current password with the provided password
      return bcrypt.compare(currentPassword, user.password)
        .then((isValid) => {
          if (!isValid) {
            throw new UnauthorizedError('Неправильный пароль');
          }

          // Hash the new password and update it in the database
          return bcrypt.hash(newPassword, 10)
            .then((hash) => {
              user.password = hash;
              return user.save();
            });
        });
    })
    .then((user) => {
      // Return the updated user object
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        reminder: user.reminder,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest(BAD_REQUEST_MESSAGE));
      } else if (err.name === 'ValidationError') {
        next(new BadRequest(BAD_REQUEST_MESSAGE));
      } else {
        next(err);
      }
    });
};

module.exports.logout = async (req, res, next) => {
  try {
    await res.clearCookie('token');
    res.status(200).json({message: 'Успешный выход'});
  } catch (err) {
    next(err);
  }
};

module.exports.deleteGiftReservationUser = (req, res, next) => {

  return User.findByIdAndUpdate(
    req.user._id,
    {$pull: {reservedGifts: {_id: req.params.giftId}}}, // Use $pull with {_id: giftId}
    {new: true},
  )
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

module.exports.login = (req, res, next) => {
  const {email, password} = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({_id: user._id}, config.JWT_SECRET);
      res.cookie('token', token, {
        maxAge: 3600000 * 24 * 7, // срок жизни куки 7 дней
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      }).json({message: 'Успешный вход'});
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.updateAbout = (req, res, next) => {
  const {about} = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {about},
    {
      new: true,
      runValidators: true,
      upsert: false,
      context: 'query', // Needed to trigger validators for individual fields
    },
  )
    .then((user) => {
      if (user === null) {
        throw new NotFound(USER_NOT_FOUND);
      }
      res.send(user);
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

module.exports.updateAvatar = (req, res, next) => {
  const {avatar} = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {avatar},
    {
      new: true,
      runValidators: true,
      upsert: false,
      context: 'query',
    },
  )
    .then((user) => {
      if (user === null) {
        throw new NotFound(USER_NOT_FOUND);
      }
      res.send(user);
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
