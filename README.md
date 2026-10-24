# 🏗️ FIRMEZA - Frontend Web & Portal Operativo

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![ESLint](https://img.shields.io/badge/ESLint-9.0-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-jose2520%2FFirmeza__frontn-181717?logo=github&logoColor=white)](https://github.com/jose2520/Firmeza_frontn)
[![Backend Status](https://img.shields.io/badge/API-.NET_10_Core-512BD4?logo=dotnet&logoColor=white)](http://localhost:5125/swagger)

Plataforma Web Oficial de **FIRMEZA S.A.S.**: Solución integral para la comercialización de materiales de construcción, logística de despachos a pie de obra y gestión de contratos de alquiler de maquinaria pesada.

Desarrollada bajo **Vite 8**, **React 19**, **TypeScript** y **Tailwind CSS**, con arquitectura modular orientada al dominio y sincronizada en tiempo real con el backend de microservicios ASP.NET Core (.NET 10).

Repositorio oficial en GitHub: **[https://github.com/jose2520/Firmeza_frontn](https://github.com/jose2520/Firmeza_frontn)**

---

## 🏛️ Arquitectura del Frontend

El proyecto está organizado bajo una estructura modular basada en características (*Feature-driven Architecture*), lo que garantiza escalabilidad, bajo acoplamiento y facilidad de mantenimiento:

```text
src/
├── assets/                     # Recursos gráficos institucionales (logos, hero, SVGs)
├── components/                 # Componentes reutilizables de UI y navegación
│   ├── navigation/
│   │   ├── AppNavbar.tsx       # Barra de navegación adaptativa (Público / Pre-login / Sesión activa)
│   │   └── ThemeToggle.tsx     # Selector interactivo de Modo Claro / Modo Oscuro
│   └── ui/
│       └── CustomCursor.tsx    # Cursor interactivo con seguimiento dinámico y aura dorada
├── context/
│   └── ThemeContext.tsx        # Proveedor de estado global para Dark/Light mode
├── core/                       # Infraestructura transversal
│   ├── api/
│   │   └── client.ts           # Cliente Axios con inyección JWT Bearer y resolución dinámica de URL
│   └── storage/
│       └── tokenStorage.ts     # Almacenamiento seguro de tokens y credenciales de sesión
├── features/                   # Módulos de negocio independientes
│   ├── admin/                  # Panel de Administración Maestro
│   │   ├── services/adminApi.ts
│   │   └── AdminDashboardScreen.tsx
│   ├── auth/                   # Autenticación, control de acceso y portal de cliente
│   │   ├── components/
│   │   │   ├── AdminGuard.tsx  # Guardián de rutas con verificación de rol 'Admin'
│   │   │   └── ControlPanelDashboard.tsx  # Portal operativo del cliente
│   │   ├── context/AuthContext.tsx
│   │   ├── hooks/useAuth.ts
│   │   ├── services/authApi.ts
│   │   ├── types/auth.types.ts
│   │   └── LoginScreen.tsx
│   ├── commercial/             # Flota, maquinaria, despachos, proveedores y kardex
│   │   ├── services/commercialApi.ts  # Servicios API sincronizados con el backend .NET
│   │   └── types/commercial.types.ts  # Modelos DTOs idénticos a los del backend
│   └── landing/                # Portal público y páginas informativas
│       ├── components/
│       │   ├── BenefitsSection.tsx
│       │   ├── HeroSection.tsx
│       │   ├── LandingFooter.tsx
│       │   └── ServiceCards.tsx
│       └── LandingScreen.tsx
├── hooks/
│   └── useTheme.ts             # Hook consumidor del tema de interfaz
└── pages/
    ├── ExplorePage.tsx         # Catálogo de Materiales y Flota con cotizador en vivo
    └── NotFoundPage.tsx        # Pantalla 404 con engranajes animados y navegación guiada
```

---

## 🎨 Sistema de Diseño (Firmeza Glassmorphism Design)

La interfaz gráfica fue construida con una identidad visual corporativa exclusiva para el sector de la construcción:

- **Estructura Flotante de Doble Tarjeta:**
  - **Cabecera Operativa (`Card 1`):** Indicador de estado de conexión (`ONLINE` / `ACTIVO`), logo de alta definición y control de colapso a modo *Slim*.
  - **Navegación Principal (`Card 2`):** Tarjetas con curvatura suave `rounded-[40px]`, sombras volumétricas y desenfoque de fondo (*backdrop-blur-xl*).
- **Botones Píldora con Microinteracciones:**
  - Botones con silueta ovalada `rounded-full` con resaltado activo en gradiente dorado (`bg-gradient-to-r from-brand-gold/20 to-brand-gold/5`), bordes sutiles y animación en hover (`hover:translate-x-1`).
  - **Tooltips Flotantes en Modo Slim:** Burbujas con flechas indicadoras flotantes al pasar el cursor sobre los íconos contraídos.
- **Paleta de Colores Institucional:**
  - `Brand Gold`: `#b87333` / `#f59e0b` (Dorado y cobre de construcción).
  - `Brand Navy`: `#091522` / `#04080f` (Azul profundo de ingeniería).
  - `Brand Slate`: `#64748b` / `#94a3b8` (Tonos neutros de soporte).
- **Tema Claro / Oscuro Nativo:** Transición suave de paletas de color con persistencia en `localStorage`.

---

## 🧭 Vistas y Módulos de la Aplicación

### 1. Sitio Web Público (`/`)
- **Hero Interactivo:** Título de alto impacto, propuesta de valor corporativa y llamado a la acción.
- **Nuestras Soluciones:** Tarjetas de líneas de servicio (Acero estructural, agregados, cementos, maquinaria).
- **Beneficios:** Garantía de cumplimiento, cubicación técnica en obra y despacho garantizado 24/7.
- **Pie de Página Institucional:** Directorio de contacto, sedes, líneas de atención y enlaces legales.

### 2. Catálogo Comercial y Cotizador (`/explore`)
- **Alternador de Línea:**
  - **Materiales de Construcción:** Búsqueda en vivo por código o nombre, disponibilidad de existencias en tiempo real y precios unitarios en pesos colombianos (COP).
  - **Flota y Maquinaria Pesada:** Fichas técnicas con tonelaje de carga, placa, tipo de máquina (Volquetas, Retroexcavadoras de oruga, Camiones Mixer, Grúas) y tarifas por día.
- **Drawer de Cotización / Pedido:**
  - Carrito lateral para modificar cantidades, cálculo del subtotal e **IVA del 19%** según la normativa colombiana.
  - Formulario de despacho con dirección de entrega a pie de obra y contacto para programación de flete.
- **Solicitud de Alquiler de Maquinaria:** Modal para seleccionar número de días de operación, liquidación automática del contrato y confirmación de reserva.

### 3. Autenticación y Portal del Cliente (`/login` ➔ `ControlPanelDashboard`)
- **Acceso Dual:** Alternador interactivo entre **Iniciar Sesión** (`POST /api/Auth/login`) y **Registrar Cuenta** (`POST /api/Auth/register`) para clientes corporativos y contratistas.
- **Centro Operativo:** Resumen ejecutivo con total de compras, alquileres vigentes, despachos en ruta y estado de la conexión API.
- **Catálogo Rápido:** Selección directa de materiales para pedidos recurrentes.
- **Flota & Maquinaria:** Listado de contratos de alquiler vigentes (número de contrato, placa, fechas de vigencia y valor total).
- **Despachos en Obra:** Rastreo logístico paso a paso con **stepper visual** (`Pendiente` ➔ `En Ruta` 🚚 ➔ `Entregado` ✓), costo del transporte y teléfono del contacto en obra.
- **Ventas y Facturas:** Historial detallado con botón para **Descargar Factura Oficial en PDF** conectada a la API backend.

### 4. Panel de Administración Maestro (`/admin` ➔ `AdminDashboardScreen`)
Acceso protegido exclusivo para roles directivos y operativos (`Admin`, `Supervisor`, `Gerente`, `Contador`):
1. **Resumen Operativo (`DashboardController`):** 4 KPIs principales de ingresos, ventas del día, usuarios activos y tablas de productos bajo stock y más vendidos (`GET /api/Dashboard/summary`).
2. **Catálogo de Materiales (`ProductsController`):** Tabla de existencias, buscador en tiempo real, modal de alta de materiales (`POST /api/Products`) y baja de artículos (`DELETE /api/Products/{id}`).
3. **Categorías del Catálogo (`CategoriesController`):** Módulo dedicado para administración de familias, creación de nuevas categorías (`POST /api/Categories`), alternador instantáneo de estado (`PATCH /api/Categories/{id}/toggle-status`) y borrado (`DELETE /api/Categories/{id}`).
4. **Flota de Vehículos (`VehiclesController`):** Registro de nuevos equipos de carga (`POST /api/Vehicles`), especificación de capacidad en toneladas y alternador de estado de disponibilidad (`Disponible` / `En Mantenimiento`).
5. **Contratos de Alquiler (`RentalsController`):** Emisión de contratos vinculados a clientes, liquidación por días (`POST /api/Rentals`) y alternador de estado para finalizar o cancelar contratos (`PATCH /api/Rentals/{id}/status`).
6. **Logística y Despachos (`DispatchesController`):** Gestión de entregas a obra (`POST /api/Dispatches`), cálculo de fletes y actualización de estados (`En Ruta`, `Entregado`).
7. **Clientes Corporativos (`ClientsController`):** Directorio de empresas, modal de registro corporativo con NIT y dirección (`POST /api/Clients`) y acción de eliminación (`DELETE /api/Clients/{id}`).
8. **Directorio de Proveedores (`SuppliersController`):** Registro y consulta de aliados comerciales y fabricantes por NIT (`GET`/`POST /api/Suppliers`).
9. **Kardex de Bodega (`InventoryMovementsController`):** Auditoría de movimientos (`Entrada`, `Salida`, `Ajuste`) con registro de stock previo vs. stock posterior y motivo de la transacción.
10. **Métodos de Pago (`PaymentMethodsController`):** Habilitación de pasarelas y formas de pago (Efectivo, PSE/Transferencia, Tarjeta Débito/Crédito, Crédito Constructor).
11. **Usuarios y Roles (`UsersController`):** Directorio de cuentas del sistema con desglose de los 10 roles configurados (`GET /api/Users`, `GET /api/Users/roles`).
12. **Centro de Carga Masiva (EPPlus):** Descarga de plantillas estándar y desnormalizadas (`/api/Products/template-excel`, `/api/Products/template-desnormalized-excel`) y carga masiva de catálogos procesados por el backend.
13. **Exportación de Reportes:** Generación y descarga directa del reporte de ventas consolidado en Excel (`/api/Sales/export-excel`).

---

## ⚡ Conexión e Integración con el Backend .NET

Por defecto, la aplicación se comunica con el servidor backend en el puerto `5125` (`http://localhost:5125/api`).

### Matriz Exhaustiva de Endpoints vs. Vistas del Frontend

| Módulo | Método | Endpoint Backend | Vista / Componente en Frontend | Estado | Funcionalidad en Interfaz |
| :--- | :---: | :--- | :--- | :---: | :--- |
| **Auth** | `POST` | `/api/Auth/login` | `LoginScreen.tsx` | ✅ Activo | Formulario de acceso con JWT, selector de rol y credenciales corporativas. |
| **Auth** | `POST` | `/api/Auth/register` | `LoginScreen.tsx` | ✅ Activo | Pestaña interactiva *"Registrar Cuenta"* con nombre/empresa, correo, teléfono y contraseña. |
| **Categories** | `GET` | `/api/Categories` | `AdminDashboardScreen.tsx` | ✅ Activo | Módulo *"Categorías Catálogo"*: listado visual de familias con contador de materiales. |
| **Categories** | `POST` | `/api/Categories` | `AdminDashboardScreen.tsx` | ✅ Activo | Modal *"Crear Nueva Categoría"* con nombre y descripción técnica. |
| **Categories** | `GET` | `/api/Categories/{id}` | `AdminDashboardScreen.tsx` | ✅ Activo | Consulta por ID y detalle en ficha de tarjeta. |
| **Categories** | `PUT` | `/api/Categories/{id}` | `adminApi.ts` | ✅ Activo | Servicio de actualización de datos de categoría. |
| **Categories** | `DELETE`| `/api/Categories/{id}` | `AdminDashboardScreen.tsx` | ✅ Activo | Botón *"Eliminar"* en cada tarjeta de categoría con borrado lógico/físico. |
| **Categories** | `GET` | `/api/Categories/{id}/products` | `ExplorePage.tsx` | ✅ Activo | Filtrado dinámico de productos por categoría en el catálogo. |
| **Categories** | `PATCH`| `/api/Categories/{id}/toggle-status` | `AdminDashboardScreen.tsx` | ✅ Activo | Botón píldora *"Activa / Inactiva"* con cambio instantáneo de estado. |
| **Clients** | `GET` | `/api/Clients` | `AdminDashboardScreen.tsx` | ✅ Activo | Pestaña *"Clientes Corporativos"*: directorio con NIT, contacto y búsqueda en vivo. |
| **Clients** | `POST` | `/api/Clients` | `AdminDashboardScreen.tsx` | ✅ Activo | Modal *"Registrar Cliente Corporativo"* con NIT, nombres, email, teléfono y dirección. |
| **Clients** | `GET` | `/api/Clients/{id}` | `AdminDashboardScreen.tsx` | ✅ Activo | Identificación y ficha en tabla de cartera. |
| **Clients** | `PUT` | `/api/Clients/{id}` | `adminApi.ts` | ✅ Activo | Edición de cartera corporativa. |
| **Clients** | `DELETE`| `/api/Clients/{id}` | `AdminDashboardScreen.tsx` | ✅ Activo | Acción *"Eliminar"* en la fila de cliente. |
| **Dashboard** | `GET` | `/api/Dashboard/summary` | `AdminDashboardScreen.tsx` | ✅ Activo | Pantalla *"Panel Resumen"*: 4 KPIs, tabla de productos bajo stock y top más vendidos. |
| **Dispatches**| `GET` | `/api/Dispatches` | `AdminDashboardScreen.tsx` | ✅ Activo | Módulo *"Despachos en Obra"*: tarjetas logísticas con destino, flete y conductor. |
| **Dispatches**| `POST` | `/api/Dispatches` | `AdminDashboardScreen.tsx` | ✅ Activo | Modal *"Programar Despacho a Pie de Obra"* vinculado a una factura de venta. |
| **Dispatches**| `GET` | `/api/Dispatches/{id}` | `ControlPanelDashboard.tsx` | ✅ Activo | Tarjeta individual de seguimiento con fecha y hora estimada de llegada. |
| **Dispatches**| `GET` | `/api/Dispatches/sale/{saleId}` | `ControlPanelDashboard.tsx` | ✅ Activo | Consulta del estado de envío asociado a la orden del cliente. |
| **Dispatches**| `PATCH`| `/api/Dispatches/{id}/status` | `AdminDashboardScreen.tsx` | ✅ Activo | Alternador de estados: *Pendiente* ➔ *En Ruta* ➔ *Entregado* con línea de tiempo. |
| **API Status**| `GET` | `/` y `/api` | `client.ts` | ✅ Activo | Health-check automático e indicador de estado `ONLINE` en el navbar lateral. |
| **Inventory** | `GET` | `/api/InventoryMovements` | `AdminDashboardScreen.tsx` | ✅ Activo | Pestaña *"Kardex de Bodega"*: historial de stock previo, posterior, fecha y motivo. |
| **Inventory** | `POST` | `/api/InventoryMovements` | `AdminDashboardScreen.tsx` | ✅ Activo | Modal *"Asentar Movimiento en Kardex"* (Entrada / Salida / Ajuste de inventario). |
| **Inventory** | `GET` | `/api/InventoryMovements/product/{productId}` | `AdminDashboardScreen.tsx` | ✅ Activo | Filtrado y auditoría de movimientos por producto. |
| **Payments**  | `GET` | `/api/PaymentMethods` | `AdminDashboardScreen.tsx` | ✅ Activo | Pestaña *"Métodos de Pago"*: pasarelas PSE, Wompi, efectivo y transferencias. |
| **Payments**  | `POST` | `/api/PaymentMethods` | `AdminDashboardScreen.tsx` | ✅ Activo | Modal *"Habilitar Forma de Pago"* con código interno y condiciones. |
| **Payments**  | `GET` | `/api/PaymentMethods/{id}` | `AdminDashboardScreen.tsx` | ✅ Activo | Consulta y detalle de pasarelas activas. |
| **Payments**  | `PUT` | `/api/PaymentMethods/{id}` | `commercialApi.ts` | ✅ Activo | Edición de configuraciones de cobro. |
| **Payments**  | `DELETE`| `/api/PaymentMethods/{id}` | `AdminDashboardScreen.tsx` | ✅ Activo | Desactivación de métodos de pago. |
| **Products**  | `GET` | `/api/Products` | `ExplorePage.tsx` y Admin | ✅ Activo | Catálogo público con cotizador y tabla administrativa de inventario. |
| **Products**  | `POST` | `/api/Products` | `AdminDashboardScreen.tsx` | ✅ Activo | Modal *"Registrar Material / Producto"* con código SKU, precio COP, stock y descripción. |
| **Products**  | `GET` | `/api/Products/{id}` | `ExplorePage.tsx` | ✅ Activo | Tarjeta individual y drawer de cotización en vivo. |
| **Products**  | `PUT` | `/api/Products/{id}` | `adminApi.ts` | ✅ Activo | Actualización de precio, stock y estado. |
| **Products**  | `DELETE`| `/api/Products/{id}` | `AdminDashboardScreen.tsx` | ✅ Activo | Acción *"Eliminar"* en la fila del material. |
| **Products**  | `GET` | `/api/Products/export-excel` | `AdminDashboardScreen.tsx` | ✅ Activo | Botón de exportación de catálogo a hoja de cálculo. |
| **Products**  | `GET` | `/api/Products/template-excel` | `AdminDashboardScreen.tsx` | ✅ Activo | Botón *"Descargar Plantilla (.xlsx)"* en pestaña *Centro de Datos*. |
| **Products**  | `POST` | `/api/Products/import-excel` | `AdminDashboardScreen.tsx` | ✅ Activo | Carga masiva mediante selector de archivos `.xlsx`. |
| **Products**  | `GET` | `/api/Products/template-desnormalized-excel` | `AdminDashboardScreen.tsx` | ✅ Activo | Descarga de formato desnormalizado para importación con categorías integradas. |
| **Products**  | `POST` | `/api/Products/import-desnormalized-excel` | `AdminDashboardScreen.tsx` | ✅ Activo | Botón *"Importar Desnormalizado"* en *Centro de Datos*. |
| **Rentals**   | `GET` | `/api/Rentals` | `AdminDashboardScreen.tsx` | ✅ Activo | Módulo *"Contratos Alquiler"*: contratos, fechas, tarifa/día y total liquidado. |
| **Rentals**   | `POST` | `/api/Rentals` | `AdminDashboardScreen.tsx` | ✅ Activo | Modal *"Emitir Contrato de Alquiler de Maquinaria"* con cálculo automático. |
| **Rentals**   | `GET` | `/api/Rentals/{id}` | `ControlPanelDashboard.tsx` | ✅ Activo | Tarjetas de maquinaria en arriendo en el portal de cliente. |
| **Rentals**   | `PATCH`| `/api/Rentals/{id}/status` | `AdminDashboardScreen.tsx` | ✅ Activo | Botón para cambiar estado: *Activo* ➔ *Finalizado* (libera la máquina). |
| **Sales**     | `GET` | `/api/Sales` | `AdminDashboardScreen.tsx` | ✅ Activo | Pestaña *"Facturación & Ventas"*: historial de ventas, IVA del 19% y totales. |
| **Sales**     | `POST` | `/api/Sales` | `ExplorePage.tsx` | ✅ Activo | Carrito de cotización y cierre de compra con liquidación de impuestos. |
| **Sales**     | `GET` | `/api/Sales/{id}` | `ControlPanelDashboard.tsx` | ✅ Activo | Consulta y detalle de la factura. |
| **Sales**     | `GET` | `/api/Sales/{id}/details` | `AdminDashboardScreen.tsx` | ✅ Activo | Desglose de renglones de producto, cantidades y precios unitarios. |
| **Sales**     | `PUT` | `/api/Sales/{id}/cancel` | `AdminDashboardScreen.tsx` | ✅ Activo | Botón *"Anular Factura"* (reintegra existencias a bodega). |
| **Sales**     | `GET` | `/api/Sales/{id}/pdf` | `AdminDashboardScreen.tsx` y Cliente | ✅ Activo | Botón *"Factura PDF"* con descarga directa del comprobante oficial. |
| **Sales**     | `GET` | `/api/Sales/export-excel` | `AdminDashboardScreen.tsx` | ✅ Activo | Botón *"Exportar Ventas (.xlsx)"* en cabecera de facturación. |
| **Suppliers** | `GET` | `/api/Suppliers` | `AdminDashboardScreen.tsx` | ✅ Activo | Pestaña *"Proveedores / Aliados"*: directorio de plantas de cemento y fábricas. |
| **Suppliers** | `POST` | `/api/Suppliers` | `AdminDashboardScreen.tsx` | ✅ Activo | Modal *"Registrar Proveedor / Aliado"* con NIT, razón social y ciudad. |
| **Suppliers** | `GET` | `/api/Suppliers/{id}` | `AdminDashboardScreen.tsx` | ✅ Activo | Consulta y ficha de distribuidor. |
| **Suppliers** | `PUT` | `/api/Suppliers/{id}` | `commercialApi.ts` | ✅ Activo | Edición de acuerdos comerciales con proveedores. |
| **Suppliers** | `DELETE`| `/api/Suppliers/{id}` | `AdminDashboardScreen.tsx` | ✅ Activo | Desactivación de proveedores aliados. |
| **Users**     | `GET` | `/api/Users` | `AdminDashboardScreen.tsx` | ✅ Activo | Pestaña *"Cuentas y Roles"*: usuarios del sistema con insignias de rol. |
| **Users**     | `GET` | `/api/Users/roles` | `AdminDashboardScreen.tsx` | ✅ Activo | Tarjetas explicativas de permisos (Admin, Vendedor, Almacenista, etc.). |
| **Vehicles**  | `GET` | `/api/Vehicles` | `AdminDashboardScreen.tsx` y Explore | ✅ Activo | Pestaña *"Flota & Maquinaria"*: volquetas, retroexcavadoras, mixers y grúas. |
| **Vehicles**  | `POST` | `/api/Vehicles` | `AdminDashboardScreen.tsx` | ✅ Activo | Modal *"Registrar Vehículo o Maquinaria"* con placa, tonelaje y tarifa diaria. |
| **Vehicles**  | `GET` | `/api/Vehicles/{id}` | `ExplorePage.tsx` | ✅ Activo | Ficha técnica de maquinaria para cotización de alquiler. |
| **Vehicles**  | `PUT` | `/api/Vehicles/{id}` | `commercialApi.ts` | ✅ Activo | Actualización de estado operacional y tarifa del equipo. |
| **Vehicles**  | `DELETE`| `/api/Vehicles/{id}` | `AdminDashboardScreen.tsx` | ✅ Activo | Retiro o baja de vehículos de la flota. |

### Modo de Contingencia Resiliente (Offline / Demo)
Si el backend no está iniciado localmente, el frontend activa un adaptador de contingencia transparente con datasets de respaldo completos, permitiendo navegar todas las pantallas, cotizar, alternar estados y descargar comprobantes sin interrupciones.

---

## 🛠️ Comandos de Desarrollo y Construcción

### 1. Instalación de Dependencias
```bash
npm install
```

### 2. Servidor de Desarrollo con Hot Reload
```bash
npm run dev
```
La aplicación se levantará en: **`http://localhost:5173`**

### 3. Verificación de Calidad y Estilo (ESLint)
```bash
npm run lint
```
*Garantiza 0 errores y 0 advertencias bajo las reglas de React Hooks y TypeScript.*

### 4. Compilación de Producción
```bash
npm run build
```
*Ejecuta `tsc -b` (validación de tipos estricta) y `vite build` (minificación Rollup y tree-shaking en < 1 segundo).*

### 5. Previsualización de Compilación Local
```bash
npm run preview
```
La compilación optimizada estará disponible en: **`http://localhost:4173`**

---

## 🔑 Credenciales Demo Preconfiguradas

Para pruebas rápidas de acceso a los diferentes niveles de permisos:

| Perfil de Usuario | Correo Electrónico | Contraseña | Rol y Acceso |
| :--- | :--- | :---: | :--- |
| **Administrador Maestro** | `admin@firmeza.com` | `Admin123*` | `Admin` (Acceso total al Panel `/admin` y Portal `/login`). |
| **Vendedor de Mostrador** | `vendedor1@firmeza.com` | `Password123*` | `Vendedor` (Gestión de ventas y catálogo). |
| **Almacenista de Bodega** | `almacen1@firmeza.com` | `Password123*` | `Almacenista` (Kardex, despachos y existencias). |
| **Cliente / Contratista** | `carlos.gomez@example.com` | `Cliente123*` | `Cliente` (Compras, contratos de alquiler y despachos propios). |

---

## ⚙️ Variables de Entorno (.env)

Si deseas apuntar el frontend a un servidor o puerto distinto al predeterminado:

```env
# URL base de la API ASP.NET Core
VITE_API_URL=http://localhost:5125/api
```
