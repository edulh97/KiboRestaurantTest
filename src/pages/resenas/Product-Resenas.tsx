import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchReviewsByProductId } from "../../services/api";
import { Resena } from "./Resenas-model";
import {
  Stack,
  Text,
  DefaultButton,
  Icon,
  mergeStyleSets,
  Spinner,
  MessageBar,
  MessageBarType,
} from "@fluentui/react";
import { FontIcon } from "@fluentui/react/lib/Icon";

const useStyles = mergeStyleSets({
  container: {
    padding: 32,
    maxWidth: 1200,
    margin: "0 auto",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 16,
    color: "white",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: 24,
    marginTop: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "all 0.3s ease-in-out",
    selectors: {
      ":hover": {
        transform: "translateY(-4px) scale(1.02)",
        boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
        cursor: "pointer",
      },
    },
  },
  userName: {
    fontWeight: 600,
    fontSize: 16,
    marginBottom: 4,
  },
  userType: {
    color: "#888",
    marginBottom: 8,
  },
  rating: {
    fontSize: 18,
    color: "#FFD700", // amarillo estrella
    marginBottom: 8,
  },
  comment: {
    marginBottom: 12,
    fontStyle: "italic",
  },
  date: {
    fontSize: 12,
    color: "#666",
    marginTop: "auto",
  },
  backButton: {
    marginTop: 40,
    backgroundColor: "#f3f3f3",
    border: "1px solid #ccc",
    transition: "all 0.3s ease-in-out",
    selectors: {
      ":hover": {
        backgroundColor: "#e0e0e0",
        borderColor: "#999",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      },
    },
  },
});


function renderStars(calificacion: number): string {
  return "★".repeat(calificacion) + "☆".repeat(5 - calificacion);
}

export default function ProductResenas(): JSX.Element {
  const classes = useStyles;
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: { productId?: string } };
  const productId = state?.productId;

  const [reviews, setReviews] = useState<Resena[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!productId) {
      setError("No se ha especificado ningún producto.");
      setLoading(false);
      return;
    }
    fetchReviewsByProductId(productId)
      .then((data) => setReviews(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <Stack horizontalAlign="center" verticalAlign="center" style={{ minHeight: 200 }}>
        <Spinner label="Cargando reseñas..." />
      </Stack>
    );
  }

  if (error) {
    return (
      <MessageBar messageBarType={MessageBarType.error}>
        {error}
      </MessageBar>
    );
  }

  return (
    <div className={classes.container}>
      <Text className={classes.title}>Reseñas del producto #{productId}</Text>

      {reviews.length === 0 ? (
        <MessageBar>No hay reseñas para este producto.</MessageBar>
      ) : (
        <div className={classes.grid}>
          {reviews.map((r) => (
            <div key={r.idResena} className={classes.card}>
              <Text className={classes.userName}>{r.usuario.nombreCompleto}</Text>
              <Text className={classes.userType}>{r.usuario.tipoUsuario}</Text>
              <Text className={classes.rating}>{renderStars(r.calificacion)}</Text>
              <Text className={classes.comment}>
                {r.comentario || "Sin comentario"}
              </Text>
              <Text className={classes.date}>
                {new Date(r.fechaCreacion).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
            </div>
          ))}
        </div>
      )}

      <DefaultButton
        iconProps={{ iconName: "Back" }}
        text="Volver"
        className={classes.backButton}
        onClick={() => navigate(-1)}
      />
    </div>
  );
}