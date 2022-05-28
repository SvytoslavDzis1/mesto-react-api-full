import { React, useState } from "react";

function AuthForm(props) {
  const { title, buttonText, onAuth } = props;
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onAuth(userData);
  }

  return (
    <section className="auth">
        <h2 className="auth__title">{title}</h2>
        <form className="auth__form" onSubmit={handleSubmit}>
            <input
            name="email"
            type="email"
            placeholder="Email"
            value={userData.email}
            className="auth__form-input"
            onChange={handleChange}
            />
            <input
            name="password"
            type="password"
            placeholder="Пароль"
            value={userData.password}
            className="auth__form-input"
            onChange={handleChange}
            />
        <button type="submit" className="auth__form-submit auth__form-submit_size">
          {buttonText}
        </button>
      </form>
    </section>
  );
}

export default AuthForm;