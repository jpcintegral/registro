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

export default function Simpatizantes() {
  const history = useHistory();
  const classes = useStyles();
  const [simpatizantes, setSimpatizantes] = useState([]);

  const fetchSimpatizantes = async () => {
    try {
      const response = await axios.get("http://localhost:3800/api/simpatizantes");
      setSimpatizantes(response.data);
    } catch (error) {
      console.error("Error fetching simpatizantes:", error);
    }
  };

  useEffect(() => {
    fetchSimpatizantes();
  }, []);

  const handleDetail = (simpatizanteId) => {
    console.log(simpatizanteId); // Lógica para mostrar detalles del simpatizante
  };

  const handleUpdate = (simpatizanteId) => {
    // Lógica para actualizar el simpatizante
    history.push(`/admin/Simpatizante/${simpatizanteId}`); // Suponiendo que `/simpatizante-form/:simpatizanteId` es la ruta para el formulario SimpatizanteForm
  };

  const handleDelete = async (simpatizanteId) => {
    try {
      await axios.put(`http://localhost:3800/api/simpatizantes/desactivar/${simpatizanteId}`);
      const updatedSimpatizantes = simpatizantes.filter(simpatizante => simpatizante._id !== simpatizanteId);
      setSimpatizantes(updatedSimpatizantes);
    } catch (error) {
      console.error("Error deleting simpatizante:", error);
    }
  };

  const estatusMap = {
    "1": "Activo",
    "2": "Inactivo"
  }
  const generoMap = {
    "1": "Hombre",
    "2": "Mujer",
    "3": "Otro"
    }
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info">
            <h4 className={classes.cardTitleWhite}>Simpatizantes</h4>
            <p className={classes.cardCategoryWhite}>
              Lista de simpatizantes registrados.
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="info"
              tableHead={[
                "Nombre",
                "Apellido Paterno",
                "Apellido Materno",
                "Género",
                "Email",
                "Fecha de Nacimiento",
                "Estado",
                "Municipio",
                "Código Postal",
                "Colonia",
                "Calle",
                "Numero",
                "Estatus",
                "Acciones"
              ]}
              tableData={simpatizantes.map((simpatizante) => [
                simpatizante.nombre,
                simpatizante.apellidoPaterno,
                simpatizante.apellidoMaterno,
                simpatizante.genero && generoMap[simpatizante.genero],
                simpatizante.email,
                simpatizante.fechaNacimiento ? new Date(simpatizante.fechaNacimiento).toLocaleDateString('es-MX') : '',
                simpatizante.estado,
                simpatizante.municipio,
                simpatizante.codigoPostal,
                simpatizante.colonia,
                simpatizante.calle,
                simpatizante.numeroCalle,
                simpatizante.estatus && estatusMap[simpatizante.estatus],
                
                <React.Fragment key={simpatizante._id}>
                  <Button color="primary" size="sm" onClick={() => handleDetail(simpatizante._id)}>Detalle</Button>
                  <Button color="primary" size="sm" onClick={() => handleUpdate(simpatizante._id)}>Actualizar</Button>
                  <Button color="primary" size="sm" onClick={() => handleDelete(simpatizante._id)}>Eliminar</Button>
                </React.Fragment>
              ])}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
