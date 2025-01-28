import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import Header from "../../components/headers-components/header/Header";
import { useState } from 'react';
import './Summary.css';
import LocationRestaurantMap from '../../components/restaurant-info/location-restaurant-map/LocationRestaurantMap';
import BackButton from '../../components/back-button/BackButton';

function LocalSummary() {
    const navigate = useNavigate();
    const handlers = useSwipeable({
        onSwipedRight: () => navigate('/Nigiri1'),
        trackMouse: true,
    });

    const nigiris = [1, 2, 3, 4, 5].map((id) => {
        const name = localStorage.getItem(`nigiri${id}Name`);
        const quantity = localStorage.getItem(`nigiri${id}Quantity`);
        const price = localStorage.getItem(`nigiri${id}Price`);
        return {
            name,
            quantity: parseInt(quantity || "0", 10),
            price: parseFloat(price || "0")
        };
    });

    const total = nigiris.reduce((sum, nigiri) => {
        return sum + (nigiri.quantity * nigiri.price);
    }, 0);

    localStorage.setItem("total", total.toFixed(2));

    const [checkbox1, setCheckbox1] = useState(false);
    const [checkbox2, setCheckbox2] = useState(true);

    const handleCheckboxChange1 = () => {
        if (checkbox2) {
            setCheckbox2(false);
        }
        setCheckbox1(!checkbox1);
    };

    const handleCheckboxChange2 = () => {
        if (checkbox1) {
            setCheckbox1(false);
        }
        setCheckbox2(!checkbox2);
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
                        .filter((nigiri) => nigiri.quantity > 0)
                        .map((nigiri, index) => (
                            <li key={index} className="order-item">
                                <span className="order-name">{nigiri.name}</span>
                                <span className="order-quantity">x{nigiri.quantity}</span>
                                <span className="order-price"> {(nigiri.price * nigiri.quantity).toFixed(2)} €</span>
                            </li>
                        ))}
                    <p className="order-total">Total: {total.toFixed(2)} $</p>
                </ul>

                {nigiris.every((nigiri) => nigiri.quantity === 0) && (
                    <p className="no-items">No items in the order.</p>
                )}
            </div>

            <div className="order-location-container">
                {!checkbox1 && <LocationRestaurantMap />}

                <button className="order-button">Make order</button>
            </div>

        </>
    );
}

export default LocalSummary;
