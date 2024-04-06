import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Modal as MuiModal, Backdrop, Fade } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: "8px",
    maxHeight: "80vh", // Altura máxima del modal
    overflowY: "auto", // Hace que el contenido sea desplazable verticalmente si excede la altura máxima
  },
}));

const Modal = ({ open, onClose, children, title ,nota,id}) => {
  const classes = useStyles();

  return (
    <MuiModal
      open={open}
      onClose={onClose}
      className={classes.modal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div id={id} className={classes.paper}>
          <h4>{title}</h4>
          <p>{nota}</p>
          <hr/>
          {children}
        </div>
      </Fade>
    </MuiModal>
  );
};

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  nota : PropTypes.string,
  id : PropTypes.string
};

export default Modal;
