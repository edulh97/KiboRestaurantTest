// src/services/auth.ts
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080'
});

export interface LoginResponse {
  // si tu controller devuelve solo el token como texto,
  // axios lo pondrá en resp.data directamente
  token: string;
}

// Llama al login y devuelve la respuesta
export function login(correoElectronico: string, contrasena: string) {
  return API.post<LoginResponse>('/Login-Screen', {
    correoElectronico,
    contrasena
  });
}

// Después de login, podemos fijar el header Authorization para todas las peticiones
export function setAuthToken(token: string) {
  API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default API;
