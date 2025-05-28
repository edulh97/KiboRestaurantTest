// src/components/maki-model/MakiBase.tsx
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useState, useEffect } from "react";
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
  HeartRegular,
  DismissCircleRegular,
  DismissCircleFilled,
} from "@fluentui/react-icons";
import { useSwipeable } from "react-swipeable";
import { useOrder } from "../../context/OrderContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useNavigate } from "react-router-dom";
import BackButton from "../back-button/BackButton";
import { fetchAverageRating } from "../../services/api";

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
    background: "none",
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
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "250px",
    width: "200px",
    maxWidth: "500px",
  },
  image: {
    width: "100%",
    maxWidth: "300px",
    height: "auto",
    objectFit: "cover",
    borderRadius: tokens.borderRadiusMedium,
    padding: "20px",
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
    background: "linear-gradient(to top, rgb(150, 141, 141), rgb(255, 255, 255))",
    boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: tokens.spacingVerticalM,
    gap: tokens.spacingVerticalS,
    borderRadius: "10px",
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
    color: "black",
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
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: tokens.spacingVerticalM,
    flexWrap: "wrap",
  },
  menuButton: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    fontSize: "13px",
    width: "40px",
    height: "40px",
    padding: "0",
    cursor: "pointer",
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

interface MakiProps {
  productId: string;
  name: string;
  price: number;
  image: string;
  description: string;
  ingredients: string;
  allergens: string;
}

const MakiBase: React.FC<MakiProps> = ({
  productId,
  name,
  price,
  image,
  description,
  ingredients,
  allergens,
}) => {
  const styles = useStyles();
  const navigate = useNavigate();
  const { total, updateTotal } = useOrder();
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  // Mapa para relacionar botones (1,2,3) con los IDs reales ("6","7","8")
  const makiIdMap: Record<number, string> = {
    1: "6",
    2: "7",
    3: "8",
  };

  const keyMap: Record<string, string> = {
    "6": "maki1Disliked",
    "7": "maki2Disliked",
    "8": "maki3Disliked",
  };
  const dislikeKey = keyMap[productId] || `${productId}Disliked`;

  const [quantity, setQuantity] = useState(() =>
    parseInt(localStorage.getItem(`${productId}Quantity`) || "0", 10)
  );
  const [prevQuantity, setPrevQuantity] = useState(quantity);
  const [liked, setLiked] = useState(favorites.includes(name));
  const [disliked, setDisliked] = useState<boolean>(() =>
    JSON.parse(localStorage.getItem(dislikeKey) || "false")
  );
  const [averageRating, setAverageRating] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchAverageRating(productId)
      .then(avg => {
        if (!cancelled) {
          setAverageRating(avg > 0 ? parseFloat(avg.toFixed(1)) : null);
        }
      })
      .catch(() => {
        if (!cancelled) setAverageRating(null);
      });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  useEffect(() => {
    localStorage.setItem(`${productId}Quantity`, quantity.toString());
    localStorage.setItem(dislikeKey, JSON.stringify(disliked));
    if (quantity > 0) {
      localStorage.setItem(`${productId}Name`, name);
      localStorage.setItem(`${productId}Price`, price.toString());
    } else {
      localStorage.removeItem(`${productId}Name`);
      localStorage.removeItem(`${productId}Price`);
    }
    if (quantity !== prevQuantity) {
      updateTotal(total + price * (quantity - prevQuantity));
      setPrevQuantity(quantity);
    }
  }, [quantity, prevQuantity, price, total, updateTotal, productId, name, disliked]);

  const handleQuantityChange = (delta: number) => {
    setQuantity(q => Math.max(q + delta, 0));
  };

  const toggleLike = () => {
    setLiked(lk => {
      const now = !lk;
      if (now) {
        addFavorite(name);
        setDisliked(false);
        localStorage.setItem(dislikeKey, "false");
      } else {
        removeFavorite(name);
      }
      return now;
    });
  };

  const toggleDislike = () => {
    setDisliked(d => {
      const now = !d;
      if (now) {
        setLiked(false);
        removeFavorite(name);
      }
      return now;
    });
  };

  const getNextDish = (): string | null => {
    for (const [num, _] of Object.entries(makiIdMap)) {
      if (!JSON.parse(localStorage.getItem(`maki${num}Disliked`) || "false")) {
        return `Maki${num}`;
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

      <div className={styles.imageWrapper}>
        <img src={image} alt={name} className={styles.image} />
        <Button
          appearance="subtle"
          className={styles.rating}
          onClick={() =>
            navigate("/Product-Resenas", { state: { productId } })
          }
        >
          {averageRating !== null ? `${averageRating} / 5 ⭐` : "Sin reseñas"}
        </Button>
      </div>

      <div className={styles.infoContainer}>
        <Title2>MakiS</Title2>
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
        {[1, 2, 3].map(n => (
          <Button
            key={n}
            className={mergeClasses(
              styles.menuButton,
              productId === makiIdMap[n] && styles.active
            )}
            onClick={() => navigate(`/Maki${n}`)}
          >
            {n}
          </Button>
        ))}
      </div>

      <div className={styles.controlsWrapper}>
        <div style={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "center", gap: 12 }}>
          <div className={styles.quantityControl}>
            <Button size="small" onClick={() => handleQuantityChange(-1)}>-</Button>
            <Body1>{quantity}</Body1>
            <Button size="small" onClick={() => handleQuantityChange(1)}>+</Button>
          </div>
          <Body1Strong className={styles.priceText}>+ {price.toFixed(2)} $</Body1Strong>
          <div className={styles.heartButtons}>
            <Button icon={liked ? <HeartFilled /> : <HeartRegular />} onClick={toggleLike} />
            <Button icon={disliked ? <DismissCircleFilled /> : <DismissCircleRegular />} onClick={toggleDislike} />
          </div>
        </div>
        <Button className={styles.orderButton} onClick={() => navigate("/Local-Summary")}>
          Make Order – {total.toFixed(2)} $
        </Button>
      </div>
    </div>
  );
};

export default MakiBase;
