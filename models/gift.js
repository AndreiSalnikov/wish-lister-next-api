const mongoose = require('mongoose');
const isUrl = require('validator/lib/isURL');

const giftSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  specification: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: true,
  },
  link: {
    required: true,
    type: String,
    validate: {
      validator: (url) => isUrl(url),
      message: 'Некорректный URL',
    },
  },
  reservation: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
    required: true,
  }],
});

module.exports = giftSchema;
