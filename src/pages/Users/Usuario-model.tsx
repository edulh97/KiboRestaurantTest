export interface TelefonoUsuario {
  idTelefono?: number;
  telefono: string;
  usuario: {
    id: number,
  }
}

//Que coincida con lo de la api
export interface Usuario {
  id?: number;
  nombreCompleto: string;
  correoElectronico: string;
  direccion: string;
  contrasena: string;
  tarjeta: number;
  tipoUsuario: string;
  token?: string;
  telefonos?: TelefonoUsuario[];
}