// src/services/autoService.ts
import { mockCars } from '../data/mockCars';
import { generateId, delay, formatPlateNumber } from '../utils';

// Interfaces exportadas para uso en types/index.ts
export interface Car {
  id?: string | number;
  model: string;
  brand: string;
  color: string;
  year: string | number;
  plateNumber: string;
  imageUrl?: string;
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

export interface CarCreateRequest {
  model: string;
  brand: string;
  color: string;
  year: string | number;
  plateNumber: string;
  imageUrl?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

const getAuthHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    console.log('🔑 Token agregado a headers:', token.substring(0, 20) + '...');
  } else {
    console.warn('⚠️ No se proporcionó token de autenticación');
  }

  return headers;
};

const handleApiError = (error: any): never => {
  if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
    throw new Error('No se puede conectar con el servidor. Usando datos de prueba...');
  }
  throw error;
};

// Storage local para mock data
let mockStorage: Car[] = [...mockCars];

// Obtener todos los autos con filtros opcionales
export const getCars = async (token?: string): Promise<Car[]> => {
  if (USE_MOCK_DATA) {
    await delay(500); // Simular delay de red
    console.log('🎭 Usando datos de prueba (mock)');
    return mockStorage;
  }

  try {
    const url = `${API_BASE_URL}/api/cars`;

    const res = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(token),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    console.log('✅ Autos obtenidos del backend:', data);

    const carsArray = Array.isArray(data) ? data : data.data || [];

    // Normalizar los datos para asegurar compatibilidad
    const normalizedCars: Car[] = carsArray.map((car: any) => ({
      id: car.id?.toString() || car.id,
      model: car.model,
      brand: car.brand,
      color: car.color,
      year: car.year?.toString() || car.year,
      plateNumber: car.plateNumber,
      imageUrl: car.imageUrl || '',
      user: car.user
    }));

    return normalizedCars;
  } catch (error) {
    console.warn('⚠️ Error conectando al backend:', error);
    handleApiError(error);
  }
};

// Crear nuevo auto
export const createCar = async (carData: CarCreateRequest, token?: string): Promise<Car> => {
  console.log('🚗 Iniciando creación de auto:', carData);
  console.log('🔑 Token disponible:', !!token);
  console.log('🎭 Usando mock data:', USE_MOCK_DATA);

  if (USE_MOCK_DATA) {
    await delay(800);
    const newCar: Car = {
      ...carData,
      id: generateId()
    };
    mockStorage.push(newCar);
    console.log('🎭 Auto creado en mock:', newCar);
    return newCar;
  }

  try {
    const url = `${API_BASE_URL}/api/cars`;
    console.log('📡 URL de creación:', url);

    // Convertir year a número para el backend
    const dataToSend = {
      ...carData,
      year: typeof carData.year === 'string' ? parseInt(carData.year) : carData.year
    };

    console.log('📦 Datos a enviar:', JSON.stringify(dataToSend, null, 2));

    const headers = getAuthHeaders(token);
    console.log('📋 Headers de la petición:', headers);

    const res = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(dataToSend),
    });

    console.log('📥 Respuesta del servidor:', {
      status: res.status,
      statusText: res.statusText,
      ok: res.ok,
      url: res.url,
      headers: Object.fromEntries(res.headers.entries())
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ Error del servidor (texto):', errorText);

      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        console.error('❌ No se pudo parsear el error como JSON');
      }

      console.error('❌ Error del servidor (parseado):', errorData);
      const errorMessage = (errorData as any)?.message || errorText || `Error ${res.status}: ${res.statusText}`;
      throw new Error(errorMessage);
    }

    const data = await res.json();
    console.log('✅ Auto creado en backend:', data);

    // Normalizar la respuesta para asegurar compatibilidad
    const normalizedCar: Car = {
      id: data.id?.toString() || data.id,
      model: data.model,
      brand: data.brand,
      color: data.color,
      year: data.year?.toString() || data.year,
      plateNumber: data.plateNumber,
      imageUrl: data.imageUrl || '',
      user: data.user
    };

    return normalizedCar;
  } catch (error) {
    console.error('❌ Error completo en createCar:', error);
    if (error instanceof Error) {
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
    }
    throw error;
  }
};

// Actualizar auto
export const updateCar = async (id: string | number, carData: Partial<CarCreateRequest>, token?: string): Promise<Car> => {
  const idString = id.toString(); // Normalizar ID a string

  if (USE_MOCK_DATA) {
    await delay(800);
    const index = mockStorage.findIndex(car => car.id?.toString() === idString);
    if (index === -1) {
      throw new Error('Auto no encontrado');
    }

    const updatedCar = { ...mockStorage[index], ...carData };
    mockStorage[index] = updatedCar;
    console.log('🎭 Auto actualizado en mock:', updatedCar);
    return updatedCar;
  }

  try {
    const url = `${API_BASE_URL}/api/cars/${idString}`;

    // Convertir year a número si existe
    const dataToSend = {
      ...carData,
      ...(carData.year && {
        year: typeof carData.year === 'string' ? parseInt(carData.year) : carData.year
      })
    };

    const res = await fetch(url, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(dataToSend),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    console.log('✅ Auto actualizado en backend:', data);

    // Normalizar la respuesta para asegurar compatibilidad
    const normalizedCar: Car = {
      id: data.id?.toString() || data.id,
      model: data.model,
      brand: data.brand,
      color: data.color,
      year: data.year?.toString() || data.year,
      plateNumber: data.plateNumber,
      imageUrl: data.imageUrl || '',
      user: data.user
    };

    return normalizedCar;
  } catch (error) {
    console.warn('⚠️ Error conectando al backend para actualizar:', error);
    handleApiError(error);
  }
};

// Eliminar auto
export const deleteCar = async (id: string | number, token?: string): Promise<void> => {
  const idString = id.toString(); // Normalizar ID a string

  if (USE_MOCK_DATA) {
    await delay(500);
    const index = mockStorage.findIndex(car => car.id?.toString() === idString);
    if (index === -1) {
      throw new Error('Auto no encontrado');
    }

    mockStorage.splice(index, 1);
    console.log('🎭 Auto eliminado del mock, ID:', idString);
    return;
  }

  try {
    const url = `${API_BASE_URL}/api/cars/${idString}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
    }

    console.log('✅ Auto eliminado del backend, ID:', idString);
  } catch (error) {
    console.warn('⚠️ Error conectando al backend para eliminar:', error);
    handleApiError(error);
  }
};
