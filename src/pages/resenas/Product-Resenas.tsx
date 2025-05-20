import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchReviewsByProductId } from "../../services/api";
import { Resena } from "./Resenas-model";

export default function ProductResenas(): JSX.Element {
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
            .then(data => setReviews(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [productId]);

    return (
        <div>
            <h2>Reseñas del producto {productId}</h2>
            {reviews.length === 0 && <p>No hay reseñas para este producto.</p>}
            {reviews.map(r => (
                <div key={r.idResena}>
                    <p><strong>Usuario:</strong> {r.usuario.nombreCompleto}</p>
                    <p><strong>Tipo:</strong> {r.usuario.tipoUsuario}</p>
                    <p><strong>Puntuación:</strong> {r.calificacion} / 5</p>
                    <p><strong>Comentario:</strong> {r.comentario}</p>
                    <p>
                        <small>
                            {new Date(r.fechaCreacion).toLocaleDateString(undefined, {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </small>
                    </p>

                </div>
            ))}
            <button onClick={() => navigate(-1)}>Volver</button>
        </div>
    );
}
