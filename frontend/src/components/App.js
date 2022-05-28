import React from 'react';
import Header from './Header';
import EditAvatarPopup from './EditAvatarPopup';
import EditProfilePopup from './EditProfilePopup';
import Main from './Main';
import Footer from './Footer';
import AddPlacePopup from './AddPlacePopup';
import ImagePopup from './ImagePopup';
import CurrentUserContext from '../contexts/CurrentUserContext';
import api from '../utils/api';
import auth from '../utils/auth';
import { Route, Switch, useHistory, Redirect } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip'
import DeleteCard from './DeleteCard'

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isdeletedCardOpen, setDeletedCardOpen] = React.useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);

  const [selectedCard, setSelectedCard] = React.useState({name: '', link: ''});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [deletedCard, setDeletedCard] = React.useState({});
  const [loggedIn, setLoggedIn] = React.useState(false);

  const [message, setMessage] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const history = useHistory();

  React.useEffect(()=>{
    function heandleEsc(evt){
      if(evt.key === "Escape"){
        closeAllPopups()
      }
    }

    document.addEventListener('keydown', heandleEsc)
      return () => {
        document.removeEventListener('keydown', heandleEsc);
      }
  }, [])

  React.useEffect(()=>{
    function heandleOverlay(evt){
      if(evt.target.classList.contains('popup')){
        closeAllPopups()
      }
    }
    document.addEventListener('mousedown', heandleOverlay)
      return () => {
        document.removeEventListener('mousedown', heandleOverlay);
      }
  }, [])
  
  function handleUpdateAvatar({ avatar }) {
    
    api.changeAvatar({ avatar })
    .then((data) => {
      setCurrentUser(data);
      closeAllPopups();
    })
    .catch((err) =>
    console.log(`${err}`))
  }

  function handleUpdateUser(data) {
    api.editUserInfo(data)
      .then((user) => {
        setCurrentUser(user);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  }

  function handlDeletedCard(card) {
    setDeletedCard(card);
  }
  
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i === currentUser._id);
    if (isLiked) {
      api.removeLike(card._id)
        .then((newCard) => {
          setCards((cards) => cards.map((c) => (c._id === card._id ? newCard : c)));
        })
        .catch((err) => {
          console.log(`${err}`);
        });
    } else {
      api.addLike(card._id)
        .then((newCard) => {
          setCards((cards) => cards.map((c) => (c._id === card._id ? newCard : c)));
        })
        .catch((err) => {
          console.log(`${err}`);
        });
    }
  }

  function handleAddPlaceSubmit({name, link}) {
    api.addNewCard({name, link})
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) =>
        console.log(`${err}`))
  }

  function closeAllPopups(){
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false); 
    setAddPlacePopupOpen(false);
    setSelectedCard({name:'', link:''});
    setIsInfoTooltipOpen(false);
    setDeletedCardOpen(false);
  }

  function handleEditAvatarClick(){
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen)
  }

  function handleEditProfileClick(){
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen) 
  }

  function handleAddPlaceClick(){
    setAddPlacePopupOpen(!isAddPlacePopupOpen)  
  }

  function handleApproveDelitionClick() {       
    setDeletedCardOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleInfoTooltip() {
    setIsInfoTooltipOpen(true);
  }

  function handleRegistr(data) {
    auth.register(data)
      .then(() => {
        handleInfoTooltip();
        setMessage(true);
        history.push('/sign-in');
      })
      .catch(() => {
        if (400) {
          console.log("400 - некорректно заполнено одно из полей");
        }
        handleInfoTooltip();
        setMessage(false);
      });
    }  

  function onLogin(data) {
    auth.login(data)
      .then((res) => {
        setLoggedIn(true);
        localStorage.setItem('jwt', res["token"]);
        setEmail(data["email"]);
        history.push('/');
      })
      .catch(() => {
        if(401){
          console.log("401 - пользователь с email не найден");
        }else if(400){
          console.log("400 - не передано одно из полей");
        }
        setMessage(false);
        handleInfoTooltip();
      });
  }

  function onLogout() {
    setLoggedIn(false);
    setEmail('');
    localStorage.removeItem('jwt');
    history.push('/sign-in');
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
        closeAllPopups();
      }).catch((err) => console.log(`${err}`)); 
  }

    // Переход на главную страницу, если пользователь авторизован
    React.useEffect(() => {
      if (localStorage.getItem('jwt')){
        auth.checkToken(localStorage.getItem('jwt'))
          .then(res => {
            setLoggedIn(true);
            history.push('/');
          })
          .catch((err) => {
            if (401) {
              console.log("401 — Токен не передан или передан не в том формате");
            }       
          });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  
    // Загрузка на страницу данных пользователя и карточек с сервера при запуске приложения
    React.useEffect(() => {
      if (loggedIn) {
        Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([userData, cards]) => {
          setCards(cards);
          cards.reverse();
          setCurrentUser(userData);
          setEmail(userData.email);
        })
        .catch((err) => {
          history.push("/sign-in");
          console.log(`${err} требуется авторизация`)
        });
    }}, [history, loggedIn]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
    <div>
      <div className="page">
          <Header email={email} logout={onLogout}/>
          <Switch>
          <ProtectedRoute
          exact path="/"
          component={Main}
          loggedIn={loggedIn}
          onEditAvatar={handleEditAvatarClick} 
          onEditProfile={handleEditProfileClick} 
          onAddPlace={handleAddPlaceClick}
          onDelete={handleApproveDelitionClick}
          onCardDelete={handlDeletedCard}
          onCardClick={handleCardClick}
          onCardLike={handleCardLike}
          onUpdateUser={handleUpdateUser}
          cards={cards}
          />
          <Route path="/sign-up">
            <Register onRegister={handleRegistr}/>
          </Route>
          <Route path="/sign-in">
            <Login onLogin={onLogin}/>
          </Route>
          <Route>
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in"/>}
          </Route>
          </Switch>

          {loggedIn && <Footer />}
      
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />

        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />

        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />

        <DeleteCard card={deletedCard} isOpen={isdeletedCardOpen} onClose={closeAllPopups} onDelete={handleCardDelete} />

        <ImagePopup card = {selectedCard} onClose={closeAllPopups} />

        <InfoTooltip isOpen={isInfoTooltipOpen} onClose={closeAllPopups} status={message} />

      </div>

    </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
