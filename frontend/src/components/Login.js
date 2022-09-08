import React from "react";

import AuthForm from "./AuthForm";

function Login({ onLogin }) {
  return <AuthForm title="Вход" buttonText="Войти" onAuth={onLogin} />;
}
export default Login;