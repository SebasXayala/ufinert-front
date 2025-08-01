# Ufinert Frontend - Aplicación de Gestión de Vehículos

## 📋 Descripción
Sistema frontend desarrollado en Next.js para la gestión de vehículos, implementando autenticación JWT y operaciones CRUD completas con fallback a datos mock.

## 🚀 Tecnologías
- **Framework**: Next.js 14 con App Router
- **Autenticación**: NextAuth.js con estrategia JWT
- **Validación**: Zod schemas con React Hook Form
- **Styling**: CSS Modules / Global CSS
- **Lenguaje**: TypeScript
- **Patrón de Arquitectura**: Service Layer con API fallbacks

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas
```
src/
├── app/                    # App Router de Next.js
│   ├── api/auth/          # Configuración NextAuth
│   ├── register/          # Página de registro
│   └── seleccion/         # Dashboard principal
├── components/            # Componentes React reutilizables
├── services/              # Capa de servicios (API + Mock)
├── schemas/               # Validaciones con Zod
├── types/                 # Definiciones TypeScript
├── constants/             # Constantes de la aplicación
├── data/                  # Datos mock
├── hooks/                 # Hooks personalizados
└── utils/                 # Utilidades generales
```

### Principios de Clean Code Aplicados

#### 1. **Separation of Concerns**
- **Services**: Lógica de negocio separada de componentes
- **Schemas**: Validaciones centralizadas
- **Constants**: Valores constantes en un solo lugar
- **Types**: Definiciones de tipos centralizadas

#### 2. **Single Responsibility Principle**
- Cada servicio maneja una entidad específica (`autoService`, `authService`)
- Componentes con responsabilidades únicas
- Utilidades específicas y reutilizables

#### 3. **Dependency Inversion**
- Configuración por variables de entorno
- Fallback automático API → Mock data
- Inyección de dependencias en servicios

## 🔧 Configuración y Instalación

### Variables de Entorno
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_USE_MOCK=false
NEXTAUTH_SECRET=tu-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### Instalación
```bash
npm install
npm run dev
```

## 📡 Capa de Servicios

### AutoService
Gestión completa de vehículos con patrón API-first y fallback:

```typescript
// Operaciones disponibles
getCars(token?: string): Promise<Car[]>
createCar(carData: CarCreateRequest, token?: string): Promise<Car>
updateCar(id: string, carData: Partial<CarCreateRequest>, token?: string): Promise<Car>
deleteCar(id: string, token?: string): Promise<void>
```

**Características:**
- Validación de formato de placa (ABC123)
- Normalización automática de datos
- Manejo robusto de errores
- Fallback transparente a mock data

### AuthService
Autenticación con JWT y registro de usuarios:

```typescript
// Operaciones disponibles
registerUser(userData: RegisterRequest): Promise<RegisterResponse>
loginUser(loginData: LoginRequest): Promise<AuthResponse>
```

## 🔐 Sistema de Autenticación

### NextAuth Configuration
- **Estrategia**: JWT tokens
- **Provider**: Credentials personalizado
- **Extracción de datos**: Del payload JWT (campo `sub`)
- **Fallback**: Mock authentication para desarrollo

### Flujo de Autenticación
1. Usuario envía credenciales
2. Backend valida y retorna JWT
3. JWT se decodifica para extraer username
4. Sesión se mantiene con NextAuth

## ✅ Validaciones

### Esquemas Zod
```typescript
const carSchema = z.object({
  model: z.string().min(1),
  brand: z.string().min(1),
  color: z.string().min(1),
  year: z.string().regex(/^\d{4}$/),
  plateNumber: z.string().regex(/^[A-Z]{3}\d{3}$/i),
  imageUrl: z.string().url().optional()
});
```

### Validaciones Específicas
- **Placas**: Formato estricto ABC123 (3 letras + 3 números)
- **Año**: 4 dígitos numéricos
- **URLs**: Validación completa de formato

## 🛡️ Manejo de Errores

### Estrategia de Resilencia
1. **API Primary**: Intenta conectar con backend
2. **Graceful Degradation**: Fallback automático a mock
3. **Error Boundaries**: Manejo centralizado de errores
4. **User Feedback**: Mensajes claros al usuario

### Logging Strategy
- **Desarrollo**: Logs detallados para debugging
- **Producción**: Logs esenciales sin información sensible
- **Errores**: Captura y reporte estructurado

## 🧪 Testing Strategy

### Mock Data
- Datos realistas para desarrollo
- Operaciones CRUD completas
- Simulación de delays de red

### Validación de Datos
- Todos los inputs validados con Zod
- Normalización automática
- Feedback inmediato al usuario

## 📈 Performance y Optimización

### Técnicas Implementadas
- **Code Splitting**: Carga lazy de componentes
- **API Caching**: Estrategias de cache para datos
- **Error Boundaries**: Prevención de crashes
- **Optimistic Updates**: UX mejorada en operaciones

## 🔄 Estado y Gestión de Datos

### Patrón de Estado
- **Server State**: Manejado por servicios
- **Client State**: React hooks locales
- **Session State**: NextAuth session provider
- **Form State**: React Hook Form

## 📱 Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Accesibilidad
- Semantic HTML
- ARIA labels apropiados
- Keyboard navigation
- Screen reader compatible

## 🚀 Deploy y Producción

### Build Optimization
```bash
npm run build
npm run start
```

### Environment Considerations
- Variables de entorno por ambiente
- Configuración de fallbacks
- Optimización de bundles

## 📚 Documentación API

### Endpoints Backend Esperados
```
POST /api/auth/login     # Autenticación
POST /api/auth/register  # Registro
GET  /api/cars          # Listar vehículos
POST /api/cars          # Crear vehículo
PUT  /api/cars/:id      # Actualizar vehículo
DELETE /api/cars/:id    # Eliminar vehículo
```

### Formato de Respuestas
```typescript
// Auth Response
{
  token: string;
  user: { id: number; username: string; email: string; }
}

// Car Response
{
  id: string;
  model: string;
  brand: string;
  color: string;
  year: string;
  plateNumber: string;
  imageUrl?: string;
}
```

## 🎯 Mejores Prácticas Implementadas

1. **Código Limpio**: Funciones puras, nombres descriptivos
2. **Tipado Fuerte**: TypeScript strict mode
3. **Validación Robusta**: Zod schemas en frontend y backend
4. **Manejo de Errores**: Try-catch apropiados y fallbacks
5. **Separación de Responsabilidades**: Services, components, utils
6. **Configuración Flexible**: Environment-based configuration
7. **Testing Ready**: Estructura preparada para testing
8. **Documentation**: Código auto-documentado

---

*Desarrollado siguiendo principios de Clean Code y mejores prácticas de la industria*
