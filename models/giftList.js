const mongoose = require('mongoose');
const isUrl = require('validator/lib/isURL');
const giftSchema = require('./gift');

const giftListSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    validate: {
      validator: (url) => isUrl(url),
      message: 'Некорректный URL',
    },
    default: 'https://static.mk.ru/upload/entities/2021/09/24/03/articles/detailPicture/ad/f0/3b/f8/aa1602c4e8a45f36cfdacc8b1b045625.jpg',

  },
  gifts: [giftSchema],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

module.exports = mongoose.model('giftsList', giftListSchema);
