import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { useEffect, useState } from 'react';
import Header from "../../components/headers-components/header/Header";
import { Product } from "../../components/products/Products-model";
import { fetchProductById } from '../../services/api';
import MakiBase from '../../components/maki-model/MakiBase';

function Maki1() {
  const navigate = useNavigate();

  const handlers = useSwipeable({
    onSwipedUp: () => {
      const d2 = JSON.parse(localStorage.getItem('maki2Disliked') || 'false');
      const d3 = JSON.parse(localStorage.getItem('maki3Disliked') || 'false');
      if (!d2) {
        navigate('/Maki2');
      } else if (!d3) {
        navigate('/Maki3');
      }
    },
    onSwipedDown: () => {
      const d2 = JSON.parse(localStorage.getItem('maki2Disliked') || 'false');
      const d3 = JSON.parse(localStorage.getItem('maki3Disliked') || 'false');
      if (!d3) {
        navigate('/Maki3');
      } else if (!d2) {
        navigate('/Maki2');
      }
    },
    onSwipedRight: () => navigate('/Main-Menu'),
    trackMouse: true,
  });

  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchProductById("6")
      .then(prod => {
        if (mounted) setProduct(prod);
      })
      .catch(err => {
        console.error(err);
        if (mounted) setError(err.message);
      });
    return () => { mounted = false; };
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Cargando producto…</div>;

  return (
    <div {...handlers}>
      <Header />
      <MakiBase
        productId={product.id.toString()}
        name={product.nombreProducto}
        price={product.precio}
        image="/makis.png"
        description={product.descripcion}
        ingredients="Mucho arroz y poco pescado"
        allergens={product.alergenos}
      />
    </div>
  );
}

export default Maki1;
