import React from "react";
import PopupWithForm from "./PopupWithForm";
import CurrentUserContext from "../contexts/CurrentUserContext";

function EditProfilePopup(props) {
  const { isOpen, onClose, onUpdateUser } = props;
  const currentUser = React.useContext(CurrentUserContext);

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  // Функции для передачи данных стейт-переменным
  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }

  // Обработчик отправки данных
  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      userName: name,
      userJob: description,
    });
  }

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      title="Редактировать профиль"
      text="Сохранить"
      name="editProfile"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        required
        name="name"
        placeholder="ФИО"
        className="popup__input popup__input_user_name"
        minLength="2"
        maxLength="40"
        autoComplete="off"
        onChange={handleNameChange}
        value={name || ""}
        id="user-name"
      />
      <span className="error" id="user-name-error"></span>

      <input
        type="text"
        required
        name="about"
        placeholder="Профессия"
        className="popup__input popup__input_user_job"
        minLength="2"
        maxLength="200"
        autoComplete="off"
        value={description || ""}
        onChange={handleDescriptionChange}
        id="user-job"
      />
      <span className="error" id="user-job-error"></span>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
