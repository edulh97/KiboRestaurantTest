// src/services/api.tsx
import { Product } from "../components/products/Products-model";
import { Categoria, Producto } from "../pages/products/Products-model";
import { Resena } from "../pages/resenas/Resenas-model";
import { TelefonoUsuario, Usuario } from "../pages/Users/Usuario-model";
import { fetchWithAuth } from "./fetchWithAuth";

// ========== Usuarios ==========
export const getUsers = (): Promise<Usuario[]> =>
  fetchWithAuth("/kibo/usuarios");

export const createUser = (usuario: Usuario): Promise<Usuario> =>
  fetchWithAuth("/kibo/usuarios", {
    method: "POST",
    body: JSON.stringify(usuario),
  });

export const deleteUser = (id: number): Promise<void> =>
  fetchWithAuth(`/kibo/usuarios/${id}`, { method: "DELETE" });

export const updateUser = (id: number, usuario: Usuario): Promise<Usuario> =>
  fetchWithAuth(`/kibo/usuarios/${id}`, {
    method: "PUT",
    body: JSON.stringify(usuario),
  });

// ========= Teléfonos ==========
export const getTelefonos = (): Promise<TelefonoUsuario[]> =>
  fetchWithAuth("/kibo/telefonos_usuarios");

export const createTelefono = (t: TelefonoUsuario): Promise<TelefonoUsuario> =>
  fetchWithAuth("/kibo/telefonos_usuarios", {
    method: "POST",
    body: JSON.stringify(t),
  });

export const deleteTelefono = (id: number): Promise<void> =>
  fetchWithAuth(`/kibo/telefonos_usuarios/${id}`, { method: "DELETE" });

export const updateTelefono = (
  id: number,
  t: TelefonoUsuario
): Promise<TelefonoUsuario> =>
  fetchWithAuth(`/kibo/telefonos_usuarios/${id}`, {
    method: "PUT",
    body: JSON.stringify(t),
  });

// ======== Promedio de reseñas ========
export const fetchAverageRating = (productId: string): Promise<number> =>
  fetchWithAuth(`/kibo/resenas/promedio/${productId}`);

// ========= Productos ==========
export const fetchProducts = (): Promise<Product[]> =>
  fetchWithAuth("/kibo/productos");

export const fetchProductById = (id: string): Promise<Product> =>
  fetchWithAuth(`/kibo/productos/${id}`);

// ========= Reseñas ==========
export const fetchReviewsByProductId = (
  productId: string
): Promise<Resena[]> =>
  fetchWithAuth(`/kibo/resenas/producto/${productId}`);

// ========= Categorías ==========
export const getCategorias = (): Promise<Categoria[]> =>
  fetchWithAuth("/kibo/categorias");

export const createCategoria = (
  cat: Omit<Categoria, "id">
): Promise<Categoria> =>
  fetchWithAuth("/kibo/categorias", {
    method: "POST",
    body: JSON.stringify(cat),
  });

export const updateCategoria = (
  id: number,
  cat: Omit<Categoria, "id">
): Promise<Categoria> =>
  fetchWithAuth(`/kibo/categorias/${id}`, {
    method: "PUT",
    body: JSON.stringify(cat),
  });

export const deleteCategoria = (id: number): Promise<void> =>
  fetchWithAuth(`/kibo/categorias/${id}`, { method: "DELETE" });

// ======== CRUD Productos ========
export const getProductos = (): Promise<Producto[]> =>
  fetchWithAuth("/kibo/productos");

export const createProducto = (
  prod: Omit<Producto, "id" | "categorias">
): Promise<Producto> =>
  fetchWithAuth("/kibo/productos", {
    method: "POST",
    body: JSON.stringify(prod),
  });

export const updateProducto = (
  id: number,
  prod: Omit<Producto, "id" | "categorias">
): Promise<Producto> =>
  fetchWithAuth(`/kibo/productos/${id}`, {
    method: "PUT",
    body: JSON.stringify(prod),
  });

export const deleteProducto = (id: number): Promise<void> =>
  fetchWithAuth(`/kibo/productos/${id}`, { method: "DELETE" });

// ======== Asignación Categorías ========
export const assignCategoria = (
  prodId: number,
  catId: number
): Promise<void> =>
  fetchWithAuth(`/kibo/productos/${prodId}/categorias/${catId}`, {
    method: "POST",
  });

export const removeCategoria = (
  prodId: number,
  catId: number
): Promise<void> =>
  fetchWithAuth(`/kibo/productos/${prodId}/categorias/${catId}`, {
    method: "DELETE",
  });
