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

    // Leer del localStorage usando las mismas claves que NigiriBase:
    //   `${id}Name`, `${id}Quantity`, `${id}Price`
    const nigiris = [1, 2, 3, 4, 5].map((num) => {
        const key = num.toString();
        const name = localStorage.getItem(`${key}Name`) || "–";
        const quantity = parseInt(localStorage.getItem(`${key}Quantity`) || "0", 10);
        const price = parseFloat(localStorage.getItem(`${key}Price`) || "0");
        return { name, quantity, price };
    });

    const total = nigiris.reduce((sum, n) => sum + n.quantity * n.price, 0);
    localStorage.setItem("total", total.toFixed(2));

    const [checkbox1, setCheckbox1] = useState(false);
    const [checkbox2, setCheckbox2] = useState(true);

    const handleCheckboxChange1 = () => {
        if (checkbox2) setCheckbox2(false);
        setCheckbox1(!checkbox1);
    };
    const handleCheckboxChange2 = () => {
        if (checkbox1) setCheckbox1(false);
        setCheckbox2(!checkbox2);
    };

    const handleMakeOrder = () => {
        // 1) Elimina los nigiris del localStorage
        for (let i = 1; i <= 5; i++) {
            localStorage.removeItem(`${i}Name`);
            localStorage.removeItem(`${i}Quantity`);
            localStorage.removeItem(`${i}Price`);
        }
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
                                checked={checkbox1}
                                onChange={handleCheckboxChange1}
                                data-testid="delivery"
                            />
                            Delivery
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={checkbox2}
                                onChange={handleCheckboxChange2}
                                data-testid="recogida"
                            />
                            Pick up
                        </label>
                    </div>

                    {nigiris
                        .filter(n => n.quantity > 0)
                        .map((n, idx) => (
                            <li key={idx} className="order-item">
                                <span className="order-name">{n.name}</span>
                                <span className="order-quantity">x{n.quantity}</span>
                                <span className="order-price">
                                    {(n.price * n.quantity).toFixed(2)} €
                                </span>
                            </li>
                        ))
                    }

                    {nigiris.every(n => n.quantity === 0) && (
                        <p className="no-items">No items in the order.</p>
                    )}

                    <p className="order-total">Total: {total.toFixed(2)} $</p>
                </ul>

            </div>

            <div className="order-location-container">
                {!checkbox1 && <LocationRestaurantMap />}
                <button className="order-button" onClick={handleMakeOrder}>
                    Make order
                </button>
            </div>
        </>
    );
}

export default LocalSummary;
