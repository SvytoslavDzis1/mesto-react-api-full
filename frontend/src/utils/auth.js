import { options } from "../utils/utils";

class Auth {
  constructor(config) {
    this._baseUrl = config.url;
    this._headers = config.headers;
  }

  _handlePromise(res) {
    if (res.ok) {
      return res.json();
    }

    return Promise.reject(new Error(`Ошибка ${res.status}`));
  }

  register(data) {
    return fetch(`${this._baseUrl}/signup`, {
      method: "POST",
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        password: data.password,
        email: data.email,
      }),
    }).then((res) => this._handlePromise(res));
  }

  login(data) {
    return fetch(`${this._baseUrl}/signin`, {
      method: "POST",
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        password: data.password,
        email: data.email,
      }),
    }).then((res) => this._handlePromise(res));
  }

  checkToken () {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "GET",
      credentials: "include",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${token}`,
      }
    }).then((res) => this._handlePromise(res));
  };

  signLogout() {
    return fetch(`${this._baseUrl}/signout`, {
      method: "DELETE",
      credentials: "include",
  }).then((res) => this._handlePromise(res));
  }
}

// Создание экземпляра класса Auth
const auth = new Auth(options);

export default auth;
