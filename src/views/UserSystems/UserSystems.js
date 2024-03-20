import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import { useHistory } from 'react-router-dom';
import axios from "axios";
//import UserForm from "path/to/UserForm"; // Ruta al componente UserForm

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.9)",
      margin: "0",
      fontSize: "14px",
      fontWeight: "300",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "600",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#7778",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

const useStyles = makeStyles(styles);
const estatusMap = {
  "1": "Activo",
  "2": "Inactivo"
}
  const tipoCuentaMap = {
  "1": "Admin",
  "2": "Estandar"
  }

  const generoMap = {
    "1": "Hombre",
    "2": "Mujer",
    "3": "Otro"
    }
export default function UserSystems() {
    const history = useHistory();
  const classes = useStyles();
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3800/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDetail = (userId) => {
    console.log(userId); // Lógica para mostrar detalles del usuario
  };

  const handleUpdate = (userId) => {
    // Lógica para actualizar el usuario
    
  history.push(`/admin/UserForm/${userId}`); // Suponiendo que `/user-form/:userId` es la ruta para el formulario UserForm
  };

  const handleDelete = async (userId) => {
    try {
      await axios.put(`http://localhost:3800/api/user/desactivar/${userId}`);
      const updatedUsers = users.filter(user => user._id !== userId);
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info">
            <h4 className={classes.cardTitleWhite}>Usuarios</h4>
            <p className={classes.cardCategoryWhite}>
              Lista de usuarios registrados.
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="info"
              tableHead={[
                "Nombre",
                "A.Paterno",
                "A.Materno",
                "Genero",
                "Email",                
                "Fecha de Nacimiento",
                "Estado",
                "Municipio",
                "Código Postal",
                "Colonia",
                "Estatus",
                "Tipo de Cuenta",
                "Acciones"
              ]}
              tableData={users.map((user) => [
                user.nombre,
                user.apellidoPaterno,
                user.apellidoMaterno,
                user.genero && generoMap[user.genero],
                user.email,
                user.fechaNacimiento,
                user.estado,
                user.municipio,
                user.codigoPostal,
                user.colonia,
                user.estatus && estatusMap[user.estatus],
                user.tipoCuenta && tipoCuentaMap[user.tipoCuenta],
                <React.Fragment key={user._id}>
                  <Button color="primary" size="sm" onClick={() => handleDetail(user._id)}>Detalle</Button>
                  <Button color="primary" size="sm" onClick={() => handleUpdate(user._id)}>Actualizar</Button>
                  <Button color="primary" size="sm" onClick={() => handleDelete(user._id)}>Eliminar</Button>
                </React.Fragment>
              ])}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
