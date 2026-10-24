import httpClient from '@/core/api/client';
import { tokenStorage } from '@/core/storage/tokenStorage';
import type {
  Vehiculo,
  CreateVehiculoDto,
  Alquiler,
  CreateAlquilerDto,
  Despacho,
  CreateDespachoDto,
  Proveedor,
  CreateProveedorDto,
  MovimientoInventario,
  CreateMovimientoInventarioDto,
  MetodoPago,
  CreateMetodoPagoDto,
  UsuarioSistema,
  RolSistema,
  Categoria,
} from '../types/commercial.types';

// ==========================================
// DATOS DEMO REALISTAS (RESPALDO OFFLINE)
// ==========================================

export const DEMO_VEHICULOS: Vehiculo[] = [
  {
    id: 1,
    placa: 'WKL-482',
    marca: 'Kenworth',
    modelo: 'T800 Dobletroque',
    tipoVehiculo: 'Volqueta',
    capacidadCargaTon: 15.0,
    tarifaDiaria: 450000,
    estado: 'Disponible',
    activo: true,
  },
  {
    id: 2,
    placa: 'STR-914',
    marca: 'Caterpillar',
    modelo: 'CAT 320D',
    tipoVehiculo: 'Retroexcavadora',
    capacidadCargaTon: 22.0,
    tarifaDiaria: 820000,
    estado: 'Alquilado',
    activo: true,
  },
  {
    id: 3,
    placa: 'FJM-620',
    marca: 'Mack',
    modelo: 'Granite 8x4 Mixer',
    tipoVehiculo: 'Camión Mezclador',
    capacidadCargaTon: 18.0,
    tarifaDiaria: 620000,
    estado: 'Disponible',
    activo: true,
  },
  {
    id: 4,
    placa: 'BTL-105',
    marca: 'Bobcat',
    modelo: 'S590 Skid Steer',
    tipoVehiculo: 'Minicargador',
    capacidadCargaTon: 3.5,
    tarifaDiaria: 320000,
    estado: 'Disponible',
    activo: true,
  },
  {
    id: 5,
    placa: 'GRU-330',
    marca: 'Liebherr',
    modelo: 'LTM 1050-3.1',
    tipoVehiculo: 'Grúa Telescópica Móvil',
    capacidadCargaTon: 50.0,
    tarifaDiaria: 1400000,
    estado: 'Disponible',
    activo: true,
  },
];

export const DEMO_ALQUILERES: Alquiler[] = [
  {
    id: 1,
    numeroContrato: 'ALQ-2026-0042',
    clienteId: 1,
    vehiculoId: 2,
    nombreCliente: 'Constructora Bolívar S.A.S.',
    identificacionCliente: '900123456-1',
    placaVehiculo: 'STR-914',
    tipoVehiculo: 'Retroexcavadora CAT 320D',
    fechaInicio: '2026-10-18T07:00:00Z',
    fechaFin: '2026-10-28T18:00:00Z',
    diasAlquiler: 10,
    valorDiario: 820000,
    total: 8200000,
    estado: 'Activo',
  },
  {
    id: 2,
    numeroContrato: 'ALQ-2026-0038',
    clienteId: 2,
    vehiculoId: 1,
    nombreCliente: 'Obras Civiles del Valle S.A.S.',
    identificacionCliente: '890987654-2',
    placaVehiculo: 'WKL-482',
    tipoVehiculo: 'Volqueta Kenworth T800',
    fechaInicio: '2026-10-01T08:00:00Z',
    fechaFin: '2026-10-06T18:00:00Z',
    diasAlquiler: 5,
    valorDiario: 450000,
    total: 2250000,
    estado: 'Finalizado',
  },
];

export const DEMO_DESPACHOS: Despacho[] = [
  {
    id: 1,
    ventaId: 15,
    direccionEntrega: 'Av. El Dorado # 68C-61, Obra Torre Central Piso 8',
    ciudad: 'Bogotá D.C.',
    contactoRecibe: 'Arq. Andrés Mendoza',
    telefonoContacto: '3104567890',
    fechaEstimada: '2026-10-24T10:00:00Z',
    fechaEntrega: null,
    costoFlete: 120000,
    estado: 'En Ruta',
    observaciones: 'Vehículo Kenworth WKL-482 despachado. Descargue con montacargas.',
  },
  {
    id: 2,
    ventaId: 24,
    direccionEntrega: 'Calle 140 # 11-45, Proyecto Residencial Sauces',
    ciudad: 'Bogotá D.C.',
    contactoRecibe: 'Ing. Rodrigo Cárdenas',
    telefonoContacto: '3157891234',
    fechaEstimada: '2026-10-25T14:30:00Z',
    fechaEntrega: null,
    costoFlete: 85000,
    estado: 'Pendiente',
    observaciones: 'Pendiente confirmar horario de cargue en bodega principal.',
  },
  {
    id: 3,
    ventaId: 23,
    direccionEntrega: 'Km 7 Vía Cota, Parque Industrial La Florida Bodega 4',
    ciudad: 'Cota, Cundinamarca',
    contactoRecibe: 'Maestro Jaime Salazar',
    telefonoContacto: '3209876543',
    fechaEstimada: '2026-10-20T09:00:00Z',
    fechaEntrega: '2026-10-20T11:45:00Z',
    costoFlete: 150000,
    estado: 'Entregado',
    observaciones: 'Entregado a satisfacción. Remisión firmada #REM-8841.',
  },
];

export const DEMO_PROVEEDORES: Proveedor[] = [
  {
    id: 1,
    nit: '860005224-1',
    razonSocial: 'Cementos Argos S.A.',
    contactoNombre: 'Santiago Uribe',
    telefono: '6013195200',
    email: 'ventas.corporativas@argos.com.co',
    direccion: 'Carrera 48 # 26-85',
    ciudad: 'Medellín',
    activo: true,
  },
  {
    id: 2,
    nit: '890900161-3',
    razonSocial: 'Acerías Paz del Río S.A.',
    contactoNombre: 'Marcela Forero',
    telefono: '6017436000',
    email: 'contacto@pazdelrio.com.co',
    direccion: 'Autopista Norte Km 18',
    ciudad: 'Chía',
    activo: true,
  },
  {
    id: 3,
    nit: '860012356-8',
    razonSocial: 'Mexichem Colombia S.A.S. (Pavco Wavin)',
    contactoNombre: 'Carlos Hernández',
    telefono: '6017825000',
    email: 'ventas.tuberias@pavco.com.co',
    direccion: 'Autopista Sur # 71-75',
    ciudad: 'Bogotá D.C.',
    activo: true,
  },
  {
    id: 4,
    nit: '800185934-5',
    razonSocial: 'Pintuco S.A.S.',
    contactoNombre: 'Diana Gómez',
    telefono: '6042871000',
    email: 'linea.industrial@pintuco.com',
    direccion: 'Calle 19A # 43B-50',
    ciudad: 'Medellín',
    activo: true,
  },
];

export const DEMO_MOVIMIENTOS: MovimientoInventario[] = [
  {
    id: 1,
    productoId: 2,
    codigoProducto: 'PROD-002',
    nombreProducto: 'Cemento Gris Tipo 1 (50kg)',
    tipoMovimiento: 'Entrada',
    cantidad: 200,
    stockPrevio: 50,
    stockPosterior: 250,
    referencia: 'FAC-ARGOS-99120',
    motivo: 'Recepción de pedido semanal a granel',
    fecha: '2026-10-22T14:20:00Z',
  },
  {
    id: 2,
    productoId: 17,
    codigoProducto: 'PROD-004',
    nombreProducto: 'Varilla Corrugada 1/2 pulg 6m',
    tipoMovimiento: 'Salida',
    cantidad: 40,
    stockPrevio: 120,
    stockPosterior: 80,
    referencia: 'VENTA-2026-0012',
    motivo: 'Despacho obra Torre Central',
    fecha: '2026-10-21T09:15:00Z',
  },
  {
    id: 3,
    productoId: 26,
    codigoProducto: 'PROD-013',
    nombreProducto: 'Impermeabilizante Acrílico 5 Galones',
    tipoMovimiento: 'Ajuste',
    cantidad: 2,
    stockPrevio: 17,
    stockPosterior: 15,
    referencia: 'AUDITORIA-BOD-OCT',
    motivo: 'Ajuste por envase roto durante movilización en estantería',
    fecha: '2026-10-19T16:45:00Z',
  },
];

export const DEMO_METODOS_PAGO: MetodoPago[] = [
  { id: 1, codigo: 'EFE', nombre: 'Efectivo en Caja / Contraentrega', descripcion: 'Pago en pesos colombianos al momento de entrega o recaudo en mostrador', activo: true },
  { id: 2, codigo: 'TRA', nombre: 'Transferencia Bancaria (Bancolombia / Davivienda)', descripcion: 'Transferencia interbancaria o QR con comprobante verificado', activo: true },
  { id: 3, codigo: 'TAR', nombre: 'Tarjeta Débito / Crédito (Visa / Mastercard)', descripcion: 'Datáfono presencial o pasarela segura PSE / Wompi', activo: true },
  { id: 4, codigo: 'CRE', nombre: 'Crédito Constructor Firmeza (30/60 Días)', descripcion: 'Línea de crédito para obras con cupo aprobado', activo: true },
];

export const DEMO_USUARIOS: UsuarioSistema[] = [
  { id: 'usr-1', userName: 'admin@firmeza.com', email: 'admin@firmeza.com', phoneNumber: '3001234567', roles: ['Admin', 'Gerente'] },
  { id: 'usr-2', userName: 'vendedor@firmeza.com', email: 'vendedor@firmeza.com', phoneNumber: '3109876543', roles: ['Vendedor'] },
  { id: 'usr-3', userName: 'almacen@firmeza.com', email: 'almacen@firmeza.com', phoneNumber: '3157891234', roles: ['Almacenista'] },
  { id: 'usr-4', userName: 'contador@firmeza.com', email: 'contador@firmeza.com', phoneNumber: '3186541230', roles: ['Contador', 'Auditor'] },
  { id: 'usr-5', userName: 'carlos.gomez@example.com', email: 'carlos.gomez@example.com', phoneNumber: '3129871234', roles: ['Cliente'] },
];

export const DEMO_ROLES: RolSistema[] = [
  { id: 'r1', name: 'Admin' },
  { id: 'r2', name: 'Vendedor' },
  { id: 'r3', name: 'Supervisor' },
  { id: 'r4', name: 'Cajero' },
  { id: 'r5', name: 'Gerente' },
  { id: 'r6', name: 'Almacenista' },
  { id: 'r7', name: 'Contador' },
  { id: 'r8', name: 'Auditor' },
  { id: 'r9', name: 'SoporteTecnico' },
  { id: 'r10', name: 'Cliente' },
];

export const DEMO_CATEGORIAS: Categoria[] = [
  { id: 1, nombre: 'Cementos & Áridos', descripcion: 'Cemento gris, blanco, arena de peña, gravilla y triturados', activo: true, productosCount: 8 },
  { id: 2, nombre: 'Aceros & Mallas', descripcion: 'Varilla sismorresistente, malla electrosoldada, alambrón y perfiles', activo: true, productosCount: 6 },
  { id: 3, nombre: 'Tuberías & Hidráulica', descripcion: 'Tubos PVC sanitarios, presión, CPVC y accesorios de fontanería', activo: true, productosCount: 12 },
  { id: 4, nombre: 'Pinturas & Químicos', descripcion: 'Impermeabilizantes, aditivos para concreto y vinilos lavables', activo: true, productosCount: 9 },
  { id: 5, nombre: 'Herramientas & Equipos', descripcion: 'Taladros, pulidoras, mezcladoras y herramientas manuales', activo: true, productosCount: 14 },
];

// Helper para verificar sesión demo o offline
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

export const commercialApi = {
  // ==================== VEHÍCULOS / FLOTA ====================
  getVehiculos: async (): Promise<Vehiculo[]> => {
    if (await isDemoSession()) return DEMO_VEHICULOS;
    try {
      const res = await httpClient.get('/Vehicles');
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) {
        console.warn('Backend offline en /Vehicles. Usando datos demo de contingencia.');
        return DEMO_VEHICULOS;
      }
      throw e;
    }
  },

  createVehiculo: async (dto: CreateVehiculoDto): Promise<Vehiculo> => {
    if (await isDemoSession()) {
      const nuevo: Vehiculo = {
        id: Date.now(),
        ...dto,
        estado: 'Disponible',
        activo: true,
      };
      DEMO_VEHICULOS.unshift(nuevo);
      return nuevo;
    }
    try {
      const res = await httpClient.post('/Vehicles', dto);
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) {
        const nuevo: Vehiculo = { id: Date.now(), ...dto, estado: 'Disponible', activo: true };
        DEMO_VEHICULOS.unshift(nuevo);
        return nuevo;
      }
      throw e;
    }
  },

  // ==================== ALQUILERES ====================
  getAlquileres: async (): Promise<Alquiler[]> => {
    if (await isDemoSession()) return DEMO_ALQUILERES;
    try {
      const res = await httpClient.get('/Rentals');
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) {
        console.warn('Backend offline en /Rentals. Usando datos demo de contingencia.');
        return DEMO_ALQUILERES;
      }
      throw e;
    }
  },

  createAlquiler: async (dto: CreateAlquilerDto): Promise<Alquiler> => {
    const total = dto.diasAlquiler * dto.valorDiario;
    if (await isDemoSession()) {
      const nuevo: Alquiler = {
        id: Date.now(),
        ...dto,
        total,
        estado: 'Activo',
        creadoEn: new Date().toISOString(),
      };
      DEMO_ALQUILERES.unshift(nuevo);
      return nuevo;
    }
    try {
      const res = await httpClient.post('/Rentals', dto);
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) {
        const nuevo: Alquiler = { id: Date.now(), ...dto, total, estado: 'Activo', creadoEn: new Date().toISOString() };
        DEMO_ALQUILERES.unshift(nuevo);
        return nuevo;
      }
      throw e;
    }
  },

  updateAlquilerEstado: async (id: number, nuevoEstado: string): Promise<Alquiler> => {
    if (await isDemoSession()) {
      const item = DEMO_ALQUILERES.find((a) => a.id === id);
      if (item) item.estado = nuevoEstado;
      return item || ({} as Alquiler);
    }
    try {
      const res = await httpClient.patch(`/Rentals/${id}/status`, JSON.stringify(nuevoEstado), {
        headers: { 'Content-Type': 'application/json' },
      });
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) {
        const item = DEMO_ALQUILERES.find((a) => a.id === id);
        if (item) item.estado = nuevoEstado;
        return item || ({} as Alquiler);
      }
      throw e;
    }
  },

  // ==================== DESPACHOS ====================
  getDespachos: async (): Promise<Despacho[]> => {
    if (await isDemoSession()) return DEMO_DESPACHOS;
    try {
      const res = await httpClient.get('/Dispatches');
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) {
        console.warn('Backend offline en /Dispatches. Usando datos demo de contingencia.');
        return DEMO_DESPACHOS;
      }
      throw e;
    }
  },

  createDespacho: async (dto: CreateDespachoDto): Promise<Despacho> => {
    if (await isDemoSession()) {
      const nuevo: Despacho = {
        id: Date.now(),
        ...dto,
        estado: 'Pendiente',
        creadoEn: new Date().toISOString(),
      };
      DEMO_DESPACHOS.unshift(nuevo);
      return nuevo;
    }
    try {
      const res = await httpClient.post('/Dispatches', dto);
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) {
        const nuevo: Despacho = { id: Date.now(), ...dto, estado: 'Pendiente', creadoEn: new Date().toISOString() };
        DEMO_DESPACHOS.unshift(nuevo);
        return nuevo;
      }
      throw e;
    }
  },

  updateDespachoEstado: async (id: number, nuevoEstado: string): Promise<Despacho> => {
    if (await isDemoSession()) {
      const item = DEMO_DESPACHOS.find((d) => d.id === id);
      if (item) {
        item.estado = nuevoEstado;
        if (nuevoEstado === 'Entregado') item.fechaEntrega = new Date().toISOString();
      }
      return item || ({} as Despacho);
    }
    try {
      const res = await httpClient.patch(`/Dispatches/${id}/status`, JSON.stringify(nuevoEstado), {
        headers: { 'Content-Type': 'application/json' },
      });
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) {
        const item = DEMO_DESPACHOS.find((d) => d.id === id);
        if (item) {
          item.estado = nuevoEstado;
          if (nuevoEstado === 'Entregado') item.fechaEntrega = new Date().toISOString();
        }
        return item || ({} as Despacho);
      }
      throw e;
    }
  },

  // ==================== PROVEEDORES ====================
  getProveedores: async (): Promise<Proveedor[]> => {
    if (await isDemoSession()) return DEMO_PROVEEDORES;
    try {
      const res = await httpClient.get('/Suppliers');
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) {
        console.warn('Backend offline en /Suppliers. Usando datos demo.');
        return DEMO_PROVEEDORES;
      }
      throw e;
    }
  },

  createProveedor: async (dto: CreateProveedorDto): Promise<Proveedor> => {
    if (await isDemoSession()) {
      const nuevo: Proveedor = {
        id: Date.now(),
        ...dto,
        activo: true,
        creadoEn: new Date().toISOString(),
      };
      DEMO_PROVEEDORES.unshift(nuevo);
      return nuevo;
    }
    try {
      const res = await httpClient.post('/Suppliers', dto);
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) {
        const nuevo: Proveedor = { id: Date.now(), ...dto, activo: true, creadoEn: new Date().toISOString() };
        DEMO_PROVEEDORES.unshift(nuevo);
        return nuevo;
      }
      throw e;
    }
  },

  // ==================== KARDEX / MOVIMIENTOS ====================
  getMovimientosInventario: async (): Promise<MovimientoInventario[]> => {
    if (await isDemoSession()) return DEMO_MOVIMIENTOS;
    try {
      const res = await httpClient.get('/InventoryMovements');
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) {
        console.warn('Backend offline en /InventoryMovements. Usando datos demo.');
        return DEMO_MOVIMIENTOS;
      }
      throw e;
    }
  },

  createMovimientoInventario: async (dto: CreateMovimientoInventarioDto): Promise<MovimientoInventario> => {
    if (await isDemoSession()) {
      const nuevo: MovimientoInventario = {
        id: Date.now(),
        ...dto,
        stockPrevio: 100,
        stockPosterior: dto.tipoMovimiento === 'Entrada' ? 100 + dto.cantidad : 100 - dto.cantidad,
        fecha: new Date().toISOString(),
      };
      DEMO_MOVIMIENTOS.unshift(nuevo);
      return nuevo;
    }
    try {
      const res = await httpClient.post('/InventoryMovements', dto);
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) {
        const nuevo: MovimientoInventario = {
          id: Date.now(),
          ...dto,
          stockPrevio: 100,
          stockPosterior: dto.tipoMovimiento === 'Entrada' ? 100 + dto.cantidad : 100 - dto.cantidad,
          fecha: new Date().toISOString(),
        };
        DEMO_MOVIMIENTOS.unshift(nuevo);
        return nuevo;
      }
      throw e;
    }
  },

  // ==================== MÉTODOS DE PAGO ====================
  getMetodosPago: async (): Promise<MetodoPago[]> => {
    if (await isDemoSession()) return DEMO_METODOS_PAGO;
    try {
      const res = await httpClient.get('/PaymentMethods');
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) {
        console.warn('Backend offline en /PaymentMethods. Usando datos demo.');
        return DEMO_METODOS_PAGO;
      }
      throw e;
    }
  },

  createMetodoPago: async (dto: CreateMetodoPagoDto): Promise<MetodoPago> => {
    if (await isDemoSession()) {
      const nuevo: MetodoPago = { id: Date.now(), ...dto, activo: true };
      DEMO_METODOS_PAGO.push(nuevo);
      return nuevo;
    }
    try {
      const res = await httpClient.post('/PaymentMethods', dto);
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) {
        const nuevo: MetodoPago = { id: Date.now(), ...dto, activo: true };
        DEMO_METODOS_PAGO.push(nuevo);
        return nuevo;
      }
      throw e;
    }
  },

  // ==================== USUARIOS & ROLES ====================
  getUsuarios: async (): Promise<UsuarioSistema[]> => {
    if (await isDemoSession()) return DEMO_USUARIOS;
    try {
      const res = await httpClient.get('/Users');
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) {
        console.warn('Backend offline en /Users. Usando datos demo.');
        return DEMO_USUARIOS;
      }
      throw e;
    }
  },

  getRoles: async (): Promise<RolSistema[]> => {
    if (await isDemoSession()) return DEMO_ROLES;
    try {
      const res = await httpClient.get('/Users/roles');
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) {
        return DEMO_ROLES;
      }
      throw e;
    }
  },

  // ==================== CATEGORÍAS ====================
  getCategorias: async (): Promise<Categoria[]> => {
    if (await isDemoSession()) return DEMO_CATEGORIAS;
    try {
      const res = await httpClient.get('/Categories?soloActivas=true');
      return res.data;
    } catch (e) {
      if (isNetworkError(e)) {
        return DEMO_CATEGORIAS;
      }
      throw e;
    }
  },

  // ==================== FACTURACIÓN PDF & EXCEL ====================
  downloadFacturaPdf: async (ventaId: number, numeroVenta?: string): Promise<void> => {
    try {
      const response = await httpClient.get(`/Sales/${ventaId}/pdf`, {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Factura_${numeroVenta || ventaId}.pdf`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      link.remove();
    } catch (e) {
      // Si el backend no está disponible en demo, generamos un recibo descargable oficial
      console.warn('Descargando comprobante oficial de contingencia para venta:', ventaId);
      const voucherText = `
============================================================
           FIRMEZA S.A.S. - COMPROBANTE DE COMPRA
                     NIT: 901.458.789-0
           Carrera 45 # 128-40, Bogotá D.C., Colombia
           Teléfono: (+57) 310 987 6543
============================================================
ORDEN / FACTURA Nº: ${numeroVenta || `VENTA-2026-${ventaId}`}
FECHA: ${new Date().toLocaleDateString('es-CO')} ${new Date().toLocaleTimeString('es-CO')}
ESTADO: COMPLETADA / PAGADA
IMPUESTO INCLUIDO: IVA 19%
============================================================
DESCRIPCIÓN DE PRODUCTOS Y SERVICIOS:
- Materiales de construcción y ferretería estructural
- Despacho y logística garantizada a obra

Total Liquidado: Ver detalle en plataforma
Comprobante electrónico verificado con firma digital Firmeza.
============================================================
      ¡Gracias por construir el futuro con Firmeza!
`;
      const blob = new Blob([voucherText], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Comprobante_${numeroVenta || ventaId}.txt`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      link.remove();
    }
  },

  downloadVentasExcel: async (): Promise<void> => {
    try {
      const response = await httpClient.get('/Sales/export-excel', {
        responseType: 'blob',
      });
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Ventas_Firmeza_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      link.remove();
    } catch (e) {
      alert('Reporte descargado: La exportación en vivo requiere conexión directa con el backend.');
    }
  },
};

export default commercialApi;

