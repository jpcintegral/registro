import React,{ useEffect,useState } from "react";
import { useHistory, useParams } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
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
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import avatar from "assets/img/faces/jpc.jpg";
import Map from "../Maps/Maps.js";
import axios from "axios";
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
  const [markersData, setMarkersData] = useState([]);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [startDate, setStartDate] = React.useState();
  const [loading, setLoading] = useState(false);
  const [municipio, setMunicipios] = useState([]);
  const [estados, setestados] = useState([]);
  
  const { userId } = useParams();
  const [perfil, setPerfil] = useState(1);
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
    folio: "",
    vigenciaCredencial: "",
    lat: "",
    lon: "",
    fechaRegistro: null
  });
  
  useEffect(() => {
    // Actualizar el estado markersData con los nuevos valores de city, country y postalCode
   

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
        setPerfil(1);
         console.log(perfil);

         const newMarkersData = [
          {
            nombre: "jose pastor",
            edad: 46,
            state: "colima",
            municipality: "colima",
            neighborhood: 'la armonia',
            postalCode: "28020",
            street: 'independencia',
            number: '271',
          }
          // Resto de los objetos del markersData...
        ];
        setMarkersData(newMarkersData);
      }, [city, state, postalCode]);


  // Método para insertar un nuevo simpatizante
  const insertSimpatizante = async (formData) => {
    try {
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

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (userId && userId !== ":userId") {
      await updateSimpatizante(formData);
      history.push("/admin/Simpatizantes");
    } else { 
      console.log(formData)
     
     
      await insertSimpatizante(formData);
      history.push("/admin/Simpatizantes");
      
    }
  } catch (error) {
    console.error("Error:", error);
  }
};
 
const handlestateChange = (event) => {
  if(event.target.value){
   const obtenerMunicipios = cargarMunicipios(event.target.value);
   setMunicipios(obtenerMunicipios);
   setState(event.target.value);
  }
  console.log("estado"+event.target.value);
};

const handleDropdownChanEstado = (event) => {
  console.log(event)
  handlestateChange(event); // Llama a la primera función
  handleInputChange(event); // Llama a la segunda función
};

const handleDropdownChanMunicipio = (event) => {
  console.log(event)
  handleCityChange(event); // Llama a la primera función
  handleInputChange(event); // Llama a la segunda función
};

const handleInputChange = (e) => {
      console.log("done");
      const { name, value } = e.target;
      console.log("name:", name, "value:", value);
      setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      }));

  };

  const classes = useStyles();
  const handlePostalCodeChange = (event) => {
    setPostalCode(event.target.value);
    handleInputChange(event);
    console.log("codigo postal");
  };
  
  const handleCityChange  = (event) => {
    setCity(event.target.value);
     console.log("city");
  };
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
  };
  const generoOptions = [
    { id: "1", nombre: "Hombre" },
    { id: "2", nombre: "Mujer" },
    { id: "3", nombre: "Otro" }
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

  if(loading && formData.nombre){
    return "<CircularProgress />";
 }
   

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}>Simpatizante</h4>
              <p className={classes.cardCategoryWhite}>Nuevo simpatizante</p>
            </CardHeader>
            <form onSubmit={handleSubmit}>
            <CardBody>
            <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="NOMBRE"
                    id="nombre"
                    name="nombre"
                    inputProps={{  [userId ? 'defaultValue' : 'value']: formData.nombre, onChange: handleInputChange }}
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
                    inputProps={{  [userId ? 'defaultValue' : 'value']: formData.apellidoPaterno, onChange: handleInputChange }}
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
                    inputProps={{  [userId ? 'defaultValue' : 'value']: formData.apellidoMaterno, onChange: handleInputChange }}
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
                      inputProps={{  [userId ? 'defaultValue' : 'value']: formData.telefono, onChange: handleInputChange }}
                      formControlProps={{ fullWidth: true }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Email"
                      name="email"
                      inputProps={{  [userId ? 'defaultValue' : 'value']: formData.email, onChange: handleInputChange }}
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
                      inputProps={{  [userId ? 'defaultValue' : 'value']: formData.codigoPostal, onChange: handlePostalCodeChange }}
                      formControlProps={{ fullWidth: true }}
                    />
                    
                  </GridItem>
                  </GridContainer>
                  <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                   <CustomInput
                      labelText="Colonia"
                      name="colonia"
                      inputProps={{  [userId ? 'defaultValue' : 'value']: formData.colonia, onChange: handleInputChange }}
                      formControlProps={{ fullWidth: true }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                   <CustomInput
                    labelText="CALLE"
                    id="calle"
                    name="calle"
                    inputProps={{  [userId ? 'defaultValue' : 'value']: formData.calle, onChange: handleInputChange }}
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
                    inputProps={{  [userId ? 'defaultValue' : 'value']: formData.numeroCalle, onChange: handleInputChange }}
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
                    inputProps={{  [userId ? 'defaultValue' : 'value']: formData.seccion, onChange: handleInputChange }}
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
                    inputProps={{  [userId ? 'defaultValue' : 'value']: formData.localidad, onChange: handleInputChange }}
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
                    inputProps={{  [userId ? 'defaultValue' : 'value']: formData.claveElector, onChange: handleInputChange }}
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
                    inputProps={{  [userId ? 'defaultValue' : 'value']: formData.folio, onChange: handleInputChange }}
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
                    inputProps={{  [userId ? 'defaultValue' : 'value']: formData.vigenciaCredencial, onChange: handleInputChange }}
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
                    inputProps={{  [userId ? 'defaultValue' : 'value']: formData.lat , onChange: handleInputChange }}
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
                    inputProps={{  [userId ? 'defaultValue' : 'value']:  formData.lon , onChange: handleInputChange }}
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
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
                      [userId ? 'defaultValue' : 'value']: formData.comentarioPersonal, onChange: handleInputChange ,
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

        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={(e) => e.preventDefault()}>
                <img src={avatar} alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h6 className={classes.cardCategory}> SOFTWARE DEVELOPER</h6>
              <h4 className={classes.cardTitle}>Alec Thompson</h4>
              <p className={classes.description}>
                Desarrollo, mantenimineto e implemnetacion de sistemas.
              </p>
              <Button color="primary" round>
                Follow
              </Button>
            </CardBody>
          </Card>
            <GridContainer>
                  <GridItem xs={12} sm={12} md={12}>
                  <Map markersData_={markersData} width="100%" height="300px" onMapUpdate={handleMapUpdate}  />
                  </GridItem>
            </GridContainer>
        </GridItem>
      
      </GridContainer>

      
    
    </div>

  );
}
