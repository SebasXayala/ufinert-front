# 🚗 Sistema de Gestión de Autos

Un sistema moderno y responsivo para la gestión de automóviles construido con Next.js 15, TypeScript y NextAuth.

## ✨ Características

### 🎯 Funcionalidades Principales
- **Autenticación segura** con NextAuth.js
- **CRUD completo** de automóviles (Crear, Leer, Actualizar, Eliminar)
- **Búsqueda avanzada** por marca, modelo, placa o color
- **Filtros inteligentes** por año y marca
- **Subida de imágenes** (campo simulado con URLs)
- **Diseño responsive** para todos los dispositivos
- **Modo demo** con datos de prueba

### 🎨 Diseño y UX
- Interfaz moderna y limpia
- Tarjetas de autos con imágenes
- Animaciones suaves
- Estadísticas en tiempo real
- Modal para crear/editar autos
- Indicadores de carga

### 📱 Responsive Design
- **Desktop** (1200px+): Grid de 3-4 columnas
- **Tablet** (768px-1199px): Grid de 2-3 columnas  
- **Mobile** (480px-767px): Grid de 1 columna
- **Mobile pequeño** (<480px): Layout optimizado

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

### Variables de Entorno
```env
# .env.local
NEXTAUTH_SECRET=tu_secreto_aqui
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_USE_MOCK=true
```

## 🎭 Modo Demo

El sistema incluye un modo demo que utiliza datos de prueba:

- **8 autos de ejemplo** con imágenes reales
- **Todas las operaciones CRUD** funcionan en memoria
- **Datos persistentes** durante la sesión
- **Simula delays** de red realistas

## 🔐 Autenticación

### Credenciales de Prueba
- **Email**: `admin@example.com`
- **Password**: `password123`

## 🔍 Funcionalidades

### Búsqueda General
Busca en todos los campos principales:
- Marca del auto
- Modelo del auto  
- Número de placa
- Color del auto

### Filtros Específicos
- **Por Año**: Dropdown con años disponibles
- **Por Marca**: Dropdown con marcas disponibles
- **Limpiar Filtros**: Resetea todos los filtros

### Gestión de Imágenes
- Campo URL para imagen del auto
- Soporte para URLs de Unsplash
- Vista previa en tarjetas
- Fallback cuando no hay imagen

## 📊 Tecnologías Utilizadas

- **Next.js 15** - Framework React
- **TypeScript** - Tipado estático
- **NextAuth.js** - Autenticación
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de schemas
- **CSS Modules** - Estilos modulares

---

**¡Disfruta gestionando tus autos!** 🚗✨
