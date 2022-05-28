
import  React from "react";
import { Link } from "react-router-dom";

import AuthForm from "./AuthForm";

function Register({ onRegister }){
  
    return(
    <>
        <AuthForm title="Регистрация" buttonText="Зарегистрироваться" onAuth={onRegister} />
        <div className="auth__register">
          <p className="auth__register_text">Уже зарегистрированы?</p>
          <Link to="sign-in" className="auth__register_link">
            Войти
          </Link>
        </div>
    </>
    )
}

export default Register;