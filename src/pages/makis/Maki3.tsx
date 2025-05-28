import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { useEffect, useState } from 'react';
import Header from "../../components/headers-components/header/Header";
import { Product } from "../../components/products/Products-model";
import { fetchProductById } from '../../services/api';
import MakiBase from '../../components/maki-model/MakiBase';

function Maki3() {
  const navigate = useNavigate();

  const handlers = useSwipeable({
    onSwipedUp: () => {
      const d1 = JSON.parse(localStorage.getItem('maki1Disliked') || 'false');
      if (!d1) {
        navigate('/Maki1');
      }
    },
    onSwipedDown: () => {
      const d2 = JSON.parse(localStorage.getItem('maki2Disliked') || 'false');
      if (!d2) {
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
    fetchProductById("8")
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
        image="/makiPepino.png"
        description={product.descripcion}
        ingredients="Mucho arroz y poco pescado"
        allergens={product.alergenos}
      />
    </div>
  );
}

export default Maki3;