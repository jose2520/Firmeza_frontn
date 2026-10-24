import { useState, useEffect } from 'react';
import {
  Search,
  Package,
  Truck,
  Layers,
  Wrench,
  CheckCircle2,
  Calendar,
  Clock,
  Plus,
  Minus,
  Trash2,
  X,
  CreditCard,
  Building2,
  MapPin,
  Phone,
  User,
  Fuel,
  Weight,
  DollarSign,
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { commercialApi, DEMO_VEHICULOS } from '@/features/commercial/services/commercialApi';
import { adminApi, DEMO_PRODUCTOS, type Producto } from '@/features/admin/services/adminApi';
import type { Vehiculo } from '@/features/commercial/types/commercial.types';

type ExploreTab = 'materiales' | 'maquinaria';

interface CartItem {
  producto: Producto;
  cantidad: number;
}

export function ExplorePage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<ExploreTab>('materiales');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Estados de datos
  const [productos, setProductos] = useState<Producto[]>(DEMO_PRODUCTOS);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>(DEMO_VEHICULOS);
  const [loading, setLoading] = useState(false);

  // Carrito de compras / cotización
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  // Modal para solicitar alquiler de maquinaria
  const [selectedVehicle, setSelectedVehicle] = useState<Vehiculo | null>(null);
  const [rentalDays, setRentalDays] = useState(3);
  const [rentalSuccess, setRentalSuccess] = useState<string | null>(null);

  // Formulario de despacho / orden
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [contactName, setContactName] = useState(user?.name || '');
  const [contactPhone, setContactPhone] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [prods, vehs] = await Promise.all([
          adminApi.getProductos().catch(() => DEMO_PRODUCTOS),
          commercialApi.getVehiculos().catch(() => DEMO_VEHICULOS),
        ]);
        setProductos(prods);
        setVehiculos(vehs);
      } catch (err) {
        console.error('Error cargando catálogo:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cardBg = isDark ? '#091522' : '#FFFFFF';
  const cardBorder = isDark ? '#1E293B' : '#E2E8F0';
  const textColor = isDark ? '#FFFFFF' : '#091522';
  const textSubColor = isDark ? '#94A3B8' : '#64748B';

  // Filtrado de materiales
  const filteredProducts = productos.filter((p) => {
    const matchesSearch =
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Filtrado de maquinaria
  const filteredVehicles = vehiculos.filter((v) => {
    const term = searchTerm.toLowerCase();
    return (
      v.placa.toLowerCase().includes(term) ||
      v.marca.toLowerCase().includes(term) ||
      v.modelo.toLowerCase().includes(term) ||
      v.tipoVehiculo.toLowerCase().includes(term)
    );
  });

  const addToCart = (prod: Producto) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.producto.id === prod.id);
      if (existing) {
        return prev.map((item) =>
          item.producto.id === prod.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { producto: prod, cantidad: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateCartQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.producto.id === id) {
            const newQty = item.cantidad + delta;
            return newQty > 0 ? { ...item, cantidad: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.producto.id !== id));
  };

  const cartSubtotal = cart.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);
  const cartIva = cartSubtotal * 0.19;
  const cartTotal = cartSubtotal + cartIva;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const orderNum = `ORD-${Date.now().toString().slice(-6)}`;
    setOrderSuccess(orderNum);
    setCart([]);
  };

  const handleConfirmRental = () => {
    if (!selectedVehicle) return;
    const rentalNum = `ALQ-CONTRATO-${Date.now().toString().slice(-6)}`;
    setRentalSuccess(rentalNum);
    setSelectedVehicle(null);
  };

  return (
    <div
      style={{ backgroundColor: isDark ? '#060E18' : '#F8FAFC' }}
      className="flex-1 min-h-screen pt-28 pb-16 px-4 sm:px-6 transition-colors">
      <div className="max-w-[1240px] mx-auto w-full">
        {/* Header Principal */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-brand-gold font-heading font-extrabold text-xs tracking-widest uppercase mb-1 block">
              FIRMEZA · OPERACIONES Y CATÁLOGO INTEGRADO
            </span>
            <h1
              style={{ color: textColor }}
              className="font-heading font-black text-2xl sm:text-4xl uppercase tracking-tight">
              CATÁLOGO & MAQUINARIA
            </h1>
            <p style={{ color: textSubColor }} className="font-sans text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Consulta inventario en tiempo real, adquiere materiales de construcción con despacho directo a obra y
              gestiona alquiler de maquinaria pesada.
            </p>
          </div>

          {/* Toggle de Pestaña Principal */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-200/60 dark:bg-[#0B1524] border border-slate-300/40 dark:border-slate-800 shrink-0 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('materiales')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'materiales'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}>
              <Package size={15} />
              Materiales ({productos.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('maquinaria')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'maquinaria'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}>
              <Truck size={15} />
              Flota y Maquinaria ({vehiculos.length})
            </button>
          </div>
        </div>

        {/* Notificaciones de éxito de compra o alquiler */}
        {orderSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={24} className="text-emerald-400 shrink-0" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  ¡Pedido {orderSuccess} registrado con éxito!
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  La orden ha sido programada. Puedes rastrear el despacho en tu Panel de Control.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOrderSuccess(null)}
              className="text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-xl font-bold">
              Cerrar
            </button>
          </div>
        )}

        {rentalSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={24} className="text-amber-400 shrink-0" />
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  ¡Solicitud de Alquiler {rentalSuccess} confirmada!
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  El equipo ha quedado reservado y se generó el contrato en estado Activo.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRentalSuccess(null)}
              className="text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-3 py-1.5 rounded-xl font-bold">
              Cerrar
            </button>
          </div>
        )}

        {/* Buscador & Acceso rápido a Cotización */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <div
            style={{ backgroundColor: cardBg, borderColor: cardBorder }}
            className="flex-1 w-full flex items-center border rounded-2xl px-4 py-3 shadow-sm">
            <Search size={18} className="text-amber-500 shrink-0" strokeWidth={2.2} />
            <input
              type="text"
              placeholder={
                activeTab === 'materiales'
                  ? 'Buscar cemento, acero, tubería, varilla por código o nombre...'
                  : 'Buscar volqueta, retroexcavadora, grúa, mixer o placa...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ color: textColor }}
              className="flex-1 ml-3 font-sans text-sm outline-none bg-transparent placeholder-slate-400 dark:placeholder-slate-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={16} />
              </button>
            )}
          </div>

          {activeTab === 'materiales' && (
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold text-xs flex items-center gap-2.5 shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer w-full sm:w-auto justify-center">
              <Package size={16} />
              <span>Mi Cotización / Pedido</span>
              {cart.length > 0 && (
                <span className="bg-slate-950 text-amber-400 font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.reduce((a, b) => a + b.cantidad, 0)}
                </span>
              )}
            </button>
          )}
        </div>

        {/* SECCIÓN 1: CATÁLOGO DE MATERIALES */}
        {activeTab === 'materiales' && (
          <div>
            {loading ? (
              <div className="py-20 text-center text-slate-400 font-bold">Cargando inventario de obra...</div>
            ) : filteredProducts.length === 0 ? (
              <div
                style={{ backgroundColor: cardBg, borderColor: cardBorder }}
                className="p-12 text-center rounded-3xl border">
                <Package size={48} className="mx-auto text-slate-400 mb-3 opacity-60" />
                <h3 style={{ color: textColor }} className="text-base font-bold">
                  No se encontraron materiales
                </h3>
                <p style={{ color: textSubColor }} className="text-xs mt-1">
                  Intenta buscar con otro término o consulta todo el catálogo.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    style={{ backgroundColor: cardBg, borderColor: cardBorder }}
                    className="p-5 rounded-2xl border shadow-sm hover:border-amber-500/40 hover:shadow-md transition-all flex flex-col justify-between group">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-[11px] font-extrabold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-500 dark:text-amber-400">
                          {p.codigo}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            p.stock > 10
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-red-500/10 text-red-500'
                          }`}>
                          Stock: {p.stock} unid.
                        </span>
                      </div>
                      <h3
                        style={{ color: textColor }}
                        className="font-heading font-black text-sm uppercase leading-snug group-hover:text-amber-500 transition-colors">
                        {p.nombre}
                      </h3>
                      <p style={{ color: textSubColor }} className="text-xs font-sans mt-2 line-clamp-2 leading-relaxed">
                        {p.descripcion || 'Material de construcción con certificación de calidad garantizada.'}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span style={{ color: textSubColor }} className="text-[10px] font-bold uppercase block">
                          Precio Unitario
                        </span>
                        <span style={{ color: textColor }} className="font-heading font-black text-base text-amber-500">
                          ${p.precio.toLocaleString('es-CO')} COP
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => addToCart(p)}
                        className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-500 hover:text-slate-950 font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95">
                        <Plus size={14} />
                        <span>Agregar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SECCIÓN 2: FLOTA Y MAQUINARIA PESADA */}
        {activeTab === 'maquinaria' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((v) => {
                const isAvailable = v.estado === 'Disponible';
                return (
                  <div
                    key={v.id}
                    style={{ backgroundColor: cardBg, borderColor: cardBorder }}
                    className="p-6 rounded-3xl border shadow-sm hover:border-amber-500/40 hover:shadow-lg transition-all flex flex-col justify-between group relative overflow-hidden">
                    {/* Badge de disponibilidad */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                          <Truck size={20} />
                        </div>
                        <div>
                          <span className="font-mono text-xs font-black tracking-wider text-slate-800 dark:text-slate-200">
                            PLACA: {v.placa}
                          </span>
                          <p style={{ color: textSubColor }} className="text-[10px] font-bold uppercase">
                            {v.tipoVehiculo}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[11px] font-black px-3 py-1 rounded-full ${
                          isAvailable
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}>
                        {v.estado}
                      </span>
                    </div>

                    <div>
                      <h3
                        style={{ color: textColor }}
                        className="font-heading font-black text-lg uppercase tracking-tight group-hover:text-amber-500 transition-colors">
                        {v.marca} {v.modelo}
                      </h3>

                      {/* Especificaciones técnicas del vehículo */}
                      <div className="grid grid-cols-2 gap-2 my-4">
                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1524] border border-slate-200/50 dark:border-slate-800">
                          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                            <Weight size={12} className="text-amber-500" />
                            <span>Capacidad</span>
                          </div>
                          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 mt-0.5 block">
                            {v.capacidadCargaTon ? `${v.capacidadCargaTon} Ton` : 'Estándar'}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1524] border border-slate-200/50 dark:border-slate-800">
                          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                            <Fuel size={12} className="text-amber-500" />
                            <span>Mantenimiento</span>
                          </div>
                          <span className="text-xs font-extrabold text-emerald-500 mt-0.5 block">
                            Certificado al Día
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <span style={{ color: textSubColor }} className="text-[10px] font-bold uppercase block">
                          Tarifa Diaria
                        </span>
                        <span style={{ color: textColor }} className="font-heading font-black text-lg text-amber-500">
                          ${v.tarifaDiaria.toLocaleString('es-CO')}
                          <span className="text-xs font-normal text-slate-400">/día</span>
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => setSelectedVehicle(v)}
                        className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                          isAvailable
                            ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/20 active:scale-95'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        }`}>
                        <Calendar size={14} />
                        <span>{isAvailable ? 'Solicitar Alquiler' : 'En Operación'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MODAL / DRAWER DE COTIZACIÓN & CHECKOUT */}
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div
              style={{ backgroundColor: cardBg, borderColor: cardBorder }}
              className="w-full max-w-lg rounded-3xl border shadow-2xl p-6 flex flex-col max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Package className="text-amber-500" size={20} />
                  <h3 style={{ color: textColor }} className="font-heading font-black text-lg uppercase">
                    Cotización de Materiales
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              {/* Items del Carrito */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {cart.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <p className="text-sm font-semibold">Tu cotización está vacía</p>
                    <p className="text-xs mt-1">Selecciona materiales del catálogo para empezar.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.producto.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1524] border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex-1 pr-3">
                        <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                          {item.producto.nombre}
                        </p>
                        <p className="text-[11px] text-amber-500 font-extrabold mt-0.5">
                          ${(item.producto.precio * item.cantidad).toLocaleString('es-CO')} COP
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.producto.id, -1)}
                          className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-black w-6 text-center text-slate-900 dark:text-white">
                          {item.cantidad}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQty(item.producto.id, 1)}
                          className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                          <Plus size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.producto.id)}
                          className="w-7 h-7 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center ml-1">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Formulario de Entrega a Obra */}
              {cart.length > 0 && (
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
                  <div className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
                    Datos de Despacho y Entrega a Obra
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Dirección exacta de la obra (ej. Cra 15 # 85-30 Torre 2)"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Nombre de quien recibe"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-500"
                    />
                    <input
                      type="tel"
                      placeholder="Teléfono de contacto"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1524] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Resumen de Valores */}
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Subtotal</span>
                      <span>${cartSubtotal.toLocaleString('es-CO')} COP</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>IVA (19% Ley Colombiana)</span>
                      <span>${cartIva.toLocaleString('es-CO')} COP</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-amber-500 pt-1 border-t border-amber-500/20">
                      <span>Total Liquidado</span>
                      <span>${cartTotal.toLocaleString('es-CO')} COP</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      handleCheckout();
                      setIsCartOpen(false);
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer">
                    Confirmar Pedido & Facturar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL PARA ALQUILER DE MAQUINARIA */}
        {selectedVehicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div
              style={{ backgroundColor: cardBg, borderColor: cardBorder }}
              className="w-full max-w-md rounded-3xl border shadow-2xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Truck className="text-amber-500" size={20} />
                  <h3 style={{ color: textColor }} className="font-heading font-black text-base uppercase">
                    Solicitud de Alquiler
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedVehicle(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white">
                  <X size={16} />
                </button>
              </div>

              <div className="py-4 space-y-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1524] border border-slate-200/60 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white">
                    {selectedVehicle.marca} {selectedVehicle.modelo}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Placa: {selectedVehicle.placa} · {selectedVehicle.tipoVehiculo}
                  </p>
                  <p className="text-xs font-black text-amber-500 mt-1">
                    Tarifa: ${selectedVehicle.tarifaDiaria.toLocaleString('es-CO')} / día
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Número de Días de Operación en Obra:
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setRentalDays(Math.max(1, rentalDays - 1))}
                      className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-800 dark:text-white font-bold">
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-black text-slate-900 dark:text-white w-12 text-center">
                      {rentalDays} {rentalDays === 1 ? 'Día' : 'Días'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setRentalDays(rentalDays + 1)}
                      className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-800 dark:text-white font-bold">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Costo Total Estimado:</span>
                  <span className="text-sm font-black text-amber-500">
                    ${(selectedVehicle.tarifaDiaria * rentalDays).toLocaleString('es-CO')} COP
                  </span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedVehicle(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400">
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRental}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase shadow-md shadow-amber-500/20">
                  Confirmar Contrato
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExplorePage;
