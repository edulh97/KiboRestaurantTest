/* src/components/Products.tsx */
import React, { useEffect, useState } from 'react';
import {
  DefaultButton,
  PrimaryButton,
  TextField,
  IconButton,
  Stack,
  mergeStyles,
  FontIcon,
  Label,
} from '@fluentui/react';
import {
  getCategorias,
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  assignCategoria,
  removeCategoria,
} from '../../services/api';

import { Producto, Categoria } from './Products-model';

const cardStyle = mergeStyles({
  background: '#fff',
  padding: 24,
  borderRadius: 16,
  boxShadow: '0 6px 18px rgba(0, 0, 0, 0.08)',
  marginBottom: 24,
  transition: 'all 0.3s ease',
  selectors: {
    ':hover': {
      boxShadow: '0 10px 24px rgba(0, 0, 0, 0.1)',
    },
  },
});

const productItemStyle = mergeStyles({
  padding: 16,
  background: '#f4f6f9',
  borderRadius: 10,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  border: '1px solid #e1e1e1',
  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
});

const Products: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [formCatId, setFormCatId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Producto, 'id' | 'categorias'>>({
    nombreProducto: '',
    precio: 0,
    descripcion: '',
    alergenos: '',
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const cats = await getCategorias();
    const prods = await getProductos();
    setCategorias(cats);
    setProductos(prods);
  };

  const toggle = (id: number) => {
    setExpandedIds((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  };

  const openForm = (catId: number, prod?: Producto) => {
    setFormCatId(catId);
    if (prod) {
      setEditingId(prod.id);
      setFormData({
        nombreProducto: prod.nombreProducto,
        precio: prod.precio,
        descripcion: prod.descripcion,
        alergenos: prod.alergenos,
      });
    } else {
      setEditingId(null);
      setFormData({ nombreProducto: '', precio: 0, descripcion: '', alergenos: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCatId) return;
    let prod: Producto;
    if (editingId) {
      prod = await updateProducto(editingId, formData);
    } else {
      prod = await createProducto(formData);
      await assignCategoria(prod.id, formCatId);
    }
    await fetchAll();
    cancelForm();
    setExpandedIds((prev) => [...new Set([...prev, formCatId])]);
  };

  const cancelForm = () => {
    setFormCatId(null);
    setEditingId(null);
    setFormData({ nombreProducto: '', precio: 0, descripcion: '', alergenos: '' });
  };

  const handleDelete = async (prodId: number, catId: number) => {
    await removeCategoria(prodId, catId);
    fetchAll();
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, textAlign: 'center', marginBottom: 32 }}>
        Gestor de Productos
      </h1>
      {categorias.map((cat) => (
        <div key={cat.id} className={cardStyle}>
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => toggle(cat.id)}
          >
            <Label styles={{ root: { fontSize: 20, fontWeight: '600' } }}>{cat.nombreCategoria}</Label>
            <span style={{ fontSize: 20 }}>{expandedIds.includes(cat.id) ? '−' : '+'}</span>
          </div>

          {expandedIds.includes(cat.id) && (
            <div style={{ marginTop: 20 }}>
              <PrimaryButton
                text="Añadir Producto"
                onClick={() => openForm(cat.id)}
                styles={{ root: { marginBottom: 20, background: '#48ACAB', border: 'none' }, rootHovered: { background: '#3e9999' } }}
              />

              <Stack tokens={{ childrenGap: 12 }}>
                {productos
                  .filter((p) => p.categorias?.some((c) => c.id === cat.id))
                  .map((p) => (
                    <div key={p.id} className={productItemStyle}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 16 }}>{p.nombreProducto}</div>
                        <div style={{ color: '#666', fontSize: 13 }}>{p.descripcion}</div>
                        <div style={{ fontSize: 14, marginTop: 6 }}>
                          <strong>Precio:</strong> €{p.precio.toFixed(2)} | <strong>Alergenos:</strong> {p.alergenos}
                        </div>
                      </div>
                      <Stack horizontal tokens={{ childrenGap: 8 }}>
                        <DefaultButton
                          text="Editar"
                          onClick={() => openForm(cat.id, p)}
                          styles={{
                            root: {
                              background: '#48ACAB',
                              color: '#fff',
                              border: 'none',
                            },
                            rootHovered: {
                              background: '#3e9999',
                              color: '#fff',
                            },
                          }}
                        />
                        <DefaultButton
                          text="Quitar"
                          onClick={() => handleDelete(p.id, cat.id)}
                          styles={{
                            root: {
                              background: '#f44336',
                              color: '#fff',
                              border: 'none',
                            },
                            rootHovered: {
                              background: '#d32f2f',
                              color: '#fff',
                            },
                          }}
                        />
                      </Stack>
                    </div>
                  ))}
              </Stack>

              {formCatId === cat.id && (
                <form onSubmit={handleSubmit} style={{ marginTop: 24, padding: 16, background: '#fafafa', borderRadius: 8, border: '1px solid #ddd' }}>
                  <h3 style={{ marginBottom: 12 }}>{editingId ? 'Editar producto' : 'Nuevo producto'}</h3>
                  <Stack tokens={{ childrenGap: 12 }}>
                    <TextField
                      label="Nombre del producto"
                      value={formData.nombreProducto}
                      required
                      onChange={(_, v) => setFormData((f) => ({ ...f, nombreProducto: v || '' }))}
                    />
                    <TextField
                      label="Precio (€)"
                      type="number"
                      step={0.01}
                      value={formData.precio.toString()}
                      required
                      onChange={(_, v) => setFormData((f) => ({ ...f, precio: parseFloat(v || '0') }))}
                    />
                    <TextField
                      label="Descripción"
                      value={formData.descripcion}
                      required
                      onChange={(_, v) => setFormData((f) => ({ ...f, descripcion: v || '' }))}
                    />
                    <TextField
                      label="Alergenos"
                      value={formData.alergenos}
                      required
                      onChange={(_, v) => setFormData((f) => ({ ...f, alergenos: v || '' }))}
                    />
                    <Stack horizontal tokens={{ childrenGap: 12 }}>
                      <PrimaryButton
                        type="submit"
                        text={editingId ? 'Actualizar' : 'Crear'}
                        styles={{ root: { background: '#48ACAB', border: 'none' }, rootHovered: { background: '#3e9999' } }}
                      />
                      <DefaultButton text="Cancelar" onClick={cancelForm} />
                    </Stack>
                  </Stack>
                </form>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Products;
