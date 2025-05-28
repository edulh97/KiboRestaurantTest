// src/context/AuthContext.tsx
import React, { createContext, useEffect, useState } from 'react';
import { login, setAuthToken } from '../services/auth';

interface AuthContextType {
  token: string | null;
  loginUser: (correo: string, pass: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  // Al montar, rescata token del localStorage
  useEffect(() => {
    const t = localStorage.getItem('jwt');
    if (t) {
      setToken(t);
      setAuthToken(t);
    }
  }, []);

  const loginUser = async (correo: string, pass: string) => {
    const resp = await login(correo, pass);
    // si tu endpoint devuelve el token en resp.data (texto plano):
    const jwt = typeof resp.data === 'string' ? resp.data : resp.data.token;
    localStorage.setItem('jwt', jwt);
    setAuthToken(jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
