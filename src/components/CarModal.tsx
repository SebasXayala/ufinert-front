// src/components/CarModal.tsx
"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { carSchema, CarFormData } from '../schemas/autoSchemas';
import { Car } from '../services/autoService';

interface CarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CarFormData) => Promise<void>;
  car?: Car;
  title: string;
  isLoading?: boolean;
}

export default function CarModal({ isOpen, onClose, onSubmit, car, title, isLoading = false }: CarModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      model: '',
      brand: '',
      color: '',
      year: new Date().getFullYear().toString(),
      plateNumber: '',
      imageUrl: ''
    }
  });

  useEffect(() => {
    if (car) {
      setValue('model', car.model);
      setValue('brand', car.brand);
      setValue('color', car.color);
      setValue('year', car.year);
      setValue('plateNumber', car.plateNumber);
      setValue('imageUrl', car.imageUrl || '');
    } else {
      reset();
    }
  }, [car, setValue, reset]);

  const handleFormSubmit = async (data: CarFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
        </div>
        
        <div className="modal-body">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="form-grid">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Marca</label>
                <input
                  {...register('brand')}
                  type="text"
                  className={`form-input ${errors.brand ? 'error' : ''}`}
                  placeholder="Ej: Ford"
                />
                {errors.brand && (
                  <span className="error-text">{errors.brand.message}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Modelo</label>
                <input
                  {...register('model')}
                  type="text"
                  className={`form-input ${errors.model ? 'error' : ''}`}
                  placeholder="Ej: Fiesta"
                />
                {errors.model && (
                  <span className="error-text">{errors.model.message}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Año</label>
                <input
                  {...register('year')}
                  type="text"
                  className={`form-input ${errors.year ? 'error' : ''}`}
                  placeholder="Ej: 2025"
                />
                {errors.year && (
                  <span className="error-text">{errors.year.message}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Color</label>
                <input
                  {...register('color')}
                  type="text"
                  className={`form-input ${errors.color ? 'error' : ''}`}
                  placeholder="Ej: Azul"
                />
                {errors.color && (
                  <span className="error-text">{errors.color.message}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Placa</label>
              <input
                {...register('plateNumber')}
                type="text"
                className={`form-input ${errors.plateNumber ? 'error' : ''}`}
                placeholder="Ej: ASD123"
                style={{ textTransform: 'uppercase' }}
              />
              {errors.plateNumber && (
                <span className="error-text">{errors.plateNumber.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">URL de la Imagen (Opcional)</label>
              <input
                {...register('imageUrl')}
                type="url"
                className={`form-input ${errors.imageUrl ? 'error' : ''}`}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              {errors.imageUrl && (
                <span className="error-text">{errors.imageUrl.message}</span>
              )}
              <small style={{ color: '#6c757d', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                Puedes usar URLs de Unsplash, por ejemplo: https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400
              </small>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={handleClose}
                className="btn-secondary"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Guardando...' : (car ? 'Actualizar' : 'Crear')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
