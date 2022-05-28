const Card = require('../models/card');
const { BadRequestError } = require('../errors/BadRequestError');
const { ForbiddenError } = require('../errors/ForbiddenError');
const { NotFoundError } = require('../errors/NotFoundError');

const CODE_OK_200 = 200;
const CODE_OK_201 = 201;

exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.status(CODE_OK_200).send(cards);
  } catch (err) {
    next(err);
  }
};

exports.createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const сard = new Card({ name, link, owner: req.user._id });
    res.status(CODE_OK_201).send(await сard.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
    } else {
      next(err);
    }
  }
};

exports.deleteCard = async (req, res, next) => {
  try {
    const deletedCard = await Card.findById(req.params.cardId);
    if (deletedCard) {
      if (req.user._id === deletedCard.owner._id.toString()) {
        await Card.findByIdAndRemove(req.params.cardId);
        res.status(CODE_OK_200).send({ deletedCard });
      } else {
        throw new ForbiddenError('Недостаочно прав для удаления карточки');
      }
    } else {
      throw new NotFoundError('Карточка с указанным _id не найдена.');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Карточка с указанным _id не найдена.'));
    } else {
      next(err);
    }
  }
};

exports.likeCard = (req, res, next) => {
  const id = req.user._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Нет пользователя с переданным ID'))
    .then((dataCard) => res.status(200).send(dataCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан несуществующий _id карточки.'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('Нет пользователя/карточки с переданным _id'));
      } else {
        next(err);
      }
    });
};

exports.dislikeCard = (req, res, next) => {
  const id = req.user._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: id } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Передан несуществующий _id карточки.'))
    .then((dataCard) => res.status(200).send(dataCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для снятии лайка.'));
      } else {
        next(err);
      }
    });
};
