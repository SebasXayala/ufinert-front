# Sistema de Gestión de Autos - Frontend

Este es el frontend de un sistema de gestión de autos desarrollado con Next.js 15, TypeScript y NextAuth para autenticación.

## 🚀 Características

- **Autenticación segura** con NextAuth.js
- **CRUD completo** de autos (Crear, Leer, Actualizar, Eliminar)
- **Búsqueda y filtrado** por marca, modelo, año y placa
- **Interfaz responsive** y moderna
- **Integración con backend SpringBoot**
- **Manejo de errores** robusto
- **TypeScript** para mayor seguridad de tipos

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Backend SpringBoot ejecutándose en puerto 8080

## ⚙️ Configuración

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd ufinert-front
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
El archivo `.env.local` ya está configurado con:
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=Q2hhbmdlVGhpcyB0b0EgbmV3IHNlY3VyZSBzZWNyZXQgd2l0aCBhdCBsZWFzdCAzMiBjaGFyYWN0ZXJzIQ==
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
NEXT_PUBLIC_USE_MOCK=false
```

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js 15
│   ├── api/auth/          # Configuración NextAuth
│   ├── auth/              # Páginas de autenticación
│   ├── register/          # Página de registro
│   ├── seleccion/         # Dashboard principal
│   └── layout.tsx         # Layout principal
├── components/            # Componentes reutilizables
│   ├── CarCard.tsx       # Tarjeta de auto
│   └── CarModal.tsx      # Modal para crear/editar autos
├── services/             # Servicios para API
│   └── autoService.ts    # Servicio de autos
├── types/               # Definiciones de tipos TypeScript
├── constants/           # Constantes de la aplicación
├── utils/              # Utilidades
└── styles/             # Estilos globales
```

## 🔗 Integración con Backend

El frontend está configurado para conectarse con un backend SpringBoot que debe tener los siguientes endpoints:

### Autenticación
- `POST /api/auth/login` - Login de usuario

### Gestión de Autos
- `GET /api/cars` - Obtener todos los autos
- `POST /api/cars` - Crear nuevo auto
- `PUT /api/cars/{id}` - Actualizar auto
- `DELETE /api/cars/{id}` - Eliminar auto

## 🔧 Configuración del Backend

Asegúrate de que tu backend SpringBoot tenga configurado CORS para permitir las peticiones desde `http://localhost:3000`:

```java
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class CarController {
    // ... tus endpoints
}
```

O configuración global de CORS:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## 🧪 Modo de Prueba

Si quieres probar la aplicación sin el backend, cambia en `.env.local`:
```bash
NEXT_PUBLIC_USE_MOCK=true
```

Esto usará datos de prueba locales.

## 🛠️ Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo
- `npm run build` - Crear build de producción
- `npm run start` - Ejecutar build de producción
- `npm run lint` - Ejecutar linter

## 📝 Uso de la Aplicación

1. **Login**: Usa las credenciales configuradas en tu backend
2. **Dashboard**: Ver lista de autos con opciones de búsqueda y filtrado
3. **Crear Auto**: Botón "Agregar Auto" para crear nuevos registros
4. **Editar Auto**: Click en "Editar" en cualquier tarjeta de auto
5. **Eliminar Auto**: Click en "Eliminar" con confirmación

## 🔒 Seguridad

- Todas las peticiones al backend incluyen el token JWT de autenticación
- Las rutas están protegidas y redirigen al login si no hay sesión
- Validación de formularios con Zod
- Manejo seguro de errores

## 🚀 Despliegue

Para desplegar en producción:

1. Actualizar variables de entorno para producción
2. Ejecutar `npm run build`
3. Desplegar usando tu plataforma preferida (Vercel, Netlify, etc.)

---

**Nota**: Asegúrate de que el backend SpringBoot esté ejecutándose antes de usar la aplicación.
