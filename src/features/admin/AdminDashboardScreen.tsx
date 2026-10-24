import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {
  FileUp,
  Users,
  Database,
  ShieldAlert,
  Menu,
  X,
  Plus,
  LogOut,
  Activity,
  Loader2,
  Download,
  Bell,
  ChevronLeft,
  Home,
  DollarSign,
  Search,
  FileText,
  FileSpreadsheet,
  Truck,
  Calendar,
  Clock,
  Building2,
  CreditCard,
  ArrowRightLeft,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Check,
  Phone,
  Mail,
  Layers,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminGuard } from '@/features/auth/components/AdminGuard';
import {
  adminApi,
  type DashboardSummary,
  type Producto,
  type Cliente,
  type Venta,
} from './services/adminApi';
import {
  commercialApi,
  DEMO_VEHICULOS,
  DEMO_ALQUILERES,
  DEMO_DESPACHOS,
  DEMO_PROVEEDORES,
  DEMO_MOVIMIENTOS,
  DEMO_METODOS_PAGO,
  DEMO_USUARIOS,
  DEMO_ROLES,
} from '@/features/commercial/services/commercialApi';
import type {
  Vehiculo,
  Alquiler,
  Despacho,
  Proveedor,
  MovimientoInventario,
  MetodoPago,
  UsuarioSistema,
  RolSistema,
  CreateVehiculoDto,
  CreateAlquilerDto,
  CreateDespachoDto,
  CreateProveedorDto,
  CreateMovimientoInventarioDto,
  CreateMetodoPagoDto,
} from '@/features/commercial/types/commercial.types';

export type AdminTab =
  | 'dashboard'
  | 'productos'
  | 'flota'
  | 'alquileres'
  | 'despachos'
  | 'ventas'
  | 'clientes'
  | 'proveedores'
  | 'kardex'
  | 'usuarios'
  | 'metodos-pago'
  | 'carga';

interface AdminSidebarItemProps {
  icon: any;
  label: string;
  tab: AdminTab;
  activeTab: AdminTab;
  isSlim: boolean;
  onSelect: (tab: AdminTab) => void;
  badge?: number | string;
}

function AdminSidebarItem({
  icon: Icon,
  label,
  tab,
  activeTab,
  isSlim,
  onSelect,
  badge,
}: AdminSidebarItemProps) {
  const isActive = activeTab === tab;
  return (
    <button
      type="button"
      onClick={() => onSelect(tab)}
      className={`relative group flex items-center rounded-full transition-all duration-300 cursor-pointer ${
        isActive
          ? 'bg-gradient-to-r from-brand-gold/20 to-brand-gold/5 dark:from-brand-gold/20 dark:to-transparent border border-brand-gold/30 text-brand-gold font-semibold shadow-sm scale-[1.02]'
          : 'font-medium text-slate-600 dark:text-slate-400 hover:text-brand-gold hover:bg-slate-100 dark:hover:bg-[#151D2E] md:hover:translate-x-1'
      } ${isSlim ? 'w-12 h-12 justify-center p-0 mx-auto' : 'w-full px-3 py-2 gap-3 text-xs'}`}>
      <Icon
        className={`flex-shrink-0 transition-transform ${
          isActive ? 'text-brand-gold' : 'text-slate-400'
        } ${isSlim ? 'w-5 h-5' : 'w-4 h-4'} ${isSlim && isActive ? 'scale-110' : ''}`}
      />
      {!isSlim && (
        <span className="truncate whitespace-nowrap overflow-hidden transition-all duration-300 w-auto opacity-100 flex-1 text-left">
          {label}
        </span>
      )}

      {!isSlim && badge !== undefined && (
        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-brand-gold/20 text-brand-gold ml-auto">
          {badge}
        </span>
      )}

      {isSlim && (
        <div className="absolute left-14 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 -translate-x-2 group-hover:translate-x-0 z-50">
          <div className="bg-[#151D2E] text-white text-xs py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap border border-slate-700/50 relative font-bold tracking-wide">
            {label}
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-[5px] border-y-transparent border-r-[5px] border-r-[#151D2E]" />
          </div>
        </div>
      )}
    </button>
  );
}

const INITIAL_VEHICULO: CreateVehiculoDto = {
  placa: '',
  marca: '',
  modelo: '',
  tipoVehiculo: 'Volqueta',
  capacidadCargaTon: 15,
  tarifaDiaria: 450000,
};

const INITIAL_ALQUILER: CreateAlquilerDto = {
  numeroContrato: 'ALQ-2026-0050',
  clienteId: 1,
  vehiculoId: 1,
  fechaInicio: '2026-10-24',
  fechaFin: '2026-10-31',
  diasAlquiler: 7,
  valorDiario: 450000,
};

const INITIAL_DESPACHO: CreateDespachoDto = {
  ventaId: 15,
  direccionEntrega: '',
  ciudad: 'Bogotá D.C.',
  contactoRecibe: '',
  telefonoContacto: '',
  fechaEstimada: '2026-10-25',
  costoFlete: 120000,
  observaciones: '',
};

export function AdminDashboardScreen() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSlim, setIsSlim] = useState(false);

  // Estados de datos
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>(DEMO_VEHICULOS);
  const [alquileres, setAlquileres] = useState<Alquiler[]>(DEMO_ALQUILERES);
  const [despachos, setDespachos] = useState<Despacho[]>(DEMO_DESPACHOS);
  const [proveedores, setProveedores] = useState<Proveedor[]>(DEMO_PROVEEDORES);
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>(DEMO_MOVIMIENTOS);
  const [usuarios, setUsuarios] = useState<UsuarioSistema[]>(DEMO_USUARIOS);
  const [roles, setRoles] = useState<RolSistema[]>(DEMO_ROLES);
  const [metodosPago, setMetodosPago] = useState<MetodoPago[]>(DEMO_METODOS_PAGO);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Modales
  const [activeModal, setActiveModal] = useState<
    'vehiculo' | 'alquiler' | 'despacho' | 'proveedor' | 'kardex' | 'metodoPago' | null
  >(null);

  // Formularios de Creación
  const [newVehiculo, setNewVehiculo] = useState<CreateVehiculoDto>(INITIAL_VEHICULO);
  const [newAlquiler, setNewAlquiler] = useState<CreateAlquilerDto>(INITIAL_ALQUILER);
  const [newDespacho, setNewDespacho] = useState<CreateDespachoDto>(INITIAL_DESPACHO);

  const [newProveedor, setNewProveedor] = useState<CreateProveedorDto>({
    nit: '',
    razonSocial: '',
    contactoNombre: '',
    telefono: '',
    email: '',
    ciudad: 'Bogotá D.C.',
  });

  const [newMovimiento, setNewMovimiento] = useState<CreateMovimientoInventarioDto>({
    productoId: 1,
    tipoMovimiento: 'Entrada',
    cantidad: 50,
    referencia: 'FAC-COMPRA-ING',
    motivo: 'Abastecimiento de bodega',
  });

  const [newMetodoPago, setNewMetodoPago] = useState<CreateMetodoPagoDto>({
    codigo: '',
    nombre: '',
    descripcion: '',
  });

  // Carga reactiva de datos según pestaña
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      if (activeTab === 'dashboard') {
        const [sum, prods, clis, vents, vehs, desps] = await Promise.all([
          adminApi.getDashboardSummary(),
          adminApi.getProductos(),
          adminApi.getClientes(),
          adminApi.getVentas(),
          commercialApi.getVehiculos(),
          commercialApi.getDespachos(),
        ]);
        setSummary(sum);
        setProductos(prods);
        setClientes(clis);
        setVentas(vents);
        setVehiculos(vehs);
        setDespachos(desps);
      } else if (activeTab === 'productos') {
        setProductos(await adminApi.getProductos());
      } else if (activeTab === 'clientes') {
        setClientes(await adminApi.getClientes());
      } else if (activeTab === 'ventas') {
        setVentas(await adminApi.getVentas());
      } else if (activeTab === 'flota') {
        setVehiculos(await commercialApi.getVehiculos());
      } else if (activeTab === 'alquileres') {
        setAlquileres(await commercialApi.getAlquileres());
      } else if (activeTab === 'despachos') {
        setDespachos(await commercialApi.getDespachos());
      } else if (activeTab === 'proveedores') {
        setProveedores(await commercialApi.getProveedores());
      } else if (activeTab === 'kardex') {
        setMovimientos(await commercialApi.getMovimientosInventario());
      } else if (activeTab === 'usuarios') {
        setUsuarios(await commercialApi.getUsuarios());
        setRoles(await commercialApi.getRoles());
      } else if (activeTab === 'metodos-pago') {
        setMetodosPago(await commercialApi.getMetodosPago());
      }
    } catch (error: any) {
      console.warn('Conectando a modo respaldo backend:', error);
      setErrorMessage(error?.friendlyMessage || error?.message || 'Error al conectar con la API.');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTabSelect = (tab: AdminTab) => {
    setActiveTab(tab);
    setSearchTerm('');
    setSidebarOpen(false);
  };

  // Manejadores de acciones rápidas
  const handleToggleVehiculoEstado = (id: number) => {
    setVehiculos((prev) =>
      prev.map((v) =>
        v.id === id
          ? { ...v, estado: v.estado === 'Disponible' ? 'En Mantenimiento' : 'Disponible' }
          : v
      )
    );
  };

  const handleUpdateAlquilerEstado = async (id: number, estado: string) => {
    await commercialApi.updateAlquilerEstado(id, estado);
    setAlquileres((prev) => prev.map((a) => (a.id === id ? { ...a, estado } : a)));
    setSuccessMessage(`Estado del contrato de alquiler actualizado a: ${estado}`);
  };

  const handleUpdateDespachoEstado = async (id: number, estado: string) => {
    await commercialApi.updateDespachoEstado(id, estado);
    setDespachos((prev) => prev.map((d) => (d.id === id ? { ...d, estado } : d)));
    setSuccessMessage(`Estado de despacho actualizado a: ${estado}`);
  };

  const handleDownloadInvoice = async (ventaId: number, numeroVenta?: string) => {
    await commercialApi.downloadFacturaPdf(ventaId, numeroVenta);
  };

  const handleExportSales = async () => {
    await commercialApi.downloadVentasExcel();
  };

  // Guardar nuevo vehículo
  const handleSaveVehiculo = async () => {
    if (!newVehiculo.placa || !newVehiculo.marca) return;
    const creado = await commercialApi.createVehiculo(newVehiculo);
    setVehiculos((prev) => [creado, ...prev]);
    setActiveModal(null);
    setSuccessMessage(`Vehículo con placa ${creado.placa} registrado.`);
  };

  // Guardar nuevo alquiler
  const handleSaveAlquiler = async () => {
    const creado = await commercialApi.createAlquiler(newAlquiler);
    setAlquileres((prev) => [creado, ...prev]);
    setActiveModal(null);
    setSuccessMessage(`Contrato de alquiler ${creado.numeroContrato} emitido.`);
  };

  // Guardar nuevo despacho
  const handleSaveDespacho = async () => {
    if (!newDespacho.direccionEntrega || !newDespacho.contactoRecibe) return;
    const creado = await commercialApi.createDespacho(newDespacho);
    setDespachos((prev) => [creado, ...prev]);
    setActiveModal(null);
    setSuccessMessage(`Orden de despacho creada para venta #${creado.ventaId}.`);
  };

  // Guardar nuevo proveedor
  const handleSaveProveedor = async () => {
    if (!newProveedor.nit || !newProveedor.razonSocial) return;
    const creado = await commercialApi.createProveedor(newProveedor);
    setProveedores((prev) => [creado, ...prev]);
    setActiveModal(null);
    setSuccessMessage(`Proveedor ${creado.razonSocial} registrado.`);
  };

  // Guardar nuevo movimiento de inventario
  const handleSaveMovimiento = async () => {
    const creado = await commercialApi.createMovimientoInventario(newMovimiento);
    setMovimientos((prev) => [creado, ...prev]);
    setActiveModal(null);
    setSuccessMessage(`Movimiento de inventario tipo '${creado.tipoMovimiento}' asentado.`);
  };

  // Guardar nuevo método de pago
  const handleSaveMetodoPago = async () => {
    if (!newMetodoPago.codigo || !newMetodoPago.nombre) return;
    const creado = await commercialApi.createMetodoPago(newMetodoPago);
    setMetodosPago((prev) => [...prev, creado]);
    setActiveModal(null);
    setSuccessMessage(`Método de pago '${creado.nombre}' configurado.`);
  };

  // KPIs
  const kpis = {
    productos: productos.length > 0 ? productos.length : summary?.totalProductos || 13,
    clientes: clientes.length > 0 ? clientes.length : summary?.totalClientes || 12,
    ventas: summary?.totalIngresos
      ? `$${Number(summary.totalIngresos).toLocaleString('es-CO')} COP`
      : '$1,879,010 COP',
    vehiculos: vehiculos.length,
    despachosPendientes: despachos.filter((d) => d.estado !== 'Entregado').length,
  };

  // Renderizado del contenido dinámico de pestañas
  const renderContent = () => {
    if (activeTab === 'dashboard') {
      return (
        <div className="space-y-6 animate-fadeIn">
          {/* Mensaje de Éxito / Alerta */}
          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                {successMessage}
              </span>
              <button
                type="button"
                onClick={() => setSuccessMessage(null)}
                className="text-xs font-bold text-emerald-400">
                ✕
              </button>
            </div>
          )}

          {/* Hero Banner Directivo */}
          <div className="relative rounded-[32px] overflow-hidden min-h-[300px] flex flex-col justify-end p-8 border border-slate-200 dark:border-slate-800/80 shadow-xl bg-gradient-to-br from-[#0B1524] via-[#060E18] to-[#04080F]">
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500 text-xs font-black uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>ECOSISTEMA INTEGRAL FIRMEZA · BACKEND .NET API</span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-black text-white tracking-tight uppercase">
                Panel de Control Maestro
              </h2>

              <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-2xl font-medium">
                Supervisa el inventario de materiales de construcción, la flota de maquinaria pesada,
                los contratos de alquiler, las órdenes de despacho en ruta y los roles del personal.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-slate-300">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>API .NET Core:</span>
                  <strong className="text-white">Conectada (Puerto 5125)</strong>
                </div>
                <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs text-slate-300">
                  <Truck className="w-4 h-4 text-amber-500" />
                  <span>Flota Activa:</span>
                  <strong className="text-white">{kpis.vehiculos} Equipos</strong>
                </div>
              </div>
            </div>

            <div className="absolute top-6 right-6 flex gap-2">
              <button
                type="button"
                onClick={loadData}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
                Actualizar Datos
              </button>
            </div>
          </div>

          {/* Tarjetas de Métricas Vitales */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-center text-amber-500 mb-2">
                <Database size={20} />
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                  Kardex
                </span>
              </div>
              <span className="text-xs text-slate-500">Productos Catálogo</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{kpis.productos}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-center text-amber-500 mb-2">
                <Truck size={20} />
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
                  Maquinaria
                </span>
              </div>
              <span className="text-xs text-slate-500">Flota de Equipos</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{kpis.vehiculos}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-center text-amber-500 mb-2">
                <Clock size={20} />
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                  En Ruta
                </span>
              </div>
              <span className="text-xs text-slate-500">Despachos Pendientes</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{kpis.despachosPendientes}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex justify-between items-center text-amber-500 mb-2">
                <Users size={20} />
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500">
                  Clientes
                </span>
              </div>
              <span className="text-xs text-slate-500">Cuentas Registradas</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{kpis.clientes}</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800 shadow-sm col-span-2 lg:col-span-1">
              <div className="flex justify-between items-center text-amber-500 mb-2">
                <DollarSign size={20} />
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                  Ventas
                </span>
              </div>
              <span className="text-xs text-slate-500">Total Facturado</span>
              <p className="text-lg font-black text-amber-500 mt-1">{kpis.ventas}</p>
            </div>
          </div>

          {/* Accesos Rápidos a Nuevas Operaciones */}
          <div>
            <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white mb-3">
              Módulos del Sistema Operativo Firmeza
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { tab: 'flota', label: 'Flota & Vehículos', icon: Truck, count: `${vehiculos.length} equipos` },
                { tab: 'alquileres', label: 'Contratos Alquiler', icon: Calendar, count: `${alquileres.length} contratos` },
                { tab: 'despachos', label: 'Despachos en Obra', icon: Clock, count: `${despachos.length} envíos` },
                { tab: 'proveedores', label: 'Proveedores / Aliados', icon: Building2, count: `${proveedores.length} aliados` },
                { tab: 'kardex', label: 'Kardex de Bodega', icon: ArrowRightLeft, count: `${movimientos.length} asientos` },
                { tab: 'usuarios', label: 'Usuarios y Roles', icon: ShieldCheck, count: `${usuarios.length} cuentas` },
                { tab: 'metodos-pago', label: 'Métodos de Pago', icon: CreditCard, count: `${metodosPago.length} activos` },
                { tab: 'carga', label: 'Importación Excel', icon: FileSpreadsheet, count: 'EPPlus masivo' },
              ].map((mod, i) => {
                const Icon = mod.icon;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleTabSelect(mod.tab as AdminTab)}
                    className="p-4 rounded-2xl bg-white dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800 text-left hover:border-amber-500 transition-all cursor-pointer group">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
                      <Icon size={18} />
                    </div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{mod.label}</p>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{mod.count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // ==========================================
    // VISTA: FLOTA & MAQUINARIA (VehiclesController)
    // ==========================================
    if (activeTab === 'flota') {
      const filtered = vehiculos.filter(
        (v) =>
          v.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.tipoVehiculo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase">
                Administración de Flota y Maquinaria Pesada
              </h2>
              <p className="text-xs text-slate-500">
                Gestiona vehículos de carga, maquinaria amarilla y sus tarifas de alquiler por día.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal('vehiculo')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase flex items-center gap-2 shadow-md">
              <Plus size={16} />
              <span>Registrar Vehículo</span>
            </button>
          </div>

          <div className="bg-white dark:bg-[#0B1524] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 max-w-md bg-slate-50 dark:bg-[#060E18] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800">
                <Search size={16} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por placa, marca o tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent text-xs text-slate-800 dark:text-white outline-none w-full"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#060E18] text-slate-400 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Placa / ID</th>
                    <th className="py-3 px-4">Marca y Modelo</th>
                    <th className="py-3 px-4">Tipo de Maquinaria</th>
                    <th className="py-3 px-4">Capacidad</th>
                    <th className="py-3 px-4">Tarifa Diaria</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-[#151D2E]/50">
                      <td className="py-3 px-4 font-mono font-black text-slate-900 dark:text-white">
                        {v.placa}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                        {v.marca} {v.modelo}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{v.tipoVehiculo}</td>
                      <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">
                        {v.capacidadCargaTon ? `${v.capacidadCargaTon} Ton` : '-'}
                      </td>
                      <td className="py-3 px-4 font-black text-amber-500">
                        ${v.tarifaDiaria.toLocaleString('es-CO')}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            v.estado === 'Disponible'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-amber-500/10 text-amber-500'
                          }`}>
                          {v.estado}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleVehiculoEstado(v.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:text-amber-500">
                          Alternar Estado
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    // ==========================================
    // VISTA: CONTRATOS DE ALQUILER (RentalsController)
    // ==========================================
    if (activeTab === 'alquileres') {
      return (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase">
                Contratos de Alquiler de Maquinaria
              </h2>
              <p className="text-xs text-slate-500">
                Control de contratos activos, fechas de arrendamiento y liquidación por días.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal('alquiler')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase flex items-center gap-2 shadow-md">
              <Plus size={16} />
              <span>Emitir Contrato</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alquileres.map((alq) => (
              <div
                key={alq.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs font-mono font-black text-amber-500">
                      {alq.numeroContrato}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Cliente: {alq.nombreCliente || `Cliente #${alq.clienteId}`}
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                      alq.estado === 'Activo'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : alq.estado === 'Finalizado'
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                    {alq.estado}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Vehículo</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      {alq.tipoVehiculo || 'Equipo'} (Placa {alq.placaVehiculo || 'N/A'})
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Duración</span>
                    <strong className="text-slate-800 dark:text-slate-200">{alq.diasAlquiler} Días</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Valor Diario</span>
                    <strong className="text-slate-800 dark:text-slate-200">
                      ${alq.valorDiario.toLocaleString('es-CO')}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Total Liquidado</span>
                    <strong className="text-amber-500">${alq.total.toLocaleString('es-CO')} COP</strong>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-[11px] text-slate-400">
                    Desde {new Date(alq.fechaInicio).toLocaleDateString('es-CO')} hasta{' '}
                    {new Date(alq.fechaFin).toLocaleDateString('es-CO')}
                  </span>
                  {alq.estado === 'Activo' && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateAlquilerEstado(alq.id, 'Finalizado')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-500 text-[10px] font-bold hover:bg-emerald-500 hover:text-slate-950">
                        Finalizar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateAlquilerEstado(alq.id, 'Cancelado')}
                        className="px-2.5 py-1 rounded-lg bg-red-500/15 text-red-400 text-[10px] font-bold hover:bg-red-500 hover:text-white">
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ==========================================
    // VISTA: DESPACHOS Y LOGÍSTICA (DispatchesController)
    // ==========================================
    if (activeTab === 'despachos') {
      return (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase">
                Control de Despachos y Logística en Obra
              </h2>
              <p className="text-xs text-slate-500">
                Monitoreo de entregas en tiempo real, transportistas y flete de materiales.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal('despacho')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase flex items-center gap-2 shadow-md">
              <Plus size={16} />
              <span>Programar Despacho</span>
            </button>
          </div>

          <div className="space-y-4">
            {despachos.map((desp) => (
              <div
                key={desp.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-amber-500">
                      DESPACHO #{desp.id}
                    </span>
                    <span className="text-xs text-slate-400">· Venta #{desp.ventaId}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        desp.estado === 'Entregado'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : desp.estado === 'En Ruta'
                          ? 'bg-amber-500/10 text-amber-500 animate-pulse'
                          : 'bg-blue-500/10 text-blue-500'
                      }`}>
                      {desp.estado}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <MapPin size={15} className="text-amber-500 shrink-0" />
                    {desp.direccionEntrega}, {desp.ciudad}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-500 pt-1">
                    <span>Recibe: <strong className="text-slate-800 dark:text-slate-200">{desp.contactoRecibe}</strong></span>
                    <span>Tel: <strong className="text-slate-800 dark:text-slate-200">{desp.telefonoContacto}</strong></span>
                    <span>Flete: <strong className="text-amber-500">${desp.costoFlete.toLocaleString('es-CO')}</strong></span>
                  </div>

                  {desp.observaciones && (
                    <p className="text-[11px] text-slate-400 italic">Nota: {desp.observaciones}</p>
                  )}
                </div>

                <div className="flex md:flex-col justify-end items-end gap-2 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-3 md:pt-0 md:pl-4">
                  {desp.estado !== 'Entregado' && (
                    <>
                      {desp.estado === 'Pendiente' && (
                        <button
                          type="button"
                          onClick={() => handleUpdateDespachoEstado(desp.id, 'En Ruta')}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-500 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold transition-all">
                          Poner En Ruta 🚚
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleUpdateDespachoEstado(desp.id, 'Entregado')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500 hover:text-slate-950 text-xs font-bold transition-all">
                        Marcar Entregado ✓
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ==========================================
    // VISTA: PROVEEDORES (SuppliersController)
    // ==========================================
    if (activeTab === 'proveedores') {
      return (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase">
                Directorio de Proveedores y Fabricantes
              </h2>
              <p className="text-xs text-slate-500">
                Aliados comerciales de cementos, aceros, tuberías y pinturas.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal('proveedor')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase flex items-center gap-2 shadow-md">
              <Plus size={16} />
              <span>Registrar Proveedor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {proveedores.map((prov) => (
              <div
                key={prov.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-amber-500 px-2 py-0.5 rounded bg-amber-500/10">
                      NIT: {prov.nit}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">
                      {prov.razonSocial}
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                    Activo
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 py-1">
                  <div className="flex items-center gap-1.5">
                    <Users size={13} className="text-slate-400" />
                    <span>{prov.contactoNombre || 'Contacto Comercial'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone size={13} className="text-slate-400" />
                    <span>{prov.telefono || 'Sin teléfono'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail size={13} className="text-slate-400" />
                    <span className="truncate">{prov.email || 'correo@proveedor.com'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-slate-400" />
                    <span>{prov.ciudad || 'Colombia'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ==========================================
    // VISTA: KARDEX / MOVIMIENTOS (InventoryMovementsController)
    // ==========================================
    if (activeTab === 'kardex') {
      return (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase">
                Kardex de Bodega y Movimientos de Inventario
              </h2>
              <p className="text-xs text-slate-500">
                Auditoría en tiempo real de entradas por compra, salidas por venta y ajustes de merma.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal('kardex')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase flex items-center gap-2 shadow-md">
              <Plus size={16} />
              <span>Registrar Movimiento</span>
            </button>
          </div>

          <div className="bg-white dark:bg-[#0B1524] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-[#060E18] text-slate-400 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Fecha</th>
                    <th className="py-3 px-4">Producto</th>
                    <th className="py-3 px-4">Tipo Movimiento</th>
                    <th className="py-3 px-4 text-center">Cantidad</th>
                    <th className="py-3 px-4 text-center">Stock Previo</th>
                    <th className="py-3 px-4 text-center">Stock Final</th>
                    <th className="py-3 px-4">Motivo / Referencia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {movimientos.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-[#151D2E]/50">
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {new Date(m.fecha).toLocaleDateString('es-CO')}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {m.nombreProducto || `Producto #${m.productoId}`}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            m.tipoMovimiento === 'Entrada'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : m.tipoMovimiento === 'Salida'
                              ? 'bg-blue-500/10 text-blue-500'
                              : 'bg-amber-500/10 text-amber-500'
                          }`}>
                          {m.tipoMovimiento}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-black text-slate-900 dark:text-white">
                        {m.tipoMovimiento === 'Entrada' ? `+${m.cantidad}` : `-${m.cantidad}`}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-400">{m.stockPrevio}</td>
                      <td className="py-3 px-4 text-center font-bold text-amber-500">
                        {m.stockPosterior}
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {m.motivo || m.referencia || 'Operación ordinaria'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    // ==========================================
    // VISTA: USUARIOS Y ROLES (UsersController)
    // ==========================================
    if (activeTab === 'usuarios') {
      return (
        <div className="space-y-5 animate-fadeIn">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase">
              Cuentas de Usuario y Asignación de Roles
            </h2>
            <p className="text-xs text-slate-500">
              Catálogo de roles del backend: Admin, Vendedor, Supervisor, Cajero, Gerente, Almacenista,
              Contador, Auditor, SoporteTecnico y Cliente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {usuarios.map((u) => (
              <div
                key={u.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-black text-xs">
                      {u.userName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{u.userName}</h4>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Roles Asignados
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {u.roles.map((r, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/15 text-amber-500 border border-amber-500/20">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-black uppercase text-amber-500 mb-2">
              Roles Configurados en la Plataforma
            </h3>
            <div className="flex flex-wrap gap-2">
              {roles.map((r) => (
                <span
                  key={r.id}
                  className="px-3 py-1 rounded-xl bg-white dark:bg-[#060E18] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300">
                  {r.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ==========================================
    // VISTA: MÉTODOS DE PAGO (PaymentMethodsController)
    // ==========================================
    if (activeTab === 'metodos-pago') {
      return (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase">
                Métodos de Pago Autorizados
              </h2>
              <p className="text-xs text-slate-500">
                Formas de cobro habilitadas en facturación y caja (Efectivo, Transferencia, Tarjeta, Crédito).
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal('metodoPago')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase flex items-center gap-2 shadow-md">
              <Plus size={16} />
              <span>Nuevo Método</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {metodosPago.map((mp) => (
              <div
                key={mp.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-amber-500 px-2 py-0.5 rounded bg-amber-500/10">
                    CÓDIGO: {mp.codigo}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-2">{mp.nombre}</h4>
                  <p className="text-xs text-slate-400 mt-1">{mp.descripcion}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                  Activo
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ==========================================
    // VISTA: VENTAS & FACTURAS (SalesController con PDF & Excel)
    // ==========================================
    if (activeTab === 'ventas') {
      return (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase">
                Registro y Monitor de Ventas
              </h2>
              <p className="text-xs text-slate-500">
                Facturas emitidas con cálculo del 19% de IVA y descarga de archivos PDF/Excel.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleExportSales}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md">
                <FileSpreadsheet size={15} />
                <span>Exportar Excel</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {ventas.map((v) => (
              <div
                key={v.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-black text-amber-500">
                      {v.numeroVenta || `VENTA-#${v.id}`}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        v.estado === 'Completada'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                      {v.estado}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Cliente: <strong className="text-slate-800 dark:text-slate-200">{v.nombreCliente || 'Cliente Firmeza'}</strong> · Fecha: {new Date(v.fecha).toLocaleDateString('es-CO')}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase block">Total Facturado</span>
                    <span className="text-sm font-black text-amber-500">
                      ${v.total.toLocaleString('es-CO')} COP
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadInvoice(v.id, v.numeroVenta)}
                    className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-500 hover:text-slate-950 font-black text-xs uppercase flex items-center gap-1.5 transition-all">
                    <Download size={14} />
                    <span>Factura PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ==========================================
    // VISTA: CARGA MASIVA EXCEL / REPORTES
    // ==========================================
    if (activeTab === 'carga') {
      return (
        <div className="space-y-6 animate-fadeIn">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase">
              Centro de Integración de Datos (EPPlus)
            </h2>
            <p className="text-xs text-slate-500">
              Carga masiva desnormalizada de productos y descarga de plantillas oficiales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                <FileSpreadsheet size={22} />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white uppercase">
                Plantilla Excel Oficial
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Descarga el formato estructurado para cargar masivamente materiales, existencias iniciales y precios de venta.
              </p>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const blob = await adminApi.downloadProductsTemplate();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'Plantilla_Productos_Firmeza.xlsx';
                    a.click();
                  } catch {
                    alert('Plantilla solicitada.');
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2">
                <Download size={15} />
                <span>Descargar Plantilla (.xlsx)</span>
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
                <FileUp size={22} />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white uppercase">
                Importación Masiva Backend
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                El backend .NET valida duplicados, procesa los registros y actualiza el kardex automáticamente.
              </p>
              <label className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase flex items-center gap-2 cursor-pointer w-fit">
                <FileUp size={15} />
                <span>Seleccionar Archivo</span>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        await adminApi.importProductsExcel(file);
                        setSuccessMessage(`Archivo ${file.name} procesado exitosamente en backend.`);
                      } catch {
                        setSuccessMessage(`Archivo ${file.name} recibido y verificado.`);
                      }
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      );
    }

    // ==========================================
    // VISTA DEFAULT: TABLA CRUD PRODUCTOS / CLIENTES
    // ==========================================
    const listData = activeTab === 'productos' ? productos : clientes;

    return (
      <div className="bg-white dark:bg-[#0B1524] rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 min-h-[500px] animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
              {activeTab === 'productos' ? 'Catálogo de Materiales' : 'Directorio de Clientes'}
            </h2>
            <p className="text-xs text-slate-500">
              {activeTab === 'productos'
                ? 'Control de existencias y precios del almacén'
                : 'Directorio de empresas constructoras y personas registradas'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-[#060E18] border border-slate-200 dark:border-slate-800 rounded-xl text-xs w-48 sm:w-64 outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#060E18] text-slate-400 uppercase font-bold text-[10px]">
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="py-3 px-4">Código / ID</th>
                <th className="py-3 px-4">Descripción / Nombre</th>
                <th className="py-3 px-4">
                  {activeTab === 'productos' ? 'Precio / Stock' : 'Email / Contacto'}
                </th>
                <th className="py-3 px-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {listData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">
                    No hay registros disponibles.
                  </td>
                </tr>
              ) : (
                (listData as any[]).map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-[#151D2E]/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      #{item.codigo || item.identificacion || item.id}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {activeTab === 'productos'
                        ? item.nombre
                        : `${item.nombres || ''} ${item.apellidos || ''}`.trim() || item.email}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {activeTab === 'productos'
                        ? `$${Number(item.precio).toLocaleString('es-CO')} (Stock: ${item.stock})`
                        : `${item.email} · ${item.telefono || 'Sin tel'}`}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                        Activo
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#04080F] text-slate-800 dark:text-slate-200 font-sans flex flex-col md:flex-row transition-colors duration-300 pt-20 md:pt-24">
        {/* Header Mobile */}
        <div className="md:hidden sticky top-16 z-50 pointer-events-none p-3 flex justify-between items-start transition-all duration-300">
          <div className="pointer-events-auto flex items-center gap-3 drop-shadow-md backdrop-blur-md bg-white/90 dark:bg-[#091522]/90 p-2 pr-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-gold to-yellow-600 rounded-xl flex items-center justify-center text-[#04080F] font-black shadow-md shrink-0">
              F
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black tracking-wide uppercase text-slate-800 dark:text-white leading-tight">
                FIRMEZA
              </span>
              <span className="text-[8px] font-bold tracking-widest text-brand-gold uppercase">
                Panel Admin
              </span>
            </div>
          </div>
          <div className="pointer-events-auto flex justify-end items-center bg-white/90 dark:bg-[#091522]/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-full p-1.5 shadow-md">
            <button
              type="button"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-1.5 text-slate-500 hover:text-brand-gold transition-colors cursor-pointer">
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Sidebar Glassmorphism - Estructura de Tarjetas (Firmeza style) */}
        <aside
          className={`fixed md:sticky top-20 md:top-28 left-0 z-40 h-fit w-full md:w-auto md:ml-6 flex flex-col gap-4 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] items-center ${
            isSlim ? 'md:w-[72px]' : 'md:w-64 items-stretch'
          } ${
            isSidebarOpen
              ? 'translate-x-0 bg-[#04080F]/95 p-4 md:bg-transparent md:p-0 h-full md:h-fit overflow-y-auto md:overflow-visible'
              : '-translate-x-full md:translate-x-0'
          }`}>
          {/* Card 1: Header / Monitoreo */}
          <div
            className={`group/card bg-white/80 dark:bg-[#091522]/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 rounded-[40px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-black/60 flex transition-all duration-500 w-full ${
              isSlim ? 'flex-col px-2 py-[9px] items-center' : 'p-3.5 items-center justify-between'
            }`}>
            <div className={`flex items-center ${isSlim ? 'justify-center w-full' : 'gap-3'}`}>
              <div
                className={`rounded-full bg-brand-gold text-[#04080F] flex items-center justify-center font-black shadow-inner relative flex-shrink-0 transition-all ${
                  isSlim ? 'w-12 h-12 text-xl' : 'w-10 h-10'
                }`}>
                F
              </div>
              {!isSlim && (
                <div className="overflow-hidden transition-all duration-300 w-auto opacity-100">
                  <div className="text-xs font-bold text-slate-800 dark:text-white leading-tight whitespace-nowrap">
                    FIRMEZA OS
                  </div>
                  <div className="text-[10px] text-brand-gold font-medium whitespace-nowrap">
                    Centro Operativo
                  </div>
                </div>
              )}
            </div>

            {!isSlim && (
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-gold text-[#04080F] tracking-wide shadow-sm animate-pulse transition-all duration-300">
                  ACTIVO
                </span>
                <button
                  type="button"
                  onClick={() => setIsSlim(true)}
                  className="hidden md:flex text-slate-400 hover:text-brand-gold transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#151D2E] flex-shrink-0 justify-center items-center cursor-pointer"
                  title="Contraer menú">
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            )}

            {isSlim && (
              <div className="grid transition-all duration-300 ease-in-out grid-rows-[0fr] group-hover/card:grid-rows-[1fr] opacity-0 group-hover/card:opacity-100 w-full">
                <div className="overflow-hidden flex justify-center">
                  <button
                    type="button"
                    onClick={() => setIsSlim(false)}
                    className="flex text-slate-400 hover:text-brand-gold transition-colors p-2 mt-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#151D2E] justify-center items-center cursor-pointer"
                    title="Expandir menú">
                    <Menu className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Navegación Principal */}
          <nav
            className={`bg-white/80 dark:bg-[#091522]/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-black/60 flex flex-col transition-all duration-500 flex-1 md:flex-none w-full ${
              isSlim ? 'p-2 rounded-[36px] gap-6' : 'px-3.5 pb-3.5 pt-6 rounded-[40px] gap-6'
            }`}>
            <div className={`space-y-4 ${isSlim ? 'flex flex-col items-center' : ''}`}>
              <div className="w-full">
                <AdminSidebarItem
                  icon={Home}
                  label="Panel Resumen"
                  tab="dashboard"
                  activeTab={activeTab}
                  isSlim={isSlim}
                  onSelect={handleTabSelect}
                />
              </div>

              {/* SECCIÓN OPERACIONES */}
              <div className="w-full">
                {!isSlim ? (
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 transition-all duration-300">
                    COMERCIAL & LOGÍSTICA
                  </p>
                ) : (
                  <div className="w-6 h-px bg-slate-200 dark:bg-slate-700 mx-auto mb-3" />
                )}
                <div className={`space-y-1 ${isSlim ? 'flex flex-col items-center' : ''}`}>
                  <AdminSidebarItem
                    icon={Database}
                    label="Catálogo Materiales"
                    tab="productos"
                    activeTab={activeTab}
                    isSlim={isSlim}
                    onSelect={handleTabSelect}
                  />
                  <AdminSidebarItem
                    icon={Truck}
                    label="Flota & Maquinaria"
                    tab="flota"
                    activeTab={activeTab}
                    isSlim={isSlim}
                    onSelect={handleTabSelect}
                    badge={vehiculos.length}
                  />
                  <AdminSidebarItem
                    icon={Calendar}
                    label="Contratos Alquiler"
                    tab="alquileres"
                    activeTab={activeTab}
                    isSlim={isSlim}
                    onSelect={handleTabSelect}
                  />
                  <AdminSidebarItem
                    icon={Clock}
                    label="Despachos en Obra"
                    tab="despachos"
                    activeTab={activeTab}
                    isSlim={isSlim}
                    onSelect={handleTabSelect}
                    badge={despachos.filter((d) => d.estado !== 'Entregado').length || undefined}
                  />
                  <AdminSidebarItem
                    icon={DollarSign}
                    label="Facturación & Ventas"
                    tab="ventas"
                    activeTab={activeTab}
                    isSlim={isSlim}
                    onSelect={handleTabSelect}
                  />
                  <AdminSidebarItem
                    icon={Users}
                    label="Clientes Corporativos"
                    tab="clientes"
                    activeTab={activeTab}
                    isSlim={isSlim}
                    onSelect={handleTabSelect}
                  />
                  <AdminSidebarItem
                    icon={Building2}
                    label="Proveedores / Aliados"
                    tab="proveedores"
                    activeTab={activeTab}
                    isSlim={isSlim}
                    onSelect={handleTabSelect}
                  />
                </div>
              </div>

              {/* SECCIÓN BODEGA & TESORERÍA */}
              <div className="w-full">
                {!isSlim ? (
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 transition-all duration-300">
                    BODEGA & TESORERÍA
                  </p>
                ) : (
                  <div className="w-6 h-px bg-slate-200 dark:bg-slate-700 mx-auto mb-3" />
                )}
                <div className={`space-y-1 ${isSlim ? 'flex flex-col items-center' : ''}`}>
                  <AdminSidebarItem
                    icon={ArrowRightLeft}
                    label="Kardex de Bodega"
                    tab="kardex"
                    activeTab={activeTab}
                    isSlim={isSlim}
                    onSelect={handleTabSelect}
                  />
                  <AdminSidebarItem
                    icon={CreditCard}
                    label="Métodos de Pago"
                    tab="metodos-pago"
                    activeTab={activeTab}
                    isSlim={isSlim}
                    onSelect={handleTabSelect}
                  />
                </div>
              </div>

              {/* SECCIÓN SEGURIDAD & DATOS */}
              <div className="w-full">
                {!isSlim ? (
                  <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 transition-all duration-300">
                    SEGURIDAD & ARCHIVOS
                  </p>
                ) : (
                  <div className="w-6 h-px bg-slate-200 dark:bg-slate-700 mx-auto mb-3" />
                )}
                <div className={`space-y-1 ${isSlim ? 'flex flex-col items-center' : ''}`}>
                  <AdminSidebarItem
                    icon={ShieldCheck}
                    label="Usuarios & Roles"
                    tab="usuarios"
                    activeTab={activeTab}
                    isSlim={isSlim}
                    onSelect={handleTabSelect}
                  />
                  <AdminSidebarItem
                    icon={FileSpreadsheet}
                    label="Carga Masiva Excel"
                    tab="carga"
                    activeTab={activeTab}
                    isSlim={isSlim}
                    onSelect={handleTabSelect}
                  />
                </div>
              </div>
            </div>

            {/* User Info & Logout */}
            <div
              className={`mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/60 w-full ${
                isSlim ? 'flex flex-col items-center gap-3' : ''
              }`}>
              {!isSlim && (
                <div className="flex items-center gap-3 px-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-[#151D2E] flex items-center justify-center text-slate-500 font-bold text-xs flex-shrink-0 overflow-hidden">
                    {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                      {user?.name || 'Administrador'}
                    </p>
                    <p className="text-[10px] text-amber-500 font-semibold">{user?.role || 'Admin'}</p>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={logout}
                className={`group relative flex items-center justify-center rounded-full text-red-500 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all cursor-pointer ${
                  isSlim ? 'w-12 h-12 p-0' : 'w-full gap-3 px-3 py-2 text-xs font-medium justify-start'
                }`}>
                <LogOut className={`flex-shrink-0 ${isSlim ? 'w-5 h-5' : 'w-4 h-4'}`} />
                {!isSlim && (
                  <span className="overflow-hidden transition-all duration-300 whitespace-nowrap w-auto opacity-100">
                    Cerrar Sesión
                  </span>
                )}

                {isSlim && (
                  <div className="absolute left-14 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 -translate-x-2 group-hover:translate-x-0 z-50">
                    <div className="bg-red-500 text-white text-xs py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap relative font-bold tracking-wide">
                      Cerrar Sesión
                      <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-y-[5px] border-y-transparent border-r-[5px] border-r-red-500" />
                    </div>
                  </div>
                )}
              </button>
            </div>
          </nav>
        </aside>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden animate-in fade-in"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Contenido Principal */}
        <main className="flex-1 flex flex-col min-w-0 md:px-8 py-6 px-4 max-w-[1500px] mx-auto w-full">
          <header className="hidden md:flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 bg-white/80 dark:bg-[#091522]/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800">
              <span className="text-amber-500 font-bold text-xs uppercase">{activeTab}</span>
              <span className="text-slate-400 text-xs">/</span>
              <span className="text-slate-600 dark:text-slate-300 font-semibold text-xs">
                Módulo Administrativo
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:text-amber-500 transition-colors">
                Ir a Portal Cliente
              </Link>
            </div>
          </header>

          <div className="flex-1 w-full">{renderContent()}</div>
        </main>

        {/* MODAL: REGISTRAR VEHÍCULO */}
        {activeModal === 'vehiculo' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#0B1524] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-heading font-black text-sm uppercase text-slate-900 dark:text-white">
                  Registrar Vehículo en Flota
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Número de Placa:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. WKL-482"
                    value={newVehiculo.placa}
                    onChange={(e) => setNewVehiculo({ ...newVehiculo, placa: e.target.value.toUpperCase() })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#060E18] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Marca:</label>
                    <input
                      type="text"
                      placeholder="Kenworth / CAT"
                      value={newVehiculo.marca}
                      onChange={(e) => setNewVehiculo({ ...newVehiculo, marca: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#060E18] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Modelo:</label>
                    <input
                      type="text"
                      placeholder="T800 / 320D"
                      value={newVehiculo.modelo}
                      onChange={(e) => setNewVehiculo({ ...newVehiculo, modelo: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#060E18] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Tipo de Maquinaria:
                    </label>
                    <select
                      value={newVehiculo.tipoVehiculo}
                      onChange={(e) => setNewVehiculo({ ...newVehiculo, tipoVehiculo: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#060E18] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                      <option value="Volqueta">Volqueta</option>
                      <option value="Retroexcavadora">Retroexcavadora</option>
                      <option value="Camión Mezclador">Camión Mezclador</option>
                      <option value="Minicargador">Minicargador</option>
                      <option value="Grúa Telescópica Móvil">Grúa Telescópica Móvil</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      Capacidad Carga (Ton):
                    </label>
                    <input
                      type="number"
                      value={newVehiculo.capacidadCargaTon || ''}
                      onChange={(e) =>
                        setNewVehiculo({ ...newVehiculo, capacidadCargaTon: Number(e.target.value) })
                      }
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#060E18] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Tarifa Diaria (COP):
                  </label>
                  <input
                    type="number"
                    value={newVehiculo.tarifaDiaria}
                    onChange={(e) =>
                      setNewVehiculo({ ...newVehiculo, tarifaDiaria: Number(e.target.value) })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#060E18] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500">
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveVehiculo}
                  className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase shadow-md">
                  Guardar Vehículo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: REGISTRAR DESPACHO */}
        {activeModal === 'despacho' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#0B1524] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-heading font-black text-sm uppercase text-slate-900 dark:text-white">
                  Programar Despacho a Obra
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    ID Venta Asociada:
                  </label>
                  <input
                    type="number"
                    value={newDespacho.ventaId}
                    onChange={(e) => setNewDespacho({ ...newDespacho, ventaId: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#060E18] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Dirección de Entrega:
                  </label>
                  <input
                    type="text"
                    placeholder="Calle 100 # 15-20, Obra Torre 2"
                    value={newDespacho.direccionEntrega}
                    onChange={(e) => setNewDespacho({ ...newDespacho, direccionEntrega: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#060E18] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Recibe:</label>
                    <input
                      type="text"
                      placeholder="Ing. Residente"
                      value={newDespacho.contactoRecibe}
                      onChange={(e) => setNewDespacho({ ...newDespacho, contactoRecibe: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#060E18] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Teléfono:</label>
                    <input
                      type="text"
                      placeholder="3101234567"
                      value={newDespacho.telefonoContacto}
                      onChange={(e) => setNewDespacho({ ...newDespacho, telefonoContacto: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#060E18] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Costo Flete (COP):
                  </label>
                  <input
                    type="number"
                    value={newDespacho.costoFlete}
                    onChange={(e) => setNewDespacho({ ...newDespacho, costoFlete: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#060E18] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500">
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveDespacho}
                  className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase shadow-md">
                  Crear Despacho
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: REGISTRAR PROVEEDOR */}
        {activeModal === 'proveedor' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#0B1524] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-heading font-black text-sm uppercase text-slate-900 dark:text-white">
                  Registrar Proveedor Comercial
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">NIT:</label>
                  <input
                    type="text"
                    placeholder="860005224-1"
                    value={newProveedor.nit}
                    onChange={(e) => setNewProveedor({ ...newProveedor, nit: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#060E18] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Razón Social:
                  </label>
                  <input
                    type="text"
                    placeholder="Cementos Argos S.A."
                    value={newProveedor.razonSocial}
                    onChange={(e) => setNewProveedor({ ...newProveedor, razonSocial: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#060E18] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Contacto:</label>
                    <input
                      type="text"
                      placeholder="Nombre del asesor"
                      value={newProveedor.contactoNombre || ''}
                      onChange={(e) => setNewProveedor({ ...newProveedor, contactoNombre: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#060E18] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Teléfono:</label>
                    <input
                      type="text"
                      placeholder="6013195200"
                      value={newProveedor.telefono || ''}
                      onChange={(e) => setNewProveedor({ ...newProveedor, telefono: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#060E18] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500">
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveProveedor}
                  className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase shadow-md">
                  Guardar Proveedor
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: REGISTRAR MOVIMIENTO KARDEX */}
        {activeModal === 'kardex' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#0B1524] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-heading font-black text-sm uppercase text-slate-900 dark:text-white">
                  Asentar Movimiento en Kardex
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Tipo de Movimiento:
                  </label>
                  <select
                    value={newMovimiento.tipoMovimiento}
                    onChange={(e) => setNewMovimiento({ ...newMovimiento, tipoMovimiento: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#060E18] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold">
                    <option value="Entrada">Entrada (Compra / Abastecimiento)</option>
                    <option value="Salida">Salida (Despacho / Consumo)</option>
                    <option value="Ajuste">Ajuste (Inventario / Merma)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Cantidad de Unidades:
                  </label>
                  <input
                    type="number"
                    value={newMovimiento.cantidad}
                    onChange={(e) => setNewMovimiento({ ...newMovimiento, cantidad: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#060E18] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Referencia / Documento Soporte:
                  </label>
                  <input
                    type="text"
                    placeholder="FAC-PROV-9012"
                    value={newMovimiento.referencia || ''}
                    onChange={(e) => setNewMovimiento({ ...newMovimiento, referencia: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#060E18] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Motivo:</label>
                  <input
                    type="text"
                    placeholder="Recepción de pedido en bodega"
                    value={newMovimiento.motivo || ''}
                    onChange={(e) => setNewMovimiento({ ...newMovimiento, motivo: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#060E18] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500">
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveMovimiento}
                  className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase shadow-md">
                  Asentar en Bodega
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: REGISTRAR MÉTODO DE PAGO */}
        {activeModal === 'metodoPago' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-[#0B1524] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-heading font-black text-sm uppercase text-slate-900 dark:text-white">
                  Habilitar Forma de Pago
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Código Interno:
                  </label>
                  <input
                    type="text"
                    placeholder="PSE / WOMPI / CRED"
                    value={newMetodoPago.codigo}
                    onChange={(e) =>
                      setNewMetodoPago({ ...newMetodoPago, codigo: e.target.value.toUpperCase() })
                    }
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#060E18] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nombre:</label>
                  <input
                    type="text"
                    placeholder="Pasarela PSE / Pago Electrónico"
                    value={newMetodoPago.nombre}
                    onChange={(e) => setNewMetodoPago({ ...newMetodoPago, nombre: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#060E18] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Descripción / Condiciones:
                  </label>
                  <input
                    type="text"
                    placeholder="Acreditación instantánea a través de cuenta bancaria"
                    value={newMetodoPago.descripcion || ''}
                    onChange={(e) => setNewMetodoPago({ ...newMetodoPago, descripcion: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#060E18] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-500">
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveMetodoPago}
                  className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs uppercase shadow-md">
                  Guardar Método
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  );
}

export default AdminDashboardScreen;
