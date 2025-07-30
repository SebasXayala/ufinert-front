// src/data/mockCars.ts
import { Car } from '../services/autoService';

export const mockCars: Car[] = [
  {
    id: '1',
    model: 'Fiesta',
    brand: 'Ford',
    color: 'Azul',
    year: '2025',
    plateNumber: 'ASD123',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    model: 'Corolla',
    brand: 'Toyota',
    color: 'Blanco',
    year: '2024',
    plateNumber: 'XYZ789',
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    model: 'Civic',
    brand: 'Honda',
    color: 'Negro',
    year: '2023',
    plateNumber: 'ABC456',
    imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=300&fit=crop'
  },
  {
    id: '4',
    model: 'Sentra',
    brand: 'Nissan',
    color: 'Gris',
    year: '2024',
    plateNumber: 'DEF789',
    imageUrl: 'https://images.unsplash.com/photo-1602731288648-4abf765b99ad?w=400&h=300&fit=crop'
  }
];
