import axios from "axios";

const OCRSpace = async (setFormDataImg) => {
  var formData = {
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    fechaNacimiento: null,
    estado: "",
    municipio: "",
    colonia: "",
    calle: "",
    numeroCalle: "",
    seccion: "",
    codigoPostal: "",
    claveElector: "",
    curp: "",
    vigenciaCredencial: "",
    fechaRegistroIne: null,
  };

  try {
    const formDatacall = new FormData();
    formDatacall.append("language", "spa");
    formDatacall.append("isOverlayRequired", "false");
    formDatacall.append("iscreatesearchablepdf", "false");
    formDatacall.append("issearchablepdfhidetextlayer", "false");
    formDatacall.append("OCREngine", "2");
    formDatacall.append("file", setFormDataImg);
    const keyOcer = process.env.REACT_APP_SECRET_KEY_OCR;
    const config = {
      method: "post",
      url: "https://api.ocr.space/parse/image", // "https://api.ocr.space/parse/image"  ,  https://apipro2.ocr.space/parse/image
      headers: {
        apikey: keyOcer, // Reemplaza "YOUR_API_KEY" con tu clave de API OCR.space
        "Content-Type": "multipart/form-data",
      },
      data: formDatacall,
    };

    const response = await axios(config);
    console.log(JSON.stringify(response.data));
    console.log(response.data);
    console.log(response);
    const { ParsedResults } = response.data;

    if (
      ParsedResults &&
      ParsedResults.length > 0 &&
      ParsedResults[0].ParsedText.trim() !== ""
    ) {
      const { ParsedText } = ParsedResults[0];
      const updatedFormData = updateFormData(ParsedText, formData);

      return updatedFormData;
    } else {
      console.log("No se pudo extraer el texto");
      return null;
    }
  } catch (error) {
    console.error("Error al llamar a la API OCR.space", error);
    return null;
  }
};

const updateFormData = (parsedText, formData) => {
  try {
    const lineas = parsedText.split("\n");

    return {
      ...formData,
      nombre: getNombre(lineas),
      apellidoPaterno: getApellidoPaterno(lineas),
      apellidoMaterno: getApellidoMaterno(lineas),
      fechaNacimiento: getFechaNacimiento(lineas),
      estado: getEstado(lineas),
      municipio: getMunicipio(lineas),
      colonia: getColonia(lineas),
      calle: getCalle(lineas),
      numeroCalle: getNumeroCalle(lineas),
      codigoPostal: getCodigoPostal(lineas),
      claveElector: getClaveElector(lineas),
      vigenciaCredencial: getVigenciaCredencial(lineas),
      fechaRegistroIne: getFechaRegistroIne(lineas),
      genero: getGenero(lineas),
      seccion: getSeccion(lineas),
      curp: getCurp(lineas),
    };
  } catch (error) {
    console.log(error);
    return formData;
  }
};

function getNombre(lineas) {
  const nombreIndex = lineas.findIndex((line) => line.includes("NOMBRE"));
  if (nombreIndex !== -1 && nombreIndex < lineas.length - 1) {
    return lineas[nombreIndex + 3].trim();
  } else {
    return "";
  }
}

function getApellidoPaterno(lineas) {
  const nombreIndex = lineas.findIndex((line) => line.includes("NOMBRE"));
  if (nombreIndex !== -1 && nombreIndex < lineas.length - 1) {
    return lineas[nombreIndex + 1].trim();
  } else {
    return "";
  }
}

function getApellidoMaterno(lineas) {
  const nombreIndex = lineas.findIndex((line) => line.includes("NOMBRE"));
  if (nombreIndex !== -1 && nombreIndex < lineas.length - 1) {
    return lineas[nombreIndex + 2].trim();
  } else {
    return "";
  }
}

function getFechaNacimiento(lineas) {
  const nombreIndex = lineas.findIndex((line) =>
    line.includes("FECHA DE NACIMIENTO"),
  );
  if (nombreIndex !== -1 && nombreIndex < lineas.length - 1) {
    return lineas[nombreIndex + 1].trim();
  } else {
    return "";
  }
}

function getEstado(lineas) {
  const estadoIndex = lineas.findIndex((linea) => linea.includes("ESTADO"));
  if (estadoIndex !== -1) {
    const numerosEstado = lineas[estadoIndex].match(/\d+/);
    if (numerosEstado) return parseInt(numerosEstado[0], 10);
    const numerosEstadoSiguiente = lineas[estadoIndex + 1].match(/\d+/);
    if (numerosEstadoSiguiente) return parseInt(numerosEstadoSiguiente[0], 10);
  }
  return "";
}

function getMunicipio(lineas) {
  const municipioIndex = lineas.findIndex(
    (linea) => linea.includes("MUNICIPIO") || linea.includes("MUNIGIPIO"),
  );
  if (municipioIndex !== -1 && municipioIndex < lineas.length) {
    const municipioLinea = lineas[municipioIndex].trim();
    const numerosMunicipio = municipioLinea.match(/\d+/);
    if (numerosMunicipio) {
      return parseInt(numerosMunicipio[0], 10); // Devuelve el primer conjunto de números encontrado como entero
    }
  }
  return "";
}

function getColonia(lineas) {
  const domicilioIndex = lineas.findIndex((line) => line.includes("DOMICILIO"));
  if (domicilioIndex !== -1 && domicilioIndex < lineas.length - 1) {
    const domicilioLine = lineas[domicilioIndex + 2].trim();
    let calle = "";
    // Verificar si la línea comienza con "Col "
    if (domicilioLine.startsWith("COL ")) {
      // Si es así, eliminamos "COL " de la línea
      calle = domicilioLine.slice(3);
    } else {
      calle = domicilioLine;
    }
    // Encontrar el último conjunto de números (que representan el número de calle)
    const palabras = calle.split(" ");
    for (let i = palabras.length - 1; i >= 0; i--) {
      const palabra = palabras[i];
      // Verificar si la palabra es un conjunto de números
      if (!isNaN(palabra)) {
        // La palabra es un conjunto de números, por lo que la eliminamos de la calle
        palabras.splice(i, 1);
      } else {
        // Si encontramos una palabra que no es un número, detenemos la búsqueda
        break;
      }
    }
    // Reconstruir la calle sin el último conjunto de números
    calle = palabras.join(" ");
    return calle.trim();
  } else {
    return "";
  }
}

function getCalle(lineas) {
  const domicilioIndex = lineas.findIndex((line) => line.includes("DOMICILIO"));
  if (domicilioIndex !== -1 && domicilioIndex < lineas.length - 1) {
    const domicilioLine = lineas[domicilioIndex + 1].trim();
    let calle = "";
    // Verificar si la línea comienza con "C "
    if (domicilioLine.startsWith("C ")) {
      // Si es así, eliminamos "C " de la línea
      calle = domicilioLine.slice(2);
    } else {
      calle = domicilioLine;
    }
    // Encontrar el último conjunto de números (que representan el número de calle)
    const palabras = calle.split(" ");
    for (let i = palabras.length - 1; i >= 0; i--) {
      const palabra = palabras[i];
      // Verificar si la palabra es un conjunto de números
      if (!isNaN(palabra)) {
        // La palabra es un conjunto de números, por lo que la eliminamos de la calle
        palabras.splice(i, 1);
      } else {
        // Si encontramos una palabra que no es un número, detenemos la búsqueda
        break;
      }
    }
    // Reconstruir la calle sin el último conjunto de números
    calle = palabras.join(" ");
    return calle.trim();
  } else {
    return "";
  }
}

function getNumeroCalle(lineas) {
  const domicilioIndex = lineas.findIndex((line) => line.includes("DOMICILIO"));
  if (domicilioIndex !== -1 && domicilioIndex < lineas.length - 1) {
    const domicilioLine = lineas[domicilioIndex + 1].trim();
    let numeroCalle = "";
    // Encontrar el último conjunto de números (que representan el número de calle)
    const palabras = domicilioLine.split(" ");
    for (let i = palabras.length - 1; i >= 0; i--) {
      const palabra = palabras[i];
      // Verificar si la palabra es un conjunto de números
      if (!isNaN(palabra)) {
        // Concatenar el conjunto de números al principio de la cadena
        numeroCalle = palabra + numeroCalle;
      } else {
        // Si encontramos una palabra que no es un número, detenemos la búsqueda
        break;
      }
    }
    return numeroCalle.trim();
  } else {
    return "";
  }
}

function getCodigoPostal(lineas) {
  const domicilioIndex = lineas.findIndex((line) => line.includes("DOMICILIO"));
  if (domicilioIndex !== -1 && domicilioIndex < lineas.length - 1) {
    const domicilioLine = lineas[domicilioIndex + 2].trim();
    let codigoPostal = "";
    // Encontrar el último conjunto de números (que representan el número de calle)
    const palabras = domicilioLine.split(" ");
    for (let i = palabras.length - 1; i >= 0; i--) {
      const palabra = palabras[i];
      // Verificar si la palabra es un conjunto de números
      if (!isNaN(palabra)) {
        // Concatenar el conjunto de números al principio de la cadena
        codigoPostal = palabra + codigoPostal;
      } else {
        // Si encontramos una palabra que no es un número, detenemos la búsqueda
        break;
      }
    }
    return codigoPostal.trim();
  } else {
    return "";
  }
}

function getClaveElector(lineas) {
  const claveElectorIndex = lineas.findIndex((line) =>
    line.includes("CLAVE DE ELECTOR"),
  );
  if (claveElectorIndex !== -1 && claveElectorIndex < lineas.length - 1) {
    const claveElectorLine = lineas[claveElectorIndex].trim();
    // Obtener el resto del texto de la línea después de "CLAVE DE ELECTOR"
    const claveElector = claveElectorLine.split("CLAVE DE ELECTOR")[1].trim();
    return claveElector;
  } else {
    return "";
  }
}

function getCurp(lineas) {
  const curpIndex = lineas.findIndex(
    (linea) => linea.includes("CURP") || linea.includes("CUAP"),
  );
  if (curpIndex !== -1 && curpIndex < lineas.length) {
    const curpLinea = lineas[curpIndex].trim();
    if (curpLinea.startsWith("CURP") || curpLinea.startsWith("CUAP")) {
      const curpTexto = curpLinea.slice(4).trim();
      if (curpTexto.length > 16) {
        return curpTexto;
      } else {
        // Buscar en el resto de las líneas después de la línea donde se encontró la palabra 'CURP'
        for (let i = curpIndex + 1; i < lineas.length; i++) {
          if (lineas[i].trim().length > 16) {
            return lineas[i].trim();
          }
        }
      }
    } else if (curpLinea.length > 16) {
      return curpLinea.trim();
    }
  }
  return "";
}

function getFechaRegistroIne(lineas) {
  try {
    const fechaRegistroIndex = lineas.findIndex(
      (linea) =>
        linea.includes("AÑO DE REGISTRO") || linea.includes("ANO DE REGISTRO"),
    );
    if (fechaRegistroIndex !== -1) {
      // Buscar un conjunto de números después de "AÑO DE REGISTRO" en la misma línea
      const fechaRegistroLinea = lineas[fechaRegistroIndex].trim();
      const numerosFechaRegistro = fechaRegistroLinea.match(/\d+/g);
      if (numerosFechaRegistro) {
        return numerosFechaRegistro.join(" "); // Devolver el conjunto de números encontrado en la misma línea
      } else {
        // Si no se encuentra un conjunto de números en la misma línea, buscar en las siguientes líneas
        for (let i = fechaRegistroIndex + 1; i < lineas.length; i++) {
          const linea = lineas[i].trim();
          const numerosFechaRegistroSiguiente = linea.match(/\d{4} \d{2}/);
          if (numerosFechaRegistroSiguiente) {
            return numerosFechaRegistroSiguiente[0]; // Devolver el primer conjunto de números encontrado con el formato "NNNN NN"
          }
        }
      }
    }
    return "";
  } catch (error) {
    console.error("Error al buscar AÑO DE REGISTRO ", error);
  }
}

function getGenero(lineas) {
  let sexoIndex = lineas.findIndex((line) => line.includes("SEXO"));
  if (sexoIndex !== -1) {
    const sexoLinea = lineas[sexoIndex].trim();
    // Buscar la letra "H" o "M" después de "SEXO"
    const letraSexo = sexoLinea.includes("H") ? "H" : "M";
    return letraSexo;
  } else {
    // Si no se encuentra en la misma línea, buscar en la siguiente línea
    sexoIndex = lineas.findIndex((line, index) =>
      index === lineas.length - 1 ? false : lineas[index + 1].includes("SEXO"),
    );
    if (sexoIndex !== -1) {
      const sexoLinea = lineas[sexoIndex + 1].trim();
      const letraSexo = sexoLinea.includes("H") ? "H" : "M";
      return letraSexo;
    } else {
      return "";
    }
  }
}

function getSeccion(lineas) {
  const seccionIndex = lineas.findIndex((linea) => linea.includes("SECCIÓN"));
  if (seccionIndex !== -1 && seccionIndex < lineas.length - 1) {
    const seccionLinea = lineas[seccionIndex].trim();
    // Buscar un conjunto de números después de "SECCIÓN" en la misma línea
    const numerosSeccion = seccionLinea.match(/\d+/);
    if (numerosSeccion) {
      return numerosSeccion[0]; // Devolver el primer conjunto de números encontrado
    } else {
      // Si no se encuentra un conjunto de números en la misma línea, buscar en la siguiente línea
      const siguienteLinea = lineas[seccionIndex + 1].trim();
      const numerosSiguienteLinea = siguienteLinea.match(/\d+/);
      if (numerosSiguienteLinea) {
        return numerosSiguienteLinea[0]; // Devolver el primer conjunto de números encontrado en la siguiente línea
      }
    }
  }
  return "";
}

function getVigenciaCredencial(lineas) {
  const vigenciaIndex = lineas.findIndex((linea) => linea.includes("VIGENCIA"));
  if (vigenciaIndex !== -1 && vigenciaIndex <= lineas.length - 1) {
    const vigenciaLinea = lineas[vigenciaIndex].trim();
    // Buscar un conjunto de números después de "VIGENCIA" en la misma línea
    const numerosVigencia = vigenciaLinea.match(/\d+/g);
    if (numerosVigencia) {
      return numerosVigencia[numerosVigencia.length - 1]; // Devolver el último conjunto de números encontrado
    } else {
      // Si no se encuentra un conjunto de números en la misma línea, buscar en la siguiente línea
      const siguienteLinea = lineas[vigenciaIndex + 1].trim();
      const numerosSiguienteLinea = siguienteLinea.match(/\d+/g);
      if (numerosSiguienteLinea) {
        return numerosSiguienteLinea[numerosSiguienteLinea.length - 1]; // Devolver el último conjunto de números encontrado después del "-"
      }
    }
  }
  return "";
}

export default OCRSpace;
