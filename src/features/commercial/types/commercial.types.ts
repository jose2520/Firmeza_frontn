// Archivo: commercial.types.ts
// Define los tipos de datos comerciales correspondientes al backend .NET de Firmeza.

export interface Vehiculo {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  tipoVehiculo: string; // Volqueta, Retroexcavadora, Grúa, Mezcladora, Minicargador, etc.
  capacidadCargaTon?: number | null;
  tarifaDiaria: number;
  estado: string; // 'Disponible' | 'Alquilado' | 'En Mantenimiento' | 'Inactivo'
  activo: boolean;
  creadoEn?: string;
}

export interface CreateVehiculoDto {
  placa: string;
  marca: string;
  modelo: string;
  tipoVehiculo: string;
  capacidadCargaTon?: number | null;
  tarifaDiaria: number;
}

export interface Alquiler {
  id: number;
  numeroContrato: string;
  clienteId: number;
  vehiculoId: number;
  nombreCliente?: string | null;
  identificacionCliente?: string | null;
  placaVehiculo?: string | null;
  tipoVehiculo?: string | null;
  fechaInicio: string;
  fechaFin: string;
  diasAlquiler: number;
  valorDiario: number;
  total: number;
  estado: string; // 'Activo' | 'Finalizado' | 'Cancelado'
  creadoEn?: string;
}

export interface CreateAlquilerDto {
  numeroContrato: string;
  clienteId: number;
  vehiculoId: number;
  fechaInicio: string;
  fechaFin: string;
  diasAlquiler: number;
  valorDiario: number;
}

export interface Despacho {
  id: number;
  ventaId: number;
  direccionEntrega: string;
  ciudad: string;
  contactoRecibe: string;
  telefonoContacto: string;
  fechaEstimada: string;
  fechaEntrega?: string | null;
  costoFlete: number;
  estado: string; // 'Pendiente' | 'En Ruta' | 'Entregado' | 'Cancelado'
  observaciones?: string | null;
  creadoEn?: string;
}

export interface CreateDespachoDto {
  ventaId: number;
  direccionEntrega: string;
  ciudad: string;
  contactoRecibe: string;
  telefonoContacto: string;
  fechaEstimada: string;
  costoFlete: number;
  observaciones?: string | null;
}

export interface Proveedor {
  id: number;
  nit: string;
  razonSocial: string;
  contactoNombre?: string | null;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
  ciudad?: string | null;
  activo: boolean;
  creadoEn?: string;
}

export interface CreateProveedorDto {
  nit: string;
  razonSocial: string;
  contactoNombre?: string | null;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
  ciudad?: string | null;
}

export interface MovimientoInventario {
  id: number;
  productoId: number;
  codigoProducto?: string | null;
  nombreProducto?: string | null;
  tipoMovimiento: string; // 'Entrada' | 'Salida' | 'Ajuste'
  cantidad: number;
  stockPrevio: number;
  stockPosterior: number;
  referencia?: string | null;
  motivo?: string | null;
  usuarioId?: string | null;
  fecha: string;
}

export interface CreateMovimientoInventarioDto {
  productoId: number;
  tipoMovimiento: string;
  cantidad: number;
  referencia?: string | null;
  motivo?: string | null;
}

export interface MetodoPago {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  activo: boolean;
}

export interface CreateMetodoPagoDto {
  codigo: string;
  nombre: string;
  descripcion?: string | null;
}

export interface UsuarioSistema {
  id: string;
  userName: string;
  email: string;
  phoneNumber?: string | null;
  roles: string[];
}

export interface RolSistema {
  id: string;
  name: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string | null;
  activo: boolean;
  productosCount?: number;
}

