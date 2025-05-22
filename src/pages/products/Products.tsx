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
        setExpandedIds(s =>
            s.includes(id) ? s.filter(x => x !== id) : [...s, id]
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
        setExpandedIds(prev => [...new Set([...prev, formCatId])]);
    };

    const cancelForm = () => {
        setFormCatId(null);
        setEditingId(null);
        setFormData({ nombreProducto: '', precio: 0, descripcion: '', alergenos: '' });
    };

    const handleDelete = async (prodId: number, catId: number) => {
        await removeCategoria(prodId, catId);
        // opcional: borrar producto completamente
        // await deleteProducto(prodId);
        fetchAll();
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
            <h1 className="text-3xl font-semibold mb-6 text-center">Categorías y Productos</h1>
            {categorias.map(cat => (
                <div key={cat.id} className="mb-5 bg-white rounded-lg shadow-sm hover:shadow-md transition p-4">
                    <div
                        className="flex justify-between items-center cursor-pointer"
                        onClick={() => toggle(cat.id)}
                    >
                        <h2 className="text-xl font-bold text-gray-800">{cat.nombreCategoria}</h2>
                        <span className="text-gray-500">{expandedIds.includes(cat.id) ? '−' : '+'}</span>
                    </div>

                    {expandedIds.includes(cat.id) && (
                        <div className="mt-4">
                            <button
                                className="mb-3 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded"
                                onClick={() => openForm(cat.id)}
                            >
                                Añadir Producto
                            </button>

                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {productos
                                    .filter(p => p.categorias?.some(c => c.id === cat.id))
                                    .map(p => (
                                        <li key={p.id} className="bg-gray-100 rounded flex justify-between items-center p-3">
                                            <span className="font-medium text-gray-700">{p.nombreProducto}</span>
                                            <div className="space-x-2">
                                                <button
                                                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
                                                    onClick={() => openForm(cat.id, p)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                                                    onClick={() => handleDelete(p.id, cat.id)}
                                                >
                                                    Quitar
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                            </ul>

                            {(formCatId === cat.id) && (
                                <form onSubmit={handleSubmit} className="mt-4 space-y-3 bg-white p-4 rounded shadow-sm">
                                    <input
                                        className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        placeholder="Nombre del producto"
                                        value={formData.nombreProducto}
                                        onChange={e => setFormData(f => ({ ...f, nombreProducto: e.target.value }))}
                                        required
                                    />
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        placeholder="Precio"
                                        value={formData.precio}
                                        onChange={e => setFormData(f => ({ ...f, precio: parseFloat(e.target.value) }))}
                                        required
                                    />
                                    <input
                                        className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        placeholder="Descripción"
                                        value={formData.descripcion}
                                        onChange={e => setFormData(f => ({ ...f, descripcion: e.target.value }))}
                                        required
                                    />
                                    <input
                                        className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                        placeholder="Alergenos"
                                        value={formData.alergenos}
                                        onChange={e => setFormData(f => ({ ...f, alergenos: e.target.value }))}
                                        required
                                    />
                                    <div className="flex space-x-3">
                                        <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold">
                                            {editingId ? 'Actualizar' : 'Crear'}
                                        </button>
                                        <button type="button" className="flex-1 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded" onClick={cancelForm}>
                                            Cancelar
                                        </button>
                                    </div>
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
