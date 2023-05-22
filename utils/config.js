require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 4200,
  JWT_SECRET: process.env.JWT_SECRET || 'devKey',
  MONGODB_URL: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/gifterdb',
};
