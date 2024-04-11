import React, { useState,useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Mapa_usuario from "assets/img/Mapa_usuario.png";
import PropTypes from 'prop-types';

const Map = ({ markersData_, width, height, onMapUpdate }) => {

   const [dragend,setDdragend]= useState(true);
  const markersData = markersData_ || [];



  useEffect(() => {
    if (markersData.length > 1){
      setDdragend(false);
    }
    const map = L.map("map", {
      dragging: true
    }).setView([19.2433, -103.725], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);
    
    const addMarkers = async () => {
      try {
        if (markersData.length > 0) {
          const allMarkers = markersData.map((markerData, index) => {
            const { nombre, edad, state, municipality, neighborhood, postalCode, street, number, lat, lon } = markerData;
            if (lat && lon) {
              return getMarkerContentFromCoordinates(nombre, edad, state, municipality, neighborhood, postalCode, street, number,lat, lon, index);
            } else {
              return getMarkerContent(nombre, edad, state, municipality, neighborhood, postalCode, street, number, index);
            }
          });

          Promise.all(allMarkers)
            .then(markers => {
              markers.forEach(marker => {
                if (marker) {
                 

                  marker.addTo(map);
                  if(dragend){
                  const markerLatLng = marker.getLatLng(); // Obtener la posición del marcador
                  const lat = markerLatLng.lat; // Obtener la latitud
                  const lon = markerLatLng.lng; // Obtener la longitud

                  centerMap(lat,lon, map);
                  }
                  const markersLatLng = markers.map(marker => ({
                    lat: marker.getLatLng().lat,
                    lon: marker.getLatLng().lng
                   // street: street,
                    //postalCode: postalCode 
                  }));
               
                  onMapUpdate(markersLatLng);
                }
              });
            })
            .catch(error => {
              console.error("Error al agregar marcadores:", error);
            });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    addMarkers();

    return () => {
      map.remove();
    };
  }, [markersData]);

 
  const getMarkerContent = async (nombre, edad, state, municipality, neighborhood, postalCode, street, number, index) => {
   
    let parametros = `q=${encodeURIComponent('mexico, ' + municipality + ', ' + state + ', ' + postalCode + ', '+ number +' '+  street+', ' )}&bounded=1&limit=1`;
    let queryString =`https://nominatim.openstreetmap.org/search?addressdetails=1&${parametros}&format=json`;
    
    try {
      let response = await fetch(queryString);
      let data = await response.json();
    
      if (data.length === 0) {
        parametros = `q=${encodeURIComponent('mexico, ' + municipality + ', ' + state + ', ' + postalCode + ', '+ number +' '+  street+', ' )}&bounded=1&limit=1`;
        queryString =`https://nominatim.openstreetmap.org/search?addressdetails=1&${parametros}&format=json`; 
        response = await fetch(queryString);
        data = await response.json();
      }

      if (data.length > 0) {
        const { lat, lon } = data[0];
        const offset = index * 0.0001;
        const markerIcon = L.icon({
          iconUrl: Mapa_usuario,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });  
        const marker = L.marker([parseFloat(lat) + offset, parseFloat(lon) + offset], { draggable: dragend, icon: markerIcon });
      
        if (marker) {
            marker.bindPopup(`
              <b>Nombre:</b> ${nombre}<br/>
              <b>Estado:</b> ${state}<br/>
              <b>Municipio:</b> ${municipality}<br/>
              <b>Colonia:</b> ${neighborhood}<br/>
              <b>Código Postal:</b> ${postalCode}<br/>
              <b>Calle:</b> ${street}<br/>
              <b>Número:</b> ${number}<br/>          
            `);   
	      	}
        marker.on("dragend", (event) => {
          const markerLatLng = event.target.getLatLng();
          const newLat = markerLatLng.lat;
          const newLon = markerLatLng.lng;
          onMapUpdate({ lat: newLat, lon: newLon, street: street, postalCode: postalCode });
        });
        marker.on("click", (event) => {
          const markerLatLng = event.target.getLatLng();
          const newLat = markerLatLng.lat;
          const newLon = markerLatLng.lng;
          onMapUpdate({ lat: newLat, lon: newLon, street: street, postalCode: postalCode });
        });
        return marker;
      } else {
        parametros = `q=${encodeURIComponent('mexico, Colima, colima, 28000' )}&bounded=1&limit=1`;
        queryString =`https://nominatim.openstreetmap.org/search?addressdetails=1&${parametros}&format=json`; 
        response = await fetch(queryString);
        data = await response.json();
        const { lat, lon } = data[0];
        const offset = index * 0.0001;
        const markerIcon = L.icon({
          iconUrl: Mapa_usuario,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });  
        const marker = L.marker([parseFloat(lat) + offset, parseFloat(lon) + offset], { draggable: dragend, icon: markerIcon });
     
        if (marker) {
					 marker.bindPopup(`
            <b>Nombre:</b> ${nombre}<br/>
            <b>Estado:</b> ${state}<br/>
            <b>Municipio:</b> ${municipality}<br/>
            <b>Colonia:</b> ${neighborhood}<br/>
            <b>Código Postal:</b> ${postalCode}<br/>
            <b>Calle:</b> ${street}<br/>
            <b>Número:</b> ${number}<br/>          
          `);   
		}
        marker.on("dragend", (event) => {
          const markerLatLng = event.target.getLatLng();
          const newLat = markerLatLng.lat;
          const newLon = markerLatLng.lng;         
          onMapUpdate({ lat: newLat, lon: newLon, street: street, postalCode: postalCode });
        });
        marker.on("click", (event) => {
          const markerLatLng = event.target.getLatLng();
          const newLat = markerLatLng.lat;
          const newLon = markerLatLng.lng;
          onMapUpdate({ lat: newLat, lon: newLon, street: street, postalCode: postalCode });
        });
        return marker;
      }
    } catch (error) {
      console.log("Error getMarkerContent",error);
    }

    return null;
  };

  const getMarkerContentFromCoordinates = async (nombre, edad, state, municipality, neighborhood, postalCode, street, number,lat, lon, index) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await response.json();

      if (data) {
        const { road: street, postcode: postalCode } = data.address;

        const offset = index * 0.0001;
        const markerIcon = L.icon({
          iconUrl: Mapa_usuario,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });  
        const marker = L.marker([parseFloat(lat) + offset, parseFloat(lon) + offset], { draggable: dragend, icon: markerIcon });
        if (marker) {
          marker.bindPopup(`
           <b>Nombre:</b> ${nombre}<br/>
           <b>Estado:</b> ${state}<br/>
           <b>Municipio:</b> ${municipality}<br/>
           <b>Colonia:</b> ${neighborhood}<br/>
           <b>Código Postal:</b> ${postalCode}<br/>
           <b>Calle:</b> ${street}<br/>
           <b>Número:</b> ${number}<br/>          
         `);   
         }
        marker.on("dragend", (event) => {
          const markerLatLng = event.target.getLatLng();
          const newLat = markerLatLng.lat;
          const newLon = markerLatLng.lng;
          onMapUpdate({ lat: newLat, lon: newLon, street: street, postalCode: postalCode });
        });
        marker.on("click", (event) => {
          const markerLatLng = event.target.getLatLng();
          const newLat = markerLatLng.lat;
          const newLon = markerLatLng.lng;
          onMapUpdate({ lat: newLat, lon: newLon, street: street, postalCode: postalCode });
        });
        return marker;
      }
    } catch (error) {
      console.error("Error al obtener la dirección desde las coordenadas:", error);
    }

    return null;
  };

  const centerMap = (lat, lon, map_) => {
    if (map_) { // Verificar si map está definido antes de usarlo
      const currentBounds = map_.getBounds();
      const newLatLng = L.latLng(lat, lon);
      if (!currentBounds.contains(newLatLng)) {
        map_.setView(newLatLng);
      }
    }
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
      lat: PropTypes.number,
      lon: PropTypes.number,
    })
  ),
  width: PropTypes.string,
  height: PropTypes.string,
  onMapUpdate: PropTypes.func.isRequired,
};

export default Map;
