import React,{ useEffect,useState } from "react";
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

const municipiosColima = [
  "Armería",
  "Colima",
  "Comala",
  "Coquimatlán",
  "Cuauhtémoc",
  "Ixtlahuacán",
  "Manzanillo",
  "Minatitlán",
  "Tecomán",
  "Villa de Álvarez",
  // Agrega más municipios aquí si es necesario
];

const useStyles = makeStyles(styles);

export default function UserProfile() {
  const [markersData, setMarkersData] = useState([]);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [startDate, setStartDate] = React.useState();
  useEffect(() => {
    // Actualizar el estado markersData con los nuevos valores de city, country y postalCode
    const newMarkersData = [
      {
        nombre: "jose pastor",
        edad: 46,
        state: state,
        municipality: city,
        neighborhood: 'la armonia',
        postalCode: postalCode,
        street: 'independencia',
        number: '271',
      }
      // Resto de los objetos del markersData...
    ];
  if(state && city && postalCode){
    setMarkersData(newMarkersData);
  }
  }, [city, state, postalCode]);

  const classes = useStyles();
  const handlePostalCodeChange = (event) => {
    setPostalCode(event.target.value);
    console.log("codigo postal");
  };
  const handlestateChange = (event) => {
    setState(event.target.value);
    console.log("estado");
  };
  const handleCityChange  = (event) => {
    setCity(event.target.value);
     console.log("city");
  };
  const handleDateChange = (date) => {
    setStartDate(date);
    console.log(date);
  };
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="info">
              <h4 className={classes.cardTitleWhite}>Simpatizante</h4>
              <p className={classes.cardCategoryWhite}>Nuevo simpatizante</p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="NOMBRE"
                    id="company-disabled"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="APELLIDO PATERNO"
                    id="ApellidoP"
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="APELLIDO MATERNO"
                    id="ApellidoP"
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
                
              </GridContainer>
              <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="EMAIL"
                    id="email-address"
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                <CustomDate
                        labelText="Fecha de nacimiento"
                        id="date"
                        formControlProps={{
                        
                          fullWidth: true,
                        }}
                        error={false}
                        success={false}
                        rtlActive={false}
                        selectedDate={startDate} // Pasar selectedDate como prop
                        onDateChange={handleDateChange} // Cambiar nombre de la prop onChange a onDateChange
                      />
                </GridItem>
                </GridContainer>
              
              <GridContainer>
                <GridItem xs={12} sm={12} md={4}>
                   <CustomDropdown
                labelText="ESTADO"
                id="ESTADO_"
                formControlProps={{
                  fullWidth: true,
                }}
                selectProps={{
                  native: true,
                }}
                onChange={handlestateChange}
              >
                  <option value=""></option>
                  <option value="Colima">COLIMA</option>
                  {/* Agrega más opciones aquí si es necesario */}
                </CustomDropdown>
                </GridItem>
                <GridItem xs={12} sm={12} md={4}>
                  <CustomDropdown
                  labelText="MUNICIPIO_"
                  id="MUNICIPIO_"
                  formControlProps={{
                    fullWidth: true,
                  }}
                  selectProps={{
                    native: true,
                    classes: {
                      root: "custom-select",
                      select: "custom-select",
                      icon: "custom-select-icon",
                    },
                  }}
                  onChange={handleCityChange}
                >
                  {municipiosColima.map((municipio) => (
                    <option key={municipio} value={municipio}>
                      {municipio}
                    </option>
                  ))}
                </CustomDropdown>
                
                </GridItem>
               
                <GridItem xs={12} sm={12} md={4}>
                  <CustomInput
                    labelText="Postal Code"
                    id="postal-code"
                    formControlProps={{
                      fullWidth: true,
                      onChange: handlePostalCodeChange,
                    }}
                    />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="COLONIA"
                    id="last-name"
                    formControlProps={{
                      fullWidth: true,
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <CustomInput
                    labelText="COMENTARIO PERSONAL."
                    id="COMENTARIO"
                    formControlProps={{
                      fullWidth: true,
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 5,
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color="primary">Update Profile</Button>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
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
                <Map markersData_={markersData} width="100%" height="300px" />
                </GridItem>
                </GridContainer>
        </GridItem>
      
      </GridContainer>

      
    
    </div>

  );
}
