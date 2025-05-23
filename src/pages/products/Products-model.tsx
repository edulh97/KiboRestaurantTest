export interface Categoria {
  id: number;
  nombreCategoria: string;
  descripcion: string;
}

export interface Producto {
  id: number;
  nombreProducto: string;
  precio: number;
  descripcion: string;
  alergenos: string;
  categorias?: Categoria[];
}