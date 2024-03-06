import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Mapa_usuario from "assets/img/Mapa_usuario.png"
import PropTypes from 'prop-types';
const Map = ({ markersData_ ,width, height}) => {
  /*const markersData =markersData_ ||  [
    {
      nombre: "jose pastor",
      edad: 46,
      state: 'Colima',
      municipality: 'Colima',
      neighborhood: 'la armonia',
      postalCode: '28020',
      street: 'independencia',
      number: '271',
    },
    {
      nombre: "jose pastor",
      edad: 46,
      state: 'Colima',
      municipality: 'Colima',
      neighborhood: 'la armonia',
      postalCode: '28020',
      street: 'independencia',
      number: '271',
    },
    {
      nombre: "jose pastor",
      edad: 46,
      state: 'Colima',
      municipality: 'Colima',
      neighborhood: 'la armonia',
      postalCode: '28020',
      street: 'independencia',
      number: '271',
    },
    {
      nombre: "miguel pastor",
      edad: 46,
      state: 'Colima',
      municipality: 'Colima',
      neighborhood: 'la armonia',
      postalCode: '28000',
      street: 'independencia',
      number: '271',
    },
    {
      nombre: "miguel garcia",
      edad: 46,
      state: 'Colima',
      municipality: 'Colima',
      neighborhood: 'la armonia',
      postalCode: '29089',
      street: 'independencia',
      number: '271',
    }
  ];

*/
  const markersData =markersData_ ||   [
    {
      nombre: "jose pastor",
      edad: 46,
      state: 'Colima',
      municipality: 'Colima',
      neighborhood: 'la armonia',
      postalCode: '28000',
      street: 'independencia',
      number: '271',
    },
    {
      nombre: "miguel pastor",
      edad: 46,
      state: 'Colima',
      municipality: 'Colima',
      neighborhood: 'la armonia',
      postalCode: '28010',
      street: 'independencia',
      number: '271',
    },
    {
      nombre: "ana gonzález",
      edad: 32,
      state: 'Colima',
      municipality: 'Colima',
      neighborhood: 'centro',
      postalCode: '28013',
      street: 'hidalgo',
      number: '123',
    },
    {
      nombre: "carlos rodríguez",
      edad: 41,
      state: 'Colima',
      municipality: 'Colima',
      neighborhood: 'los cedros',
      postalCode: '28014',
      street: 'revolución',
      number: '456',
    },
    {
      nombre: "luisa hernández",
      edad: 29,
      state: 'Colima',
      municipality: 'Colima',
      neighborhood: 'las palmas',
      postalCode: '28015',
      street: 'juárez',
      number: '789',
    },
    {
      nombre: "pedro gómez",
      edad: 35,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'san francisco',
      postalCode: '28970',
      street: 'madero',
      number: '555',
    },
    {
      nombre: "maría garcía",
      edad: 27,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'centro',
      postalCode: '28979',
      street: 'hidalgo',
      number: '321',
    },
    {
      nombre: "manuel rodríguez",
      edad: 38,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'villas del sol',
      postalCode: '28980',
      street: 'paz',
      number: '999',
    },
    {
      nombre: "jorge garcía",
      edad: 42,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'agua dulce',
      postalCode: '28955',
      street: 'jardines',
      number: '123',
    },
    {
      nombre: "carla rodríguez",
      edad: 31,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'alfonso rolon michel',
      postalCode: '28983',
      street: 'progreso',
      number: '456',
    },
    {
      nombre: "alejandro ramirez",
      edad: 36,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'alfredo v. bonfil',
      postalCode: '28979',
      street: 'revolución',
      number: '789',
    },
    {
      nombre: "sara gonzález",
      edad: 39,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'alta villa',
      postalCode: '28987',
      street: 'juárez',
      number: '111',
    },
    {
      nombre: "roberto hernández",
      edad: 33,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'arboledas del carmen',
      postalCode: '28978',
      street: 'pino suárez',
      number: '222',
    },
    {
      nombre: "lucia lopez",
      edad: 28,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'azaleas',
      postalCode: '28978',
      street: 'benito juárez',
      number: '333',
    },
    {
      nombre: "juan castro",
      edad: 45,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'azteca',
      postalCode: '28984',
      street: 'madero',
      number: '444',
    },
    {
      nombre: "martha jiménez",
      edad: 37,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'buenavista',
      postalCode: '28984',
      street: 'hidalgo',
      number: '555',
    },
    {
      nombre: "javier ramírez",
      edad: 41,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'bugambilias',
      postalCode: '28979',
      street: 'benito juárez',
      number: '666',
    },
    {
      nombre: "rosa hernández",
      edad: 34,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'burócratas del estado',
      postalCode: '28989',
      street: 'revolución',
      number: '777',
    },
    {
      nombre: "fernando rodríguez",
      edad: 48,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'campestre',
      postalCode: '28988',
      street: 'hidalgo',
      number: '888',
    },
    {
      nombre: "diana gómez",
      edad: 29,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'campestre bugambilias',
      postalCode: '28989',
      street: 'juárez',
      number: '999',
    },
    {
      nombre: "alejandra ramírez",
      edad: 43,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'carlos de la madrid',
      postalCode: '28979',
      street: 'madero',
      number: '111',
    },
    {
      nombre: "raúl garcía",
      edad: 36,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'centenario ii',
      postalCode: '28984',
      street: 'hidalgo',
      number: '222',
    },
    {
      nombre: "laura lopez",
      edad: 31,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'colinas de las lagunas',
      postalCode: '28979',
      street: 'revolución',
      number: '333',
    },
    {
      nombre: "daniel castro",
      edad: 39,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'colinas del carmen',
      postalCode: '28978',
      street: 'juárez',
      number: '444',
    },
    {
      nombre: "mariana jiménez",
      edad: 27,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'colinas del sol',
      postalCode: '28979',
      street: 'madero',
      number: '555',
    },
    {
      nombre: "gerardo hernández",
      edad: 35,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'cruz de comala',
      postalCode: '28979',
      street: 'hidalgo',
      number: '666',
    },
    {
      nombre: "verónica gómez",
      edad: 32,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'cuidad nátura',
      postalCode: '28989',
      street: 'benito juárez',
      number: '777',
    },
    {
      nombre: "luis ramírez",
      edad: 41,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'del valle',
      postalCode: '28985',
      street: 'revolución',
      number: '888',
    },
    {
      nombre: "karla garcía",
      edad: 29,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'el angel',
      postalCode: '28979',
      street: 'juárez',
      number: '999',
    },
    {
      nombre: "rodrigo rodríguez",
      edad: 34,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'el carrizal',
      postalCode: '28960',
      street: 'madero',
      number: '111',
    },
    {
      nombre: "daniela gómez",
      edad: 37,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'el centenario',
      postalCode: '28984',
      street: 'hidalgo',
      number: '222',
    },
    {
      nombre: "josé hernández",
      edad: 40,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'el chivato (providencia)',
      postalCode: '28965',
      street: 'revolución',
      number: '333',
    },
    {
      nombre: "paola lopez",
      edad: 30,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'el cortijo',
      postalCode: '28982',
      street: 'juárez',
      number: '444',
    },
    {
      nombre: "rafael castro",
      edad: 45,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'el crucero',
      postalCode: '28970',
      street: 'madero',
      number: '555',
    },
    {
      nombre: "sandra jiménez",
      edad: 33,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'el derramadero',
      postalCode: '28969',
      street: 'hidalgo',
      number: '666',
    },
    {
      nombre: "martín ramírez",
      edad: 42,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'el fresno',
      postalCode: '28960',
      street: 'benito juárez',
      number: '777',
    },
    {
      nombre: "patricia hernández",
      edad: 36,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'el huarache',
      postalCode: '28969',
      street: 'revolución',
      number: '888',
    },
    {
      nombre: "sergio gómez",
      edad: 38,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'el llano',
      postalCode: '28960',
      street: 'hidalgo',
      number: '999',
    },
    {
      nombre: "isabel ramírez",
      edad: 39,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'el mezcal',
      postalCode: '28964',
      street: 'juárez',
      number: '111',
    },
    {
      nombre: "manuel garcía",
      edad: 31,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'el mirador',
      postalCode: '28970',
      street: 'madero',
      number: '222',
    },
    {
      nombre: "carmen rodríguez",
      edad: 34,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'el naranjal',
      postalCode: '28969',
      street: 'hidalgo',
      number: '333',
    },
    {
      nombre: "fernando gonzález",
      edad: 35,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'el pantanal',
      postalCode: '28970',
      street: 'revolución',
      number: '444',
    },
    {
      nombre: "maría hernández",
      edad: 37,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'el plan',
      postalCode: '28968',
      street: 'juárez',
      number: '555',
    },
    {
      nombre: "luisa lopez",
      edad: 29,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'el porvenir',
      postalCode: '28979',
      street: 'madero',
      number: '666',
    },
    {
      nombre: "pedro castro",
      edad: 40,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'el porvenir ii',
      postalCode: '28980',
      street: 'hidalgo',
      number: '777',
    },
    {
      nombre: "ana jiménez",
      edad: 32,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'el tepeyac',
      postalCode: '28980',
      street: 'benito juárez',
      number: '888',
    },
    {
      nombre: "josé hernández",
      edad: 43,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'el tinto',
      postalCode: '28964',
      street: 'revolución',
      number: '999',
    },
    {
      nombre: "carolina garcía",
      edad: 36,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'esteban v porras',
      postalCode: '28968',
      street: 'juárez',
      number: '111',
    },
    {
      nombre: "david ramírez",
      edad: 30,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'fuentes del molino',
      postalCode: '28968',
      street: 'madero',
      number: '222',
    },
    {
      nombre: "andrea gómez",
      edad: 35,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'gaviotas',
      postalCode: '28978',
      street: 'hidalgo',
      number: '333',
    },
    {
      nombre: "juan hernández",
      edad: 39,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'golondrinas',
      postalCode: '28978',
      street: 'revolución',
      number: '444',
    },
    {
      nombre: "mariana ramírez",
      edad: 31,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'hacienda real',
      postalCode: '28978',
      street: 'juárez',
      number: '555',
    },
    {
      nombre: "roberto gonzález",
      edad: 42,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'jardines de la hacienda',
      postalCode: '28978',
      street: 'madero',
      number: '666',
    },
    {
      nombre: "alejandra lopez",
      edad: 33,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'jardines del llano',
      postalCode: '28968',
      street: 'hidalgo',
      number: '777',
    },
    {
      nombre: "raúl castro",
      edad: 37,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'jardines del sol',
      postalCode: '28978',
      street: 'benito juárez',
      number: '888',
    },
    {
      nombre: "sofía hernández",
      edad: 34,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'jardines del valle',
      postalCode: '28978',
      street: 'revolución',
      number: '999',
    },
    {
      nombre: "carlos ramírez",
      edad: 38,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'jardines del vergel',
      postalCode: '28979',
      street: 'juárez',
      number: '111',
    },
    {
      nombre: "paola gómez",
      edad: 29,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'la colina',
      postalCode: '28979',
      street: 'madero',
      number: '222',
    },
    {
      nombre: "eduardo hernández",
      edad: 43,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'la comarca',
      postalCode: '28979',
      street: 'hidalgo',
      number: '333',
    },
    {
      nombre: "maría lopez",
      edad: 31,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'la cuesta',
      postalCode: '28979',
      street: 'revolución',
      number: '444',
    },
    {
      nombre: "luis castro",
      edad: 36,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'la estancia',
      postalCode: '28979',
      street: 'juárez',
      number: '555',
    },
    {
      nombre: "angélica ramírez",
      edad: 39,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'la joya',
      postalCode: '28979',
      street: 'madero',
      number: '666',
    },
    {
      nombre: "fernando gómez",
      edad: 35,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'la joyita',
      postalCode: '28969',
      street: 'hidalgo',
      number: '777',
    },
    {
      nombre: "patricia hernández",
      edad: 37,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'la libertad',
      postalCode: '28969',
      street: 'benito juárez',
      number: '888',
    },
    {
      nombre: "juan ramírez",
      edad: 40,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'la loma',
      postalCode: '28969',
      street: 'revolución',
      number: '999',
    },
    {
      nombre: "laura gonzález",
      edad: 32,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'la providencia',
      postalCode: '28960',
      street: 'juárez',
      number: '111',
    },
    {
      nombre: "javier hernández",
      edad: 41,
      state: 'Colima',
      municipality: 'Villa de Álvarez',
      neighborhood: 'la reforma',
      postalCode: '28960',
      street: 'madero',
      number: '222',
    },
  ];


  useEffect(() => {
    const map = L.map("map").setView([19.2433, -103.725], 13);
  
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);
  
    const addMarkers = async () => {
      try {
      if (markersData.length > 0) {
        for (const [index, markerData] of markersData.entries()) {
          const { nombre, edad, state, municipality, neighborhood, postalCode, street, number } = markerData;
          const marker = await getMarkerContent(nombre, edad, state, municipality, neighborhood, postalCode, street, number, index);
          if (marker) {
            marker.bindPopup(`
            <b>Nombre:</b> ${nombre}<br/>
            <b>Edad:</b> ${edad}<br/>
            <b>Estado:</b> ${state}<br/>
            <b>Municipio:</b> ${municipality}<br/>
            <b>Colonia:</b> ${neighborhood}<br/>
            <b>Código Postal:</b> ${postalCode}<br/>
            <b>Calle:</b> ${street}<br/>
            <b>Número:</b> ${number}<br/>
          
          `);    
          marker.on("dragend", (event) => {
            const markerLatLng = event.target.getLatLng();
            const newLat = markerLatLng.lat;
            const newLon = markerLatLng.lng;
            console.log("Nuevas coordenadas:", newLat, newLon);
            console.log(markerLatLng);
          
          });
          // Agregar el marcador al mapa
          marker.on('add', () => {
            if (marker._icon && marker._icon.parentNode) {
              marker._icon.parentNode.insertBefore(marker._icon, marker._icon.nextSibling);
            }
          });
          const markerLatLng = marker.getLatLng();
         const lat = markerLatLng.lat;
         const lon = markerLatLng.lng;
         map.setView([lat, lon], 13);
            marker.addTo(map);

          }

          
        }
      }
    }catch (error) {
      console.log("error");
      console.log(error);
    }
    };
  
   
    addMarkers();
  
    return () => {
      map.remove();
    };
  }, [markersData]);

  const getMarkerContent = async (nombre, edad, state, municipality, neighborhood, postalCode, street, number, index) => {
    const queryString = `q=${encodeURIComponent('mexico, ' + municipality + ', ' + state + ', ' + postalCode)}&bounded=1&limit=1`;
  
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&${queryString}`);
      const data = await response.json();
       console.log(data);
      if (data.length > 0) {
        const { lat, lon } = data[0];
        const offset = index * 0.0001;
        const markerIcon = L.icon({
          iconUrl: Mapa_usuario,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });  
        const marker = L.marker([parseFloat(lat) + offset, parseFloat(lon) + offset], { draggable: true, icon: markerIcon });
       return marker;
      }
    } catch (error) {
      console.log("error");
      console.log(error);
    }
  
    return null;
  };
  
  const mapStyle = {
    width: width || "100%",
    height: height || "100vh",
  };

  return <div id="map" style={mapStyle}></div>;
};


Map.propTypes = {
  markersData_: PropTypes.arrayOf(
    PropTypes.shape({
      nombre: PropTypes.string,
      edad: PropTypes.number,
      state: PropTypes.string,
      municipality: PropTypes.string,
      neighborhood: PropTypes.string,
      postalCode: PropTypes.string,
      street: PropTypes.string,
      number: PropTypes.string,
    })
  ),
  width: PropTypes.string,
  height: PropTypes.string,
};

export default Map;
