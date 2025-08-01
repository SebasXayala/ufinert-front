# Clean Code - Mejores Prácticas Implementadas

## 🎯 Principios SOLID Aplicados

### Single Responsibility Principle (SRP)
```typescript
// ❌ Antes: Clase con múltiples responsabilidades
class CarManager {
  validateCar() { /* ... */ }
  saveCar() { /* ... */ }
  sendEmail() { /* ... */ }
}

// ✅ Después: Responsabilidades separadas
export const validatePlateNumber = (plate: string) => { /* ... */ }
export const createCar = async (data: CarData) => { /* ... */ }
// Email en otro servicio
```

### Open/Closed Principle (OCP)
```typescript
// ✅ Servicios abiertos para extensión, cerrados para modificación
interface ApiService {
  get(endpoint: string): Promise<any>;
  post(endpoint: string, data: any): Promise<any>;
}

// Fácil extensión sin modificar código existente
class CarApiService implements ApiService { /* ... */ }
class AuthApiService implements ApiService { /* ... */ }
```

### Dependency Inversion Principle (DIP)
```typescript
// ✅ Dependencia de abstracciones, no de concreciones
const config = {
  useMockData: process.env.NEXT_PUBLIC_USE_MOCK === 'true',
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL
};

// Service decide qué implementación usar
export const getCars = async () => {
  return config.useMockData ? getMockCars() : getApiCars();
};
```

## 🧹 Clean Code Practices

### 1. Nombres Descriptivos
```typescript
// ❌ Nombres poco claros
const u = getUserData();
const d = new Date();
const calc = (x, y) => x + y;

// ✅ Nombres descriptivos
const currentUser = getCurrentUserData();
const registrationDate = new Date();
const calculateTotalPrice = (basePrice: number, tax: number) => basePrice + tax;
```

### 2. Funciones Pequeñas y Puras
```typescript
// ✅ Funciones puras sin efectos secundarios
export const normalizeCar = (carData: any): Car => ({
  id: carData.id?.toString() || carData.id,
  model: carData.model,
  brand: carData.brand,
  year: carData.year?.toString() || carData.year,
  plateNumber: carData.plateNumber.toUpperCase(),
});

// ✅ Una sola responsabilidad
export const validatePlateNumber = (plateNumber: string): boolean => {
  const plateRegex = /^[A-Z]{3}\d{3}$/i;
  return plateRegex.test(plateNumber);
};
```

### 3. Manejo de Errores Consistente
```typescript
// ✅ Error handling uniforme
const parseApiResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Error ${response.status}: ${response.statusText}`;

    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // Keep original error if parsing fails
    }

    throw new Error(errorMessage);
  }

  return response.json();
};
```

### 4. Configuración Centralizada
```typescript
// ✅ Configuración en un solo lugar
const config: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || '',
  useMockData: process.env.NEXT_PUBLIC_USE_MOCK === 'true',
};

// ✅ Constantes centralizadas
export const VALIDATION_MESSAGES = {
  MODEL_REQUIRED: "El modelo es requerido",
  BRAND_REQUIRED: "La marca es requerida",
  PLATE_FORMAT: "La placa debe tener formato ABC123",
} as const;
```

## 📐 Arquitectura de Servicios

### Patrón Service Layer
```typescript
// ✅ Capa de servicios bien definida
interface CarService {
  getCars(token?: string): Promise<Car[]>;
  createCar(data: CarCreateRequest, token?: string): Promise<Car>;
  updateCar(id: string, data: Partial<CarCreateRequest>, token?: string): Promise<Car>;
  deleteCar(id: string, token?: string): Promise<void>;
}

// ✅ Implementación con fallbacks
export const createCar = async (carData: CarCreateRequest, token?: string): Promise<Car> => {
  try {
    return config.useMockData 
      ? await createCarInMock(carData) 
      : await createCarInApi(carData, token);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      return createCarInMock(carData); // Graceful degradation
    }
    throw error;
  }
};
```

### Separación API/Mock
```typescript
// ✅ Funciones específicas para cada contexto
const getCarsFromMock = async (): Promise<Car[]> => {
  await delay(500); // Simular latencia de red
  return [...mockStorage];
};

const getCarsFromApi = async (token?: string): Promise<Car[]> => {
  const response = await fetch(createApiUrl(''), {
    method: 'GET',
    headers: createHeaders(token),
  });
  
  const data = await parseApiResponse(response);
  return normalizeApiData(data);
};
```

## 🔐 Seguridad y Validación

### Validación con Zod
```typescript
// ✅ Schemas tipo-safe
export const carSchema = z.object({
  model: z.string().min(1, { message: VALIDATION_MESSAGES.MODEL_REQUIRED }),
  plateNumber: z.string().regex(APP_CONFIG.PLATE_PATTERN, { 
    message: VALIDATION_MESSAGES.PLATE_FORMAT 
  }),
});

export type CarFormData = z.infer<typeof carSchema>;
```

### JWT Handling Seguro
```typescript
// ✅ Decodificación segura de JWT
const decodeJWTPayload = (token: string): any => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null; // Fail gracefully
  }
};
```

## 🧪 Testing y Desarrollo

### Mock Data Realista
```typescript
// ✅ Datos mock que reflejan la realidad
export const mockCars: Car[] = [
  {
    id: '1',
    model: 'Civic',
    brand: 'Honda',
    color: 'Azul',
    year: '2022',
    plateNumber: 'ABC123',
    imageUrl: 'https://example.com/civic.jpg'
  }
];
```

### Environment Configuration
```typescript
// ✅ Configuración flexible por ambiente
const config = {
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || '',
  useMockData: process.env.NEXT_PUBLIC_USE_MOCK === 'true',
};
```

## 📊 Performance y Optimización

### Lazy Loading
```typescript
// ✅ Carga perezosa de componentes pesados
const CarModal = dynamic(() => import('./CarModal'), {
  loading: () => <div>Cargando...</div>
});
```

### Memoización
```typescript
// ✅ Memorizar cálculos costosos
const memoizedNormalizeData = useMemo(
  () => normalizeApiData(rawData),
  [rawData]
);
```

## 🔄 Estado y Side Effects

### Custom Hooks
```typescript
// ✅ Lógica reutilizable en hooks
export const useAuthToken = () => {
  const { data: session } = useSession();
  return (session as any)?.accessToken;
};
```

### Error Boundaries
```typescript
// ✅ Manejo de errores a nivel componente
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error) {
    console.error('Component error:', error);
    // Report to monitoring service
  }
}
```

## 📝 Documentación y Comentarios

### JSDoc para APIs Públicas
```typescript
/**
 * Validates car plate number format (ABC123)
 * @param plateNumber - The plate number to validate
 * @returns True if format is valid, false otherwise
 */
export const validatePlateNumber = (plateNumber: string): boolean => {
  const plateRegex = /^[A-Z]{3}\d{3}$/i;
  return plateRegex.test(plateNumber);
};
```

### Comentarios Explicativos
```typescript
// Extract username from JWT token payload instead of relying on backend response
const payload = decodeJWTPayload(data.token);
const username = payload?.sub || "usuario";
```

## 🚀 Deployment y Producción

### Build Optimization
```typescript
// ✅ Optimización de build
const nextConfig = {
  experimental: {
    turbopack: true, // Faster builds
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // Remove logs in prod
  }
};
```

### Environment Variables
```bash
# ✅ Variables por ambiente
# Development
NEXT_PUBLIC_USE_MOCK=true
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080

# Production  
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_BACKEND_URL=https://api.production.com
```

---

*Estas prácticas aseguran código mantenible, escalable y profesional para presentaciones técnicas.*
