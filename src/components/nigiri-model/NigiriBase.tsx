import { useState, useEffect } from "react";
import { useOrder } from "../../context/OrderContext";
import { useFavorites } from "../../context/FavoritesContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Nigiri.css";
import { useSwipeable } from "react-swipeable";
import BackButton from "../back-button/BackButton";

interface NigiriProps {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    ingredients: string;
    allergens: string;
}

function NigiriBase({ id, name, price, image, description, ingredients, allergens }: NigiriProps) {
    const [quantity, setQuantity] = useState(() =>
        parseInt(localStorage.getItem(`${id}Quantity`) || "0", 10)
    );
    const { total, updateTotal } = useOrder();
    const { favorites, addFavorite, removeFavorite } = useFavorites();
    const [liked, setLiked] = useState(favorites.includes(name));
    const [disliked, setDisliked] = useState(() => JSON.parse(localStorage.getItem(`${id}Disliked`) || "false"));
    const navigate = useNavigate();
    const [prevQuantity, setPrevQuantity] = useState(quantity);
    const location = useLocation();


    useEffect(() => {
        localStorage.setItem(`${id}Quantity`, quantity.toString());
        if (quantity > 0) {
            localStorage.setItem(`${id}Name`, name);
            localStorage.setItem(`${id}Price`, price.toString());
        } else {
            localStorage.removeItem(`${id}Name`);
            localStorage.removeItem(`${id}Price`);
        }

        if (quantity !== prevQuantity) {
            const quantityDifference = quantity - prevQuantity;
            updateTotal(total + price * quantityDifference);
            setPrevQuantity(quantity);
        }

        localStorage.setItem(`${id}Disliked`, JSON.stringify(disliked));
    }, [quantity, prevQuantity, price, updateTotal, total, id, name, disliked]);

    const handleQuantityChange = (delta: number) => {
        setQuantity((prev) => {
            const newQuantity = prev + delta;
            return newQuantity >= 0 ? newQuantity : 0;
        });
    };

    const toggleLike = () => {
        if (liked) {
            setLiked(false);
            removeFavorite(name);
        } else {
            setLiked(true);
            addFavorite(name);
        }
        setDisliked(false);
    };

    const toggleDislike = () => {
        if (disliked) {
            setDisliked(false);
        } else {
            setDisliked(true);
        }
        setLiked(false);
    };


    const handlers = useSwipeable({
        onSwipedUp: () => handleSwipeUp(),
        trackMouse: true,
    });

    const handleSwipeUp = () => {
        const nextDish = getNextDish();
        if (nextDish) {
            navigate(`/Nigiri${nextDish}`);
        }
    };

    const getNextDish = (): string | null => {
        const allDishes = [1, 2, 3, 4, 5];
        for (let i = 0; i < allDishes.length; i++) {
            const dishId = `Nigiri${allDishes[i]}`;
            const isDisliked = JSON.parse(localStorage.getItem(`${dishId}Disliked`) || "false");
            if (!isDisliked) {
                return dishId;
            }
        }

        return null;
    };

    return (
        <div {...handlers} className="container">
            <BackButton/>
            <section className="content">
                <div className="dish-info">
                    <h1>NIGIRIS</h1>
                    <img src={image} alt={name} className="dish-img" />
                    <h2>{name}</h2>
                    <p>{description}</p>
                    <p><strong>Ingredients: &nbsp;</strong>{ingredients}</p>
                    <p><strong>Allergens:&nbsp;</strong>{allergens}</p>
                    <div className="menu" data-testid="scroll-container">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <Link to={`/Nigiri${item}`} key={item}>
                            <button
                                className={`menu-button ${location.pathname === `/Nigiri${item}` ? 'active' : ''}`}
                            >
                                {item}
                            </button>
                        </Link>
                    ))}
                </div>
                </div>


                <div className="controls">
                    <div className="first-control">
                        <div className="quantity-control">
                            <button onClick={() => handleQuantityChange(-1)}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => handleQuantityChange(1)}>+</button>
                        </div>
                        <div className="price">
                            <p>&nbsp;&nbsp;{`+ ${price} $`}</p>
                        </div>
                        <div className="heart">
                            <button className="favorite-button" onClick={toggleLike}>
                                {liked ? "❤️" : "🤍"}
                            </button>
                            <button className="favorite-button" onClick={toggleDislike}>
                                {disliked ? "❌" : "👎"}
                            </button>
                        </div>
                    </div>
                    <div className="second-control">
                        <div className="order">
                            <button className="order-button" onClick={() => navigate("/Local-Summary")}>
                                Make order &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{total.toFixed(2)} $
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default NigiriBase;
