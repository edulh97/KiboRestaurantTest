/* src/components/Products.tsx */
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  DefaultButton,
  PrimaryButton,
  TextField,
  Checkbox,
  Stack,
  mergeStyles,
  Modal,
  Label,
  Spinner,
  SpinnerSize,
  FontWeights,
  getTheme,
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

// --- Tema y colores personalizados ---
const customPrimary = '#48ACAB';
const theme = getTheme();
const { palette } = theme;

// --- Estilos mejorados ---
const containerClass = mergeStyles({
  maxWidth: 1200,
  margin: '0 auto',
  padding: '32px 24px',
  fontFamily: "'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif",
  minHeight: '100vh',
  color: '#000000',
});

const headerStyle = mergeStyles({
  textAlign: 'center',
  color: '#000000',
  fontWeight: FontWeights.semibold,
  marginBottom: 36,
  fontSize: 28,
});

const cardStyle = mergeStyles({
  background: palette.white,
  padding: 24,
  borderRadius: 12,
  boxShadow: theme.effects.elevation8,
  marginBottom: 24,
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  selectors: {
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.effects.elevation16,
    },
  },
});

const categoryHeaderStyle = mergeStyles({
  cursor: 'pointer',
  userSelect: 'none',
  margin: 0,
  color: '#000000',
  fontWeight: FontWeights.semibold,
  fontSize: 18,
  padding: '8px 0',
  transition: 'color 0.2s ease',
  selectors: {
    ':hover': {
      color: '#3b9594',
    },
  },
});

const productItemStyle = mergeStyles({
  background: palette.neutralLighterAlt,
  padding: 16,
  borderRadius: 8,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
  transition: 'background-color 0.2s ease',
  border: `1px solid ${palette.neutralLight}`,
  selectors: {
    ':hover': {
      backgroundColor: palette.neutralLighter,
    },
    ':last-child': {
      marginBottom: 0,
    },
  },
});

const priceStyle = mergeStyles({
  fontWeight: FontWeights.semibold,
  color: palette.green,
  fontSize: 16,
});

const descriptionStyle = mergeStyles({
  color: '#000000',
  fontSize: 14,
  margin: '4px 0',
});

const allergenStyle = mergeStyles({
  color: palette.redDark,
  fontSize: 13,
});

const emptyStateStyle = mergeStyles({
  fontStyle: 'italic', 
  color: palette.neutralTertiary, 
  padding: 12,
  backgroundColor: palette.neutralLighter,
  borderRadius: 4,
});

const headerButtonStyles = {
  root: {
    borderRadius: 4,
    border: 'none',
    padding: '10px 24px',
    fontWeight: FontWeights.semibold,
    fontSize: 14,
    color: palette.black,
    
    transition: 'all 0.2s ease',
    selectors: {
      ':hover': {
        backgroundColor: '#3b9594',
        color: palette.white,
      },
      ':focus': {
        outline: `2px solid ${customPrimary}`,
      },
    },
  },
  rootPressed: {
    backgroundColor: customPrimary,
    color: palette.white,
    selectors: {
      ':hover': {
        backgroundColor: '#3b9594',
      },
    },
  },
};

const dangerButtonStyles = {
  root: {
    borderColor: palette.redDark,
    color: palette.redDark,
    selectors: {
      ':hover': {
        color: palette.redDark,
      },
    },
  },
};

const formStackTokens = { childrenGap: 16 };
const buttonStackTokens = { childrenGap: 12 };

// ... Resto del componente sin cambios visibles en estilos ...


function useProductoForm(
  initialData: Omit<Producto, 'id' | 'categorias'>,
  onSubmit: (data: Omit<Producto, 'id' | 'categorias'>) => Promise<void>,
  onCancel: () => void
) {
  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (field: keyof typeof formData, value: string | number) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Error guardando producto:', error);
        alert('Ocurrió un error al guardar el producto.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, onSubmit]
  );

  const resetForm = useCallback(() => setFormData(initialData), [initialData]);

  useEffect(() => {
    resetForm();
  }, [initialData, resetForm]);

  return { formData, handleChange, handleSubmit, resetForm, isSubmitting };
}

const Products: React.FC = () => {
  const [view, setView] = useState<'categorias' | 'productos'>('categorias');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<number | null>(null);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  const [deleteOptions, setDeleteOptions] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, prods] = await Promise.all([getCategorias(), getProductos()]);
      setCategorias(cats);
      setProductos(prods);
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar categorías y productos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const toggleExpanded = useCallback((id: number) => {
    setExpandedIds(ids => (ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]));
  }, []);

  const {
    formData,
    handleChange,
    handleSubmit,
    resetForm,
    isSubmitting,
  } = useProductoForm(
    {
      nombreProducto: editingProducto?.nombreProducto ?? '',
      precio: editingProducto?.precio ?? 0,
      descripcion: editingProducto?.descripcion ?? '',
      alergenos: editingProducto?.alergenos ?? '',
    },
    async data => {
      if (selectedCatId === null) return;

      if (editingProducto) {
        await updateProducto(editingProducto.id, data);
      } else {
        const created = await createProducto(data);
        await assignCategoria(created.id, selectedCatId);
      }
      await fetchAll();
      handleCloseForm();
      setExpandedIds(prev => [...new Set([...prev, selectedCatId])]);
    },
    () => handleCloseForm()
  );

  const handleOpenForm = useCallback((catId: number, producto?: Producto) => {
    setSelectedCatId(catId);
    setEditingProducto(producto ?? null);
  }, []);

  const handleCloseForm = useCallback(() => {
    setSelectedCatId(null);
    setEditingProducto(null);
    resetForm();
  }, [resetForm]);

  const handleDeleteRelation = useCallback(
    async (prodId: number, catId: number) => {
      if (!window.confirm('¿Está seguro que desea eliminar esta relación?')) return;

      setLoading(true);
      try {
        await removeCategoria(prodId, catId);
        if (deleteOptions[prodId]) {
          await deleteProducto(prodId);
        }
        await fetchAll();
      } catch (error) {
        console.error('Error eliminando relación:', error);
        alert('Error al eliminar la relación o producto.');
      } finally {
        setLoading(false);
      }
    },
    [deleteOptions, fetchAll]
  );

  const toggleDeleteOption = useCallback(
    (prodId: number) => {
      setDeleteOptions(opts => ({ ...opts, [prodId]: !opts[prodId] }));
    },
    []
  );

  const onDeleteProduct = useCallback(
    async (id: number) => {
      if (!window.confirm('¿Está seguro que desea eliminar este producto?')) return;

      setLoading(true);
      try {
        await deleteProducto(id);
        await fetchAll();
      } catch (error) {
        console.error('Error eliminando producto:', error);
        alert('Error al eliminar el producto.');
      } finally {
        setLoading(false);
      }
    },
    [fetchAll]
  );

  const productosPorCategoria = useMemo(() => {
    const map = new Map<number, Producto[]>();
    categorias.forEach(cat => map.set(cat.id, []));
    productos.forEach(prod => {
      prod.categorias?.forEach(cat => {
        if (map.has(cat.id)) map.get(cat.id)!.push(prod);
      });
    });
    return map;
  }, [categorias, productos]);

  const renderProductosList = (cat: Categoria) => {
    const prods = productosPorCategoria.get(cat.id) ?? [];

    if (prods.length === 0) {
      return (
        <div className={emptyStateStyle}>
          No hay productos asignados a esta categoría.
        </div>
      );
    }

    return prods.map(prod => {
      const isMarkedForDelete = !!deleteOptions[prod.id];
      return (
        <div key={prod.id} className={productItemStyle} role="listitem" aria-label={`Producto ${prod.nombreProducto}`}>
          <div style={{ flex: 1, marginRight: 12 }}>
            <Label styles={{ root: { 
              fontWeight: FontWeights.semibold, 
              fontSize: 16,
              color: palette.neutralPrimary,
            } }}>
              {prod.nombreProducto}
            </Label>
            <div className={priceStyle}>
              {prod.precio.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </div>
            <div className={descriptionStyle}>{prod.descripcion}</div>
            {prod.alergenos && (
              <div className={allergenStyle}>
                <strong>Alérgenos:</strong> {prod.alergenos}
              </div>
            )}
          </div>

          <Stack horizontal tokens={{ childrenGap: 12 }} verticalAlign="center">
            <Checkbox
              label="Eliminar producto"
              checked={isMarkedForDelete}
              onChange={() => toggleDeleteOption(prod.id)}
              styles={{
                root: { marginRight: 8 },
                label: { color: palette.neutralPrimary },
              }}
            />
            <PrimaryButton
              onClick={() => handleOpenForm(cat.id, prod)}
              text="Editar"
              styles={{ root: { minWidth: 90 } }}
            />
            <DefaultButton
              onClick={() => handleDeleteRelation(prod.id, cat.id)}
              text="Eliminar relación"
              styles={dangerButtonStyles}
            />
          </Stack>
        </div>
      );
    });
  };

  return (
    <div className={containerClass}>
      <h1 className={headerStyle}>Gestión de Productos y Categorías</h1>

      <Stack horizontal horizontalAlign="center" tokens={buttonStackTokens} styles={{ root: { marginBottom: 36 } }}>
        <DefaultButton
          text="Categorías"
          onClick={() => setView('categorias')}
          styles={view === 'categorias' ? { 
            root: { ...headerButtonStyles.root, ...headerButtonStyles.rootPressed } 
          } : headerButtonStyles}
          aria-pressed={view === 'categorias'}
          aria-label="Mostrar vista de categorías"
        />
        <DefaultButton
          text="Productos"
          onClick={() => setView('productos')}
          styles={view === 'productos' ? { 
            root: { ...headerButtonStyles.root, ...headerButtonStyles.rootPressed } 
          } : headerButtonStyles}
          aria-pressed={view === 'productos'}
          aria-label="Mostrar vista de productos"
        />
      </Stack>

      {loading && (
        <Stack horizontalAlign="center" verticalAlign="center" styles={{ root: { marginBottom: 24 } }}>
          <Spinner size={SpinnerSize.large} label="Cargando datos..." />
        </Stack>
      )}

      {view === 'categorias' && (
        <section aria-label="Listado de categorías">
          {categorias.length === 0 && !loading && (
            <div className={emptyStateStyle}>No hay categorías disponibles.</div>
          )}

          {categorias.map(cat => (
            <div key={cat.id} className={cardStyle} aria-expanded={expandedIds.includes(cat.id)}>
              <Stack horizontal horizontalAlign="space-between" verticalAlign="center" tokens={{ childrenGap: 12 }}>
                <h3
                  onClick={() => toggleExpanded(cat.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleExpanded(cat.id);
                    }
                  }}
                  className={categoryHeaderStyle}
                  aria-controls={`productos-categoria-${cat.id}`}
                  aria-expanded={expandedIds.includes(cat.id)}
                >
                  {cat.nombreCategoria}
                </h3>
                <PrimaryButton 
                  onClick={() => handleOpenForm(cat.id)} 
                  text="Añadir producto" 
                  styles={{ root: { minWidth: 140, backgroundColor: customPrimary,} }}
                />
              </Stack>

              {expandedIds.includes(cat.id) && (
                <div 
                  id={`productos-categoria-${cat.id}`} 
                  role="list" 
                  aria-live="polite" 
                  style={{ marginTop: 18 }}
                >
                  {renderProductosList(cat)}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {view === 'productos' && (
        <section aria-label="Listado completo de productos" style={{ marginTop: 16 }}>
          {productos.length === 0 && !loading && (
            <div className={emptyStateStyle}>No hay productos registrados.</div>
          )}

          {productos.map(prod => (
            <div key={prod.id} className={cardStyle} role="listitem" aria-label={`Producto ${prod.nombreProducto}`}>
              <Stack horizontal horizontalAlign="space-between" verticalAlign="center" tokens={{ childrenGap: 12 }}>
                <div style={{ flex: 1 }}>
                  <Label styles={{ root: { 
                    fontWeight: FontWeights.semibold, 
                    fontSize: 16,
                    color: palette.neutralPrimary,
                  } }}>
                    {prod.nombreProducto}
                  </Label>
                  <div className={priceStyle}>
                    {prod.precio.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                  </div>
                  <div className={descriptionStyle}>{prod.descripcion}</div>
                  {prod.alergenos && (
                    <div className={allergenStyle}>
                      <strong>Alérgenos:</strong> {prod.alergenos}
                    </div>
                  )}
                  <div style={{ marginTop: 8 }}>
                    <strong>Categorías:</strong>{' '}
                    {prod.categorias?.map(c => c.nombreCategoria).join(', ') || 'Sin categoría'}
                  </div>
                </div>
                <Stack horizontal tokens={{ childrenGap: 12 }}>
                  <PrimaryButton 
                    onClick={() => handleOpenForm(prod.categorias?.[0]?.id ?? 0, prod)} 
                    text="Editar" 
                    styles={{ root: { minWidth: 90, backgroundColor: customPrimary, } }}
                  />
                  <DefaultButton
                    onClick={() => onDeleteProduct(prod.id)}
                    text="Eliminar"
                    styles={dangerButtonStyles}
                  />
                </Stack>
              </Stack>
            </div>
          ))}
        </section>
      )}

      <Modal
        isOpen={selectedCatId !== null}
        onDismiss={handleCloseForm}
        isBlocking={false}
        containerClassName={mergeStyles({ 
          padding: 24, 
          maxWidth: 480,
          borderRadius: 8,
        })}
        styles={{
          main: {
            borderRadius: 8,
            boxShadow: theme.effects.elevation16,
          }
        }}
        aria-labelledby="modal-titulo-producto"
      >
        <h2 
          id="modal-titulo-producto" 
          style={{ 
            color: customPrimary, 
            marginBottom: 18,
            fontWeight: FontWeights.semibold,
          }}
        >
          {editingProducto ? 'Editar Producto' : 'Nuevo Producto'}
        </h2>

        <form onSubmit={handleSubmit} aria-describedby="form-desc">
          <Stack tokens={formStackTokens}>
            <TextField
              label="Nombre del producto"
              required
              value={formData.nombreProducto}
              onChange={(_, v) => handleChange('nombreProducto', v || '')}
              maxLength={100}
              underlined
              styles={{
                fieldGroup: { borderColor: palette.neutralLight },
                prefix: { backgroundColor: palette.neutralLighter },
              }}
              aria-required="true"
            />
            <TextField
              label="Precio (€)"
              required
              type="number"
              value={formData.precio.toString()}
              onChange={(_, v) => {
                const n = parseFloat(v || '0');
                handleChange('precio', isNaN(n) ? 0 : n);
              }}
              min={0}
              step={0.01}
              underlined
              styles={{
                fieldGroup: { borderColor: palette.neutralLight },
                prefix: { backgroundColor: palette.neutralLighter },
              }}
              aria-required="true"
            />
            <TextField
              label="Descripción"
              multiline
              value={formData.descripcion}
              onChange={(_, v) => handleChange('descripcion', v || '')}
              maxLength={300}
              underlined
              styles={{
                fieldGroup: { borderColor: palette.neutralLight },
                prefix: { backgroundColor: palette.neutralLighter },
              }}
            />
            <TextField
              label="Alergenos"
              placeholder="Ej: gluten, lactosa..."
              value={formData.alergenos}
              onChange={(_, v) => handleChange('alergenos', v || '')}
              maxLength={150}
              underlined
              styles={{
                fieldGroup: { borderColor: palette.neutralLight },
                prefix: { backgroundColor: palette.neutralLighter },
              }}
            />
          </Stack>

          <Stack 
            horizontal 
            horizontalAlign="end" 
            tokens={buttonStackTokens} 
            styles={{ root: { marginTop: 24 } }}
          >
            <DefaultButton 
              onClick={handleCloseForm} 
              text="Cancelar" 
              styles={{ root: { minWidth: 90 } }}
            />
            <PrimaryButton 
              type="submit" 
              text={isSubmitting ? 'Guardando...' : 'Guardar'} 
              disabled={isSubmitting} 
              styles={{ root: { minWidth: 90 } }}
            />
          </Stack>
        </form>
      </Modal>
    </div>
  );
};

export default Products;