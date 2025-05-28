// src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../services/AuthContext';

interface Props { children: JSX.Element; }

export function PrivateRoute({ children }: Props) {
  const { token } = useContext(AuthContext);
  if (!token) {
    return <Navigate to="/Login-Screen" replace />;
  }
  return children;
}
