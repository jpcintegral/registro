import React from "react";
import { CircularProgress, makeStyles, Fade, Backdrop } from "@material-ui/core";
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
  },
}));

const SpinnerOverlay = ({open} ) => {
  const classes = useStyles();
 // Validar si open es nulo o indefinido
 if (open == null) {
    return null; // Si es nulo, no renderizar el componente
  }
  return (
    <Fade in={open}>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Fade>
  );
};

SpinnerOverlay.propTypes = {
    open: PropTypes.bool,
  };
export default SpinnerOverlay;
