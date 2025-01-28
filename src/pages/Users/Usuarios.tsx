import React, { useEffect, useState } from "react";
import { getUsers } from "../../services/api";
import type { Usuario } from "./Usuario-model";

const User: React.FC = () => {
  const [users, setUsers] = useState<Usuario[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUsers();
      setUsers(data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Lista de Usuarios</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <strong>{user.nombreCompleto}</strong> - {user.correoElectronico}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default User;