// src/pages/LocalSummary.tsx
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import Header from "../../components/headers-components/header/Header";
import { useState } from 'react';
import './Summary.css';
import LocationRestaurantMap from '../../components/restaurant-info/location-restaurant-map/LocationRestaurantMap';
import BackButton from '../../components/back-button/BackButton';
import { useOrder } from '../../context/OrderContext';

function LocalSummary() {
  const navigate = useNavigate();
  const { updateTotal } = useOrder();

  const handlers = useSwipeable({
    onSwipedRight: () => navigate('/Main-Menu'),
    trackMouse: true,
  });

  const productIds = [1, 2, 3, 4, 5, 6, 7, 8];

  // Leer del localStorage usando las mismas claves que NigiriBase/MakiBase:
  const products = productIds.map(id => {
    const key = id.toString();
    const name = localStorage.getItem(`${key}Name`) || "–";
    const quantity = parseInt(localStorage.getItem(`${key}Quantity`) || "0", 10);
    const price = parseFloat(localStorage.getItem(`${key}Price`) || "0");
    return { id, name, quantity, price };
  });

  // Calcular total
  const total = products.reduce((sum, p) => sum + p.quantity * p.price, 0);
  localStorage.setItem("total", total.toFixed(2));

  // Estados para modalidad de pedido
  const [delivery, setDelivery] = useState(false);
  const [pickup, setPickup] = useState(true);

  const handleDeliveryChange = () => {
    if (pickup) setPickup(false);
    setDelivery(!delivery);
  };
  const handlePickupChange = () => {
    if (delivery) setDelivery(false);
    setPickup(!pickup);
  };

  const handleMakeOrder = () => {
    // 1) Elimina los productos del localStorage
    productIds.forEach(id => {
      const key = id.toString();
      localStorage.removeItem(`${key}Name`);
      localStorage.removeItem(`${key}Quantity`);
      localStorage.removeItem(`${key}Price`);
    });
    // 2) Elimina totales
    localStorage.removeItem("total");
    localStorage.removeItem("orderTotal");
    // 3) Resetea el contexto
    updateTotal(0);
    // 4) Feedback / redirección
    alert("Pedido realizado. ¡Gracias!");
    navigate("/Main-Menu");
  };

  return (
    <>
      <Header />
      <BackButton />
      <div {...handlers}>
        <h1 className='summary'>Summary</h1>

        <ul className="order-list">
          <div className="checkbox">
            <label>
              <input
                type="checkbox"
                checked={delivery}
                onChange={handleDeliveryChange}
                data-testid="delivery"
              />
              Delivery
            </label>
            <label>
              <input
                type="checkbox"
                checked={pickup}
                onChange={handlePickupChange}
                data-testid="recogida"
              />
              Pick up
            </label>
          </div>

          {products.filter(p => p.quantity > 0).map((p, idx) => (
            <li key={idx} className="order-item">
              <span className="order-name">{p.name}</span>
              <span className="order-quantity">x{p.quantity}</span>
              <span className="order-price">{(p.price * p.quantity).toFixed(2)} €</span>
            </li>
          ))}

          {products.every(p => p.quantity === 0) && (
            <p className="no-items">No items in the order.</p>
          )}

          <p className="order-total">Total: {total.toFixed(2)} €</p>
        </ul>

      </div>

      <div className="order-location-container">
        {!delivery && <LocationRestaurantMap />}
        <button className="order-button" onClick={handleMakeOrder}>
          Make order
        </button>
      </div>
    </>
  );
}

export default LocalSummary;
