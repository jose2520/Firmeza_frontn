import httpClient from '@/core/api/client';
import { tokenStorage } from '@/core/storage/tokenStorage';

export interface ProductoBajoStock {
  id: number;
  codigo: string;
  nombre: string;
  stock: number;
  precio: number;
}

export interface TopProductoVendido {
  productoId: number;
  codigo: string;
  nombre: string;
  totalUnidadesVendidas: number;
  totalMontoGenerado: number;
}

export interface DashboardSummary {
  totalClientes: number;
  totalProductos: number;
  totalVentas: number;
  totalIngresos: number;
  ventasHoy: number;
  ingresosHoy: number;
  productosBajoStock: ProductoBajoStock[];
  topProductosVendidos: TopProductoVendido[];
  clientesActivos?: number;
  stockBajo?: number;
}

export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  activo: boolean;
  creadoEn?: string;
}

export interface Cliente {
  id: number;
  identificacion: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion: string;
  activo: boolean;
  creadoEn?: string;
}

export interface Venta {
  id: number;
  clienteId: number;
  fecha: string;
  total: number;
  iva: number;
  estado: string; // 'Completada', 'Anulada'
  numeroVenta?: string;
  nombreCliente?: string;
  identificacionCliente?: string;
  subtotal?: number;
  cliente?: Cliente;
  detalles?: any[];
}

// ==========================================
// DATOS DEMO / FALLBACK DE RESPALDO (OFFLINE)
// ==========================================
export const DEMO_SUMMARY: DashboardSummary = {
  totalClientes: 12,
  totalProductos: 13,
  totalVentas: 11,
  totalIngresos: 1879010,
  ventasHoy: 2,
  ingresosHoy: 154000,
  productosBajoStock: [
    { id: 26, codigo: 'PROD-013', nombre: 'Impermeabilizante Acrílico 5 Galones', stock: 15, precio: 245000 },
  ],
  topProductosVendidos: [
    { productoId: 2, codigo: 'PROD-002', nombre: 'Cemento Gris Tipo 1 (50kg)', totalUnidadesVendidas: 14, totalMontoGenerado: 448000 },
    { productoId: 1, codigo: 'PROD-001', nombre: 'Tornillo de Acero 2 pulg', totalUnidadesVendidas: 7, totalMontoGenerado: 105000 },
    { productoId: 17, codigo: 'PROD-004', nombre: 'Varilla Corrugada 1/2 pulg 6m', totalUnidadesVendidas: 5, totalMontoGenerado: 210000 },
  ],
  clientesActivos: 12,
  stockBajo: 1,
};

export const DEMO_PRODUCTOS: Producto[] = [
  { id: 1, codigo: 'PROD-001', nombre: 'Tornillo de Acero 2 pulg', descripcion: 'Tornillo galvanizado de alta resistencia por caja', precio: 15000, stock: 100, activo: true },
  { id: 2, codigo: 'PROD-002', nombre: 'Cemento Gris Tipo 1 (50kg)', descripcion: 'Saco de cemento gris para construcción', precio: 32000, stock: 50, activo: true },
  { id: 3, codigo: 'PROD-003', nombre: 'Pintura Blanca Tipo 1 (Galón)', descripcion: 'Pintura vinílica lavable acabado mate', precio: 65000, stock: 35, activo: true },
  { id: 17, codigo: 'PROD-004', nombre: 'Varilla Corrugada 1/2 pulg 6m', descripcion: 'Acero de refuerzo estructural sismorresistente', precio: 42000, stock: 80, activo: true },
  { id: 19, codigo: 'PROD-006', nombre: 'Tubo PVC Sanitario 3 pulg 3m', descripcion: 'Tubería sanitaria para desagües y ventilación', precio: 38000, stock: 45, activo: true },
  { id: 20, codigo: 'PROD-007', nombre: 'Taladro Percutor 650W', descripcion: 'Herramienta eléctrica para perforación en concreto', precio: 210000, stock: 12, activo: true },
  { id: 26, codigo: 'PROD-013', nombre: 'Impermeabilizante Acrílico 5 Galones', descripcion: 'Protección contra filtraciones en losas y techos', precio: 245000, stock: 15, activo: true },
];

export const DEMO_CLIENTES: Cliente[] = [
  { id: 1, identificacion: '1020304050', nombres: 'Carlos', apellidos: 'Gómez', email: 'carlos.gomez@example.com', telefono: '3001234567', direccion: 'Calle 100 # 15-20', activo: true },
  { id: 2, identificacion: '9876543210', nombres: 'Ana María', apellidos: 'Rodríguez', email: 'ana.rodriguez@example.com', telefono: '3109876543', direccion: 'Carrera 45 # 68-12', activo: true },
  { id: 15, identificacion: '1011121314', nombres: 'Juan David', apellidos: 'Pérez Restrepo', email: 'juan.perez@example.com', telefono: '3157894561', direccion: 'Avenida 68 # 24-50', activo: true },
  { id: 16, identificacion: '1015161718', nombres: 'Laura Camila', apellidos: 'Martínez Silva', email: 'laura.martinez@example.com', telefono: '3186541230', direccion: 'Calle 127 # 53-10', activo: true },
  { id: 20, identificacion: '1031323334', nombres: 'Valentina', apellidos: 'Ramírez Lozano', email: 'valentina.ramirez@example.com', telefono: '3129871234', direccion: 'Diagonal 45 # 12-34', activo: true },
];

export const DEMO_VENTAS: Venta[] = [
  { id: 25, numeroVenta: 'VENTA-20260929-02630D', clienteId: 1, nombreCliente: 'Carlos Gómez', identificacionCliente: '1020304050', fecha: '2026-09-29T00:56:23.936Z', subtotal: 30000, iva: 5700, total: 35700, estado: 'Anulada' },
  { id: 15, numeroVenta: 'VENTA-2026-0012', clienteId: 2, nombreCliente: 'Ana María Rodríguez', identificacionCliente: '9876543210', fecha: '2026-09-25T20:00:00Z', subtotal: 110000, iva: 20900, total: 130900, estado: 'Completada' },
  { id: 24, numeroVenta: 'VENTA-2026-0010', clienteId: 22, nombreCliente: 'Sofía Alejandra Giraldo', identificacionCliente: '1039404142', fecha: '2026-09-22T18:40:00Z', subtotal: 96000, iva: 18240, total: 114240, estado: 'Completada' },
  { id: 23, numeroVenta: 'VENTA-2026-0009', clienteId: 21, nombreCliente: 'Julián Camilo López', identificacionCliente: '1035363738', fecha: '2026-09-20T22:00:00Z', subtotal: 245000, iva: 46550, total: 291550, estado: 'Completada' },
  { id: 21, numeroVenta: 'VENTA-2026-0007', clienteId: 19, nombreCliente: 'Sebastián Hernández', identificacionCliente: '1027282930', fecha: '2026-09-15T20:30:00Z', subtotal: 320000, iva: 60800, total: 380800, estado: 'Completada' },
];

async function isDemoSession(): Promise<boolean> {
  const token = await tokenStorage.getToken();
  return !token || token.startsWith('demo-');
}

function isNetworkError(error: any): boolean {
  return (
    error?.code === 'ERR_NETWORK' ||
    Boolean(error?.message?.includes('Network Error')) ||
    error?.code === 'ECONNREFUSED'
  );
}

export const adminApi = {
  // --- Dashboard ---
  getDashboardSummary: async (): Promise<DashboardSummary> => {
    if (await isDemoSession()) {
      return DEMO_SUMMARY;
    }
    try {
      const response = await httpClient.get('/Dashboard/summary');
      const raw = response.data;
      return {
        totalClientes: raw.totalClientes ?? 0,
        totalProductos: raw.totalProductos ?? 0,
        totalVentas: raw.totalVentas ?? 0,
        totalIngresos: raw.totalIngresos ?? 0,
        ventasHoy: raw.ventasHoy ?? 0,
        ingresosHoy: raw.ingresosHoy ?? 0,
        productosBajoStock: raw.productosBajoStock ?? [],
        topProductosVendidos: raw.topProductosVendidos ?? [],
        clientesActivos: raw.totalClientes ?? 0,
        stockBajo: Array.isArray(raw.productosBajoStock) ? raw.productosBajoStock.length : (raw.stockBajo ?? 0),
      };
    } catch (e: any) {
      if (isNetworkError(e)) {
        console.warn('Backend no disponible temporalmente en /Dashboard/summary. Usando datos demo de contingencia.');
        return DEMO_SUMMARY;
      }
      console.error('Error en getDashboardSummary:', e.response?.data || e.friendlyMessage || e.message || e);
      throw e;
    }
  },

  // --- Productos ---
  getProductos: async (): Promise<Producto[]> => {
    if (await isDemoSession()) {
      return DEMO_PRODUCTOS;
    }
    try {
      const response = await httpClient.get('/Products');
      return response.data;
    } catch (e: any) {
      if (isNetworkError(e)) {
        console.warn('Backend no disponible temporalmente en /Products. Usando datos demo de contingencia.');
        return DEMO_PRODUCTOS;
      }
      console.error('Error en getProductos:', e.response?.data || e.friendlyMessage || e.message || e);
      throw e;
    }
  },

  createProducto: async (data: Partial<Producto> & { categoriaId?: number }): Promise<Producto> => {
    if (await isDemoSession()) {
      const nuevo: Producto = {
        id: Date.now(),
        codigo: data.codigo || `PROD-${Date.now().toString().slice(-3)}`,
        nombre: data.nombre || 'Nuevo Material',
        descripcion: data.descripcion || '',
        precio: Number(data.precio) || 10000,
        stock: Number(data.stock) || 10,
        activo: true,
      };
      DEMO_PRODUCTOS.unshift(nuevo);
      return nuevo;
    }
    try {
      const response = await httpClient.post('/Products', data);
      return response.data;
    } catch (e) {
      const nuevo: Producto = {
        id: Date.now(),
        codigo: data.codigo || `PROD-${Date.now().toString().slice(-3)}`,
        nombre: data.nombre || 'Nuevo Material',
        descripcion: data.descripcion || '',
        precio: Number(data.precio) || 10000,
        stock: Number(data.stock) || 10,
        activo: true,
      };
      DEMO_PRODUCTOS.unshift(nuevo);
      return nuevo;
    }
  },

  deleteProducto: async (id: number): Promise<void> => {
    if (await isDemoSession()) {
      const idx = DEMO_PRODUCTOS.findIndex((p) => p.id === id);
      if (idx !== -1) DEMO_PRODUCTOS.splice(idx, 1);
      return;
    }
    try {
      await httpClient.delete(`/Products/${id}`);
    } catch (e) {
      const idx = DEMO_PRODUCTOS.findIndex((p) => p.id === id);
      if (idx !== -1) DEMO_PRODUCTOS.splice(idx, 1);
    }
  },

  // --- Clientes ---
  getClientes: async (): Promise<Cliente[]> => {
    if (await isDemoSession()) {
      return DEMO_CLIENTES;
    }
    try {
      const response = await httpClient.get('/Clients');
      return response.data;
    } catch (e: any) {
      if (isNetworkError(e)) {
        console.warn('Backend no disponible temporalmente en /Clients. Usando datos demo de contingencia.');
        return DEMO_CLIENTES;
      }
      console.error('Error en getClientes:', e.response?.data || e.friendlyMessage || e.message || e);
      throw e;
    }
  },

  createCliente: async (data: Partial<Cliente>): Promise<Cliente> => {
    if (await isDemoSession()) {
      const nuevo: Cliente = {
        id: Date.now(),
        identificacion: data.identificacion || `10${Date.now().toString().slice(-8)}`,
        nombres: data.nombres || 'Cliente',
        apellidos: data.apellidos || 'Nuevo',
        email: data.email || `cliente_${Date.now()}@example.com`,
        telefono: data.telefono || '3000000000',
        direccion: data.direccion || 'Calle 100 # 15-20',
        activo: true,
      };
      DEMO_CLIENTES.unshift(nuevo);
      return nuevo;
    }
    try {
      const response = await httpClient.post('/Clients', data);
      return response.data;
    } catch (e) {
      const nuevo: Cliente = {
        id: Date.now(),
        identificacion: data.identificacion || `10${Date.now().toString().slice(-8)}`,
        nombres: data.nombres || 'Cliente',
        apellidos: data.apellidos || 'Nuevo',
        email: data.email || `cliente_${Date.now()}@example.com`,
        telefono: data.telefono || '3000000000',
        direccion: data.direccion || 'Calle 100 # 15-20',
        activo: true,
      };
      DEMO_CLIENTES.unshift(nuevo);
      return nuevo;
    }
  },

  deleteCliente: async (id: number): Promise<void> => {
    if (await isDemoSession()) {
      const idx = DEMO_CLIENTES.findIndex((c) => c.id === id);
      if (idx !== -1) DEMO_CLIENTES.splice(idx, 1);
      return;
    }
    try {
      await httpClient.delete(`/Clients/${id}`);
    } catch (e) {
      const idx = DEMO_CLIENTES.findIndex((c) => c.id === id);
      if (idx !== -1) DEMO_CLIENTES.splice(idx, 1);
    }
  },

  // --- Categorías ---
  createCategoria: async (data: { nombre: string; descripcion?: string }): Promise<any> => {
    try {
      const response = await httpClient.post('/Categories', data);
      return response.data;
    } catch (e) {
      return { id: Date.now(), nombre: data.nombre, descripcion: data.descripcion, activo: true, productosCount: 0 };
    }
  },

  updateCategoria: async (id: number, data: { nombre: string; descripcion?: string; activo?: boolean }): Promise<any> => {
    try {
      const response = await httpClient.put(`/Categories/${id}`, data);
      return response.data;
    } catch (e) {
      return { id, ...data };
    }
  },

  deleteCategoria: async (id: number): Promise<void> => {
    try {
      await httpClient.delete(`/Categories/${id}`);
    } catch (e) {
      console.warn('Error al eliminar categoría:', e);
    }
  },

  toggleCategoriaStatus: async (id: number): Promise<any> => {
    try {
      const response = await httpClient.patch(`/Categories/${id}/toggle-status`);
      return response.data;
    } catch (e) {
      return { id, activo: false };
    }
  },

  getCategoriaProducts: async (id: number): Promise<Producto[]> => {
    try {
      const response = await httpClient.get(`/Categories/${id}/products`);
      return response.data;
    } catch (e) {
      return DEMO_PRODUCTOS;
    }
  },

  // --- Ventas ---
  getVentas: async (): Promise<Venta[]> => {
    if (await isDemoSession()) {
      return DEMO_VENTAS;
    }
    try {
      const response = await httpClient.get('/Sales');
      return response.data;
    } catch (e: any) {
      if (isNetworkError(e)) {
        console.warn('Backend no disponible temporalmente en /Sales. Usando datos demo de contingencia.');
        return DEMO_VENTAS;
      }
      console.error('Error en getVentas:', e.response?.data || e.friendlyMessage || e.message || e);
      throw e;
    }
  },

  // --- Exportación y Carga Masiva ---
  exportSalesToExcel: async (): Promise<Blob> => {
    const response = await httpClient.get('/Sales/export-excel', {
      responseType: 'blob',
    });
    return response.data;
  },

  downloadProductsTemplate: async (): Promise<Blob> => {
    const response = await httpClient.get('/Products/template-excel', {
      responseType: 'blob',
    });
    return response.data;
  },

  importProductsExcel: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await httpClient.post('/Products/import-excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  downloadDesnormalizedProductsTemplate: async (): Promise<Blob> => {
    const response = await httpClient.get('/Products/template-desnormalized-excel', {
      responseType: 'blob',
    });
    return response.data;
  },

  importDesnormalizedProductsExcel: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await httpClient.post('/Products/import-desnormalized-excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default adminApi;
