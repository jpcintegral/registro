import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import PropTypes from "prop-types";
import Snackbar from "components/Snackbar/Snackbar.js";
import fondo from "assets/img/andador-const.jpg";

const defaultTheme = createTheme();

export default function SignInSide(props) {
  const [mensaje, setMensaje] = useState(null);
  const [bc, setBC] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
    const isLogin = await props.handleLogin(data.get("email"), data.get("password"));
    if (!isLogin) {
      showNotification("bc", 'datos incorrectos');
    }
  };

  const showNotification = (place, message) => {
    setMensaje(message);
    switch (place) {
      case "bc":
        showBottomCenterNotification(message);
        break;
      default:
        break;
    }
  };

  const showBottomCenterNotification = (message) => {
    console.log(message);
    setBC(true);
    setTimeout(() => {
      setBC(false);
    }, 6000);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          sx={{
            position: "relative",
            overflow: "hidden",
            backgroundImage: `url(${fondo})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          component={Paper}
          elevation={6}
          square
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)", // Capa negra con opacidad
              zIndex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
             
            }}
          >
            <Box
              sx={{
                p: 4,
                width: "100%",
                maxWidth: 400,
                bgcolor: "rgba(255, 255, 255, 0.6)", // Fondo con opacidad
                borderRadius: 3,
                textAlign: "center",
                backdropFilter: "blur(6px)",
                
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon   variant="outlined" />
              </Avatar>
              <Typography component="h1" variant="h5">
                REGISTRO
              </Typography>
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Usuario"
                  name="email"
                  autoComplete="email"
                  variant="outlined" 
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Contraseña"
                  type="password"
                  id="password"
                  variant="outlined"
                  autoComplete="current-password"
                />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3,
                 backgroundColor: "#4e9bae" }}>
                  Entrar
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <Snackbar
        place="tc"
        color="danger"
        message={mensaje}
        open={bc}
        closeNotification={() => setBC(false)}
        close
      />
    </ThemeProvider>
  );
}

SignInSide.propTypes = {
  handleLogin: PropTypes.func.isRequired,
};
