import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
import CustomDate from "components/CustomDate/CustomDate.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import axios from "axios";

const useStyles = makeStyles({
  // Estilos
});


export default function UserForm() {
    const classes = useStyles();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const { userId } = useParams();
    const [estados, setestados] = useState([]);
    const [municipio, setMunicipios] = useState([]);
    const [perfil, setPerfil] = useState(1);
    const [formData, setFormData] = useState({
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      genero: 0,
      telefono: "",
      email: "",
      fechaNacimiento: new Date(),
      estado: 0,
      municipio: 0,
      codigoPostal: "",
      colonia: "",
      comentarioPersonal: "",
      estatus: 0,
      tipoCuenta: 0,
      password: ""
    });
   
  
    useEffect(() => {
        if (userId && (userId!=":userId")) {
            setLoading(true);
           
          // Si hay un ID en los parámetros de la URL, obtén los datos del usuario
          axios.get(`http://localhost:3800/api/user/${userId}`)
            .then(response => {
              const userData = response.data;
              // Almacena temporalmente los datos del usuario en un objeto
              let tempData = {
                nombre: userData.nombre,
                apellidoPaterno: userData.apellidoPaterno,
                apellidoMaterno: userData.apellidoMaterno,
                genero: userData.genero,
                telefono: userData.telefono,
                email: userData.email,
                fechaNacimiento: new Date(userData.fechaNacimiento),
                estado: userData.estado,
                municipio: userData.municipio,
                codigoPostal: userData.codigoPostal,
                colonia: userData.colonia,
                comentarioPersonal: userData.comentarioPersonal,
                estatus: userData.estatus,
                tipoCuenta: userData.tipoCuenta,
                password: userData.password,
              };

              // Establece el estado formData con los datos temporales
              setFormData(tempData);
              const Municipios = cargarMunicipios(userData.estado);
               setMunicipios(Municipios);
              setLoading(false);

            })
            .catch(error => {
              console.error("Error al obtener datos del usuario:", error);
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
      }, [userId]);
      
    const handleInputChange = (e) => {
         console.log("done");
      const { name, value } = e.target;
      console.log("name:", name, "value:", value);
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        if (userId && userId != ":userId"  ) {
          // Si hay un ID en los parámetros de la URL, es una actualización
          await updateUsuario(formData);
          console.log("Usuario actualizado:", formData);
          history.push("/admin/UserSystems"); // Redirige a la ruta /admin/UserSystems
        } else {
          // Si no hay un ID en los parámetros de la URL, es una inserción
          await insertUsuario(formData);
          history.push("/admin/UserSystems");
          console.log("Usuario agregado:", formData);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    const updateUsuario = async (userData) => {
      // Lógica para actualizar el usuario en el backend
       await axios.put(`http://localhost:3800/api/user/${userId}`, userData);
    };
  
    const insertUsuario = async (userData) => {
      // Lógica para insertar un nuevo usuario en el backend
      await axios.post("http://localhost:3800/api/user", userData);
    };
  
    if(loading && formData.nombre){
        return "<CircularProgress />";
     }
       
  



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





 
      const generoOptions = [
      { id: "1", nombre: "Hombre" },
      { id: "2", nombre: "Mujer" },
      { id: "3", nombre: "Otro" }
    ];

      const estatus = [
        { id: "1", nombre: "Activo" },
        { id: "2", nombre: "Inactivo" }
       ]
       const tipoCuenta = [
        { id: "1", nombre: "Admin" },
        { id: "2", nombre: "Estandar" }
       ]
      const handlestateChange = (event) => {
        if(event.target.value){
         const obtenerMunicipios = cargarMunicipios(event.target.value);
         setMunicipios(obtenerMunicipios);
        }
        console.log("estado"+event.target.value);
     };
     
      const handleDropdownChanEstado = (event) => {
        console.log(event)
        handlestateChange(event); // Llama a la primera función
        handleInputChange(event); // Llama a la segunda función
      };
      
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}>
                {userId ? "Editar Usuario" : "Agregar Usuario"}
              </h4>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                    labelText="Nombre"
                    name="nombre"
                    inputProps={{
                        [userId ? 'defaultValue' : 'value']: formData.nombre,
                      onChange: handleInputChange,
                    }}
                    formControlProps={{ fullWidth: true }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Apellido Paterno"
                      name="apellidoPaterno"
                      inputProps={{  [userId ? 'defaultValue' : 'value']: formData.apellidoPaterno, onChange: handleInputChange }}
                      formControlProps={{ fullWidth: true }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomInput
                      labelText="Apellido Materno"
                      name="apellidoMaterno"
                      inputProps={{  [userId ? 'defaultValue' : 'value']: formData.apellidoMaterno, onChange: handleInputChange }}
                      formControlProps={{ fullWidth: true }}
                    />
                  </GridItem>
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
                    onChange={handleInputChange}
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
                      inputProps={{  [userId ? 'defaultValue' : 'value']: formData.codigoPostal, onChange: handleInputChange }}
                      formControlProps={{ fullWidth: true }}
                    />
                    
                  </GridItem>
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
                      labelText="Comentario Personal"
                      name="comentarioPersonal"
                      inputProps={{  [userId ? 'defaultValue' : 'value']: formData.comentarioPersonal, onChange: handleInputChange }}
                      formControlProps={{ fullWidth: true }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomDropdown
                    labelText="Estatus"
                    id="estatus"
                    name="estatus"
                    formControlProps={{ fullWidth: true }}
                    value={formData.estatus ? formData.estatus.toString() : ''}
                    onChange={handleInputChange}
                    >
                    {estatus.map((option) => (
                        <option key={option.id} value={option.id.toString()}>
                        {option.nombre}
                        </option>
                    ))}
                    </CustomDropdown>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                      <CustomDropdown
                    labelText="Tipo de Cuenta"
                    id="tipoCuenta"
                    name="tipoCuenta"
                    formControlProps={{ fullWidth: true }}
                    value={formData.tipoCuenta ? formData.tipoCuenta.toString() : ''}
                    onChange={handleInputChange}
                    >
                    {tipoCuenta.map((option) => (
                        <option key={option.id} value={option.id.toString()}>
                        {option.nombre}
                        </option>
                    ))}
                    </CustomDropdown>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}  style={{ display: perfil === 1 ? 'block' : 'none' }}>
                    <CustomInput
                      labelText="Contraseña"
                      name="password"
                      inputProps={{  [userId ? 'defaultValue' : 'value']: formData.password, onChange: handleInputChange }}
                      formControlProps={{ fullWidth: true }}
                    />
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <CustomDate
                      labelText="Fecha de Nacimiento"
                      name="fechaNacimiento"
                      selectedDate={formData.fechaNacimiento}
                      onChange={(date) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          fechaNacimiento: date,
                        }))
                      }
                      formControlProps={{ fullWidth: true }}
                    />
                  </GridItem>
                </GridContainer>
                <Button color="primary" type="submit">
                  { userId && userId != ":userId"  ? "Actualizar" : "Guardar"}
                </Button>
              </form>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
