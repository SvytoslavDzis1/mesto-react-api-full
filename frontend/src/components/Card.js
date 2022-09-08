import React from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";

function Card(props) {
  const { card, onCardClick, onCardLike, onDelete, onCardDelete } = props;
  const currentUser = React.useContext(CurrentUserContext);

  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = card.owner === currentUser._id;


  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = card.likes.some((i) => i === currentUser._id);

  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = `element__like-button ${
    isLiked ? "element__like_active" : ""
  }`;

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onDelete()
    onCardDelete(card);
  }

  return (
    <li className="element">
      <img
        className="element__img"
        src={card.link}
        alt={card.name}
        onClick={handleClick}
      />
      {isOwn &&  <button type="button" className="button__delete article__like-button" onClick={handleDeleteClick}></button>}
      <div className="element__caption">
        <h2 className="element__name">{card.name}</h2>
        <div className="element__like-container">
          <button
            type="button"
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
          ></button>
          <span className="element__like">{card.likes.length}</span>
        </div>
      </div>
    </li>
  );
}

export default Card;
