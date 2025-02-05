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