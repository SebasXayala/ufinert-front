// src/services/autoService.ts
import { mockCars } from '../data/mockCars';
import { generateId, delay } from '../utils';

// Interfaces
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Car {
  id?: string | number;
  model: string;
  brand: string;
  color: string;
  year: string | number;
  plateNumber: string;
  imageUrl?: string;
  user?: User;
}

export interface CarCreateRequest {
  model: string;
  brand: string;
  color: string;
  year: string | number;
  plateNumber: string;
  imageUrl?: string;
}

// Configuration
interface ApiConfig {
  baseUrl: string;
  useMockData: boolean;
}

const config: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || '',
  useMockData: process.env.NEXT_PUBLIC_USE_MOCK === 'true',
};

// Validar configuración al inicio
if (!config.useMockData && !config.baseUrl) {
  console.warn('⚠️ NEXT_PUBLIC_BACKEND_URL no está configurada. Usando mock data como fallback.');
}

// HTTP utilities
const createHeaders = (token?: string): HeadersInit => ({
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` }),
});

const createApiUrl = (endpoint: string): string => `${config.baseUrl}/api/cars${endpoint}`;

const parseApiResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `Error ${response.status}: ${response.statusText}`;

    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.message || errorData.error || errorMessage;

      // Log detallado para debugging
      console.error('API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        errorText
      });
    } catch {
      // Log el texto crudo si no se puede parsear como JSON
      console.error('Raw API Error:', errorText);
    }

    throw new Error(errorMessage);
  }

  return response.json();
};

// Data normalization and validation
export const validatePlateNumber = (plateNumber: string): boolean => {
  // Formato: 3 letras seguidas de 3 números (ABC123)
  const plateRegex = /^[A-Z]{3}\d{3}$/i;
  return plateRegex.test(plateNumber);
};

const normalizeCar = (carData: any): Car => ({
  id: carData.id?.toString() || carData.id,
  model: carData.model,
  brand: carData.brand,
  color: carData.color,
  year: carData.year?.toString() || carData.year,
  plateNumber: carData.plateNumber,
  imageUrl: carData.imageUrl || '',
  user: carData.user,
});

const normalizeApiData = (data: any): Car[] => {
  const carsArray = Array.isArray(data) ? data : data.data || [];
  return carsArray.map(normalizeCar);
};

// Mock data storage
let mockStorage: Car[] = [...mockCars];

// Mock service functions
const getCarsFromMock = async (): Promise<Car[]> => {
  await delay(500);
  return [...mockStorage];
};

const createCarInMock = async (carData: CarCreateRequest): Promise<Car> => {
  // Validar formato de placa
  if (!validatePlateNumber(carData.plateNumber)) {
    throw new Error('La placa debe tener el formato de 3 letras seguidas de 3 números, por ejemplo: ABC123');
  }

  await delay(800);
  const newCar: Car = {
    ...carData,
    id: generateId(),
    plateNumber: carData.plateNumber.toUpperCase() // Normalizar a mayúsculas
  };
  mockStorage.push(newCar);
  return newCar;
};

const updateCarInMock = async (id: string, carData: Partial<CarCreateRequest>): Promise<Car> => {
  // Validar formato de placa si se está actualizando
  if (carData.plateNumber && !validatePlateNumber(carData.plateNumber)) {
    throw new Error('La placa debe tener el formato de 3 letras seguidas de 3 números, por ejemplo: ABC123');
  }

  await delay(800);
  const index = mockStorage.findIndex(car => car.id?.toString() === id);

  if (index === -1) {
    throw new Error('Auto no encontrado');
  }

  const updatedCar = {
    ...mockStorage[index],
    ...carData,
    // Normalizar placa a mayúsculas si está presente
    ...(carData.plateNumber && { plateNumber: carData.plateNumber.toUpperCase() })
  };
  mockStorage[index] = updatedCar;
  return updatedCar;
};

const deleteCarFromMock = async (id: string): Promise<void> => {
  await delay(500);
  const index = mockStorage.findIndex(car => car.id?.toString() === id);

  if (index === -1) {
    throw new Error('Auto no encontrado');
  }

  mockStorage.splice(index, 1);
};

// API service functions
const getCarsFromApi = async (token?: string): Promise<Car[]> => {
  if (!config.baseUrl) {
    throw new Error('Backend URL not configured');
  }

  const response = await fetch(createApiUrl(''), {
    method: 'GET',
    headers: createHeaders(token),
  });

  const data = await parseApiResponse(response);
  return normalizeApiData(data);
};

const createCarInApi = async (carData: CarCreateRequest, token?: string): Promise<Car> => {
  if (!config.baseUrl) {
    throw new Error('Backend URL not configured');
  }

  // Validar formato de placa antes de enviar
  if (!validatePlateNumber(carData.plateNumber)) {
    throw new Error('La placa debe tener el formato de 3 letras seguidas de 3 números, por ejemplo: ABC123');
  }

  // El backend espera year como string, no como número
  const payload = {
    ...carData,
    year: carData.year.toString(), // Asegurar que year sea string
    plateNumber: carData.plateNumber.toUpperCase() // Normalizar a mayúsculas
  };

  console.log('Sending car data to API:', payload);
  console.log('API URL:', createApiUrl(''));
  console.log('Headers:', createHeaders(token));

  const response = await fetch(createApiUrl(''), {
    method: 'POST',
    headers: createHeaders(token),
    body: JSON.stringify(payload),
  });

  const data = await parseApiResponse(response);
  return normalizeCar(data);
};

const updateCarInApi = async (id: string, carData: Partial<CarCreateRequest>, token?: string): Promise<Car> => {
  // Validar formato de placa si se está actualizando
  if (carData.plateNumber && !validatePlateNumber(carData.plateNumber)) {
    throw new Error('La placa debe tener el formato de 3 letras seguidas de 3 números, por ejemplo: ABC123');
  }

  const payload = {
    ...carData,
    // Asegurar que year sea string si está presente
    ...(carData.year && { year: carData.year.toString() }),
    // Normalizar placa a mayúsculas si está presente
    ...(carData.plateNumber && { plateNumber: carData.plateNumber.toUpperCase() }),
  };

  const response = await fetch(createApiUrl(`/${id}`), {
    method: 'PUT',
    headers: createHeaders(token),
    body: JSON.stringify(payload),
  });

  const data = await parseApiResponse(response);
  return normalizeCar(data);
};

const deleteCarFromApi = async (id: string, token?: string): Promise<void> => {
  const response = await fetch(createApiUrl(`/${id}`), {
    method: 'DELETE',
    headers: createHeaders(token),
  });

  await parseApiResponse(response);
};

// Public API functions
export const getCars = async (token?: string): Promise<Car[]> => {
  try {
    return config.useMockData ? await getCarsFromMock() : await getCarsFromApi(token);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      console.warn('API not available, falling back to mock data');
      return getCarsFromMock();
    }
    throw error;
  }
};

export const createCar = async (carData: CarCreateRequest, token?: string): Promise<Car> => {
  try {
    return config.useMockData ? await createCarInMock(carData) : await createCarInApi(carData, token);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      console.warn('API not available, falling back to mock data');
      return createCarInMock(carData);
    }
    throw error;
  }
};

export const updateCar = async (id: string | number, carData: Partial<CarCreateRequest>, token?: string): Promise<Car> => {
  const carId = id.toString();

  try {
    return config.useMockData ? await updateCarInMock(carId, carData) : await updateCarInApi(carId, carData, token);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      console.warn('API not available, falling back to mock data');
      return updateCarInMock(carId, carData);
    }
    throw error;
  }
};

export const deleteCar = async (id: string | number, token?: string): Promise<void> => {
  const carId = id.toString();

  try {
    return config.useMockData ? await deleteCarFromMock(carId) : await deleteCarFromApi(carId, token);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Failed to fetch')) {
      console.warn('API not available, falling back to mock data');
      return deleteCarFromMock(carId);
    }
    throw error;
  }
};
