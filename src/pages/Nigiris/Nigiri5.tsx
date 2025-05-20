// Nigiri2.tsx
import { useState, useEffect } from "react";
import Header from "../../components/headers-components/header/Header";
import NigiriBase from "../../components/nigiri-model/NigiriBase";
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { Product } from "../../components/products/Products-model";
import { fetchProductById } from "../../services/api";
function Nigiri5() {
    const navigate = useNavigate();
    const handlers = useSwipeable({
        onSwipedDown: () => navigate('/Nigiri4'),
        onSwipedUp: () => navigate('/Nigiri1'),
        onSwipedRight: () => navigate('/Main-Menu'),
        trackMouse: true,
    });

    // Estado para guardar el producto cargado
    const [product, setProduct] = useState<Product | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Al montar: traemos el producto con id=1
    useEffect(() => {
        let mounted = true;
        fetchProductById("5")
            .then(prod => {
                if (mounted) setProduct(prod);
            })
            .catch(err => {
                console.error(err);
                if (mounted) setError(err.message);
            });
        return () => { mounted = false; };
    }, []);

    // Mientras carga…
    if (error) return <div>Error: {error}</div>;
    if (!product) return <div>Cargando producto…</div>;
    return (
        <div {...handlers}>
            <Header />
            <NigiriBase
                productId={product.id.toString()}
                name={product.nombreProducto}
                price={product.precio}
                image="/nigiri5beef.png"
                description={product.descripcion}
                ingredients="Mucho arroz y poco pescado"
                allergens={product.alergenos}
            />
        </div>
    );
}

export default Nigiri5;
