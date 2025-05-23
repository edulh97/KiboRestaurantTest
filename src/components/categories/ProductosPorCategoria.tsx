import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

type Producto = {
    id: number;
    nombreProducto: string;
    descripcion: string;
    precio: number;
};

function ProductosPorCategoria() {
    const { categoriaId } = useParams();
    const [productos, setProductos] = useState<Producto[]>([]);

    useEffect(() => {
        fetch(`http://localhost:8080/kibo/productos/categoria/${categoriaId}`)
            .then(res => res.json())
            .then(data => setProductos(data))
            .catch(err => console.error("Error cargando productos:", err));
    }, [categoriaId]);

    return (
        <div>
            <h2>Productos de la categoría {categoriaId}</h2>
            <ul>
                {productos.map(producto => (
                    <li key={producto.id}>
                        <h3>{producto.nombreProducto}</h3>
                        <p>{producto.descripcion}</p>
                        <p>Precio: ${producto.precio}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProductosPorCategoria;
