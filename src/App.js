import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import SignInSide from "views/SignInSide/SignInSide.js"
// core components
import Admin from "layouts/Admin.js";
import RTL from "layouts/RTL.js";
import UserSystems from "views/UserSystems/UserSystems.js";
import UserForm from "views/UserSystems/UserForm.js";
import "assets/css/material-dashboard-react.css?v=1.10.0";
import Login from 'views/SignInSide/Login.js';
export default function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);

  const handleLogin = async (username, password) => {
    // Lógica de verificación de inicio de sesión
    const isLogin = await Login(username, password);
    console.log(isLogin);
    if (isLogin) {
      setLoggedIn(true);
    }
  };

  return (
    <BrowserRouter>
      <Switch>
        {!loggedIn && <Route path="/" render={() => <SignInSide handleLogin={handleLogin} />} />}
        {loggedIn && <Route path="/admin" component={Admin} />}
        {loggedIn && <Route path="/rtl" component={RTL} />}
        {loggedIn && <Route path="/UserSystems" component={UserSystems} />} {/* Agrega esta línea */}
        {loggedIn && <Route path="/UserForm/:userId?" component={UserForm} />}
        <Redirect from="/" to="/admin/dashboard" />
      </Switch>
    </BrowserRouter>
  );
}
