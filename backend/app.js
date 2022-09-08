const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const router = require('./routes');
require('dotenv').config();
const { InternalServerError } = require('./errors/InternalServerError');
const { login, createUser, signLogout } = require('./controllers/users');
const { validateSigUp, validateSigIn } = require('./validation/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const { PORT = 3001 } = process.env;

app.use(express.json());
app.use(requestLogger);

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://svyatoslav.nomoredomains.work',
    'http://api.svyatoslav.nomoredomains.xyz',
    'https://svyatoslav.nomoredomains.work',
    'https://api.svyatoslav.nomoredomains.xyz',
  ],
  methods: ['OPTIONS', 'GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
}));

app.use(cookieParser());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', validateSigIn, login);
app.post('/signup', validateSigUp, createUser);
app.delete('/signout', signLogout);
app.use(auth);// все роуты ниже этой строки будут защищены авторизацией
app.use(router);

app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use(InternalServerError);

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true });

app.listen(PORT);
