import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import SignInSide from "views/SignInSide/SignInSide.js"
// core components
import Admin from "layouts/Admin.js";
import RTL from "layouts/RTL.js";
import "assets/css/material-dashboard-react.css?v=1.10.0";

export default function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);

  const handleLogin = (username, password) => {
    // Lógica de verificación de inicio de sesión
    if (username === "admin" && password === "jose") {
      setLoggedIn(true);
    }
  }

  return (
    <BrowserRouter>
      <Switch>
        {!loggedIn && <Route path="/" render={() => <SignInSide handleLogin={handleLogin} />} />}
        {loggedIn && <Route path="/admin" component={Admin} />}
        {loggedIn &&<Route path="/rtl" component={RTL} />}
        <Redirect from="/" to="/admin/dashboard" />
      </Switch>
    </BrowserRouter>
  );
}