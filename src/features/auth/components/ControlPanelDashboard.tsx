import { useState, useEffect } from 'react';
import {
  ShieldAlert,
  LogOut,
  CheckCircle2,
  Server,
  TrendingUp,
  Truck,
  Users,
  FileSpreadsheet,
  FileUp,
  Activity,
  Hammer,
  LayoutDashboard,
  ShoppingCart,
  Settings,
  Menu,
  X,
  ChevronLeft,
  Package,
  Calendar,
  FileText,
  Download,
  MapPin,
  Clock,
  Eye,
  Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { commercialApi, DEMO_VEHICULOS, DEMO_ALQUILERES, DEMO_DESPACHOS } from '@/features/commercial/services/commercialApi';
import { adminApi, DEMO_VENTAS, DEMO_PRODUCTOS, type Venta, type Producto } from '@/features/admin/services/adminApi';
import type { Vehiculo, Alquiler, Despacho } from '@/features/commercial/types/commercial.types';

interface User {
  id: string | number;
  name?: string;
  email: string;
  role?: string;
}

interface ControlPanelDashboardProps {
  user: User;
  logout: () => void;
}

type TabType = 'dashboard' | 'materiales' | 'flota' | 'despachos' | 'ventas';

interface SidebarItemProps {
  icon: any;
  label: string;
  tab: TabType;
  activeTab: TabType;
  isSlim: boolean;
  onSelect: (tab: TabType) => void;
  badge?: number | string;
}

function SidebarItem({ icon: Icon, label, tab, activeTab, isSlim, onSelect, badge }: SidebarItemProps) {
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

      {!isSlim && badge && (
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

export function ControlPanelDashboard({ user, logout }: ControlPanelDashboardProps) {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSlim, setIsSlim] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Datos reales / de contingencia para las vistas
  const [ventas, setVentas] = useState<Venta[]>(DEMO_VENTAS);
  const [despachos, setDespachos] = useState<Despacho[]>(DEMO_DESPACHOS);
  const [alquileres, setAlquileres] = useState<Alquiler[]>(DEMO_ALQUILERES);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>(DEMO_VEHICULOS);
  const [productos, setProductos] = useState<Producto[]>(DEMO_PRODUCTOS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const [vts, desps, alqs, vehs, prods] = await Promise.all([
          adminApi.getVentas().catch(() => DEMO_VENTAS),
          commercialApi.getDespachos().catch(() => DEMO_DESPACHOS),
          commercialApi.getAlquileres().catch(() => DEMO_ALQUILERES),
          commercialApi.getVehiculos().catch(() => DEMO_VEHICULOS),
          adminApi.getProductos().catch(() => DEMO_PRODUCTOS),
        ]);
        setVentas(vts);
        setDespachos(desps);
        setAlquileres(alqs);
        setVehiculos(vehs);
        setProductos(prods);
      } catch (e) {
        console.error('Error cargando datos del portal de usuario:', e);
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  const handleTabSelect = (tab: TabType) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const handleDownloadInvoice = async (ventaId: number, numeroVenta?: string) => {
    await commercialApi.downloadFacturaPdf(ventaId, numeroVenta);
  };

  const activeRentalsCount = alquileres.filter((a) => a.estado === 'Activo').length;
  const inRouteDispatchesCount = despachos.filter((d) => d.estado === 'En Ruta' || d.estado === 'Pendiente').length;

  return (
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
              Panel Control
            </span>
          </div>
        </div>
        <div className="pointer-events-auto flex justify-end items-center bg-white/90 dark:bg-[#091522]/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-full p-1.5 shadow-md transition-all">
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
                  Panel de Control
                </div>
              </div>
            )}
          </div>

          {!isSlim && (
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-brand-gold text-[#04080F] tracking-wide shadow-sm animate-pulse transition-all duration-300">
                ONLINE
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
              <SidebarItem
                icon={LayoutDashboard}
                label="Centro Operativo"
                tab="dashboard"
                activeTab={activeTab}
                isSlim={isSlim}
                onSelect={handleTabSelect}
              />
            </div>

            <div className="w-full">
              {!isSlim ? (
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 transition-all duration-300">
                  MÓDULOS
                </p>
              ) : (
                <div className="w-6 h-px bg-slate-200 dark:bg-slate-700 mx-auto mb-3" />
              )}
              <div className={`space-y-1 ${isSlim ? 'flex flex-col items-center' : ''}`}>
                <SidebarItem
                  icon={Hammer}
                  label="Materiales"
                  tab="materiales"
                  activeTab={activeTab}
                  isSlim={isSlim}
                  onSelect={handleTabSelect}
                />
                <SidebarItem
                  icon={Truck}
                  label="Flota y Maquinaria"
                  tab="flota"
                  activeTab={activeTab}
                  isSlim={isSlim}
                  onSelect={handleTabSelect}
                  badge={activeRentalsCount > 0 ? `${activeRentalsCount}` : undefined}
                />
                <SidebarItem
                  icon={Clock}
                  label="Despachos en Obra"
                  tab="despachos"
                  activeTab={activeTab}
                  isSlim={isSlim}
                  onSelect={handleTabSelect}
                  badge={inRouteDispatchesCount > 0 ? `${inRouteDispatchesCount}` : undefined}
                />
                <SidebarItem
                  icon={ShoppingCart}
                  label="Ventas y Facturas"
                  tab="ventas"
                  activeTab={activeTab}
                  isSlim={isSlim}
                  onSelect={handleTabSelect}
                />
              </div>
            </div>

            <div className="w-full">
              {!isSlim ? (
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 transition-all duration-300">
                  CONFIGURACIÓN
                </p>
              ) : (
                <div className="w-6 h-px bg-slate-200 dark:bg-slate-700 mx-auto mb-3" />
              )}
              <div className={`space-y-1 ${isSlim ? 'flex flex-col items-center' : ''}`}>
                <button
                  type="button"
                  className={`relative group flex items-center rounded-full transition-all duration-300 font-medium text-slate-600 dark:text-slate-400 hover:text-brand-gold hover:bg-slate-100 dark:hover:bg-[#151D2E] md:hover:translate-x-1 cursor-pointer ${
                    isSlim ? 'w-12 h-12 justify-center p-0 mx-auto' : 'w-full px-3 py-2 gap-3 text-xs'
                  }`}>
                  <Settings className={`flex-shrink-0 text-slate-400 ${isSlim ? 'w-5 h-5' : 'w-4 h-4'}`} />
                  {!isSlim && (
                    <span className="truncate whitespace-nowrap overflow-hidden transition-all duration-300 w-auto opacity-100">
                      Configuración
                    </span>
                  )}
                </button>

                {(user.role === 'Admin' ||
                  user.role === 'Supervisor' ||
                  user.role === 'Gerente' ||
                  user.role === 'Contador') && (
                  <button
                    type="button"
                    onClick={() => navigate('/admin')}
                    className={`relative group flex items-center rounded-full transition-all duration-300 font-bold text-amber-600 dark:text-amber-500 hover:text-brand-gold hover:bg-amber-50 dark:hover:bg-amber-900/30 md:hover:translate-x-1 mt-2 cursor-pointer ${
                      isSlim ? 'w-12 h-12 justify-center p-0 mx-auto' : 'w-full px-3 py-2 gap-3 text-xs'
                    }`}>
                    <ShieldAlert className={`flex-shrink-0 text-amber-500 ${isSlim ? 'w-5 h-5' : 'w-4 h-4'}`} />
                    {!isSlim && (
                      <span className="truncate whitespace-nowrap overflow-hidden transition-all duration-300 w-auto opacity-100">
                        Panel de Administración
                      </span>
                    )}
                  </button>
                )}
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
                  {user?.name
                    ? user.name.slice(0, 2).toUpperCase()
                    : user?.email?.slice(0, 2).toUpperCase() || 'US'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                    {user?.name || user?.email}
                  </p>
                  <p className="text-[10px] text-emerald-500 font-semibold">{user?.role || 'Cliente Firmeza'}</p>
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

      {/* Mobile Overlay Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 md:hidden animate-in fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 md:px-8 py-6 px-4 max-w-[1400px] mx-auto w-full">
        {/* PESTAÑA 1: DASHBOARD RESUMEN */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-500 tracking-wider uppercase">
                  CENTRO OPERATIVO CLIENTE
                </span>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Hola, {user.name || user.email}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Gestiona tus pedidos de materiales, alquiler de maquinaria y haz seguimiento en tiempo real a tus entregas.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/explore')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center gap-2">
                  <Package size={14} />
                  <span>Explorar Todo el Catálogo</span>
                </button>
              </div>
            </div>

            {/* KPIs Principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-amber-500 mb-2">
                  <ShoppingCart size={22} />
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                    Historial
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">Total Compras</span>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{ventas.length}</p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-amber-500 mb-2">
                  <Truck size={22} />
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
                    Contratos
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">Alquileres Activos</span>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{activeRentalsCount}</p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-amber-500 mb-2">
                  <Clock size={22} />
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                    En Proceso
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">Despachos en Ruta</span>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{inRouteDispatchesCount}</p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-amber-500 mb-2">
                  <CheckCircle2 size={22} />
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                    Online
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">Backend API</span>
                <p className="text-lg font-black text-emerald-500 mt-1">Conectado</p>
              </div>
            </div>

            {/* Accesos Directos a Operaciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Despacho Reciente en Ruta */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-black text-sm uppercase text-slate-900 dark:text-white flex items-center gap-2">
                    <Truck size={16} className="text-amber-500" />
                    Último Despacho a Obra
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('despachos')}
                    className="text-xs text-amber-500 font-bold hover:underline">
                    Ver todos
                  </button>
                </div>

                {despachos.length > 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#060E18] border border-slate-200/60 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Venta #{despachos[0].ventaId}
                      </span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500">
                        {despachos[0].estado}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <MapPin size={13} className="text-amber-500 shrink-0" />
                      {despachos[0].direccionEntrega}, {despachos[0].ciudad}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Contacto: {despachos[0].contactoRecibe} ({despachos[0].telefonoContacto})
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No hay despachos registrados recientemente.</p>
                )}
              </div>

              {/* Maquinaria en Alquiler */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-black text-sm uppercase text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar size={16} className="text-amber-500" />
                    Contrato de Maquinaria
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('flota')}
                    className="text-xs text-amber-500 font-bold hover:underline">
                    Ver flota
                  </button>
                </div>

                {alquileres.length > 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#060E18] border border-slate-200/60 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {alquileres[0].numeroContrato}
                      </span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                        {alquileres[0].estado}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Equipo: <strong className="text-slate-800 dark:text-white">{alquileres[0].tipoVehiculo || 'Retroexcavadora'}</strong> (Placa {alquileres[0].placaVehiculo || 'STR-914'})
                    </p>
                    <p className="text-xs font-black text-amber-500">
                      Total Contrato: ${alquileres[0].total.toLocaleString('es-CO')} COP ({alquileres[0].diasAlquiler} días)
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No cuentas con maquinaria en alquiler actualmente.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: CATÁLOGO Y PEDIDO RÁPIDO */}
        {activeTab === 'materiales' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase">
                  Catálogo de Materiales
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Existencias disponibles para suministro inmediato en tus proyectos.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/explore')}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs">
                Ir a Cotizador Completo
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {productos.map((prod) => (
                <div
                  key={prod.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-mono font-bold text-amber-500 px-2 py-0.5 rounded bg-amber-500/10">
                        {prod.codigo}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-500">Stock: {prod.stock}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {prod.nombre}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{prod.descripcion}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-sm font-black text-amber-500">
                      ${prod.precio.toLocaleString('es-CO')} COP
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate('/explore')}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-500 hover:bg-amber-500 hover:text-slate-950 text-xs font-bold transition-all">
                      Cotizar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PESTAÑA 3: FLOTA & ALQUILERES */}
        {activeTab === 'flota' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase">
                Mis Alquileres de Maquinaria Pesada
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Consulta los contratos vigentes de equipos, volquetas y maquinaria pesada para tus obras.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alquileres.map((alq) => (
                <div
                  key={alq.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs font-black text-amber-500">{alq.numeroContrato}</span>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        {alq.tipoVehiculo || 'Maquinaria de Construcción'}
                      </h4>
                    </div>
                    <span
                      className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                        alq.estado === 'Activo'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-slate-500/15 text-slate-400'
                      }`}>
                      {alq.estado}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Placa del Equipo</span>
                      <strong className="text-slate-800 dark:text-slate-200">{alq.placaVehiculo || 'N/A'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Duración</span>
                      <strong className="text-slate-800 dark:text-slate-200">{alq.diasAlquiler} Días</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Tarifa por Día</span>
                      <strong className="text-slate-800 dark:text-slate-200">${alq.valorDiario.toLocaleString('es-CO')}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Total Liquidado</span>
                      <strong className="text-amber-500">${alq.total.toLocaleString('es-CO')} COP</strong>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Vigencia: {new Date(alq.fechaInicio).toLocaleDateString('es-CO')} hasta {new Date(alq.fechaFin).toLocaleDateString('es-CO')}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Catálogo de Flota Disponible */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-black uppercase text-slate-900 dark:text-white mb-3">
                Equipos Disponibles en Flota Firmeza
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {vehiculos.map((v) => (
                  <div
                    key={v.id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {v.marca} {v.modelo}
                      </p>
                      <p className="text-[10px] text-slate-400">Placa: {v.placa} · {v.tipoVehiculo}</p>
                      <p className="text-xs font-black text-amber-500 mt-1">
                        ${v.tarifaDiaria.toLocaleString('es-CO')}/día
                      </p>
                    </div>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        v.estado === 'Disponible' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                      }`}>
                      {v.estado}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 4: DESPACHOS Y RASTREO EN OBRA */}
        {activeTab === 'despachos' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase">
                Rastreo de Despachos y Entregas en Obra
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Monitorea el avance de las órdenes de despacho vinculadas a tus facturas y compras.
              </p>
            </div>

            <div className="space-y-4">
              {despachos.map((desp) => (
                <div
                  key={desp.id}
                  className="p-6 rounded-2xl bg-white dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-black text-amber-500">
                          DESPACHO #{desp.id}
                        </span>
                        <span className="text-xs text-slate-400">· Venta #{desp.ventaId}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                        Destino: {desp.direccionEntrega}, {desp.ciudad}
                      </h4>
                    </div>

                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full self-start sm:self-auto ${
                        desp.estado === 'Entregado'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : desp.estado === 'En Ruta'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse'
                          : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                      }`}>
                      {desp.estado}
                    </span>
                  </div>

                  {/* Stepper Visual de Estado */}
                  <div className="py-2">
                    <div className="flex items-center justify-between max-w-md mx-auto relative">
                      <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 dark:bg-slate-800 z-0" />
                      
                      <div className="flex flex-col items-center gap-1 z-10 bg-white dark:bg-[#0B1524] px-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-sm">
                          ✓
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">Pendiente</span>
                      </div>

                      <div className="flex flex-col items-center gap-1 z-10 bg-white dark:bg-[#0B1524] px-2">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                            desp.estado === 'En Ruta' || desp.estado === 'Entregado'
                              ? 'bg-amber-500 text-slate-950 shadow-sm'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                          }`}>
                          🚚
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">En Ruta</span>
                      </div>

                      <div className="flex flex-col items-center gap-1 z-10 bg-white dark:bg-[#0B1524] px-2">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                            desp.estado === 'Entregado'
                              ? 'bg-emerald-500 text-slate-950 shadow-sm'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                          }`}>
                          ✓
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">Entregado</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#060E18] text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] block">Contacto en Obra:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{desp.contactoRecibe}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Teléfono:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{desp.telefonoContacto}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Costo Flete:</span>
                      <strong className="text-amber-500">${desp.costoFlete.toLocaleString('es-CO')} COP</strong>
                    </div>
                  </div>

                  {desp.observaciones && (
                    <p className="text-[11px] text-slate-400 italic">
                      Nota de despacho: {desp.observaciones}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PESTAÑA 5: VENTAS Y FACTURACIÓN CON DESCARGA PDF */}
        {activeTab === 'ventas' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase">
                  Historial de Facturación & Compras
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Descarga tus facturas oficiales con IVA (19%) en formato PDF.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {ventas.map((v) => (
                <div
                  key={v.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-amber-500">
                        {v.numeroVenta || `FACTURA-2026-${v.id}`}
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
                      Fecha de Emisión: {new Date(v.fecha).toLocaleDateString('es-CO')} · {new Date(v.fecha).toLocaleTimeString('es-CO')}
                    </p>
                    <p className="text-xs text-slate-400">
                      Comprador: <strong className="text-slate-700 dark:text-slate-200">{v.nombreCliente || user.name || 'Cliente Registrado'}</strong>
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase block">Total con IVA</span>
                      <span className="text-base font-black text-amber-500">
                        ${v.total.toLocaleString('es-CO')} COP
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownloadInvoice(v.id, v.numeroVenta)}
                      className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer">
                      <Download size={14} />
                      <span>Descargar PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ControlPanelDashboard;
