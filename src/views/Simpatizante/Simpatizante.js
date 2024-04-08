import React,{ useEffect,useState } from "react";
import { useHistory, useParams } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";


import { List, ListItem, Checkbox, ListItemText } from "@material-ui/core"
//import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
import CustomDate from "components/CustomDate/CustomDate.js";


import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
//import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
//import avatar from "assets/img/faces/jpc.jpg";
import imgElectorDefault from "assets/img/imgElectorDefault.jpg"
import Map from "../Maps/Maps.js";
import axios from "axios";
import OCRSpace from "helpers/OCRSpace.js";
import formLoader from "helpers/formLoader.js";
import Modal from "components/Modal/Modal.js";
import Snackbar from "components/Snackbar/Snackbar.js";
//import imageToBase64 from 'image-to-base64';
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

export default function Simpatizante() {
  const history = useHistory();
  const classes = useStyles();
  
  
  const [markersData, setMarkersData] = useState([]);
  const [startDate, setStartDate] = React.useState();
  const [loading, setLoading] = useState(false);
  const [municipio, setMunicipios] = useState([]);
  const [estados, setestados] = useState([]);
  const [image, setImage] = useState(null);
  const [imageTracera, setImageTracera] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openModalMapa, setOpenModalMapa] = useState(false);
  
  const { userId } = useParams();
  //const [perfil, setPerfil] = useState(1);
  const [formDataImg, setFormDataImg] = useState(null);
  const [checkedFields, setCheckedFields] = useState([]);
  const [mensaje, setMensaje] = useState(null);
  const [bc, setBC] = useState(false);
  const [idUsuarioAlta,setIdUsuarioAlta]= useState([]);
  const [idUsuarioUpdate,setIdUsuarioUpdate]= useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    genero: "",
    edad: "",
    telefono: "",
    email: "",
    fechaNacimiento: new Date(),
    estado: "",
    municipio: "",
    colonia: "",
    calle: "",
    numeroCalle: "",
    seccion: "",
    codigoPostal: "",
    comentarioPersonal: "",
    estatus: "",
    localidad: "",
    claveElector: "",
    curp: "",
    folio: "",
    vigenciaCredencial: "",
    lat: "",
    lon: "",
    imgElectorFrontal: "",
    imgElectorTrasera: "",
    idUsuarioAlta: "",
    idUsuarioUpdate: "",
    fechaRegistro: null
  });
  
  useEffect(() => {
    // Actualizar el estado markersData con los nuevos valores de city, country y postalCode
    setIdUsuarioAlta("65f4b7048317e1d5dbc1807a");
    setIdUsuarioUpdate("65f4b7048317e1d5dbc1807a")

        if (userId && userId !== ":userId") {
          setLoading(true);
          axios.get(`http://localhost:3800/api/simpatizantes/${userId}`)
            .then(response => {
              const simpatizanteData = response.data;
              setFormData(simpatizanteData);
             
              const Municipios = cargarMunicipios(simpatizanteData.estado);
              setMunicipios(Municipios);
              setLoading(false);
            })
            .catch(error => {
              console.error("Error al obtener datos del simpatizante:", error);
              setLoading(false);
            });
        }
        // Método para obtener los estados desde la API
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
          setestados(estadosObtenidos);
        } catch (error) {
          console.error('Error al cargar los estados:', error);
        }
      }
      // Llamar a la función para cargar los estados
        cargarEstados();     
               
      }, [userId]);


  // Método para insertar un nuevo simpatizante
  const insertSimpatizante = async (formData) => {
    try {
      formData.idUsuarioAlta=idUsuarioAlta;
      // console.log("formData.imgElectorFrontal;",formData.imgElectorFrontal);
      const response = await axios.post(`http://localhost:3800/api/simpatizantes`, formData);
      return response.data; // Devuelve los datos del nuevo simpatizante creado
    } catch (error) {
      console.error("Error al insertar simpatizante:", error);
      throw error;
    }
  };
  
  // Método para actualizar un simpatizante existente
  const updateSimpatizante = async (formData) => {
    try {
      formData.idUsuarioUpdate=idUsuarioUpdate;
      //console.log("formData.imgElectorFrontal;",formData.imgElectorFrontal);
      const response = await axios.put(`http://localhost:3800/api/simpatizantes/${userId}`, formData);
      return response.data; // Devuelve los datos del simpatizante actualizado
    } catch (error) {
      console.error("Error al actualizar simpatizante:", error);
      throw error;
    }
  };
  
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
    setMunicipios(municipiosObtenidos);
  } catch (error) {
    console.error('Error al cargar los estados:', error);
  }

}
 function utpdateMapa(){
  const newMarkersData = [
    {
      nombre: formData.nombre + " " +formData.apellidoPaterno+" "+formData.apellidoMaterno ,
      state: getNombreEstado(formData.estado) ,
      municipality: getNombreMunicipio(formData.municipio) ,
      neighborhood: formData.colonia ,
      postalCode: formData.codigoPostal,
      street: formData.calle ,
      number: formData.numeroCalle,
    }
    // Resto de los objetos del markersData...
  ];
  setMarkersData(newMarkersData);

 }

 
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Validar que todos los campos obligatorios estén llenos
    const requiredFields = ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'genero', 'telefono', 'email', 'fechaNacimiento', 'estado', 'municipio', 'colonia', 'calle', 'numeroCalle', 'seccion', 'codigoPostal', 'claveElector', 'curp', 'vigenciaCredencial'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      // Si faltan campos obligatorios, mostrar una notificación con los campos faltantes
      const errorMessage = `Los siguientes campos son obligatorios: ${missingFields.join(', ')}`;
      showBottomCenterNotification(errorMessage);
    } else {
      // Todos los campos están llenos, proceder con el envío de datos
      if (userId && userId !== ":userId") {
        await updateSimpatizante(formData);
        history.push("/admin/Simpatizantes");
      } else {     
        await insertSimpatizante(formData);
        history.push("/admin/Simpatizantes");      
      }
    }
  } catch (error) {
    console.error("Error:", error);
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

const handleInputChange = (e) => {
      
      const { name, value } = e.target;
      setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      }));

  }


  const handlePostalCodeChange = (event) => {

    //setPostalCode(event.target.value);
    handleInputChange(event);

  }
  
  /*
  const handleCityChange  = (event) => {

    const nombreMunicipio= municipio.find((mcp)=> mcp.idMunicipio==event.target.value).nombre;
    setCity(nombreMunicipio);
    
  }
*/
  const handleDateChange = (date) => {

    setStartDate(date);
     // Crear el objeto con el nombre y el valor
  const dateObj = {
    target: {
      name: "fechaNacimiento",
      value: date,
    },
  };
    handleInputChange(dateObj);
  }

  const generoOptions = [
    { id: "1", nombre: "Hombre" },
    { id: "2", nombre: "Mujer" }
  ];

  const handleMapUpdate = (updatedMarkersData) => {
    // Actualiza el estado con los datos actualizados del mapa
    setFormData(prevFormData => ({
      ...prevFormData,
      lat: updatedMarkersData.lat,
      lon: updatedMarkersData.lon
    }));
    console.log("updatedMarkersData:",updatedMarkersData);
  };


 const  getBase64 = (file) => {

    return new Promise(resolve => {
    
      let baseURL = "";     
      let reader = new FileReader();      
      reader.readAsDataURL(file);      
      reader.onload = () => {
        baseURL = reader.result;
        resolve(baseURL);
      };
      
    });

  };

  const handleImageChange = async (e) => {

    const file = e.target.files[0];
      // Verificar si es un archivo de imagen válido
   
      setImage(URL.createObjectURL(file));
      const ocrs = await OCRSpace(file);
      console.log(ocrs.fechaNacimiento);
      setFormDataImg(ocrs);
      handleOpenModal();
      getBase64(file)
      .then(result => {
        file["base64"] = result;
        setFormData((prevFormData) => ({
          ...prevFormData,
          imgElectorFrontal: result
        }));
      })
      .catch(err => {
        console.log(err);
      });       
      e.target.value = null;
      
  };


  const handleImageTraceraChange = async (e) => {

    const file = e.target.files[0];
      // Verificar si es un archivo de imagen válido
      setImageTracera(URL.createObjectURL(file));
      //const ocrs = await OCRSpace(file);
      //console.log(ocrs.fechaNacimiento);
      //setFormDataImg(ocrs);
      //handleOpenModal();
      getBase64(file)
      .then(result => {
        file["base64"] = result;
        setFormData((prevFormData) => ({
          ...prevFormData,
          imgElectorTracera: result
        }));
      })
      .catch(err => {
        console.log(err);
      });       
      e.target.value = null;
      
  };

  const handleOpenModal = () => {   
    setOpenModal(true);
  }

  const handleCloseModal = () => {
    setOpenModal(false);
  }


  const handleOpenModalMapa = () => {

     // Verificar si los campos necesarios tienen datos
     if (!formData.codigoPostal || !formData.estado || !formData.municipio) {
      showBottomCenterNotification("Es necesario tener los siguientes datos ingresados: Estado, Municipio y Código Postal");
      return; // Detener la ejecución si falta algún dato
    }
      // 
    utpdateMapa();
    setOpenModalMapa(true);
  }

  const handleCloseModalMapa = () => {
    setOpenModalMapa(false);
  }


  const handleMoldalMapa = () => {      
        handleCloseModalMapa();
   };

   const showBottomCenterNotification = (message) => {
    // Mostrar la notificación en la parte inferior central
    setMensaje(message);
    setBC(true);
    setTimeout(() => {
      setBC(false);     
    }, 9000);
  };

  
   // Renderiza la lista de checkboxes
   const renderCheckboxes = () => {

    if (!formDataImg) return null; // Si no hay detalles de usuario, no renderiza nada
  
    const keys = Object.keys(formDataImg);
    const middleIndex = Math.ceil(keys.length / 2);
    const leftKeys = keys.slice(0, middleIndex);
    const rightKeys = keys.slice(middleIndex);
  
    return (
      <GridItem container spacing={2}>
        <GridItem item xs={6}>
          <List>
            {leftKeys.map((key) => (
              <ListItem key={key}>
                <Checkbox
                  checked={checkedFields[key] || false} // Estado del checkbox
                  onChange={handleCheckboxChange}
                  value={key}
                />
                <ListItemText primary={`Campo: ${key}`} secondary={`Texto: ${formDataImg[key]}`} />
              </ListItem>
            ))}
          </List>
        </GridItem>
        <GridItem item xs={6}>
          <List>
            {rightKeys.map((key) => (
              <ListItem key={key}>
                <Checkbox
                  checked={checkedFields[key] || false} // Estado del checkbox
                  onChange={handleCheckboxChange}
                  value={key}
                />
                <ListItemText primary={`Campo: ${key}`} secondary={`Texto: ${formDataImg[key]}`} />
              </ListItem>
            ))}
          </List>
        </GridItem>
      </GridItem>
    );

  }

  const handleCheckboxChange = (event) => {

   const { value, checked } = event.target; 
      try {
    
      setCheckedFields((prevCheckedFields) => ({
        ...prevCheckedFields,
        [value]: checked
      }));
      }catch(error){
      console.log("error al marcar los campos de la credencial", error);
      }
   
  }


  const handleCheckboxVerification = () => {
    // Verificar los checkboxes marcados y actualizar formData si es necesario
    Object.keys(checkedFields).forEach((field) => {
      if (checkedFields[field] && field in formDataImg) {
        // Verificar si el campo está marcado y existe en formDataImg
        let fieldValue = formDataImg[field];
        // Convertir el campo fechaNacimiento a un objeto Date si es necesario
        if (field === 'fechaNacimiento' && typeof fieldValue === 'string') {
          fieldValue = parseFechaNacimiento(fieldValue);
          if (!fieldValue) {
            return; // No actualizar formData si la fecha no es válida
          }
        }
       
       if (field ==='estado' &&  Number.isInteger(fieldValue)){        
        const Municipios = cargarMunicipios(fieldValue);
        setMunicipios(Municipios);
       }
       if (field ==='genero' &&  typeof fieldValue === 'string'){        
         switch (fieldValue) {
          case "M":
            fieldValue = 2
            break;
            case "H":
            fieldValue = 1
            break;
            default:
            fieldValue = ""
            break;
         }
       }

        setFormData((prevFormData) => ({
          ...prevFormData,
          [field]: fieldValue // Actualizar el valor del campo con el valor de formDataImg
        }));

        setCheckedFields((prevChecked) => ({
          ...prevChecked,
          [field]: false
        }));
      }
    });
    // Cerrar el modal después de la verificación
    handleCloseModal();
  };

      // Función para validar y convertir una cadena de fecha en un objeto Date válido
    const parseFechaNacimiento = (fechaString) => {

      const fechaNacimientoParts = fechaString.split("/");
      if (fechaNacimientoParts.length === 3) {
        const dia = parseInt(fechaNacimientoParts[0], 10);
        const mes = parseInt(fechaNacimientoParts[1], 10) - 1; // Restamos 1 al mes porque los meses en JavaScript van de 0 a 11
        const anio = parseInt(fechaNacimientoParts[2], 10);
        const fecha = new Date(anio, mes, dia);
        if (isNaN(fecha.getTime())) {
          console.error('La fecha de nacimiento no es válida:', fechaString);
          return null; // Devolver null si la fecha no es válida
        }
        return fecha;
      }
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

  return (
 
    <div>

    {loading && formData.nombre ? (
       formLoader()
    ):(
      <GridContainer>
        <GridItem xs={12} sm={12} md={9}>
          <Card>
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}>Simpatizante</h4>
              <p className={classes.cardCategoryWhite}>Nuevo simpatizante</p>
              <div style={{ marginBottom: '10px',float: 'inline-end' }}>
             
                <input accept="image/*" className="input-file" id="CredencialFrontal" onChange={handleImageChange} type="file" />
                  <label htmlFor="CredencialFrontal">
                    <Button variant="contained" color="primary" size="sm" component="span">
                    Credencial (Frontal)
                    </Button>
                  </label>
                <input accept="image/*" className="input-file" id="CredencialTracera" onChange={handleImageTraceraChange} type="file" />
                  <label htmlFor="CredencialTracera">
                    <Button variant="contained" color="primary" size="sm" component="span">
                    Credencial (Tracera)
                    </Button>
                  </label>
                </div>
            </CardHeader>
            <form onSubmit={handleSubmit}>
            <CardBody>
            <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="NOMBRE"
                    id="nombre"
                    name="nombre"
                    inputProps={{ value: formData.nombre || '', onChange: handleInputChange }}
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="APELLIDO PATERNO"
                    id="apellidoPaterno"
                    name="apellidoPaterno"
                    inputProps={{  value : formData.apellidoPaterno, onChange: handleInputChange }}
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="APELLIDO MATERNO"
                    id="apellidoMaterno"
                    name="apellidoMaterno"
                    inputProps={{ value : formData.apellidoMaterno, onChange: handleInputChange }}
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
              </GridContainer>

              <GridContainer>
                   <GridItem xs={12} sm={12} md={4}>
                   <CustomDropdown
                    labelText="Género"
                    id="genero"
                    name="genero"
                    formControlProps={{ fullWidth: true }}
                    value={formData.genero ? formData.genero.toString() : ''}
                    onChange={handleInputChange}
                    >
                    {generoOptions.map((option) => (
                        <option key={option.id} value={option.id.toString()}>
                        {option.nombre}
                        </option>
                    ))}
                    </CustomDropdown>

                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Teléfono"
                      name="telefono"
                      inputProps={{  value : formData.telefono, onChange: handleInputChange }}
                      formControlProps={{ fullWidth: true }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Email"
                      name="email"
                      inputProps={{ value : formData.email, onChange: handleInputChange }}
                      formControlProps={{ fullWidth: true }}
                    />
                  </GridItem>                  
               
              </GridContainer>
              <GridContainer>
              <GridItem xs={12} sm={12} md={4}>
                    <CustomDropdown
                      labelText="Estado"
                      id="estado"
                      name="estado"
                      formControlProps={{ fullWidth: true }}
                      value={estados.length > 0 && formData.estado ? formData.estado : ''}
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
                  <GridItem xs={12} sm={12} md={4}>
                  <CustomDropdown
                    labelText="Municipio"
                    id="municipio"
                    name="municipio"
                    formControlProps={{ fullWidth: true }}
                    value={municipio.length > 0 && formData.municipio ? formData.municipio : ''}
                    onChange={handleDropdownChanMunicipio}
                    >
                    { municipio.length > 0 && municipio && municipio.map((municipio) => (
                      <option key={municipio.idMunicipio} value={municipio.idMunicipio}>
                        {municipio.nombre}
                      </option>
                    ))}
                  </CustomDropdown>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Código Postal"
                      name="codigoPostal"
                      inputProps={{ value : formData.codigoPostal, onChange: handlePostalCodeChange }}
                      formControlProps={{ fullWidth: true }}
                    />
                    
                  </GridItem>
                  </GridContainer>
                  <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                   <CustomInput
                      labelText="Colonia"
                      name="colonia"
                      inputProps={{  value : formData.colonia, onChange: handleInputChange }}
                      formControlProps={{ fullWidth: true }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                   <CustomInput
                    labelText="CALLE"
                    id="calle"
                    name="calle"
                    inputProps={{ value: formData.calle, onChange: handleInputChange }}
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="NUMERO CALLE"
                    id="numeroCalle"
                    name="numeroCalle"
                    inputProps={{  value : formData.numeroCalle, onChange: handleInputChange }}
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>                
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="SECCION"
                    id="seccion"
                    name="seccion"
                    inputProps={{ value : formData.seccion, onChange: handleInputChange }}
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
              
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="LOCALIDAD"
                    id="localidad"
                    name="localidad"
                    inputProps={{  value : formData.localidad, onChange: handleInputChange }}
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="CLAVE ELECTOR"
                    id="claveElector"
                    name="claveElector"
                    inputProps={{ value : formData.claveElector, onChange: handleInputChange }}
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="FOLIO"
                    id="folio"
                    name="folio"
                    inputProps={{ value : formData.folio, onChange: handleInputChange }}
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="VIGENCIA CREDENCIAL"
                    id="vigenciaCredencial"
                    name="vigenciaCredencial"
                    inputProps={{ value : formData.vigenciaCredencial, onChange: handleInputChange }}
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomDate
                    labelText="Fecha de nacimiento"
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    error={false}
                    success={false}
                    rtlActive={false}
                    selectedDate={ formData.fechaNacimiento ? formData.fechaNacimiento :startDate}
                    onDateChange={handleDateChange}
                  />
                </GridItem>
              </GridContainer>




              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="LATITUD"
                    id="lat"
                    name="lat"
                    inputProps={{ value : formData.lat , onChange: handleInputChange }}
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="LONGITUD"
                    id="lon"
                    name="lon"
                    inputProps={{ value : formData.lon , onChange: handleInputChange }}
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="CURP"
                    id="curp"
                    name="curp"
                    inputProps={{ value : formData.curp , onChange: handleInputChange }}
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                    <Button color="primary" size="sm" variant="contained" onClick={handleOpenModalMapa}>
                    buscar mapa
                    </Button>
              </GridItem>
              </GridContainer>

              
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="COMENTARIO PERSONAL"
                    id="comentarioPersonal"
                    name="comentarioPersonal"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      value : formData.comentarioPersonal, onChange: handleInputChange ,
                      multiline: true,
                      rows: 5,
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
             <Button color="primary" type="submit">
                  { userId && userId != ":userId"  ? "Actualizar" : "Guardar"}
                </Button>
            </CardFooter>
            </form>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={12} md={3}>
        <GridItem xs={12} sm={12} md={12}>
          <Card profile className="img-container">
          <div className="img-container">
           <img src={image ? image: imgElectorDefault} alt="Imagen" />
          </div>
          </Card>
          </GridItem>
          <GridItem xs={12} sm={12} md={12}>
                  
          {imageTracera && (
            <Card profile className="img-container">
            <div className="img-container">
              <img src={imageTracera} alt="ImagenTracera" />
            </div>
             </Card>
          )}         
          </GridItem>
          
          
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
        <Modal open={openModal} onClose={handleCloseModal} title="Detalle"
        nota="Por favor, verifique que los datos escaneados sean correctos y seleccione los que corresponden a la credencial."
        >
        <GridItem xs={12} sm={12} md={12}>
          {/* Aquí va el contenido del modal */}
            <div className="card-container">
              <div className="img-container">
                <img src={image } alt="Imagen" />
              </div>
            </div>
          {/* Renderiza la lista de checkboxes */}
          {renderCheckboxes()}
        </GridItem>
        <GridItem xs={12}>
        <Button color="primary" variant="contained" onClick={handleCheckboxVerification}>
            Verificar y Actualizar
          </Button>
        </GridItem>        
      </Modal>
      </GridItem>

      <GridItem xs={12} sm={12} md={12}>
        <Modal open={openModalMapa} onClose={handleCloseModalMapa} title="Mapa"
        nota="Por favor, ubica y coloca la marca en el mapa en la ubicación del domicilio y luego presiona aceptar.">
          
          <GridContainer>
                
                <GridItem xs={12}>
                <labe>Dirección :</labe> 
                  <label>Calle: {[formData.calle,"#"+formData.numeroCalle].join(' ')} </label> <br/>
                  <label>Colonia: {formData.colonia} </label> <br/>
                  <label>Estado: {getNombreEstado(formData.estado)} </label> 
                  <label>Municipio: {getNombreMunicipio(formData.municipio)} </label> <br/>
                  <label>CP: {formData.codigoPostal} </label>
                </GridItem>
           </GridContainer>
          {           
            <GridItem xs={12} sm={12} md={12}>
              <Map markersData_={markersData} width="100%" height="300px" onMapUpdate={handleMapUpdate}  />
            </GridItem> 
           }
        <GridItem xs={4}>
          <Button color="primary" variant="contained" onClick={handleMoldalMapa}>
              Guardar ubicacion
          </Button>
        </GridItem>    
        <GridItem xs={4} >
                <labe>long: {formData.lat }</labe>  
                <labe>long :{formData.lon }</labe> 
                </GridItem>
                 
      </Modal>
      </GridItem>
      <Snackbar
        place="tc"
        color="warning"
        message={mensaje}
        open={bc}
        closeNotification={() => setBC(false)}
        close
      />
      </GridContainer>      
      )}
    </div>

  );
}
