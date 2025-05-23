// Categoria.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { mergeStyles } from '@fluentui/react/lib/Styling';
import BackButton from '../../components/back-button/BackButton';

const wrapperClass = mergeStyles({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  paddingTop: 130,
  paddingBottom: 40,
  minHeight: '100vh',
  backgroundColor: '#f3f2f1',
  width: '100%',
});

const titleClass = mergeStyles({
  fontSize: 28,
  fontWeight: 700,
  marginBottom: 24,
});

const productCardClass = mergeStyles({
  border: '1px solid #ddd',
  borderRadius: 6,
  padding: 12,
  marginBottom: 12,
  backgroundColor: '#fff',
  width: '100%',
  maxWidth: 600,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
});

type Producto = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
};

export default function Categoria() {
  const { nombreCategoria } = useParams();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProductos() {
      try {
        const resCat = await fetch('/api/categorias');
        const categorias = await resCat.json();

        const categoria = categorias.find(
          (cat: { nombreCategoria: string }) => cat.nombreCategoria === nombreCategoria
        );

        if (!categoria) {
          console.error(`Categoría "${nombreCategoria}" no encontrada`);
          setProductos([]);
          return;
        }

        const resProd = await fetch(`/api/categorias/${categoria.id}/productos`);
        const productosData = await resProd.json();
        setProductos(productosData);
      } catch (error) {
        console.error('Error cargando productos:', error);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProductos();
  }, [nombreCategoria]);

  return (
    <div className={wrapperClass}>
      <BackButton to="/Login-Menu" />
      <h2 className={titleClass}>{nombreCategoria}</h2>

  
    </div>
  );
}
    