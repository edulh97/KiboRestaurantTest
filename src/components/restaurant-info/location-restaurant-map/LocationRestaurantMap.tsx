import "./LocationRestaurantMap.css";
import { useState } from "react";

function LocationRestaurantMap() {
  const [, estadoImagen] = useState(false);

  const cargaImagen = () => {
    estadoImagen(true);
    console.log("Imagen cargada correctamente.");
  };

  const cargarErrorImagen = () => {
    console.error("Error al cargar la imagen.");
  };

  return (
    <div className="location-container-map" onClick={() => window.open("https://maps.app.goo.gl/Ro3Rour6P7i9nbAX9")}>
      <img 
        src="/location.png" 
        alt="Map"
        onError={cargarErrorImagen}
        onLoad={cargaImagen} 
      />
      <p className="location-text-map">We are located on Veerstraat 41</p>
    </div>
  );
}

export default LocationRestaurantMap;
