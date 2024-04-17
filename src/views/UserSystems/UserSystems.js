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
//import avatar from "assets/img/faces/jpc.jpg";
import { ShimmerTable } from "react-shimmer-effects";
import EditIcon from '@material-ui/icons/Edit';
import Visibility from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import FileDownload from '@material-ui/icons/GetApp';
import jwt from 'jsonwebtoken';
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
  const url=process.env.REACT_APP_API_URL;
  const admin= process.env.REACT_APP_ADMIN;
  const key = process.env.REACT_APP_SECRET_KEY;  
  const history = useHistory();
  const classes = useStyles();
 const [users, setUsers] = useState([]);
  const [filterValue, setFilterValue] = useState('');
  const [municipiosList,setMunicipiosList] = useState(null);
  const [estadosList,setEstadosList] =useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [detalleUsuario,setDetalleUsuario]=useState(null);
  const [loading, setLoading] = useState(false);
  const [idUsuarioBaja,setIdUsuarioBaja]= useState([]);
  const [perfil, setPerfil] = useState(0);
 
  const fetchUsers = async () => {
    try {
      const token = getCookie("token"); // Suponiendo que tengas una función para obtener la cookie del token
      const config = {
        headers: {
          Authorization: `Bearer ${token}` // Añade el token al encabezado de autorización
        }
      };
      const response = await axios.get(`${url}/api/users`,config);
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const getEstados = async () =>{
    try {
      const responseEstados= await axios.get(`${url}/api/estados`);
      setEstadosList(responseEstados.data);
      setLoading(false);
    } catch(error) {
      console.error("Errro get estados:", error);
    }
   }

   const getMunicipos = async () =>{
    try {
      const responseMunicipios= await axios.get(`${url}/api/municipios`);
      setMunicipiosList(responseMunicipios.data);
      setLoading(false);
    } catch(error) {
      console.error("Errro get estados:", error);
    }
   }

  useEffect(() => {
    
    setLoading(true);
    fetchUsers();
    getEstados();
    getMunicipos();
  // Llamar a la función para decodificar y asignar los valores de la cookie
     decodeAndSetValuesFromCookie();
  }, []);

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
  
  const decodeAndSetValuesFromCookie = () => {
    const token = getCookie('token'); // Reemplaza 'your_cookie_name' con el nombre real de tu cookie
    if (token) {
      try {
        const decodedToken = jwt.verify(token,key);
        if (decodedToken) {
          const { user, perfil } = decodedToken.data;
          // Asignar los valores de user y perfil a las variables
          setIdUsuarioBaja(user);
          setPerfil(perfil);
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    } else {
      console.error('La cookie no fue encontrada o está vacía.');
    }
  };
  

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleDetail = (userId) => {
    const detalleUsuario = users.find(user => user._id === userId);
    setDetalleUsuario(detalleUsuario);
    handleOpenModal();
  };

  const handleUpdate = (userId) => {
    // Lógica para actualizar el usuario
    
  history.push(`/admin/UserForm/${userId}`); // Suponiendo que `/user-form/:userId` es la ruta para el formulario UserForm
  };

  function getNombreMunicipio(idMunicipio) {
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
      const token = getCookie("token"); // Suponiendo que tengas una función para obtener la cookie del token
      const config = {
        headers: {
          Authorization: `Bearer ${token}` // Añade el token al encabezado de autorización
        }
      };
      await axios.put(`${url}/api/user/desactivar/${userId}/${idUsuarioBaja}`,config);
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

  if(loading){
      
    return <ShimmerTable row={6} col={6} />;
 }

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info">
            <h4 className={classes.cardTitleWhite}>  Lista de usuarios registrados</h4>
            <p >
            <Button color="primary" size="sm" onClick={() => exportToExcelFilter(filteredUsers)} disabled={admin != perfil}><FileDownload/>Descargar Tabla</Button>
            <Button color="primary" size="sm" onClick={() => exportToExcelBase(users)} disabled={admin != perfil}><FileDownload/>Descargar Base</Button>
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
                  <Button color="primary" size="sm" onClick={() => handleDetail(user._id)}><Visibility/></Button>
                  <Button color="primary" size="sm" onClick={() => handleUpdate(user._id)}><EditIcon/></Button>
                  <Button color="primary" size="sm" onClick={() => handleDelete(user._id)} disabled={admin != perfil}><DeleteIcon/></Button>
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
        <Button color="primary" size="sm"  className="hide-on-print" onClick={printUserDetailToPDF} disabled={admin != perfil}>
          Imprimir
        </Button>
             
            </CardBody>
          </Card>
           
        </GridItem>
      </Modal>
    </GridContainer>
  );

}

