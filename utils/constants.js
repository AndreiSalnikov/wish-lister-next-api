const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;
const UNAUTHORIZED = 401;
const CONFLICT_ERROR = 409;
const FORBIDDEN = 403;

const BAD_REQUEST_MESSAGE = 'Переданы некорректные данные';
const NOT_FOUND_ID = 'Такого id нет в базе';
const USER_NOT_FOUND = 'Пользователь не найден';
const GIFT_LIST_NOT_FOUND = 'Лист с подарками не найден';
const WRONG_OWNER = 'Вы не можете забронировать подарок, который забронировал другой человек';
const OWNER_CANT_RESERVATION = 'Вы не можете бронировать свои подарки';
const WRONG_ID = 'Передан некорректный id';
const NOT_FOUND_PAGE = 'Такой страницы не существует';
const UNAUTHORIZED_MSG = 'Вы не авторизованы';
const WRONG_TOKEN = 'Неправильный токен';
const INTERNAL_SERVER_ERROR_MESSAGE = 'На сервере произошла ошибка';
const EMAIL_IS_BUSY = 'Такой email уже существует';
const GIFT_NOT_FOUND = 'Подарок не найден';

module.exports = {
  GIFT_NOT_FOUND,
  GIFT_LIST_NOT_FOUND,
  FORBIDDEN,
  OWNER_CANT_RESERVATION,
  CONFLICT_ERROR,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  BAD_REQUEST_MESSAGE,
  NOT_FOUND_ID,
  WRONG_OWNER,
  WRONG_ID,
  NOT_FOUND_PAGE,
  BAD_TOKEN_TYPE: UNAUTHORIZED_MSG,
  WRONG_TOKEN,
  INTERNAL_SERVER_ERROR_MESSAGE,
  USER_NOT_FOUND,
  EMAIL_IS_BUSY,
};
