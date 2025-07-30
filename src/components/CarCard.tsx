// src/components/CarCard.tsx
"use client";

import { Pencil, Trash2 } from 'lucide-react';
import { Car } from '../types';

interface CarCardProps {
  car: Car;
  onEdit: (car: Car) => void;
  onDelete: (car: Car) => void;
}

export default function CarCard({ car, onEdit, onDelete }: CarCardProps) {
  return (
    <div className="car-card">
      {car.imageUrl && (
        <div className="car-image-container">
          <img
            src={car.imageUrl}
            alt={`${car.brand} ${car.model}`}
            className="car-image"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="car-header">
        <h3 className="car-title">{car.brand} {car.model}</h3>
        <div className="car-actions">
          <button
            onClick={() => onEdit(car)}
            className="btn-sm btn-edit"
            title="Editar auto"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(car)}
            className="btn-sm btn-delete"
            title="Eliminar auto"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="car-details">
        <div className="car-detail">
          <span className="detail-label">Año:</span>
          <span className="detail-value">{car.year}</span>
        </div>
        <div className="car-detail">
          <span className="detail-label">Color:</span>
          <span className="detail-value">{car.color}</span>
        </div>
        <div className="car-detail">
          <span className="detail-label">Placa:</span>
          <span className="detail-value">{car.plateNumber}</span>
        </div>
      </div>
    </div>
  );
}
