const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { BAD_TOKEN_TYPE, WRONG_TOKEN } = require('../utils/constants');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {

  const { token } = req.cookies;

  if (!token) {
    return next(new UnauthorizedError(BAD_TOKEN_TYPE));
  }
  try {
    req.user = jwt.verify(token, config.JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError(WRONG_TOKEN);
  }
  next();
};
