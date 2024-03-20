import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
import CustomDate from "components/CustomDate/CustomDate.js";
import Button from "components/CustomButtons/Button.js";

const styles = {
  modalBody: {
    paddingTop: "40px",
    paddingBottom: "40px",
  },
};

const useStyles = makeStyles(styles);

const NewUserModal = ({ onAddNewUser, editingUser, onClose }) => {
  const classes = useStyles();

  const [newUser, setNewUser] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    email: "",
    fechaNacimiento: "",
    estado: "",
    municipio: "",
    codigoPostal: "",
    colonia: "",
    comentarioPersonal: "",
    estatus: 0,
    TipoCuenta: 0,
  });

  useEffect(() => {
    if (editingUser) {
      setNewUser(editingUser);
    }
  }, [editingUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onAddNewUser(newUser);
  };

  return (
    <div className={classes.modalBody}>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <CustomInput
            labelText="Nombre"
            name="nombre"
            value={newUser.nombre}
            onChange={handleChange}
            formControlProps={{
              fullWidth: true,
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <CustomInput
            labelText="Apellido Paterno"
            name="apellidoPaterno"
            value={newUser.apellidoPaterno}
            onChange={handleChange}
            formControlProps={{
              fullWidth: true,
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <CustomInput
            labelText="Apellido Materno"
            name="apellidoMaterno"
            value={newUser.apellidoMaterno}
            onChange={handleChange}
            formControlProps={{
              fullWidth: true,
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <CustomInput
            labelText="Email"
            name="email"
            value={newUser.email}
            onChange={handleChange}
            formControlProps={{
              fullWidth: true,
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <CustomDate
            labelText="Fecha de Nacimiento"
            name="fechaNacimiento"
            value={newUser.fechaNacimiento}
            onChange={handleChange}
            formControlProps={{
              fullWidth: true,
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <CustomInput
            labelText="Estado"
            name="estado"
            value={newUser.estado}
            onChange={handleChange}
            formControlProps={{
              fullWidth: true,
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <CustomInput
            labelText="Municipio"
            name="municipio"
            value={newUser.municipio}
            onChange={handleChange}
            formControlProps={{
              fullWidth: true,
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <CustomInput
            labelText="Código Postal"
            name="codigoPostal"
            value={newUser.codigoPostal}
            onChange={handleChange}
            formControlProps={{
              fullWidth: true,
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <CustomInput
            labelText="Colonia"
            name="colonia"
            value={newUser.colonia}
            onChange={handleChange}
            formControlProps={{
              fullWidth: true,
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <CustomInput
            labelText="Comentario Personal"
            name="comentarioPersonal"
            value={newUser.comentarioPersonal}
            onChange={handleChange}
            formControlProps={{
              fullWidth: true,
            }}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <CustomDropdown
            labelText="Estatus"
            name="estatus"
            value={newUser.estatus}
            onChange={handleChange}
            formControlProps={{
              fullWidth: true,
            }}
            dropdownList={[{ value: 0, text: "Inactivo" }, { value: 1, text: "Activo" }]}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <CustomDropdown
            labelText="Tipo de Cuenta"
            name="TipoCuenta"
            value={newUser.TipoCuenta}
            onChange={handleChange}
            formControlProps={{
              fullWidth: true,
            }}
            dropdownList={[{ value: 0, text: "Tipo 1" }, { value: 1, text: "Tipo 2" }]}
          />
        </GridItem>
      </GridContainer>
      <Button color="info" onClick={handleSave}>
        Guardar
      </Button>
      <Button color="danger" onClick={onClose}>
        Cancelar
      </Button>
    </div>
  );
};

export default NewUserModal;
