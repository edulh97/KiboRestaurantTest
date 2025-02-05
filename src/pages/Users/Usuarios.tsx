import React, { useEffect, useState } from "react";
import { deleteUser, getTelefonos, getUsers, createTelefono, deleteTelefono, updateTelefono, updateUser } from "../../services/api";
import type { TelefonoUsuario, Usuario } from "./Usuario-model";


const User: React.FC = () => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [, setTelefonos] = useState<TelefonoUsuario[]>([]);
  const [newTelefono, setNewTelefono] = useState<string>(""); // Estado para el nuevo teléfono
  const [editingTelefono, setEditingTelefono] = useState<{ idTelefono?: number; telefono: string } | null>(null);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);


  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchTelefonos = async () => {
      const data = await getTelefonos();
      setTelefonos(data);
    };

    fetchTelefonos();
  }, []);

  // Función para eliminar un usuario
  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      alert("Usuario eliminado correctamente.");
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      alert("Hubo un error al eliminar el usuario. Por favor, inténtalo de nuevo.");
    }
  };

  // Función para añadir un teléfono
  const handleAddTelefono = async (idUsuario: number) => {
    if (!newTelefono.trim()) {
      alert("Por favor, introduce un número de teléfono.");
      return;
    }

    const nuevoTelefono = {
      telefono: newTelefono,
      usuario: {
        id: idUsuario,
      },
    };

    try {
      const telefonoCreado = await createTelefono(nuevoTelefono);
      console.log("Teléfono creado:", telefonoCreado);
      alert("Teléfono añadido correctamente.");

      // Actualizar la lista de usuarios para reflejar el nuevo teléfono
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === idUsuario
            ? { ...user, telefonos: [...(user.telefonos ?? []), telefonoCreado] }
            : user
        )
      );

      // Limpiar el campo de entrada
      setNewTelefono("");
    } catch (error) {
      console.error("Error al añadir el teléfono:", error);
      alert("Hubo un error al añadir el teléfono. Por favor, inténtalo de nuevo.");
    }
  };

  const handleDeleteTelefono = async (idTelefono: number | undefined, idUsuario: number | undefined) => {
    if (!idTelefono) {
      alert("Error: ID del teléfono no válido");
      return;
    }

    try {
      const success = await deleteTelefono(idTelefono);
      if (success) {
        alert("Teléfono eliminado correctamente.");

        // Actualizar la lista de usuarios
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === idUsuario
              ? {
                ...user,
                telefonos: user.telefonos?.filter(t => t.idTelefono !== idTelefono)
              }
              : user
          )
        );
      }
    } catch (error) {
      console.error("Error al eliminar el teléfono:", error);
      alert("Error al eliminar el teléfono. Por favor, inténtalo de nuevo.");
    }
  };

  const handleUpdateTelefono = async (idUsuario?: number) => {
    if (!editingTelefono?.idTelefono || !idUsuario || !editingTelefono.telefono) {
      alert("Datos incompletos");
      return;
    }

    try {
      const updatedTelefono = await updateTelefono(editingTelefono.idTelefono, {
        idTelefono: editingTelefono.idTelefono,
        telefono: editingTelefono.telefono,
        usuario: { id: idUsuario }
      });

      setUsers(prev => prev.map(user =>
        user.id === idUsuario
          ? {
            ...user,
            telefonos: user.telefonos?.map(t =>
              t.idTelefono === updatedTelefono.idTelefono ? updatedTelefono : t
            )
          }
          : user
      ));

      setEditingTelefono(null);
      alert("Teléfono actualizado correctamente");
    } catch (error) {
      console.error("Error actualizando teléfono:", error);
      alert("Error al actualizar el teléfono");
    }
  };

  const startEditingUser = (user: Usuario) => {
    setEditingUser(user);
  };

  const handleUpdateUser = async () => {
    if (!editingUser || !editingUser.id) {
      alert("Datos inválidos");
      return;
    }

    try {
      const updatedUser = await updateUser(editingUser.id, editingUser);
      setUsers(prev => prev.map(user =>
        user.id === updatedUser.id ? updatedUser : user
      ));
      setEditingUser(null);
      alert("Usuario actualizado correctamente");
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      alert("Error al actualizar el usuario");
    }
  };

  return (
    <div>
      <h1>Lista de Usuarios</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <strong>{user.nombreCompleto}</strong>
            <button onClick={() => startEditingUser(user)}>Editar</button>
            <button onClick={() => user.id !== undefined && handleDeleteUser(user.id)}>Eliminar XD</button>
            <p><strong>id de usuario:</strong> {user.id}</p>
            <p><strong>Correo electronico:</strong> {user.correoElectronico}</p>
            <p><strong>Direccion de entrega:</strong> {user.direccion}</p>
            <p><strong>Numero de tarjeta:</strong> {user.tarjeta}</p>
            <p><strong>Tipo de Usuario:</strong> {user.tipoUsuario}</p>


            <p><strong>Teléfonos:</strong></p>
            <ul>
              {(user.telefonos ?? []).map((telefono) => (
                <li key={telefono.idTelefono}>
                  {"id del Telefono: ("}{telefono.idTelefono}{") telefono: "}
                  {editingTelefono?.idTelefono === telefono.idTelefono ? (
                    <input
                      value={editingTelefono?.telefono ?? ""}
                      onChange={(e) => setEditingTelefono({
                        ...editingTelefono,
                        telefono: e.target.value
                      })}
                    />
                  ) : (
                    telefono.telefono
                  )}

                  {editingTelefono?.idTelefono === telefono.idTelefono ? (
                    <>
                      <button onClick={() => handleUpdateTelefono(user.id)}>Guardar</button>
                      <button onClick={() => setEditingTelefono(null)}>Cancelar</button>
                    </>
                  ) : (
                    <button onClick={() => setEditingTelefono({
                      idTelefono: telefono.idTelefono,
                      telefono: telefono.telefono
                    })}>
                      Editar
                    </button>
                  )}

                  <button onClick={() => handleDeleteTelefono(telefono.idTelefono, user.id)}>
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
            <input
              placeholder="Añadir Teléfono"
              value={newTelefono}
              onChange={(e) => setNewTelefono(e.target.value)}
            />
            <button onClick={() => user.id !== undefined && handleAddTelefono(user.id)}>Añadir</button>
          </li>
        ))}
        {editingUser && (
          <div>
            <h2>Editar Usuario</h2>
            <input
              value={editingUser.nombreCompleto}
              onChange={(e) => setEditingUser({ ...editingUser, nombreCompleto: e.target.value })}
              placeholder="Nombre completo"
            />
            <input
              value={editingUser.correoElectronico}
              onChange={(e) => setEditingUser({ ...editingUser, correoElectronico: e.target.value })}
              placeholder="Correo electrónico"
            />
            <input
              value={editingUser.direccion}
              onChange={(e) => setEditingUser({ ...editingUser, direccion: e.target.value })}
              placeholder="Dirección"
            />
            <input
              value={editingUser.contrasena}
              onChange={(e) => setEditingUser({ ...editingUser, contrasena: e.target.value })}
              placeholder="Contraseña"
            />
            <input
              value={editingUser.tarjeta}
              onChange={(e) => setEditingUser({ ...editingUser, tarjeta: Number(e.target.value) })}
              placeholder="Tarjeta"
            />
            <button onClick={handleUpdateUser}>Guardar</button>
            <button onClick={() => setEditingUser(null)}>Cancelar</button>
          </div>
        )}
      </ul>
    </div>
  );
};

export default User;