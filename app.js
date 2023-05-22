const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');
const passport = require('passport');
const errorHandler = require('./errors/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/limiter');
const router = require('./routes');
const config = require('./utils/config');

require('./utils/passport-vkontakte');
require('./utils/passport-mail');
require('./utils/passport-google');

const app = express();

app.use(express.json());

app.use(cookieParser());
mongoose.connect(config.MONGODB_URL);
app.use(helmet());
app.use(requestLogger);
app.use(limiter);
app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000', 'https://wish-lister.ru/'],
  methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
}));

app.use(passport.initialize());
//router.use(passport.initialize());
 //router.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', router);
//app.use('/', );

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`App listening on port ${config.PORT}`);
});
