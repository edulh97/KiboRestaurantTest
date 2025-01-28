export interface Telefono {
    id_usuario: number;
    telefono: string;
  }
  
  export interface Usuario {
    id: number;
    nombreCompleto: string;
    correoElectronico: string;
    direccion: string;
    contrasena: string;
    tarjeta: number;
    tipoUsuario: string;
    telefonos: Telefono[];
  }
  