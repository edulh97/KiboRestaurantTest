import { Product } from "../components/products/Products-model";
import { Resena } from "../pages/resenas/Resenas-model";
import { TelefonoUsuario, Usuario } from "../pages/Users/Usuario-model";

//==================Usuarios=================

export const getUsers = async () => {
    const response = await fetch('http://localhost:8080/kibo/usuarios');
    const data = await response.json();
    return data;
};

export const createUser = async (usuario: Usuario) => {
    try {
        const response = await fetch("http://localhost:8080/kibo/usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(usuario),
        });

        if (!response.ok) {
            throw new Error("Error al crear el usuario");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

export const deleteUser = async (id: number) => {
    const response = await fetch(`http://localhost:8080/kibo/usuarios/${id}`, {
        method: 'DELETE',
    });
    return response.json();
};

export const updateUser = async (id: number, updatedUser: Usuario) => {
    const response = await fetch(`http://localhost:8080/kibo/usuarios/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
    });

    if (!response.ok) {
        throw new Error('Error al actualizar el usuario');
    }

    return response.json();
};
//==================Telefonos=================

export const getTelefonos = async () => {
    const response = await fetch('http://localhost:8080/kibo/telefonos_usuarios');
    const data = await response.json();
    return data;
};

export const createTelefono = async (telefonoData: TelefonoUsuario) => {
    const response = await fetch("http://localhost:8080/kibo/telefonos_usuarios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(telefonoData),
    });

    if (!response.ok) {
        throw new Error("Error al añadir el teléfono");
    }

    return await response.json();
};

export const deleteTelefono = async (id_telefono: number) => {
    try {
        const response = await fetch(`http://localhost:8080/kibo/telefonos_usuarios/${id_telefono}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Error al eliminar el teléfono");
        }

        return true;

    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

export const updateTelefono = async (idTelefono: number, telefonoActualizado: TelefonoUsuario) => {
    try {
        const response = await fetch(`http://localhost:8080/kibo/telefonos_usuarios/${idTelefono}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(telefonoActualizado),
        });

        if (!response.ok) {
            throw new Error("Error al actualizar el teléfono");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

//==================Promedio=================

// src/api.tsx
export async function fetchAverageRating(productId: string): Promise<number> {
    const resp = await fetch(`http://localhost:8080/kibo/resenas/promedio/${productId}`);
    if (!resp.ok) {
        throw new Error(`Error ${resp.status} al cargar promedio`);
    }
    // El endpoint devuelve el número bruto (ej: 4.0)
    const promedio = await resp.json();
    return promedio;
}

//==================Productos=================

// Obtiene todos los productos
export async function fetchProducts(): Promise<Product[]> {
  const resp = await fetch(`http://localhost:8080/kibo/productos`);
  if (!resp.ok) throw new Error(`Error ${resp.status} al cargar productos`);
  return resp.json();
}

// Obtiene un solo producto, filtrando el array
export async function fetchProductById(id: string): Promise<Product> {
  const products = await fetchProducts();
  const prod = products.find(p => p.id.toString() === id);
  if (!prod) throw new Error(`Producto ${id} no encontrado`);
  return prod;
}

//==================Resenas=================
export async function fetchReviewsByProductId(
  productId: string
): Promise<Resena[]> {
  const resp = await fetch(`http://localhost:8080/kibo/resenas/producto/${productId}`);
  if (!resp.ok) {
    throw new Error(`Error ${resp.status} al cargar reseñas`);
  }
  return resp.json();
}