"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, Calendar, Building2, Filter } from "lucide-react";
import { getCars, createCar, updateCar, deleteCar } from "../../services/autoService";
import { Car, CarFormData } from "../../types";
import CarModal from "../../components/CarModal";
import CarCard from "../../components/CarCard";
import { ROUTES } from "../../constants";

export default function SeleccionPage() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Renderizar loading hasta que el componente esté montado
  if (!hasMounted) {
    return <div className="loading">Cargando...</div>;
  }

  return <MountedSeleccionPage />;
}

function MountedSeleccionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Obtener token directamente de la sesión
  const token = (session as any)?.accessToken;

  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(ROUTES.LOGIN);
    }
  }, [status, router]);

  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 Cargando autos con token:', !!token);
        const carsData = await getCars(token);
        console.log('📋 Datos recibidos:', carsData);
        console.log('📋 Primer auto ejemplo:', carsData[0]);
        setCars(carsData);
        setFilteredCars(carsData);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error al cargar los autos';
        setError(errorMessage);
        console.error('Error al cargar autos:', error);
      } finally {
        setLoading(false);
      }
    };

    if (session && token) {
      loadCars();
    }
  }, [session, token]);

  useEffect(() => {
    let filtered = cars;
    console.log('🔍 Aplicando filtros:', { searchTerm, yearFilter, brandFilter });
    console.log('🔍 Total autos:', cars.length);

    // Búsqueda por texto (marca, modelo, placa)
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(car =>
        car.brand.toLowerCase().includes(search) ||
        car.model.toLowerCase().includes(search) ||
        car.plateNumber.toLowerCase().includes(search) ||
        car.color.toLowerCase().includes(search)
      );
      console.log('🔍 Después de búsqueda:', filtered.length);
    }

    // Filtro por año - convertir ambos a string para comparar
    if (yearFilter) {
      console.log('🔍 Filtrando por año:', yearFilter);
      console.log('🔍 Años disponibles:', cars.map(car => `${car.year} (${typeof car.year})`));
      filtered = filtered.filter(car => {
        const match = String(car.year) === String(yearFilter);
        console.log(`🔍 ${car.brand} ${car.model} - año: ${car.year} (${typeof car.year}) vs ${yearFilter} = ${match}`);
        return match;
      });
      console.log('🔍 Después de filtro año:', filtered.length);
    }

    // Filtro por marca
    if (brandFilter) {
      filtered = filtered.filter(car => car.brand.toLowerCase() === brandFilter.toLowerCase());
      console.log('🔍 Después de filtro marca:', filtered.length);
    }

    console.log('🔍 Resultado final:', filtered.length);
    setFilteredCars(filtered);
  }, [cars, searchTerm, yearFilter, brandFilter]);

  const handleCreateCar = async (data: CarFormData) => {
    setIsSubmitting(true);
    try {
      const newCar = await createCar(data, token);
      setCars(prev => [...prev, newCar]);
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al crear el auto';
      setError(errorMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCar = async (data: CarFormData) => {
    if (!editingCar?.id) return;

    setIsSubmitting(true);
    try {
      const updatedCar = await updateCar(editingCar.id, data, token);
      setCars(prev => prev.map(car => car.id === editingCar.id ? updatedCar : car));
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el auto';
      setError(errorMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCar = async (car: Car) => {
    if (!car.id) return;

    if (window.confirm(`¿Estás seguro de que quieres eliminar el auto ${car.brand} ${car.model}?`)) {
      try {
        await deleteCar(car.id, token);
        setCars(prev => prev.filter(c => c.id !== car.id));
        setError(null);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el auto';
        setError(errorMessage);
      }
    }
  };

  const openCreateModal = () => {
    setEditingCar(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (car: Car) => {
    setEditingCar(car);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCar(undefined);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setYearFilter('');
    setBrandFilter('');
  };

  // Obtener años únicos para el filtro
  const uniqueYears = [...new Set(cars.map(car => String(car.year)))].sort((a, b) => b.localeCompare(a));

  // Obtener marcas únicas para el filtro
  const uniqueBrands = [...new Set(cars.map(car => car.brand))].sort();

  if (status === "loading") {
    return <div className="loading">Cargando...</div>;
  }

  if (!session) {
    return <div>No autorizado</div>;
  }

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>Sistema de Gestión de Autos</h1>
          <div className="header-right">
            <span className="user-info">
              Hola, {session.user?.name || (session.user as any)?.username || session.user?.email?.split('@')[0] || 'Usuario'}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: ROUTES.LOGIN })}
              className="logout-btn"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="main-container">
        {/* Estadísticas */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-number">{cars.length}</div>
            <div className="stat-label">Total de Autos</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{uniqueBrands.length}</div>
            <div className="stat-label">Marcas Diferentes</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{filteredCars.length}</div>
            <div className="stat-label">Resultados Filtrados</div>
          </div>
        </div>

        {/* Controles */}
        <div className="controls-section">
          <div className="controls-header">
            <h2 className="controls-title">Filtros de Búsqueda</h2>
            <button onClick={openCreateModal} className="btn-primary">
              + Agregar Auto
            </button>
          </div>

          <div className="filters-grid">
            <div className="form-group">
              <label className="form-label">
                <Search className="w-4 h-4 inline mr-2" />
                Búsqueda General
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por marca, modelo, placa o color..."
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Calendar className="w-4 h-4 inline mr-2" />
                Filtrar por Año
              </label>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="form-select"
              >
                <option value="">Todos los años</option>
                {uniqueYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Building2 className="w-4 h-4 inline mr-2" />
                Filtrar por Marca
              </label>
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="form-select"
              >
                <option value="">Todas las marcas</option>
                {uniqueBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <button
                onClick={clearFilters}
                className="btn-secondary"
                style={{ marginTop: '1.5rem' }}
              >
                <Filter className="w-4 h-4 inline mr-2" />
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="error-alert">
            Error: {error}
          </div>
        )}

        {/* Lista de Autos */}
        <div className="cars-section">
          <div className="section-header">
            <h2 className="section-title">
              Autos ({filteredCars.length})
            </h2>
          </div>

          {loading ? (
            <div className="loading">Cargando autos...</div>
          ) : filteredCars.length === 0 ? (
            <div className="empty-state">
              <h3>No hay autos que mostrar</h3>
              <p>
                {cars.length === 0
                  ? "No hay autos registrados. ¡Agrega el primer auto!"
                  : "No se encontraron autos con los filtros aplicados."
                }
              </p>
            </div>
          ) : (
            <div className="cars-grid">
              {filteredCars.map((car) => (
                <CarCard
                  key={car.id || `${car.plateNumber}-${car.model}`}
                  car={car}
                  onEdit={openEditModal}
                  onDelete={handleDeleteCar}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      <CarModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={editingCar ? handleUpdateCar : handleCreateCar}
        car={editingCar}
        title={editingCar ? 'Editar Auto' : 'Agregar Nuevo Auto'}
        isLoading={isSubmitting}
      />
    </>
  );
}
