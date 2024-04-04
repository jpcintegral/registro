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
import CustomInput from "components/CustomInput/CustomInput.js";
import * as XLSX from 'xlsx';
import Modal from "components/Modal/Modal.js";
import CardAvatar from "components/Card/CardAvatar.js";
import avatar from "assets/img/faces/jpc.jpg";

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
  const [filterValue, setFilterValue] = useState('');
  const [municipiosList,setMunicipiosList] = useState(null);
  const [estadosList,setEstadosList] =useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [detalleUsuario,setDetalleUsuario]=useState(null);

 
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3800/api/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const getEstados = async () =>{
    try {
      const responseEstados= await axios.get("http://localhost:3800/api/estados");
      setEstadosList(responseEstados.data);
    } catch(error) {
      console.error("Errro get estados:", error);
    }
   }

   const getMunicipos = async () =>{
    try {
      const responseMunicipios= await axios.get("http://localhost:3800/api/municipios");
      setMunicipiosList(responseMunicipios.data);
    } catch(error) {
      console.error("Errro get estados:", error);
    }
   }

  useEffect(() => {
    fetchUsers();
    getEstados();
    getMunicipos();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleDetail = (userId) => {
    console.log(userId);
    const detalleUsuario = users.find(user => user._id === userId);
    setDetalleUsuario(detalleUsuario);
    handleOpenModal();
  };

  const handleUpdate = (userId) => {
    // Lógica para actualizar el usuario
    
  history.push(`/admin/UserForm/${userId}`); // Suponiendo que `/user-form/:userId` es la ruta para el formulario UserForm
  };

  function getNombreMunicipio(idMunicipio) {
    console.log("municipiosList",municipiosList);
   if (municipiosList && municipiosList.length > 0) {
     const municipioEncontrado = municipiosList.find((mcp) => mcp.idMunicipio === idMunicipio);
     return municipioEncontrado ? municipioEncontrado.nombre : "";
   }
   return "";
 }
  function getNombreEstado(idEstado) {
    if (estadosList && estadosList.length > 0) {
      const estadoEncontrado = estadosList.find((est) => est.idEstado === idEstado);
      return estadoEncontrado ? estadoEncontrado.nombre : "";
    }
    return "";
  }
  const handleDelete = async (userId) => {
    try {
      await axios.put(`http://localhost:3800/api/user/desactivar/${userId}`);
      const updatedUsers = users.filter(user => user._id !== userId);
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
 
  const exportToExcelFilter = (data) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "users");
    XLSX.writeFile(wb, "usuariosTabla.xlsx");
  };

  const exportToExcelBase = (data) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "users");
    XLSX.writeFile(wb, "usuariosBase.xlsx");
  };
  const filteredUsers = users.filter(users =>
    Object.values(users).some(field =>
      String(field).toLowerCase().includes(filterValue.toLowerCase())
    )
  );

  const handleFilterChange = (e) => {console.log("filtro:",e.target.value)
    setFilterValue(e.target.value);
  };
  const printUserDetailToPDF = () => {
    // Función para imprimir los datos del usuario en un PDF
    // Aquí puedes colocar la lógica para imprimir los datos en un PDF
    // Utilizando la función window.print() o cualquier otra librería de generación de PDF
    // Por ejemplo, puedes utilizar jsPDF para generar un PDF en el lado del cliente
    // Verifica la documentación de la librería jsPDF para obtener más detalles: https://github.com/MrRio/jsPDF
    window.print();
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
            <p >
            <Button color="primary" size="sm" onClick={() => exportToExcelFilter(filteredUsers)}>Descargar Tabla</Button>
            <Button color="primary" size="sm" onClick={() => exportToExcelBase(users)}>Descargar Base</Button>
            </p>
          </CardHeader>
          <CardBody>
          <div style={{ marginBottom: '10px',float: 'inline-end' }}>
               <CustomInput
                    labelText="Filtrar"
                    id="Filtrar"
                    name="Filtrar"
                    inputProps={{ 'value': filterValue, onChange: handleFilterChange }}
                    formControlProps={{
                      fullWidth: false,
                    }}
                  />
            </div>
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
              tableData={filteredUsers.map((user) => [
                user.nombre,
                user.apellidoPaterno,
                user.apellidoMaterno,
                user.genero && generoMap[user.genero],
                user.email,
                user.fechaNacimiento,
                getNombreEstado(user.estado),
                getNombreMunicipio(user.municipio),
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
      <Modal open={openModal} onClose={handleCloseModal} title="Detalle">
      <GridItem xs={12} sm={12} md={12}>
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={(e) => e.preventDefault()}>
                <img src={avatar} alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile >
              {detalleUsuario && (
              <React.Fragment>
                <div className="card-container">
                <h6 className="card-title">
                  {detalleUsuario.nombre} {detalleUsuario.apellidoPaterno} {detalleUsuario.apellidoMaterno}
                </h6>
                <p className="description">Email: {detalleUsuario.email}</p>
                <p className="description">Teléfono: {detalleUsuario.telefono}</p>
                <p className="description">Fecha de Nacimiento: {detalleUsuario.fechaNacimiento}</p>
                <p className="description">Estado: {getNombreEstado(detalleUsuario.estado)}</p>
                <p className="description">Municipio: {getNombreMunicipio(detalleUsuario.municipio)}</p>
                <p className="description">Código Postal: {detalleUsuario.codigoPostal}</p>
                <p className="description">Colonia: {detalleUsuario.colonia}</p>
                <p className="description">Comentario Personal: {detalleUsuario.comentarioPersonal}</p>
                </div>
              </React.Fragment>
            )}
        <Button color="primary" size="sm"  className="hide-on-print" onClick={printUserDetailToPDF}>
          Imprimir
        </Button>
             
            </CardBody>
          </Card>
           
        </GridItem>
      </Modal>
    </GridContainer>
  );
}
