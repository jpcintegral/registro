import React, { useEffect, useState, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import { List, ListItem, Checkbox, ListItemText } from "@material-ui/core";
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
import imgElectorDefault from "assets/img/imgElectorDefault.jpg";
import Map from "../Maps/Maps.js";
import axios from "axios";
import OCRSpace from "helpers/OCRSpace.js";
import formLoader from "helpers/formLoader.js";
import SpinnerOverlay from "helpers/SpinnerOverlay.js";
import Modal from "components/Modal/Modal.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import MapOutlinedIcon from "@material-ui/icons/MapOutlined";

import CameraAltIcon from "@material-ui/icons/CameraAlt";
import jwt from "jsonwebtoken";
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
  const url = process.env.REACT_APP_API_URL;
  const key = process.env.REACT_APP_SECRET_KEY;
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
  const [idUsuarioAlta, setIdUsuarioAlta] = useState([]);
  const [idUsuarioUpdate, setIdUsuarioUpdate] = useState([]);
  const [spinner, setSpinner] = useState(false);

  // =========================================================
  // CAMARA
  // =========================================================

  const [openCamera, setOpenCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState(null);
  const [cameraError, setCameraError] = useState("");
  const [cameraReady, setCameraReady] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // =========================================================

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
    fechaRegistro: null,
  });

  useEffect(() => {
    // Actualizar el estado markersData con los nuevos valores de city, country y postalCode

    if (userId && userId !== ":userId") {
      setLoading(true);
      axios
        .get(`${url}/api/simpatizantes/${userId}`)
        .then((response) => {
          const simpatizanteData = response.data;
          setFormData(simpatizanteData);

          const Municipios = cargarMunicipios(simpatizanteData.estado);
          setMunicipios(Municipios);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error al obtener datos del simpatizante:", error);
          setLoading(false);
        });
    }

    // Método para obtener los estados desde la API
    async function obtenerEstados() {
      try {
        const response = await axios.get(`${url}/api/estados`);
        return response.data.map((estado) => ({
          idEstado: estado.idEstado,
          nombre: estado.nombre,
        }));
      } catch (error) {
        console.error("Error al obtener los estados:", error);
        return [];
      }
    }

    // Llamar a la función asincrónica y asignar el resultado a estados
    async function cargarEstados() {
      try {
        const estadosObtenidos = await obtenerEstados();
        setestados(estadosObtenidos);
      } catch (error) {
        console.error("Error al cargar los estados:", error);
      }
    }

    // Llamar a la función para cargar los estados
    cargarEstados();
    decodeAndSetValuesFromCookie();

    // Limpiar cámara si el componente se desmonta
    return () => {
      stopCamera();
    };
  }, [userId]);

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
    const token = getCookie("token");

    if (token) {
      try {
        const decodedToken = jwt.verify(token, key);

        if (decodedToken) {
          const { user } = decodedToken.data;

          setIdUsuarioAlta(user);
          setIdUsuarioUpdate(user);
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    } else {
      console.error("La cookie no fue encontrada o está vacía.");
    }
  };

  // =========================================================
  // INSERTAR
  // =========================================================

  const insertSimpatizante = async (formData) => {
    try {
      formData.idUsuarioAlta = idUsuarioAlta;

      const response = await axios.post(`${url}/api/simpatizantes`, formData);

      return response.data;
    } catch (error) {
      console.error("Error al insertar simpatizante:", error);
      throw error;
    }
  };

  // =========================================================
  // ACTUALIZAR
  // =========================================================

  const updateSimpatizante = async (formData) => {
    try {
      formData.idUsuarioUpdate = idUsuarioUpdate;

      const response = await axios.put(
        `${url}/api/simpatizantes/${userId}`,
        formData,
      );

      return response.data;
    } catch (error) {
      console.error("Error al actualizar simpatizante:", error);
      throw error;
    }
  };

  // =========================================================
  // MUNICIPIOS
  // =========================================================

  async function obtenerMunicipios(idEstado) {
    try {
      const response = await axios.get(`${url}/api/municipios/${idEstado}`);

      return response.data.map((municipio) => ({
        idMunicipio: municipio.idMunicipio,
        nombre: municipio.nombre,
      }));
    } catch (error) {
      console.error("Error al obtener los municipios:", error);
      return [];
    }
  }

  async function cargarMunicipios(idEstado) {
    try {
      const municipiosObtenidos = await obtenerMunicipios(idEstado);
      setMunicipios(municipiosObtenidos);
    } catch (error) {
      console.error("Error al cargar los estados:", error);
    }
  }

  function utpdateMapa() {
    const newMarkersData = [
      {
        nombre:
          formData.nombre +
          " " +
          formData.apellidoPaterno +
          " " +
          formData.apellidoMaterno,
        state: getNombreEstado(formData.estado),
        municipality: getNombreMunicipio(formData.municipio),
        neighborhood: formData.colonia,
        postalCode: formData.codigoPostal,
        street: formData.calle,
        number: formData.numeroCalle,
      },
    ];

    setMarkersData(newMarkersData);
  }

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSpinner(true);

    try {
      const requiredFields = [
        "nombre",
        "apellidoPaterno",
        "apellidoMaterno",
        "genero",
        "telefono",
        "email",
        "fechaNacimiento",
        "estado",
        "municipio",
        "colonia",
        "calle",
        "numeroCalle",
        "seccion",
        "codigoPostal",
        "claveElector",
        "curp",
        "vigenciaCredencial",
      ];

      const missingFields = requiredFields.filter((field) => !formData[field]);

      if (missingFields.length > 0) {
        const errorMessage = `Los siguientes campos son obligatorios: ${missingFields.join(
          ", ",
        )}`;

        showBottomCenterNotification(errorMessage);
      } else {
        if (userId && userId !== ":userId") {
          await updateSimpatizante(formData);
          history.push("/admin/Simpatizantes");
        } else {
          await insertSimpatizante(formData);
          history.push("/admin/Simpatizantes");
        }
      }

      setSpinner(false);
    } catch (error) {
      console.error("Error:", error);
      setSpinner(false);
    }
  };

  const handlestateChange = (event) => {
    if (event.target.value) {
      cargarMunicipios(event.target.value);
    }
  };

  const handleDropdownChanEstado = (event) => {
    handlestateChange(event);
    handleInputChange(event);
  };

  const handleDropdownChanMunicipio = (event) => {
    handleInputChange(event);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePostalCodeChange = (event) => {
    handleInputChange(event);
  };

  const handleDateChange = (date) => {
    setStartDate(date);

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
  ];

  const handleMapUpdate = (updatedMarkersData) => {
    if (
      updatedMarkersData.lat !== undefined &&
      updatedMarkersData.lon !== undefined
    ) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        lat: updatedMarkersData.lat,
        lon: updatedMarkersData.lon,
      }));

      console.log("updatedMarkersData:", updatedMarkersData);
    }
  };

  // =========================================================
  // BASE64
  // =========================================================

  const getBase64 = (file) => {
    return new Promise((resolve) => {
      let baseURL = "";
      let reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };

  // =========================================================
  // PROCESAR IMAGEN FRONTAL
  // =========================================================

  const processFrontImage = async (file) => {
    if (!file) {
      return;
    }

    setSpinner(true);

    try {
      setImage(URL.createObjectURL(file));

      const ocrs = await OCRSpace(file);

      if (!ocrs || !Object.keys(ocrs).length) {
        showBottomCenterNotification(
          "No se detectaron datos en la credencial. Por favor, intenta nuevamente.",
        );

        setSpinner(false);
        return;
      }

      setFormDataImg(ocrs);

      console.log("ocrs", ocrs);

      handleOpenModal();

      const result = await getBase64(file);

      file["base64"] = result;

      setFormData((prevFormData) => ({
        ...prevFormData,
        imgElectorFrontal: result,
      }));
    } catch (error) {
      console.error("Error al procesar la imagen frontal:", error);

      showBottomCenterNotification(
        "Ocurrió un error al procesar la imagen de la credencial.",
      );
    } finally {
      setSpinner(false);
    }
  };

  // =========================================================
  // PROCESAR IMAGEN TRASERA
  // =========================================================

  const processBackImage = async (file) => {
    if (!file) {
      return;
    }

    setSpinner(true);

    try {
      setImageTracera(URL.createObjectURL(file));

      const result = await getBase64(file);

      file["base64"] = result;

      setFormData((prevFormData) => ({
        ...prevFormData,
        imgElectorTracera: result,
      }));
    } catch (error) {
      console.error("Error al procesar la imagen trasera:", error);
    } finally {
      setSpinner(false);
    }
  };

  // =========================================================
  // ABRIR CAMARA
  // =========================================================

  const openCameraFor = async (mode) => {
    setCameraMode(mode);
    setCameraError("");
    setCameraReady(false);
    setOpenCamera(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          "El navegador no permite utilizar la cámara desde este sitio.",
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: "environment",
          },
          width: {
            ideal: 1920,
          },
          height: {
            ideal: 1080,
          },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        await videoRef.current.play();

        setCameraReady(true);
      }
    } catch (error) {
      console.error("Error al abrir la cámara:", error);

      setCameraError(
        "No fue posible acceder a la cámara. Verifica que hayas otorgado permisos al navegador.",
      );
    }
  };

  // =========================================================
  // DETENER CAMARA
  // =========================================================

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraReady(false);
  };

  // =========================================================
  // CERRAR CAMARA
  // =========================================================

  const closeCamera = () => {
    stopCamera();
    setOpenCamera(false);
    setCameraMode(null);
    setCameraError("");
  };

  // =========================================================
  // TOMAR FOTOGRAFIA
  // =========================================================

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) {
      return;
    }

    if (!cameraReady) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const width = video.videoWidth;
    const height = video.videoHeight;

    if (!width || !height) {
      showBottomCenterNotification(
        "La cámara todavía no está lista. Intenta nuevamente.",
      );
      return;
    }

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    context.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          showBottomCenterNotification(
            "No fue posible capturar la fotografía.",
          );
          return;
        }

        const file = new File(
          [blob],
          cameraMode === "front"
            ? "credencial-frontal.jpg"
            : "credencial-trasera.jpg",
          {
            type: "image/jpeg",
          },
        );

        closeCamera();

        if (cameraMode === "front") {
          await processFrontImage(file);
        } else {
          await processBackImage(file);
        }
      },
      "image/jpeg",
      0.92,
    );
  };

  // =========================================================
  // FUNCIONES ANTERIORES DE IMAGEN
  // =========================================================

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    await processFrontImage(file);

    e.target.value = null;
  };

  const handleImageTraceraChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    await processBackImage(file);

    e.target.value = null;
  };

  // =========================================================
  // MODALES
  // =========================================================

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenModalMapa = () => {
    if (!formData.codigoPostal || !formData.estado || !formData.municipio) {
      showBottomCenterNotification(
        "Es necesario tener los siguientes datos ingresados: Estado, Municipio y Código Postal",
      );

      return;
    }

    utpdateMapa();
    setOpenModalMapa(true);
  };

  const handleCloseModalMapa = () => {
    setOpenModalMapa(false);
  };

  const handleMoldalMapa = () => {
    handleCloseModalMapa();
  };

  const showBottomCenterNotification = (message) => {
    setMensaje(message);
    setBC(true);

    setTimeout(() => {
      setBC(false);
    }, 9000);
  };

  // =========================================================
  // CHECKBOXES
  // =========================================================

  const renderCheckboxes = () => {
    if (!formDataImg) return null;

    const keys = Object.keys(formDataImg);
    const middleIndex = Math.ceil(keys.length / 2);

    const leftKeys = keys.slice(0, middleIndex);
    const rightKeys = keys.slice(middleIndex);

    return (
      <GridItem container spacing={8}>
        <GridItem item xs={6}>
          <List>
            {leftKeys.map((key) => (
              <ListItem key={key}>
                <Checkbox
                  checked={checkedFields[key] || false}
                  onChange={handleCheckboxChange}
                  value={key}
                />

                <ListItemText
                  primary={`Campo: ${key}`}
                  secondary={`Texto: ${formDataImg[key]}`}
                />
              </ListItem>
            ))}
          </List>
        </GridItem>

        <GridItem item xs={6}>
          <List>
            {rightKeys.map((key) => (
              <ListItem key={key}>
                <Checkbox
                  checked={checkedFields[key] || false}
                  onChange={handleCheckboxChange}
                  value={key}
                />

                <ListItemText
                  primary={`Campo: ${key}`}
                  secondary={`Texto: ${formDataImg[key]}`}
                />
              </ListItem>
            ))}
          </List>
        </GridItem>
      </GridItem>
    );
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;

    try {
      setCheckedFields((prevCheckedFields) => ({
        ...prevCheckedFields,
        [value]: checked,
      }));
    } catch (error) {
      console.log("error al marcar los campos de la credencial", error);
    }
  };

  const handleCheckboxVerification = () => {
    Object.keys(checkedFields).forEach((field) => {
      if (checkedFields[field] && field in formDataImg) {
        let fieldValue = formDataImg[field];

        if (field === "fechaNacimiento" && typeof fieldValue === "string") {
          fieldValue = parseFechaNacimiento(fieldValue);

          if (!fieldValue) {
            return;
          }
        }

        if (field === "estado" && Number.isInteger(fieldValue)) {
          cargarMunicipios(fieldValue);
        }

        if (field === "genero" && typeof fieldValue === "string") {
          switch (fieldValue) {
            case "M":
              fieldValue = 2;
              break;

            case "H":
              fieldValue = 1;
              break;

            default:
              fieldValue = "";
              break;
          }
        }

        setFormData((prevFormData) => ({
          ...prevFormData,
          [field]: fieldValue,
        }));

        setCheckedFields((prevChecked) => ({
          ...prevChecked,
          [field]: false,
        }));
      }
    });

    handleCloseModal();
  };

  // =========================================================
  // FECHA
  // =========================================================

  const parseFechaNacimiento = (fechaString) => {
    const fechaNacimientoParts = fechaString.split("/");

    if (fechaNacimientoParts.length === 3) {
      const dia = parseInt(fechaNacimientoParts[0], 10);
      const mes = parseInt(fechaNacimientoParts[1], 10) - 1;
      const anio = parseInt(fechaNacimientoParts[2], 10);

      const fecha = new Date(anio, mes, dia);

      if (isNaN(fecha.getTime())) {
        console.error("La fecha de nacimiento no es válida:", fechaString);

        return null;
      }

      return fecha;
    }

    return null;
  };

  // =========================================================
  // NOMBRES
  // =========================================================

  function getNombreMunicipio(idMunicipio) {
    if (municipio && municipio.length > 0) {
      const municipioEncontrado = municipio.find(
        (mcp) => mcp.idMunicipio === idMunicipio,
      );

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
    <>
      <div>
        {loading && formData.nombre ? (
          formLoader()
        ) : (
          <GridContainer>
            <GridItem xs={12} sm={12} md={9}>
              <Card>
                <CardHeader color="info">
                  <h4 className={classes.cardTitleWhite}>Simpatizante</h4>

                  <p className={classes.cardCategoryWhite}>
                    Nuevo simpatizante
                  </p>

                  <div
                    style={{
                      marginBottom: "10px",
                      float: "inline-end",
                    }}
                  >
                    {/* ================================================= */}
                    {/* CAMARA FRONTAL */}
                    {/* ================================================= */}

                    <Button
                      color="primary"
                      size="sm"
                      variant="contained"
                      onClick={() => openCameraFor("front")}
                    >
                      <CameraAltIcon />
                      Credencial (Frontal)
                    </Button>

                    {/* ================================================= */}
                    {/* CAMARA TRASERA */}
                    {/* ================================================= */}

                    <Button
                      color="primary"
                      size="sm"
                      variant="contained"
                      onClick={() => openCameraFor("back")}
                    >
                      <CameraAltIcon />
                      Credencial (Trasera)
                    </Button>

                    {/* ================================================= */}
                    {/* INPUTS ORIGINALES OCULTOS */}
                    {/* Se conservan como respaldo */}
                    {/* ================================================= */}

                    <input
                      accept="image/*"
                      className="input-file"
                      id="CredencialFrontal"
                      onChange={handleImageChange}
                      type="file"
                      style={{ display: "none" }}
                    />

                    <input
                      accept="image/*"
                      className="input-file"
                      id="CredencialTracera"
                      onChange={handleImageTraceraChange}
                      type="file"
                      style={{ display: "none" }}
                    />
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
                          inputProps={{
                            value: formData.nombre || "",
                            onChange: handleInputChange,
                          }}
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
                          inputProps={{
                            value: formData.apellidoPaterno,
                            onChange: handleInputChange,
                          }}
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
                          inputProps={{
                            value: formData.apellidoMaterno,
                            onChange: handleInputChange,
                          }}
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
                          value={
                            formData.genero ? formData.genero.toString() : ""
                          }
                          onChange={handleInputChange}
                        >
                          {generoOptions.map((option) => (
                            <option
                              key={option.id}
                              value={option.id.toString()}
                            >
                              {option.nombre}
                            </option>
                          ))}
                        </CustomDropdown>
                      </GridItem>

                      <GridItem xs={12} sm={12} md={4}>
                        <CustomInput
                          labelText="Teléfono"
                          name="telefono"
                          inputProps={{
                            value: formData.telefono,
                            onChange: handleInputChange,
                          }}
                          formControlProps={{
                            fullWidth: true,
                          }}
                        />
                      </GridItem>

                      <GridItem xs={12} sm={12} md={4}>
                        <CustomInput
                          labelText="Email"
                          name="email"
                          inputProps={{
                            value: formData.email,
                            onChange: handleInputChange,
                          }}
                          formControlProps={{
                            fullWidth: true,
                          }}
                        />
                      </GridItem>
                    </GridContainer>

                    <GridContainer>
                      <GridItem xs={12} sm={12} md={4}>
                        <CustomDropdown
                          labelText="Estado"
                          id="estado"
                          name="estado"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          value={
                            estados.length > 0 && formData.estado
                              ? formData.estado
                              : ""
                          }
                          onChange={handleDropdownChanEstado}
                        >
                          {estados.length > 0 &&
                            estados.map((estado) => (
                              <option
                                key={estado.idEstado}
                                value={estado.idEstado}
                              >
                                {estado.nombre}
                              </option>
                            ))}
                        </CustomDropdown>
                      </GridItem>

                      <GridItem xs={12} sm={12} md={4}>
                        <CustomDropdown
                          labelText="Municipio"
                          id="municipio"
                          name="municipio"
                          formControlProps={{
                            fullWidth: true,
                          }}
                          value={
                            municipio.length > 0 && formData.municipio
                              ? formData.municipio
                              : ""
                          }
                          onChange={handleDropdownChanMunicipio}
                        >
                          {municipio.length > 0 &&
                            municipio &&
                            municipio.map((municipio) => (
                              <option
                                key={municipio.idMunicipio}
                                value={municipio.idMunicipio}
                              >
                                {municipio.nombre}
                              </option>
                            ))}
                        </CustomDropdown>
                      </GridItem>

                      <GridItem xs={12} sm={12} md={4}>
                        <CustomInput
                          labelText="Código Postal"
                          name="codigoPostal"
                          inputProps={{
                            value: formData.codigoPostal,
                            onChange: handlePostalCodeChange,
                          }}
                          formControlProps={{
                            fullWidth: true,
                          }}
                        />
                      </GridItem>
                    </GridContainer>

                    <GridContainer>
                      <GridItem xs={12} sm={12} md={4}>
                        <CustomInput
                          labelText="Colonia"
                          name="colonia"
                          inputProps={{
                            value: formData.colonia,
                            onChange: handleInputChange,
                          }}
                          formControlProps={{
                            fullWidth: true,
                          }}
                        />
                      </GridItem>

                      <GridItem xs={12} sm={12} md={4}>
                        <CustomInput
                          labelText="CALLE"
                          id="calle"
                          name="calle"
                          inputProps={{
                            value: formData.calle,
                            onChange: handleInputChange,
                          }}
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
                          inputProps={{
                            value: formData.numeroCalle,
                            onChange: handleInputChange,
                          }}
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
                          inputProps={{
                            value: formData.seccion,
                            onChange: handleInputChange,
                          }}
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
                          inputProps={{
                            value: formData.localidad,
                            onChange: handleInputChange,
                          }}
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
                          inputProps={{
                            value: formData.claveElector,
                            onChange: handleInputChange,
                          }}
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
                          inputProps={{
                            value: formData.folio,
                            onChange: handleInputChange,
                          }}
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
                          inputProps={{
                            value: formData.vigenciaCredencial,
                            onChange: handleInputChange,
                          }}
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
                          selectedDate={
                            formData.fechaNacimiento
                              ? formData.fechaNacimiento
                              : startDate
                          }
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
                          inputProps={{
                            value: formData.lat,
                            onChange: handleInputChange,
                          }}
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
                          inputProps={{
                            value: formData.lon,
                            onChange: handleInputChange,
                          }}
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
                          inputProps={{
                            value: formData.curp,
                            onChange: handleInputChange,
                          }}
                          formControlProps={{
                            fullWidth: true,
                          }}
                        />
                      </GridItem>

                      <GridItem xs={12} sm={12} md={4}>
                        <Button
                          color="primary"
                          size="sm"
                          variant="contained"
                          onClick={handleOpenModalMapa}
                        >
                          <MapOutlinedIcon />
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
                            value: formData.comentarioPersonal,
                            onChange: handleInputChange,
                            multiline: true,
                            rows: 5,
                          }}
                        />
                      </GridItem>
                    </GridContainer>
                  </CardBody>

                  <CardFooter>
                    <Button color="primary" type="submit">
                      {userId && userId != ":userId" ? "Actualizar" : "Guardar"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </GridItem>

            {/* ===================================================== */}
            {/* PREVISUALIZACION DE IMAGENES */}
            {/* ===================================================== */}

            <GridItem xs={12} sm={12} md={3}>
              <GridItem xs={12} sm={12} md={12}>
                <Card profile className="img-container">
                  <div className="img-container">
                    <img src={image ? image : imgElectorDefault} alt="Imagen" />
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

            {/* ===================================================== */}
            {/* MODAL OCR */}
            {/* ===================================================== */}

            <GridItem xs={12} sm={12} md={12}>
              <Modal
                open={openModal}
                onClose={handleCloseModal}
                title="Detalle"
                nota="Por favor, verifique que los datos escaneados sean correctos y seleccione los que corresponden a la credencial."
              >
                <GridItem xs={12} sm={12} md={12}>
                  <div className="card-container">
                    <div className="img-container">
                      <img src={image} alt="Imagen" />
                    </div>
                  </div>

                  {renderCheckboxes()}
                </GridItem>

                <GridItem xs={12}>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={handleCheckboxVerification}
                  >
                    Verificar y Actualizar
                  </Button>
                </GridItem>
              </Modal>
            </GridItem>

            {/* ===================================================== */}
            {/* MODAL CAMARA */}
            {/* ===================================================== */}

            <GridItem xs={12} sm={12} md={12}>
              <Modal
                open={openCamera}
                onClose={closeCamera}
                title={
                  cameraMode === "front"
                    ? "Fotografiar credencial - Frontal"
                    : "Fotografiar credencial - Trasera"
                }
                nota="Coloca la credencial dentro del marco y asegúrate de que sea completamente visible."
              >
                <div
                  style={{
                    width: "100%",
                    maxWidth: "620px",
                    margin: "0 auto",
                  }}
                >
                  {cameraError ? (
                    <div
                      style={{
                        padding: "20px",
                        textAlign: "center",
                      }}
                    >
                      <p
                        style={{
                          color: "#d32f2f",
                        }}
                      >
                        {cameraError}
                      </p>

                      <Button
                        color="primary"
                        size="sm"
                        onClick={() => openCameraFor(cameraMode)}
                      >
                        Intentar nuevamente
                      </Button>
                    </div>
                  ) : (
                    <>
                      {/* ========================================= */}
                      {/* VISOR DE CAMARA */}
                      {/* Proporción credencial INE / PVC: 1.586 */}
                      {/* ========================================= */}

                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "16 / 10",
                          maxHeight: "390px",
                          backgroundColor: "#000",
                          borderRadius: "10px",
                          overflow: "hidden",
                          position: "relative",
                          margin: "0 auto",
                        }}
                      >
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />

                        {/* ========================================= */}
                        {/* MARCO DE CREDENCIAL */}
                        {/* ========================================= */}

                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",

                            width: "82%",
                            aspectRatio: "1.586",

                            border: "2px solid #ffffff",
                            borderRadius: "8px",

                            boxSizing: "border-box",
                            pointerEvents: "none",

                            boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.35)",
                          }}
                        />

                        {/* ========================================= */}
                        {/* TEXTO DE AYUDA */}
                        {/* ========================================= */}

                        <div
                          style={{
                            position: "absolute",
                            bottom: "10px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            color: "#fff",
                            background: "rgba(0,0,0,0.55)",
                            padding: "5px 12px",
                            borderRadius: "15px",
                            fontSize: "12px",
                            whiteSpace: "nowrap",
                            pointerEvents: "none",
                          }}
                        >
                          Alinea la credencial dentro del marco
                        </div>
                      </div>

                      <canvas
                        ref={canvasRef}
                        style={{
                          display: "none",
                        }}
                      />

                      {/* ========================================= */}
                      {/* BOTONES */}
                      {/* ========================================= */}

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "10px",
                          padding: "12px 0 4px",
                          flexWrap: "wrap",
                        }}
                      >
                        <Button
                          color="primary"
                          size="sm"
                          variant="contained"
                          onClick={capturePhoto}
                          disabled={!cameraReady}
                        >
                          <CameraAltIcon />
                          Tomar fotografía
                        </Button>

                        <Button
                          color="secondary"
                          size="sm"
                          variant="contained"
                          onClick={closeCamera}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </Modal>
            </GridItem>

            {/* ===================================================== */}
            {/* MODAL MAPA */}
            {/* ===================================================== */}

            <GridItem xs={12} sm={12} md={12}>
              <Modal
                open={openModalMapa}
                onClose={handleCloseModalMapa}
                title="Mapa"
                nota="Por favor, ubica y coloca la marca en el mapa en la ubicación del domicilio y luego presiona aceptar."
              >
                <GridContainer>
                  <GridItem xs={12}>
                    <labe>Dirección :</labe>

                    <label>
                      Calle:{" "}
                      {[formData.calle, "#" + formData.numeroCalle].join(" ")}
                    </label>

                    <br />

                    <label>Colonia: {formData.colonia}</label>

                    <br />

                    <label>Estado: {getNombreEstado(formData.estado)}</label>

                    <label>
                      Municipio: {getNombreMunicipio(formData.municipio)}
                    </label>

                    <br />

                    <label>CP: {formData.codigoPostal}</label>
                  </GridItem>
                </GridContainer>

                {
                  <GridItem xs={12} sm={12} md={12}>
                    <Map
                      markersData_={markersData}
                      width="100%"
                      height="300px"
                      onMapUpdate={handleMapUpdate}
                    />
                  </GridItem>
                }

                <GridItem xs={4}>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={handleMoldalMapa}
                  >
                    Guardar ubicacion
                  </Button>
                </GridItem>

                <GridItem xs={4}>
                  <labe>long: {formData.lat}</labe>

                  <labe>long :{formData.lon}</labe>
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

      <SpinnerOverlay open={spinner} />
    </>
  );
}
