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
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);

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
        if (timeRemaining <= 30000) {
          console.log("timeRemaining",timeRemaining);
          setShowModal(true);
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
    </BrowserRouter>
  );
}
