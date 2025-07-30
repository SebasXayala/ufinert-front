// src/services/autoService.ts
import { mockCars } from '../data/mockCars';
import { generateId, delay, formatPlateNumber } from '../utils';

export interface Car {
  id?: string;
  model: string;
  brand: string;
  color: string;
  year: string;
  plateNumber: string;
  imageUrl?: string;
}

export interface CarCreateRequest {
  model: string;
  brand: string;
  color: string;
  year: string;
  plateNumber: string;
  imageUrl?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK === 'true' || true; // Activar mock por defecto

const getAuthHeaders = () => {
  return {
    "Content-Type": "application/json",
  };
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
export const getCars = async (): Promise<Car[]> => {
  if (USE_MOCK_DATA) {
    await delay(500); // Simular delay de red
    console.log('🎭 Usando datos de prueba (mock)');
    return mockStorage;
  }

  try {
    const url = `${API_BASE_URL}/api/cars`;

    const res = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.warn('⚠️ Error conectando al backend, usando datos de prueba:', error);
    await delay(500);
    return mockStorage;
  }
};

// Crear nuevo auto
export const createCar = async (carData: CarCreateRequest): Promise<Car> => {
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

    const res = await fetch(url, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(carData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.warn('⚠️ Error conectando al backend para crear, usando mock:', error);
    await delay(800);
    const newCar: Car = {
      ...carData,
      id: generateId()
    };
    mockStorage.push(newCar);
    return newCar;
  }
};

// Actualizar auto
export const updateCar = async (id: string, carData: Partial<CarCreateRequest>): Promise<Car> => {
  if (USE_MOCK_DATA) {
    await delay(800);
    const index = mockStorage.findIndex(car => car.id === id);
    if (index === -1) {
      throw new Error('Auto no encontrado');
    }

    const updatedCar = { ...mockStorage[index], ...carData };
    mockStorage[index] = updatedCar;
    console.log('🎭 Auto actualizado en mock:', updatedCar);
    return updatedCar;
  }

  try {
    const url = `${API_BASE_URL}/api/cars/${id}`;

    const res = await fetch(url, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(carData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.warn('⚠️ Error conectando al backend para actualizar, usando mock:', error);
    await delay(800);
    const index = mockStorage.findIndex(car => car.id === id);
    if (index === -1) {
      throw new Error('Auto no encontrado');
    }

    const updatedCar = { ...mockStorage[index], ...carData };
    mockStorage[index] = updatedCar;
    return updatedCar;
  }
};

// Eliminar auto
export const deleteCar = async (id: string): Promise<void> => {
  if (USE_MOCK_DATA) {
    await delay(500);
    const index = mockStorage.findIndex(car => car.id === id);
    if (index === -1) {
      throw new Error('Auto no encontrado');
    }

    mockStorage.splice(index, 1);
    console.log('🎭 Auto eliminado del mock, ID:', id);
    return;
  }

  try {
    const url = `${API_BASE_URL}/api/cars/${id}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`);
    }
  } catch (error) {
    console.warn('⚠️ Error conectando al backend para eliminar, usando mock:', error);
    await delay(500);
    const index = mockStorage.findIndex(car => car.id === id);
    if (index === -1) {
      throw new Error('Auto no encontrado');
    }

    mockStorage.splice(index, 1);
  }
};
