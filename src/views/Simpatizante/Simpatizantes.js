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
import * as XLSX from 'xlsx';
import CustomInput from "components/CustomInput/CustomInput.js";
import Modal from "components/Modal/Modal.js";
import { ShimmerTable } from "react-shimmer-effects";
import EditIcon from '@material-ui/icons/Edit';
import Visibility from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import FileDownload from '@material-ui/icons/GetApp';
import jwt from 'jsonwebtoken';
//import jsPDF from 'jspdf';

//import avatar from "assets/img/faces/jpc.jpg";


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
  const key = process.env.REACT_APP_SECRET_KEY;  
  const admin= process.env.REACT_APP_ADMIN;
  const history = useHistory();
  const classes = useStyles();
  const [simpatizantes, setSimpatizantes] = useState([]);
  const [municipiosList,setMunicipiosList] = useState(null);
  const [estadosList,setEstadosList] =useState(null);
  const [loading, setLoading] = useState(false);
  const [filterValue, setFilterValue] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [detalleUsuario,setDetalleUsuario]=useState(null);
  const [idUsuarioBaja,setIdUsuarioBaja]= useState([]);
  const [perfil, setPerfil] = useState(0);
  

  const fetchSimpatizantes = async () => {
    try {
      const response = await axios.get("http://localhost:3800/api/simpatizantes");
      setSimpatizantes(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching simpatizantes:", error);
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
  
    fetchSimpatizantes();
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
        const decodedToken =jwt.verify(token,key);
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
  const handleDetail = (simpatizanteId) => {
   // Lógica para mostrar detalles del simpatizante
    const detalleUsuario = simpatizantes.find(user => user._id === simpatizanteId);
    setDetalleUsuario(detalleUsuario);
    handleOpenModal();
  };

  const handleUpdate = (simpatizanteId) => {
    // Lógica para actualizar el simpatizante
    history.push(`/admin/Simpatizante/${simpatizanteId}`); // Suponiendo que `/simpatizante-form/:simpatizanteId` es la ruta para el formulario SimpatizanteForm
  };

  const handleDelete = async (simpatizanteId) => {
    try {
      await axios.put(`http://localhost:3800/api/simpatizantes/desactivar/${simpatizanteId}/${idUsuarioBaja}`);
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

    const exportToExcelFilter = (data) => {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Simpatizantes");
      XLSX.writeFile(wb, "simpatizantesTabla.xlsx");
    };

    const exportToExcelBase = (data) => {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Simpatizantes");
      XLSX.writeFile(wb, "simpatizantesBase.xlsx");
    };
    const filteredSimpatizantes = simpatizantes.filter(simpatizante =>
      Object.values(simpatizante).some(field =>
        String(field).toLowerCase().includes(filterValue.toLowerCase())
      )
    );
  
    const printUserDetailToPDF = () => {
      // Verifica la documentación de la librería jsPDF para obtener más detalles: https://github.com/MrRio/jsPDF
      window.print();
    };
    const handleFilterChange = (e) => {
      setFilterValue(e.target.value);
    };

    

    const  Simpatizante = (simpatizante )=> {
      // Obtener la cadena base64 de imgElectorFrontal
      const base64Img = simpatizante;
    
      // Renderizar la imagen si la cadena base64 es válida
      return (
        <div>
           {base64Img ? (
            <img src={base64Img} alt="Credencial" className="img-elector" />
          ) : (
            ""
          )}
        </div>
      );
    }

    if(loading || !estadosList || !municipiosList){
      
      return <ShimmerTable row={6} col={6} />;
   }
  return ( 

    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="info">
            <h4 className={classes.cardTitleWhite}>Lista de simpatizantes registrados</h4>
            
            <p >
            <Button color="primary" size="sm" onClick={() => exportToExcelFilter(filteredSimpatizantes)}  disabled={admin !== perfil}><FileDownload/>Descargar Tabla</Button>
            <Button color="primary" size="sm" onClick={() => exportToExcelBase(simpatizantes)}  disabled={admin !== perfil}><FileDownload/>Descargar Base</Button>
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
              tableHeaderColor="gray"
              tableHead={[
                "Nombre",
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
              tableData={filteredSimpatizantes.map((simpatizante) => [
                `${simpatizante.nombre} ${simpatizante.apellidoPaterno} ${simpatizante.apellidoMaterno}` ,
                simpatizante.genero && generoMap[simpatizante.genero],
                simpatizante.email,
                simpatizante.fechaNacimiento ? new Date(simpatizante.fechaNacimiento).toLocaleDateString('es-MX') : '',
                getNombreEstado(simpatizante.estado),
                getNombreMunicipio(simpatizante.municipio),
                simpatizante.codigoPostal,
                simpatizante.colonia,
                simpatizante.calle,
                simpatizante.numeroCalle,
                simpatizante.estatus && estatusMap[simpatizante.estatus],
                
                <React.Fragment key={simpatizante._id}>
                  <Button color="primary" size="sm" onClick={() => handleDetail(simpatizante._id)}><Visibility/></Button>
                  <Button color="primary" size="sm" onClick={() => handleUpdate(simpatizante._id)}><EditIcon/></Button>
                  <Button color="primary" size="sm" onClick={() => handleDelete(simpatizante._id)} disabled={admin !== perfil}><DeleteIcon/></Button>
                </React.Fragment>
              ])}
            />
          </CardBody>
        </Card>
      </GridItem>
      <Modal open={openModal} onClose={handleCloseModal} title="Detalle">
        <GridItem xs={4} sm={4} md={4}>
        
                    { detalleUsuario && ( Simpatizante(detalleUsuario.imgElectorFrontal) )}
                 
        </GridItem>
      <GridItem xs={12} sm={12} md={12}>            
               
              {detalleUsuario && (
              <React.Fragment>
                <div className="card-container">
                <h6 className="card-title">
                  {detalleUsuario.nombre} {detalleUsuario.apellidoPaterno} {detalleUsuario.apellidoMaterno}
                </h6>
                <p className="description">Fecha de Nacimiento: {detalleUsuario.fechaNacimiento   ? new Date(detalleUsuario.fechaNacimiento).toLocaleDateString('es-MX') : '' }</p>
                <p className="description">Clave de Elector: {detalleUsuario.claveElector}</p>
                <p className="description">Curp: {detalleUsuario.curp}</p>
                <p className="description">Calle: {detalleUsuario.calle}</p>
                <p className="description">Colonia: {detalleUsuario.colonia}</p>
                <p className="description">Código Postal: {detalleUsuario.codigoPostal}</p>
                <p className="description">Estado: {getNombreEstado(detalleUsuario.estado)}</p>
                <p className="description">Municipio: {getNombreMunicipio(detalleUsuario.municipio)}</p>
                <p className="description">Email: {detalleUsuario.email}</p>
                <p className="description">Teléfono: {detalleUsuario.telefono}</p>
                <p className="description">Comentario Personal: {detalleUsuario.comentarioPersonal}</p>
                </div>
              </React.Fragment>
            )}         
        </GridItem>
        <GridItem xs={12}>
        <Button color="primary" size="sm"  className="hide-on-print" onClick={printUserDetailToPDF} disabled={admin !== perfil}>
          Imprimir
        </Button> 
        </GridItem>
      </Modal>    

    </GridContainer>
  );
}
