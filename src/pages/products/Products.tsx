/* src/components/Products.tsx */
import React, { useEffect, useState } from 'react';
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

const Products: React.FC = () => {
  // Vista: 'categorias' o 'productos'
  const [view, setView] = useState<'categorias' | 'productos'>('categorias');

  // Datos
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);

  // Expandir categorías
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  // Formulario inline por categoría
  const [formCatId, setFormCatId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<Producto, 'id' | 'categorias'>>({
    nombreProducto: '',
    precio: 0,
    descripcion: '',
    alergenos: '',
  });

  // Opciones de borrado en vista categorías
  const [deleteOptions, setDeleteOptions] = useState<Record<number, boolean>>({});

  // Carga inicial
  useEffect(() => { fetchAll(); }, []);
  const fetchAll = async () => {
    setCategorias(await getCategorias());
    setProductos(await getProductos());
  };

  // Handlers generales
  const toggle = (id: number) =>
    setExpandedIds(ids => ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]);

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
  const cancelForm = () => {
    setFormCatId(null); setEditingId(null);
    setFormData({ nombreProducto: '', precio: 0, descripcion: '', alergenos: '' });
  };

  // CRUD inline por categoría
  const handleSubmitCat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCatId) return;
    let prod: Producto;
    if (editingId) prod = await updateProducto(editingId, formData);
    else {
      prod = await createProducto(formData);
      await assignCategoria(prod.id, formCatId);
    }
    await fetchAll(); cancelForm();
    setExpandedIds(prev => [...new Set([...prev, formCatId])]);
  };

  const handleDeleteRelation = async (prodId: number, catId: number) => {
    await removeCategoria(prodId, catId);
    if (deleteOptions[prodId]) await deleteProducto(prodId);
    await fetchAll();
  };
  const handleCheckboxChange = (prodId: number) => {
    setDeleteOptions(opts => ({ ...opts, [prodId]: !opts[prodId] }));
  };

  // CRUD global productos
  const onEditProd = (prod: Producto) => openForm(0, prod);
  const onDeleteProd = async (id: number) => {
    if (window.confirm('¿Eliminar producto?')) {
      await deleteProducto(id); await fetchAll();
    }
  };
  const handleSubmitProd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) await updateProducto(editingId, formData);
    else await createProducto(formData);
    cancelForm(); await fetchAll();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold mb-6 text-center">Gestión de Productos</h1>
      {/* Switch de vistas */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => { setView('categorias'); cancelForm(); }}
          className={`${view === 'categorias' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'} px-4 py-2 rounded-l-lg border border-gray-300`}
        >Categorias</button>
        <button
          onClick={() => { setView('productos'); cancelForm(); }}
          className={`${view === 'productos' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'} px-4 py-2 rounded-r-lg border border-gray-300`}
        >Productos</button>
      </div>

      {view === 'categorias' ? (
        categorias.map(cat => (
          <div key={cat.id} className="mb-5 bg-white rounded-lg shadow-sm transition p-4">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => toggle(cat.id)}>
              <h2 className="text-xl font-bold text-gray-800">{cat.nombreCategoria}</h2>
              <span className="text-gray-500">{expandedIds.includes(cat.id) ? 'Ver menos' : 'Ver mas'}</span>
            </div>

            {expandedIds.includes(cat.id) && (
              <div className="mt-4">
                <button
                  className="mb-3 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
                  onClick={() => openForm(cat.id)}
                >Añadir Producto</button>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productos.filter(p => p.categorias?.some(c => c.id === cat.id)).map(p => (
                    <li key={p.id} className="bg-gray-100 rounded flex flex-col justify-between p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-700">{p.nombreProducto}</span>
                        <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded" onClick={() => openForm(cat.id, p)}>Editar</button>
                      </div>

                      <label className="inline-flex items-center text-sm mb-2">
                        <input type="checkbox" checked={!!deleteOptions[p.id]} onChange={() => handleCheckboxChange(p.id)} className="mr-2" />
                        Eliminar producto también
                      </label>

                      <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded" onClick={() => handleDeleteRelation(p.id, cat.id)}>
                        Eliminar categoría
                      </button>
                    </li>
                  ))}
                </ul>

                {formCatId === cat.id && (
                  <form onSubmit={handleSubmitCat} className="mt-4 space-y-3 bg-white p-4 rounded shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        placeholder="Nombre"
                        value={formData.nombreProducto}
                        onChange={e => setFormData(f => ({ ...f, nombreProducto: e.target.value }))}
                        className="border p-2 rounded focus:ring-2 focus:ring-indigo-400 w-full"
                        required
                      />
                      <input
                        type="number" step="0.01"
                        placeholder="Precio"
                        value={formData.precio}
                        onChange={e => setFormData(f => ({ ...f, precio: parseFloat(e.target.value) }))}
                        className="border p-2 rounded focus:ring-2 focus:ring-indigo-400 w-full"
                        required
                      />
                    </div>
                    <input
                      placeholder="Descripción"
                      value={formData.descripcion}
                      onChange={e => setFormData(f => ({ ...f, descripcion: e.target.value }))}
                      className="border p-2 rounded focus:ring-2 focus:ring-indigo-400 w-full"
                      required
                    />
                    <input
                      placeholder="Alergenos"
                      value={formData.alergenos}
                      onChange={e => setFormData(f => ({ ...f, alergenos: e.target.value }))}
                      className="border p-2 rounded focus:ring-2 focus:ring-indigo-400 w-full"
                      required
                    />
                    <div className="flex space-x-3">
                      <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded">
                        {editingId ? 'Actualizar' : 'Crear'}
                      </button>
                      <button type="button" onClick={cancelForm} className="flex-1 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded">Cancelar</button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <form onSubmit={handleSubmitProd} className="space-y-3 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Nombre"
                value={formData.nombreProducto}
                onChange={e => setFormData(f => ({ ...f, nombreProducto: e.target.value }))}
                className="border p-2 rounded focus:ring-2 focus:ring-indigo-400 w-full"
                required
              />
              <input
                type="number" step="0.01"
                placeholder="Precio"
                value={formData.precio}
                onChange={e => setFormData(f => ({ ...f, precio: parseFloat(e.target.value) }))}
                className="border p-2 rounded focus:ring-2 focus:ring-indigo-400 w-full"
                required
              />
            </div>
            <input
              placeholder="Descripción"
              value={formData.descripcion}
              onChange={e => setFormData(f => ({ ...f, descripcion: e.target.value }))}
              className="border p-2 rounded focus:ring-2 focus:ring-indigo-400 w-full"
              required
            />
            <input
              placeholder="Alergenos"
              value={formData.alergenos}
              onChange={e => setFormData(f => ({ ...f, alergenos: e.target.value }))}
              className="border p-2 rounded focus:ring-2 focus:ring-indigo-400 w-full"
              required
            />
            <div className="flex space-x-3">
              <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded">
                {editingId ? 'Actualizar Producto' : 'Crear Producto'}
              </button>
              {editingId && <button type="button" onClick={cancelForm} className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded">Cancelar</button>}
            </div>
          </form>
          <ul className="divide-y divide-gray-200">
            {productos.map(prod => (
              <li key={prod.id} className="flex justify-between items-center py-3">
                <div>
                  <p className="font-medium text-gray-800">{prod.nombreProducto}</p>
                  <p className="text-sm text-gray-600">{prod.descripcion}</p>
                  <p className="text-sm text-gray-600">€{prod.precio.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Alergenos: {prod.alergenos}</p>
                </div>
                <div className="space-x-2">
                  <button onClick={() => onEditProd(prod)} className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded">Editar</button>
                  <button onClick={() => onDeleteProd(prod.id)} className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded">Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Products;
