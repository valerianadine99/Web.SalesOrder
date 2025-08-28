// Componente de filtros para órdenes

import React, { useState } from 'react';
import { Input, Button } from '@/components/ui';
import { useOrderStore } from '@/store/orderStore';
import { Search, Filter, X } from 'lucide-react';

const OrderFilters: React.FC = () => {
  const { fetchOrders } = useOrderStore();
  
  const [localFilters, setLocalFilters] = useState({
    customerFilter: '',
    startDate: '',
    endDate: '',
  });

  const handleFilterChange = (key: string, value: string) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    fetchOrders(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      customerFilter: '',
      startDate: '',
      endDate: '',
    };
    
    setLocalFilters(clearedFilters);
    fetchOrders(clearedFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value !== '');

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-secondary-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-secondary-900 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filtros de Búsqueda
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-secondary-600 hover:text-secondary-800"
          >
            <X className="w-4 h-4 mr-1" />
            Limpiar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Cliente"
          placeholder="Nombre del cliente"
          value={localFilters.customerFilter}
          onChange={(e) => handleFilterChange('customerFilter', e.target.value)}
        />

        <Input
          label="Fecha Inicio"
          type="date"
          value={localFilters.startDate}
          onChange={(e) => handleFilterChange('startDate', e.target.value)}
        />

        <Input
          label="Fecha Fin"
          type="date"
          value={localFilters.endDate}
          onChange={(e) => handleFilterChange('endDate', e.target.value)}
        />
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          onClick={handleApplyFilters}
          className="px-6"
          disabled={!hasActiveFilters}
        >
          <Search className="w-4 h-4 mr-2" />
          Buscar
        </Button>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-secondary-200">
          <div className="flex flex-wrap gap-2">
            {localFilters.customerFilter && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                Cliente: {localFilters.customerFilter}
              </span>
            )}
            {localFilters.startDate && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                Desde: {new Date(localFilters.startDate).toLocaleDateString()}
              </span>
            )}
            {localFilters.endDate && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 text-secondary-800">
                Hasta: {new Date(localFilters.endDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderFilters;
