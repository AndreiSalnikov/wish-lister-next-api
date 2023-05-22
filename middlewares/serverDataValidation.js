const { Joi, celebrate } = require('celebrate');

const userRegistrationValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.empty': 'Поле "name" должно быть заполнено',
        'string.min': 'Поле "name" должно быть не менее 2 символов',
        'string.max': 'Поле "name" должно быть не более 30 символов',
        'any.required': 'Поле "name" обязательное для заполнения',
      }),
    email: Joi.string().required().email().messages({
      'string.empty': 'Поле "email" должно быть заполнено',
      'string.email': 'Поле "email" содержит некорректные данные',
      'any.required': 'Поле "email" обязательное для заполнения',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Поле "password" должно быть заполнено',
      'any.required': 'Поле "password" обязательное для заполнения',
    }),
    reminder: Joi.boolean().required().messages({
      'boolean.base': 'Значнеие reminder должно быть типа boolean',
      'any.required': 'Поле "reminder" обязательное для заполнения',
    }),
  }),
});

const userLoginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.empty': 'Поле "email" должно быть заполнено',
      'string.email': 'Поле "email" содержит некорректные данные',
      'any.required': 'Поле "email" обязательное для заполнения',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Поле "password" должно быть заполнено',
      'any.required': 'Поле "password" обязательное для заполнения',
    }),
  }),
});

const userUpdateValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.empty': 'Поле "name" должно быть заполнено',
        'string.min': 'Поле "name" должно быть не менее 2 символов',
        'string.max': 'Поле "name" должно быть не более 30 символов',
        'any.required': 'Поле "name" обязательное для заполнения',
      }),
    email: Joi.string().email().required().messages({
      'string.empty': 'Поле "email" должно быть заполнено',
      'string.email': 'Поле "email" содержит некорректные данные',
      'any.required': 'Поле "email" обязательное для заполнения',
    }),
    reminder: Joi.boolean().required().messages({
      'reminder.boolean': 'Поле "reminder" должно быть логического типа',
      'any.required': 'Поле "reminder" обязательное для заполнения',
    }),
  }),
});

const passwordChangeValidation = celebrate({
  body: Joi.object().keys({
    currentPassword: Joi.string().required().messages(
      {
        'string.empty': 'Поле "currentPassword" должно быть заполнено',
        'any.required': 'Поле "currentPassword" обязательное для заполнения',
      },
    ),
    newPassword: Joi.string().required().messages(
      {
        'string.empty': 'Поле "newPassword" должно быть заполнено',
        'any.required': 'Поле "newPassword" обязательное для заполнения',
      },
    ),
  }),
});

const giftListCreateValidation = celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(2).messages({
      'string.empty': 'Поле "title" должно быть заполнено',
      'string.min': 'Поле "title" должно быть не менее 2 символов',
      'any.required': 'Поле "title" обязательное для заполнения',
    }),
    date: Joi.string().required().messages({}),
    gifts: Joi.array().required().messages({}),
    description: Joi.string()
      .messages({}),
    image: Joi.string()
      .uri({ scheme: ['http', 'https'] }).messages({
        'string.uriCustomScheme': 'Ссылка должна соответствовать шаблону http/https',
      }),
  }),
});

const giftReservationValidation = celebrate({
  params: Joi.object().keys({
    giftId: Joi.string().length(24).hex().required(),
    giftListId: Joi.string().length(24).hex().required(),
  }),
});

const giftListUpdateValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).messages({
      'string.empty': 'Поле "name" должно быть заполнено',
      'string.min': 'Поле "name" должно быть не менее 2 символов',
      'any.required': 'Поле "name" обязательное для заполнения',
    }),
    specification: Joi.string().min(2).messages({
      'string.min': 'Поле "specification" должно быть не менее 2 символов',
    }),
    price: Joi.number().min(0).messages({
      'number.empty': 'Поле "price" должно быть заполнено',
      'number.base': 'Цена должна быть числом',
      'number.min': 'Цена не может быть отрицательной',
      'any.required': 'Цена обязательна для заполнения',
    }),
    link: Joi.string()
      .uri({ scheme: ['http', 'https'] }).messages({
        'string.empty': 'Поле "link" должно быть заполнено',
        'string.uriCustomScheme': 'Ссылка должна соответствовать шаблону http/https',
        'any.required': 'Поле "link" обязательное для заполнения',
      }),
    title: Joi.string().min(2).messages({
      'string.empty': 'Поле "title" должно быть заполнено',
      'string.min': 'Поле "title" должно быть не менее 2 символов',
      'any.required': 'Поле "title" обязательное для заполнения',
    }),
    date: Joi.string().messages({}),
    gifts: Joi.array().messages({}),
    description: Joi.string().allow('')
      .messages({}),
    image: Joi.string()
      .uri({ scheme: ['http', 'https'] }).messages({
        'string.uriCustomScheme': 'Ссылка должна соответствовать шаблону http/https',
      }),
  }),
});

const giftAddValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).messages({
      'string.empty': 'Поле "name" должно быть заполнено',
      'string.min': 'Поле "name" должно быть не менее 2 символов',
      'any.required': 'Поле "name" обязательное для заполнения',
    }),
    specification: Joi.string().min(2).allow('').messages({
      'string.min': 'Поле "specification" должно быть не менее 2 символов',
    }),
    price: Joi.number().min(0).required().messages({
      'number.empty': 'Поле "price" должно быть заполнено',
      'number.base': 'Цена должна быть числом',
      'number.min': 'Цена не может быть отрицательной',
      'any.required': 'Цена обязательна для заполнения',
    }),
    link: Joi.string().required()
      .uri({ scheme: ['http', 'https'] }).messages({
        'string.uriCustomScheme': 'Ссылка должна соответствовать шаблону http/https',
        'any.required': 'Поле "link" обязательное для заполнения',
      }),
  }),
});

const giftDeleteValidation = celebrate({
  params: Joi.object().keys({
    giftListId: Joi.string().length(24).hex().required()
      .messages({
        'string.length': 'Строка "giftId" должна быть длинной 24 символа',
      }),
    giftId: Joi.string().length(24).hex().required()
      .messages({
        'string.length': 'Строка "giftId" должна быть длинной 24 символа',
      }),
  }),
});

const giftListDeleteValidation = celebrate({
  params: Joi.object().keys({
    giftListId: Joi.string().length(24).hex().required()
      .messages({
        'string.length': 'Строка "giftId" должна быть длинной 24 символа',
      }),
  }),
});

const aboutValidation = celebrate({
  body: Joi.object().keys({
    about: Joi.string().max(90).required().messages({
      'string.empty': 'Поле "about" должно быть заполнено',
      'string.max': 'Поле "about" должно содержать не более 90 символов',
      'any.required': 'Поле "about" обязательно для заполнения',
    }),
  }),
});

const avatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .uri({ scheme: ['http', 'https'] }).messages({
        'string.uriCustomScheme': 'Ссылка должна соответствовать шаблону http/https',
      }),
  }),
});

const updateGiftValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).messages({
      'string.empty': 'Поле "name" должно быть заполнено',
      'string.min': 'Поле "name" должно быть не менее 2 символов',
      'any.required': 'Поле "name" обязательное для заполнения',
    }),
    specification: Joi.string().min(2).messages({
      'string.min': 'Поле "specification" должно быть не менее 2 символов',
    }),
    price: Joi.number().min(0).required().messages({
      'number.empty': 'Поле "price" должно быть заполнено',
      'number.base': 'Цена должна быть числом',
      'number.min': 'Цена не может быть отрицательной',
      'any.required': 'Цена обязательна для заполнения',
    }),
    link: Joi.string().required()
      .uri({ scheme: ['http', 'https'] }).messages({
        'string.empty': 'Поле "link" должно быть заполнено',
        'string.uriCustomScheme': 'Ссылка должна соответствовать шаблону http/https',
        'any.required': 'Поле "link" обязательное для заполнения',
      }),
  }),
});

module.exports = {
  avatarValidation,
  aboutValidation,
  passwordChangeValidation,
  updateGiftValidation,
  giftListDeleteValidation,
  giftDeleteValidation,
  userRegistrationValidation,
  userLoginValidation,
  userUpdateValidation,
  giftAddValidation,
  giftListUpdateValidation,
  giftListCreateValidation,
  giftReservationValidation,
};
