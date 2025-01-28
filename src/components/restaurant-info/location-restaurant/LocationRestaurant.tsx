import "./LocationRestaurant.css";

function LocationRestaurant() {
  return (
    <div className="location-container" onClick={()=> window.open("https://maps.app.goo.gl/Ro3Rour6P7i9nbAX9")}>
      <img src="/location.png" alt="Map"/>
      <p className="location-text">
        We are located on Veerstraat 41
        <br/>
        <br/>
        Open from Wednesday to Sunday<br />
        from 12 to 20h.
      </p>
    </div>
  );
};

export default LocationRestaurant;