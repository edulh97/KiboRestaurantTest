import {
  Button,
  makeStyles,
  tokens,
  Text,
  Caption1,
  Title2,
  Body1,
  Body1Strong,
  mergeClasses,
} from "@fluentui/react-components";
import {
  HeartFilled,
  DismissCircleRegular,
  HeartRegular,
} from "@fluentui/react-icons";
import { useSwipeable } from "react-swipeable";
import { useState, useEffect } from "react";
import { useOrder } from "../../context/OrderContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "../back-button/BackButton";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: tokens.spacingHorizontalXL,
    gap: tokens.spacingVerticalL,
    backgroundColor: tokens.colorNeutralBackground1,
    marginTop: "50px",
  },
  ratingWrapper: {
    position: "relative",
    display: "inline-block",
    marginBottom: tokens.spacingVerticalS,
  },
  rating: {
    position: "absolute",
    top: "-28px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "none",
    padding: "6px 14px",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "16px",
    color: "#48ACAB",
    cursor: "pointer",
    textDecoration: "underline",
    zIndex: 5,
    transition: "background 0.3s",
    ":hover": {
      transform: "translateX(-50%) scale(1.05)",
    },
    userSelect: "none",
  },
  imageWrapper: {
    position: "relative",  // para que rating absoluto se posicione respecto aquí
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "250px",
    minWidth: "200px",
    maxWidth: "500px",
    "@media (max-width: 768px)": {
      height: "300px",
    },
    "@media (max-width: 480px)": {
      height: "250px",
    },
  },
  image: {
    width: "100%",
    maxWidth: "300px",
    height: "auto",
    objectFit: "cover",
    borderRadius: tokens.borderRadiusMedium,
    padding: "20px",
    "@media (min-width: 768px)": {
      maxWidth: "400px",
    },
    "@media (min-width: 1024px)": {
      maxWidth: "500px",
    },
  },
  infoContainer: {
    width: "fit-content",
    maxWidth: "600px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: tokens.spacingVerticalM,
    marginBottom: "50px",
  },
  controlsWrapper: {
    position: "fixed",
    bottom: 0,
    width: "100%",
    maxWidth: "500px",
    background:
      "linear-gradient(to top,rgb(150, 141, 141),rgb(255, 255, 255))",
    boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: tokens.spacingVerticalM,
    gap: tokens.spacingVerticalS,
    borderRadius: "10px",
    margin: "0px",
    zIndex: 10,
    maxHeight: "calc(100vh - 200px)",
    overflowY: "auto",
  },
  quantityControl: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "white",
    padding: "0 12px",
    height: "50px",
    borderRadius: "10px",
    marginLeft: "20px",
  },
  priceText: {
    fontSize: "20px",
    marginLeft: "10px",
    color: "Black",
  },
  heartButtons: {
    display: "flex",
    marginLeft: "auto",
    gap: tokens.spacingHorizontalXS,
    padding: "20px",
  },
  orderButton: {
    backgroundColor: "black",
    color: "white",
    width: "100%",
    height: "45px",
    fontSize: "22px",
    ":hover": {
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      color: "white",
      backgroundColor: "black",
    },
  },
  menuNav: {
    top: "40px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    gap: "10px",
    marginTop: tokens.spacingVerticalM,
    flexWrap: "wrap",
  },
  menuButton: {
    top: "40px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    fontSize: "13px",
    width: "40px",
    height: "40px",
    padding: "0",
    cursor: "pointer",
    ":active": {
      backgroundColor: "#48ACAB",
      color: "white",
    },
    "@media (max-width: 480px)": {
      width: "30px",
      height: "30px",
    },
    ":hover": {
      backgroundColor: "#48ACAB",
      color: "white",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
  },
  active: {
    backgroundColor: "#48ACAB",
    color: "white",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
});

interface NigiriProps {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  ingredients: string;
  allergens: string;
}

function NigiriBase({
  id,
  name,
  price,
  image,
  description,
  ingredients,
  allergens,
}: NigiriProps) {
  const styles = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const { total, updateTotal } = useOrder();
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const [quantity, setQuantity] = useState(
    () => parseInt(localStorage.getItem(`${id}Quantity`) || "0", 10)
  );
  const [prevQuantity, setPrevQuantity] = useState(quantity);
  const [liked, setLiked] = useState(favorites.includes(name));
  const [disliked, setDisliked] = useState(
    () => JSON.parse(localStorage.getItem(`${id}Disliked`) || "false")
  );
  const [activeProduct, setActiveProduct] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(`${id}Ratings`);
    if (stored) {
      const ratings = JSON.parse(stored) as number[];
      if (ratings.length) {
        const avg =
          ratings.reduce((a, b) => a + b, 0) / ratings.length;
        setAverageRating(parseFloat(avg.toFixed(1)));
      } else {
        setAverageRating(null);
      }
    } else {
      setAverageRating(null);
    }
  }, [id]);

  useEffect(() => {
    const productId = location.pathname.match(/Nigiri(\d)/)?.[1];
    setActiveProduct(productId || null);
  }, [location.pathname]);

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
      updateTotal(total + price * (quantity - prevQuantity));
      setPrevQuantity(quantity);
    }

    localStorage.setItem(`${id}Disliked`, JSON.stringify(disliked));
  }, [quantity, prevQuantity, price, updateTotal, total, id, name, disliked]);

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(prev + delta, 0));
  };

  const toggleLike = () => {
    setLiked(!liked);
    setDisliked(false);
    liked ? removeFavorite(name) : addFavorite(name);
  };

  const toggleDislike = () => {
    setDisliked(!disliked);
    setLiked(false);
  };

  const getNextDish = (): string | null => {
    const ids = [2, 3, 4, 5];
    for (const id of ids) {
      if (!JSON.parse(localStorage.getItem(`Nigiri${id}Disliked`) || "false")) {
        return `Nigiri${id}`;
      }
    }
    return null;
  };

  const handlers = useSwipeable({
    onSwipedUp: () => {
      const next = getNextDish();
      if (next) navigate(`/${next}`);
    },
    onSwipedRight: () => navigate("/Main-Menu"),
    trackMouse: true,
  });

  return (
    <div {...handlers} className={styles.container}>
      <BackButton to="/Main-Menu" />


      {/* Imagen + rating dentro de contenedor para posicionar */}
      <div className={styles.imageWrapper}>
        <img src={image} alt={name} className={styles.image} />
        <Button
          appearance="subtle"
          className={styles.rating}
          onClick={() => navigate(`/Product-Reviews/${id}`)}
        >
          {averageRating !== null ? `${averageRating} / 5 ⭐` : "No ratings"}
        </Button>
      </div>

      <div className={styles.infoContainer}>
        <Title2>NIGIRIS</Title2>
        <Text size={500} weight="semibold">
          {name}
        </Text>
        <Body1>{description}</Body1>
        <Caption1>
          <strong>Ingredients:</strong> {ingredients}
        </Caption1>
        <Caption1>
          <strong>Allergens:</strong> {allergens}
        </Caption1>
      </div>

      <div className={styles.menuNav}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Button
            key={n}
            className={mergeClasses(
              styles.menuButton,
              activeProduct === `${n}` && styles.active
            )}
            onClick={() => {
              navigate(`/Nigiri${n}`);
              setActiveProduct(`${n}`);
            }}
          >
            {n}
          </Button>
        ))}
      </div>

      <div className={styles.controlsWrapper}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <div className={styles.quantityControl}>
            <Button size="small" onClick={() => handleQuantityChange(-1)}>
              -
            </Button>
            <Body1>{quantity}</Body1>
            <Button size="small" onClick={() => handleQuantityChange(1)}>
              +
            </Button>
          </div>
          <Body1Strong className={styles.priceText}>+ {price.toFixed(2)} $</Body1Strong>
          <div className={styles.heartButtons}>
            <Button icon={liked ? <HeartFilled /> : <HeartRegular />} onClick={toggleLike} />
            <Button icon={<DismissCircleRegular />} onClick={toggleDislike} />
          </div>
        </div>

        <Button className={styles.orderButton} onClick={() => navigate("/Local-Summary")}>
          Make Order – {total.toFixed(2)} $
        </Button>
      </div>
    </div>
  );
}

export default NigiriBase;
