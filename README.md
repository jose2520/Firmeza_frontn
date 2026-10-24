# 🏗️ FIRMEZA - Frontend Web & Portal Operativo

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![ESLint](https://img.shields.io/badge/ESLint-9.0-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)
[![Backend Status](https://img.shields.io/badge/API-.NET_10_Core-512BD4?logo=dotnet&logoColor=white)](http://localhost:5125/swagger)

Plataforma Web Oficial de **FIRMEZA S.A.S.**: Solución integral para la comercialización de materiales de construcción, logística de despachos a pie de obra y gestión de contratos de alquiler de maquinaria pesada.

Desarrollada bajo **Vite 8**, **React 19**, **TypeScript** y **Tailwind CSS**, con arquitectura modular orientada al dominio y sincronizada en tiempo real con el backend de microservicios ASP.NET Core (.NET 10).

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

### 3. Portal del Cliente (`/login` ➔ `ControlPanelDashboard`)
- **Centro Operativo:** Resumen ejecutivo con total de compras, alquileres vigentes, despachos en ruta y estado de la conexión API.
- **Catálogo Rápido:** Selección directa de materiales para pedidos recurrentes.
- **Flota & Maquinaria:** Listado de contratos de alquiler vigentes (número de contrato, placa, fechas de vigencia y valor total).
- **Despachos en Obra:** Rastreo logístico paso a paso con **stepper visual** (`Pendiente` ➔ `En Ruta` 🚚 ➔ `Entregado` ✓), costo del transporte y teléfono del contacto en obra.
- **Ventas y Facturas:** Historial detallado con botón para **Descargar Factura Oficial en PDF** conectada a la API backend.

### 4. Panel de Administración Maestro (`/admin` ➔ `AdminDashboardScreen`)
Acceso protegido exclusivo para roles directivos y operativos (`Admin`, `Supervisor`, `Gerente`, `Contador`):
1. **Resumen Operativo:** KPIs de ingresos totales, ventas del mes, usuarios activos y métricas de inventario.
2. **Catálogo de Materiales (`ProductsController`):** Tabla de existencias, control de precios y buscador en tiempo real.
3. **Flota de Vehículos (`VehiclesController`):** Registro de nuevos equipos de carga, especificación de capacidad en toneladas y alternador de estado de disponibilidad (`Disponible` / `En Mantenimiento`).
4. **Contratos de Alquiler (`RentalsController`):** Emisión de contratos vinculados a clientes, liquidación por días y acciones para finalizar o cancelar contratos.
5. **Logística y Despachos (`DispatchesController`):** Gestión de entregas a obra, cálculo de fletes y actualización de estados (`En Ruta`, `Entregado`).
6. **Directorio de Proveedores (`SuppliersController`):** Registro y consulta de aliados comerciales y fabricantes por NIT.
7. **Kardex de Bodega (`InventoryMovementsController`):** Auditoría de movimientos (`Entrada`, `Salida`, `Ajuste`) con registro de stock previo vs. stock posterior y motivo de la transacción.
8. **Métodos de Pago (`PaymentMethodsController`):** Habilitación de pasarelas y formas de pago (Efectivo, PSE/Transferencia, Tarjeta Débito/Crédito, Crédito Constructor).
9. **Usuarios y Roles (`UsersController`):** Directorio de cuentas del sistema con desglose de los 10 roles configurados.
10. **Centro de Carga Masiva (EPPlus):** Descarga de plantillas `.xlsx` oficiales y carga masiva de catálogos procesados por el backend.
11. **Exportación de Reportes:** Generación y descarga directa del reporte de ventas consolidado en Excel (`/api/Sales/export-excel`).

---

## ⚡ Conexión e Integración con el Backend .NET

Por defecto, la aplicación se comunica con el servidor backend en el puerto `5125` (`http://localhost:5125/api`).

### Matriz de Endpoints Integrados

| Módulo Frontend | Endpoint Backend | Método HTTP | Acción Realizada |
| :--- | :--- | :---: | :--- |
| Inicio de Sesión | `/api/Auth/login` | `POST` | Validación de credenciales y obtención de Bearer Token JWT. |
| Catálogo de Materiales | `/api/Products` | `GET` / `POST` | Lectura de existencias y registro de nuevos artículos. |
| Categorías Oficiales | `/api/Categories` | `GET` | Clasificación por familias de producto. |
| Flota y Maquinaria | `/api/Vehicles` | `GET` / `POST` | Consulta pública y alta de vehículos de transporte y maquinaria. |
| Contratos de Alquiler | `/api/Rentals` | `GET` / `POST` / `PATCH` | Liquidación y cambio de estado de contratos de maquinaria. |
| Despachos en Obra | `/api/Dispatches` | `GET` / `POST` / `PATCH` | Rastreo logístico y actualización de etapa de entrega. |
| Ventas y Facturas | `/api/Sales` | `GET` / `POST` | Registro de compra con descuento atómico de inventario. |
| Factura en PDF | `/api/Sales/{id}/pdf` | `GET` | Descarga de factura comercial electrónica en PDF. |
| Exportación de Ventas | `/api/Sales/export-excel` | `GET` | Descarga masiva del consolidado de ventas en formato `.xlsx`. |
| Directorio Proveedores | `/api/Suppliers` | `GET` / `POST` | Gestión de empresas aliadas y fabricantes. |
| Kardex de Bodega | `/api/InventoryMovements` | `GET` / `POST` | Historial de auditoría de entradas, salidas y ajustes de stock. |
| Métodos de Pago | `/api/PaymentMethods` | `GET` / `POST` | Medios de pago autorizados. |
| Cuentas y Roles | `/api/Users` | `GET` | Listado de usuarios y catálogo de roles del sistema. |
| Plantilla de Productos | `/api/Products/template-excel` | `GET` | Descarga del formato de carga masiva en Excel. |
| Importación Masiva | `/api/Products/import-excel` | `POST` | Envío de archivo `.xlsx` para procesamiento con EPPlus. |

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
