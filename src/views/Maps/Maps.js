import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Mapa_usuario from "assets/img/Mapa_usuario.png"
import PropTypes from 'prop-types';
const Map = ({ markersData_ ,width, height,onMapUpdate }) => {
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
    }
    
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
            onMapUpdate(markerLatLng);
          

            getAddressFromCoordinates(newLat, newLon)
            .then(addressData => {
              console.log("Dirección del marcador:", addressData);
        
              // Extraer la calle y el código postal de la respuesta
              const street = addressData.address.road || "Desconocido";
              const postalCode = addressData.address.postcode || "Desconocido";
        
              console.log("Calle:", street);
              console.log("Código Postal:", postalCode);
        
              // Llamar a la función de devolución de llamada con la nueva posición y dirección del marcador
              onMapUpdate({ lat: newLat, lon: newLon, street: street, postalCode: postalCode });
            })
            .catch(error => {
              console.error("Error al obtener la dirección del marcador:", error);
            });


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
  
    function getAddressFromCoordinates(lat, lon) {
      return fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
        .then(response => response.json());
    }
    addMarkers();
    // Llama a la función de devolución de llamada cuando los datos del mapa se actualicen
   // onMapUpdate(markersData_);
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
  onMapUpdate: PropTypes.func.isRequired,
};

export default Map;
