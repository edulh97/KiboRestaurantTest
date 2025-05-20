export interface Resena {
  idResena: number;
  usuario: {
    id: number;
    nombreCompleto: string;
    tipoUsuario: string;
  };
  producto: {
    id: number;
    nombreProducto: string;
  };
  calificacion: number;
  comentario: string;
  fechaCreacion: string;
}