import React from "react";
import PopupWithForm from "./PopupWithForm";

function DeleteCard(props) {
  const { card, isOpen, onClose, onDelete } = props;
  const [buttonText, setButtonText] = React.useState('Да');

  React.useEffect(() => {
    resetButtonText();
  }, [isOpen]);

  // Функции для изменения текста на кнопке отправки
  function changeButtonText() {
    setButtonText('Удаление...');
  }

  function resetButtonText() {
    setButtonText('Да');
  }

  // Обработчик отправки данных
  function handleSubmit(e) {
    e.preventDefault();
    changeButtonText();

    onDelete(card);
  }

  return (
    <PopupWithForm
      className="popup popup_type_delete-card"
      text="Да"
      title="Вы уверены?"
      isOpen={isOpen}
      onClose={onClose}
      name="delete"
      buttonText={buttonText}
      onSubmit={handleSubmit}
    />
  );
}

export default DeleteCard;
