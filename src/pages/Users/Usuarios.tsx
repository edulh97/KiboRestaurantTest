import React, { useEffect, useMemo, useState } from "react";
import {
  TextField,
  DetailsList,
  DetailsListLayoutMode,
  PrimaryButton,
  DefaultButton,
  Modal,
  Stack,
  getTheme,
  mergeStyleSets,
  IColumn,
} from "@fluentui/react";

import {
  getUsers,
  deleteUser,
  updateUser,
  getTelefonos,
  deleteTelefono,
  createTelefono,
  updateTelefono,
} from "../../services/api";

import type { Usuario, TelefonoUsuario } from "./Usuario-model";

const primaryColor = "#48ACAB";

const theme = getTheme();
const classNames = mergeStyleSets({
  container: { padding: 20, maxWidth: 1200, margin: "0 auto", color:"white", fontFamily:"Arial" },
  toolbar: { margin: 16 , display: "flex", justifyContent: "flex-end" },
  modalContent: {
    backgroundColor: theme.palette.white,
    padding: 50,
    paddingTop: 25,
    width: 500,
    margin: "0px",
    borderRadius: 8,
    outline: "none",
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  telefonoList: {
    marginTop: 16,
    paddingLeft: 0,
    listStyleType: "none",
  },
  telefonoItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  telefonoInput: {
    flexGrow: 1,
  },
  detailsListWrapper: {
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${theme.palette.neutralLight}`,
    backgroundColor: theme.palette.white,
  },
});

// Estilos personalizados para los botones
const buttonStyle = {
  root: {
    backgroundColor: primaryColor,
    borderColor: primaryColor,
    color: "white",
  },
  rootHovered: {
    backgroundColor: "#3e9999",
    borderColor: "#3e9999",
  },
  rootPressed: {
    backgroundColor: "#2e8888",
    borderColor: "#2e8888",
  },
};

const User: React.FC = () => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [, setTelefonos] = useState<TelefonoUsuario[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<Usuario[]>([]);
  const [newTelefono, setNewTelefono] = useState<string>("");
  const [editingTelefono, setEditingTelefono] = useState<{ idTelefono?: number; telefono: string } | null>(null);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(data);
      setFilteredUsers(data);
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

  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users);
    } else {
      const lower = searchTerm.toLowerCase();
      setFilteredUsers(
        users.filter(
          (u) =>
            u.nombreCompleto.toLowerCase().includes(lower) ||
            u.correoElectronico.toLowerCase().includes(lower)
        )
      );
    }
  }, [searchTerm, users]);

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id);
      const updated = users.filter((u) => u.id !== id);
      setUsers(updated);
      setFilteredUsers(updated);
      alert("Usuario eliminado correctamente.");
    } catch {
      alert("Error al eliminar usuario");
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser || !editingUser.id) return;

    try {
      const updatedUser = await updateUser(editingUser.id, editingUser);
      const updated = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
      setUsers(updated);
      setFilteredUsers(updated);
      setEditingUser(null);
      alert("Usuario actualizado correctamente");
    } catch {
      alert("Error al actualizar usuario");
    }
  };

  const handleAddTelefono = async (idUsuario: number) => {
    if (!newTelefono.trim()) {
      alert("Por favor, introduce un número de teléfono.");
      return;
    }
    const nuevoTelefono = {
      telefono: newTelefono,
      usuario: { id: idUsuario },
    };

    try {
      const telefonoCreado = await createTelefono(nuevoTelefono);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === idUsuario
            ? { ...user, telefonos: [...(user.telefonos ?? []), telefonoCreado] }
            : user
        )
      );
      setNewTelefono("");
      alert("Teléfono añadido correctamente.");
    } catch {
      alert("Error al añadir el teléfono.");
    }
  };

  const handleDeleteTelefono = async (idTelefono: number | undefined, idUsuario: number | undefined) => {
    if (!idTelefono) return alert("ID de teléfono inválido");

    try {
      const success = await deleteTelefono(idTelefono);
      if (success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === idUsuario
              ? {
                  ...user,
                  telefonos: user.telefonos?.filter((t) => t.idTelefono !== idTelefono),
                }
              : user
          )
        );
        alert("Teléfono eliminado correctamente.");
      }
    } catch {
      alert("Error al eliminar teléfono.");
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
        usuario: { id: idUsuario },
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.id === idUsuario
            ? {
                ...user,
                telefonos: user.telefonos?.map((t) =>
                  t.idTelefono === updatedTelefono.idTelefono ? updatedTelefono : t
                ),
              }
            : user
        )
      );
      setEditingTelefono(null);
      alert("Teléfono actualizado correctamente");
    } catch {
      alert("Error al actualizar teléfono");
    }
  };

  const columns: IColumn[] = useMemo(
    () => [
      { key: "col1", name: "Nombre", fieldName: "nombreCompleto", minWidth: 120, isResizable: true },
      { key: "col2", name: "Correo", fieldName: "correoElectronico", minWidth: 180, isResizable: true },
      { key: "col3", name: "Dirección", fieldName: "direccion", minWidth: 180, isResizable: true },
      { key: "col4", name: "Tarjeta", fieldName: "tarjeta", minWidth: 80, isResizable: true },
      {
        key: "col5",
        name: "Teléfonos",
        minWidth: 180,
        isResizable: true,
        onRender: (item: Usuario) =>
          (item.telefonos && item.telefonos.length > 0)
            ? item.telefonos.map((t) => t.telefono).join(", ")
            : "Sin teléfonos",
      },
      {
        key: "col6",
        name: "Acciones",
        minWidth: 180,
        onRender: (item: Usuario) => (
          <Stack horizontal tokens={{ childrenGap: 8 }}>
            <PrimaryButton onClick={() => setEditingUser(item)} text="Editar" styles={buttonStyle} />
            <DefaultButton onClick={() => item.id && handleDeleteUser(item.id)} text="Eliminar" />
          </Stack>
        ),
      },
    ],
    [users]
  );

  return (
    <div className={classNames.container}>
      <h1>Gestión de Usuarios</h1>
      <div className={classNames.detailsListWrapper}>
        <Stack horizontal tokens={{ childrenGap: 12 }} className={classNames.toolbar}>
          <TextField
            placeholder="Buscar por nombre o correo"
            value={searchTerm}
            onChange={(_, val) => setSearchTerm(val ?? "")}
            styles={{ root: { width: 320 } }}
          />
        </Stack>
        <DetailsList
          items={filteredUsers}
          columns={columns}
          setKey="set"
          layoutMode={DetailsListLayoutMode.fixedColumns}
          selectionPreservedOnEmptyClick
          styles={{ root: { background: theme.palette.white, padding:"10px" } }}
        />
      </div>

      <Modal isOpen={!!editingUser} onDismiss={() => setEditingUser(null)} isBlocking={false}>
        <div className={classNames.modalContent}>
          <h2>Editar Usuario</h2>
          {editingUser && (
            <>
              <TextField label="Nombre completo" value={editingUser.nombreCompleto} onChange={(_, val) => setEditingUser({ ...editingUser, nombreCompleto: val ?? "" })} />
              <TextField label="Correo electrónico" value={editingUser.correoElectronico} onChange={(_, val) => setEditingUser({ ...editingUser, correoElectronico: val ?? "" })} />
              <TextField label="Dirección" value={editingUser.direccion} onChange={(_, val) => setEditingUser({ ...editingUser, direccion: val ?? "" })} />
              <TextField label="Contraseña" type="password" value={editingUser.contrasena} onChange={(_, val) => setEditingUser({ ...editingUser, contrasena: val ?? "" })} />
              <TextField label="Tarjeta" type="number" value={editingUser.tarjeta?.toString() ?? ""} onChange={(_, val) => setEditingUser({ ...editingUser, tarjeta: val ? Number(val) : 0 })} />

              <div style={{ marginTop: 20 }}>
                <h3>Teléfonos</h3>
                <ul className={classNames.telefonoList}>
                  {(editingUser.telefonos ?? []).map((telefono) => (
                    <li key={telefono.idTelefono} className={classNames.telefonoItem}>
                      {editingTelefono?.idTelefono === telefono.idTelefono ? (
                        <>
                          <TextField className={classNames.telefonoInput} value={editingTelefono?.telefono ?? ""} onChange={(e, val) => setEditingTelefono({ ...editingTelefono, telefono: val ?? "" })} />
                          <PrimaryButton onClick={() => handleUpdateTelefono(editingUser.id)} text="Guardar" styles={buttonStyle} />
                          <DefaultButton onClick={() => setEditingTelefono(null)} text="Cancelar" />
                        </>
                      ) : (
                        <>
                          <span>{telefono.telefono}</span>
                          <PrimaryButton onClick={() => setEditingTelefono({ idTelefono: telefono.idTelefono, telefono: telefono.telefono })} text="Editar" styles={buttonStyle} />
                          <DefaultButton onClick={() => handleDeleteTelefono(telefono.idTelefono, editingUser.id)} text="Eliminar" />
                        </>
                      )}
                    </li>
                  ))}
                </ul>

                <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="end">
                  <TextField placeholder="Nuevo teléfono" value={newTelefono} onChange={(_, val) => setNewTelefono(val ?? "")} styles={{ root: { width: 200 } }} />
                  <PrimaryButton onClick={() => editingUser.id && handleAddTelefono(editingUser.id)} text="Añadir" styles={buttonStyle} />
                </Stack>
              </div>

              <Stack horizontal tokens={{ childrenGap: 8 }} styles={{ root: { marginTop: 20 } }}>
                <PrimaryButton onClick={handleUpdateUser} text="Guardar usuario" styles={buttonStyle} />
                <DefaultButton onClick={() => setEditingUser(null)} text="Cancelar" />
              </Stack>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default User;
