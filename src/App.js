import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import SignInSide from "views/SignInSide/SignInSide.js";
// core components
import Admin from "layouts/Admin.js";
import RTL from "layouts/RTL.js";
import UserSystems from "views/UserSystems/UserSystems.js";
import UserForm from "views/UserSystems/UserForm.js";
import "assets/css/material-dashboard-react.css?v=1.10.0";
import jwt from "jsonwebtoken";
import Login from 'views/SignInSide/Login.js';
import Snackbar from "components/Snackbar/Snackbar.js";
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [bc, setBC] = useState(false);
  const [mensaje, setMensaje] = useState(null);
 
 let  showMensajeExpira=true;
    useEffect(() => {
    // Verificar si existe la cookie token y el token
    checkCookie();
    // Ejecutar la validación de la cookie y el token cada 10 segundos
    const intervalId = setInterval(() => {
      checkCookie();
    }, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const checkCookie = () => {
    const token = getCookie("token");
    if (!token) {
      // Si no hay cookie, el usuario debe hacer login de nuevo
      setLoggedIn(false);
    } else {
      // Verificar si el token es válido
      try {
        const decodedToken = jwt.decode(token);
        const expirationTime = decodedToken.exp * 1000; // Convertir a milisegundos
        const currentTime = Date.now();
        const timeRemaining = expirationTime - currentTime;
        setTimeRemaining(timeRemaining);
        // Si el tiempo restante es menor o igual a 15000 ms (15 segundos), mostrar el modal
        console.log("showMensajeExpira:",showMensajeExpira);
        if (timeRemaining <= 30000 && timeRemaining >0 && showMensajeExpira) {
          console.log("timeRemaining",timeRemaining);
          showMensajeExpira=false;
          setShowModal(true);
          showNotification("bc", `La sesión expirará en ${Math.ceil(timeRemaining / 1000)} segundos`);
          
          
        }
        // Si el token es válido y el tiempo restante es mayor a 0, establecer loggedIn como verdadero
        if (timeRemaining > 0) {
          setLoggedIn(true);
        } else {
          // Si el tiempo ha expirado, eliminar la cookie y establecer loggedIn como falso
          document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          setLoggedIn(false);
         
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        // Si hay un error al decodificar el token, eliminar la cookie y establecer loggedIn como falso
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setLoggedIn(false);
      }
    }
  };
  

  const handleLogin = async (username, password) => {
    // Lógica de verificación de inicio de sesión
    const isLogin = await Login(username, password);
    console.log(isLogin);
    if (isLogin) {
      setLoggedIn(true);
    }
  };

  const getCookie = (name) => {
    const cookieName = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");

    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === " ") {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(cookieName) === 0) {
        return cookie.substring(cookieName.length, cookie.length);
      }
    }
    return "";
  };

  const handleLogout = () => {
    // Eliminar la cookie y volver a la página de inicio de sesión
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setLoggedIn(false);
  };
  const showNotification = (place, message) => {
    setMensaje(message);
    // Mostrar la notificación en el lugar especificado
    switch (place) {
      case "bc":
        showBottomCenterNotification(message);
        break;
      // Agrega más casos según sea necesario para otros lugares
      default:
        break;
    }
  };

  const showBottomCenterNotification = (message) => {
    // Mostrar la notificación en la parte inferior central
    console.log(message);
    setBC(true);
    setTimeout(() => {
      setBC(false);     
    }, 6000);
  };

 
  return (
    <BrowserRouter>
      <Switch>
        {loggedIn && <Route path="/admin" component={Admin} />}
        {loggedIn && <Route path="/rtl" component={RTL} />}
        {loggedIn && <Route path="/UserSystems" component={UserSystems} />}
        {loggedIn && <Route path="/UserForm/:userId?" component={UserForm} />}
        {!loggedIn && <Route path="/" render={() => <SignInSide handleLogin={handleLogin} />} />}
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Sesión a punto de expirar</h2>
              <p>La sesión expirará en {Math.ceil(timeRemaining / 1000)} segundos.</p>
              <button onClick={handleLogout}>Cerrar sesión</button>
            </div>
          </div>
        )}
        <Redirect from="/" to="/admin/dashboard" />
      </Switch>
      <Snackbar
        place="bc"
        color="info"
        message={mensaje}
        open={bc}
        closeNotification={() => setBC(false)}
        close
      />
    </BrowserRouter>
  );
}
