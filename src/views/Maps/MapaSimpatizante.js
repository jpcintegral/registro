import React, { useState ,useEffect} from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
//import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
import Map from "../Maps/Maps.js";
import axios from "axios";
import Snackbar from "components/Snackbar/Snackbar.js";
import Button from "components/CustomButtons/Button.js";
import CardFooter from "components/Card/CardFooter.js";
import CardBody from "components/Card/CardBody.js";
import SpinnerOverlay from "helpers/SpinnerOverlay.js";
const styles = {
    cardCategoryWhite: {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    cardTitleWhite: {
      color: "#FFFFFF",
      marginTop: "0px",
      minHeight: "auto",
      fontWeight: "300",
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      marginBottom: "3px",
      textDecoration: "none",
    },
  };
  

const useStyles = makeStyles(styles);
export default function MapaSipatizantes (){
    const classes = useStyles();
    const [municipio, setMunicipios] = useState([]);
    const [estados, setestados] = useState([]);
    const [mensaje, setMensaje] = useState(null);
    const [bc, setBC] = useState(false);
    const [spinner,setSpinner]= useState(false);
    
    
    const [formDataFilter, setFormDataFilter] = useState({
        estado: "",
        municipio: "",
        colonia: "",
        codigoPostal: "",
        genero: "",
        calle: "",
        seccion: "",
      });

  
  const [markersData, setMarkersData] = useState([
    {
        
      nombre: "Juan",
      edad: 30,
      state: "Colima",
      municipality: "Colima",
      neighborhood: "Centro",
      postalCode: "28000",
      street: "Independencia",
      number: "123",
    },
    {
      nombre: "Maria",
      edad: 25,
      state: "Colima",
      municipality: "Colima",
      neighborhood: "Reforma",
      postalCode: "28050",
      street: "Benito Juarez",
      number: "456",
    },
  ]);

  useEffect(() => {
    async function obtenerEstados() {
        try {
          const response = await axios.get('http://localhost:3800/api/estados');
          return response.data.map((estado) => ({ idEstado: estado.idEstado, nombre: estado.nombre }));
        } catch (error) {
          console.error('Error al obtener los estados:', error);
          return [];
        }
      }
      
    // Llamar a la función asincrónica y asignar el resultado a estados
    async function cargarEstados() {
      try {
        const estadosObtenidos = await obtenerEstados();
        const estadoConBlanco = [{ id: "", nombre: "" }, ...estadosObtenidos];;
        setestados(estadoConBlanco);
      } catch (error) {
        console.error('Error al cargar los estados:', error);
      }
    }
    // Llamar a la función para cargar los estados
      cargarEstados();     
             
    
  }, [])
  
  const generoOptions = [
    { id: "1", nombre: "Hombre" },
    { id: "2", nombre: "Mujer" }
  ];
 // Método para obtener los municipios de un estado específico desde la API
 async function obtenerMunicipios(idEstado) {
    try {
      const response = await axios.get(`http://localhost:3800/api/municipios/${idEstado}`);
      return response.data.map((municipio) => ({ idMunicipio: municipio.idMunicipio, nombre: municipio.nombre }));
    } catch (error) {
      console.error('Error al obtener los municipios:', error);
      return [];
    }
  }
  async function cargarMunicipios(idEstado) {
   
    try {
      const municipiosObtenidos = await obtenerMunicipios(idEstado);
      const municipiosConBlanco = [{ id: "", nombre: "" }, ...municipiosObtenidos];;
      setMunicipios(municipiosConBlanco);
    } catch (error) {
      console.error('Error al cargar los estados:', error);
    }
  
  }

  const handlestateChange = (event) => {

    if(event.target.value){
     const obtenerMunicipios = cargarMunicipios(event.target.value);
     setMunicipios(obtenerMunicipios);
     //const nombreEstado= estados.find((etd)=> etd.idEstado==event.target.value).nombre;
     //setState(nombreEstado);
    }
  }
    const handleDropdownChanEstado = (event) => {
        handlestateChange(event); // Llama a la primera función
        handleInputChange(event); // Llama a la segunda función
      }
      
      const handleDropdownChanMunicipio = (event) => {
      
        //handleCityChange(event); // Llama a la primera función
        handleInputChange(event); // Llama a la segunda función
      
      }
      const handlePostalCodeChange = (event) => {

        //setPostalCode(event.target.value);
        handleInputChange(event);
    
      }
      const handleInputChange = (e) => {
            
            const { name, value } = e.target;
            setFormDataFilter((prevData) => ({
            ...prevData,
            [name]: value,
            }));
      
        }

    function getNombreMunicipio(idMunicipio) {
      if (municipio && municipio.length > 0) {
       const municipioEncontrado = municipio.find((mcp) => mcp.idMunicipio === idMunicipio);
       return municipioEncontrado ? municipioEncontrado.nombre : "";
     }
     return "";
   }
   function getNombreEstado(idEstado) {
     if (estados && estados.length > 0) {
       const estadoEncontrado = estados.find((est) => est.idEstado === idEstado);
       return estadoEncontrado ? estadoEncontrado.nombre : "";
     }
     return "";
   }
  
  const handleMapUpdate = (updatedMarkersData) => {
    // Actualizar el estado con los nuevos datos de marcadores
    console.log(updatedMarkersData);
    //setMarkersData(updatedMarkersData);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSpinner(true);
    try {
      // Validar que todos los campos obligatorios estén llenos
      const requiredFields = [  'genero',   'estado', 'municipio', 'colonia', 'calle',  'seccion', 'codigoPostal'];
      const missingFields = requiredFields.filter(field => formDataFilter[field]);
  
      if (missingFields.length === 0) {
        // Si faltan campos obligatorios, mostrar una notificación con los campos faltantes
        const errorMessage = `Debe ingresar al menos un campo para realizar la búsqueda`;
        showBottomCenterNotification(errorMessage);
      } else {
        const response = await axios.get("http://localhost:3800/api/simpatizantes/filtrosMapa",{params: formDataFilter});
      
        const newMarkersData = [];
        if (response && response.data.length > 0) {
            response.data.forEach(data => {
              newMarkersData.push({
                _id: data._id,
                nombre: data.nombre + " " + data.apellidoPaterno + " " + data.apellidoMaterno,
                state: getNombreEstado(data.estado),
                municipality: getNombreMunicipio(data.municipio),
                neighborhood: data.colonia,
                postalCode: data.codigoPostal,
                street: data.calle,
                number: data.numeroCalle,
                lon : data.lon,
                lat : data.lat
              });
            });
            setMarkersData(newMarkersData);
            setSpinner(false);
          }else{
            const errorMessage = "Los parámetros seleccionados no devolvieron datos, por favor selecciona otros parámetros";
            showBottomCenterNotification(errorMessage);
            setSpinner(false);
          }
         
      }
    } catch (error) {
      setSpinner(false);
      console.error("Error handleSubmit:", error);
    }
  }
 
  const showBottomCenterNotification = (message) => {
    // Mostrar la notificación en la parte inferior central
    setMensaje(message);
    setBC(true);
    setTimeout(() => {
      setBC(false);     
    }, 9000);
  };

  return (
    <div>
         <form onSubmit={handleSubmit}>
            <GridContainer>
                <GridItem xs={12} sm={12} md={3}>
                <Card>
                    <CardHeader color="info">
                    <h4 className={classes.cardTitleWhite}>Mapa de Simpatizante</h4>         
                    </CardHeader>
                    <CardBody>
                    <GridContainer>
                    <GridItem xs={12} sm={12} md={6}>
                            <CustomDropdown
                            labelText="Estado"
                            id="estado"
                            name="estado"
                            formControlProps={{ fullWidth: true }}
                            value={estados.length > 0 && formDataFilter.estado ? formDataFilter.estado : ''}
                            onChange={handleDropdownChanEstado} // Llama a la función que invoca ambas funciones
                                                >
                            {estados.length > 0 && estados.map((estado) => (
                            <option key={estado.idEstado } value={estado.idEstado } >
                                {estado.nombre}
                            </option>
                            ))}
                            {/* Agrega más opciones aquí si es necesario */}
                            </CustomDropdown>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                        <CustomDropdown
                            labelText="Municipio"
                            id="municipio"
                            name="municipio"
                            formControlProps={{ fullWidth: true }}
                            value={municipio.length > 0 && formDataFilter.municipio ? formDataFilter.municipio : ''}
                            onChange={handleDropdownChanMunicipio}
                            >
                            { municipio.length > 0 && municipio && municipio.map((municipio) => (
                            <option key={municipio.idMunicipio} value={municipio.idMunicipio}>
                                {municipio.nombre}
                            </option>
                            ))}
                        </CustomDropdown>
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                            labelText="Colonia"
                            name="colonia"
                            inputProps={{  value : formDataFilter.colonia, onChange: handleInputChange }}
                            formControlProps={{ fullWidth: true }}
                            />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                            labelText="CALLE"
                            id="calle"
                            name="calle"
                            inputProps={{ value: formDataFilter.calle, onChange: handleInputChange }}
                            formControlProps={{
                            fullWidth: true,
                            }}
                        />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <CustomInput
                            labelText="Código Postal"
                            name="codigoPostal"
                            inputProps={{ value : formDataFilter.codigoPostal, onChange: handlePostalCodeChange }}
                            formControlProps={{ fullWidth: true }}
                            />
                            
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                        <CustomInput
                            labelText="SECCION"
                            id="seccion"
                            name="seccion"
                            inputProps={{ value : formDataFilter.seccion, onChange: handleInputChange }}
                            formControlProps={{
                            fullWidth: true,
                            }}
                        />
                        </GridItem>
                        <GridItem xs={12} sm={12} md={6}>
                            <CustomDropdown
                                labelText="Género"
                                id="genero"
                                name="genero"
                                formControlProps={{ fullWidth: true }}
                                value={formDataFilter.genero ? formDataFilter.genero.toString() : ''}
                                onChange={handleInputChange}
                                >
                                {generoOptions.map((option) => (
                                    <option key={option.id} value={option.id.toString()}>
                                    {option.nombre}
                                    </option>
                                ))}
                                </CustomDropdown>

                            </GridItem>
                        </GridContainer>
                        </CardBody>
                        <CardFooter>
                    <Button color="primary" type="submit">
                        { "Buscar" }
                        </Button>
                    </CardFooter>
               
                </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={9}>
                <Map markersData_={markersData}  width="80%"  onMapUpdate={handleMapUpdate} />
            </GridItem>
            </GridContainer>
            
         </form>
         <Snackbar
        place="tc"
        color="warning"
        message={mensaje}
        open={bc}
        closeNotification={() => setBC(false)}
        close
      />

<SpinnerOverlay  open={spinner}/>
    </div>
  );
}

