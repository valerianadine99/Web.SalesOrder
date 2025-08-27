// Componente de filtros para órdenes

import React, { useState } from 'react';
import { Input, Select, Button } from '@/components/ui';
import { OrderStatus } from '@/types/api';
import { useOrderStore } from '@/store/orderStore';
import { Search, Filter, X } from 'lucide-react';

const OrderFilters: React.FC = () => {
  const { filters, setFilters, fetchOrders } = useOrderStore();
  
  const [localFilters, setLocalFilters] = useState({
    customerName: filters.customerName || '',
    startDate: filters.startDate || '',
    endDate: filters.endDate || '',
    status: filters.status || '',
    productCode: filters.productCode || '',
  });

  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: OrderStatus.Pending, label: 'Pendiente' },
    { value: OrderStatus.Confirmed, label: 'Confirmado' },
    { value: OrderStatus.Shipped, label: 'Enviado' },
    { value: OrderStatus.Delivered, label: 'Entregado' },
    { value: OrderStatus.Cancelled, label: 'Cancelado' },
  ];

  const handleFilterChange = (key: string, value: string) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    const newFilters = {
      ...localFilters,
      pageNumber: 1, // Reset a página 1
    };
    setFilters(newFilters);
    fetchOrders(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      customerName: '',
      startDate: '',
      endDate: '',
      status: '',
      productCode: '',
      pageNumber: 1,
      pageSize: filters.pageSize,
    };
    
    setLocalFilters({
      customerName: '',
      startDate: '',
      endDate: '',
      status: '',
      productCode: '',
    });
    
    setFilters(clearedFilters);
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Input
          label="Cliente"
          placeholder="Nombre del cliente"
          value={localFilters.customerName}
          onChange={(e) => handleFilterChange('customerName', e.target.value)}
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

        <Select
          label="Estado"
          options={statusOptions}
          value={localFilters.status}
          onChange={(value) => handleFilterChange('status', value)}
        />

        <Input
          label="Código Producto"
          placeholder="Código del producto"
          value={localFilters.productCode}
          onChange={(e) => handleFilterChange('productCode', e.target.value)}
        />

        <div className="flex items-end">
          <Button
            onClick={handleApplyFilters}
            className="w-full"
            disabled={!hasActiveFilters}
          >
            <Search className="w-4 h-4 mr-2" />
            Buscar
          </Button>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-secondary-200">
          <div className="flex flex-wrap gap-2">
            {localFilters.customerName && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                Cliente: {localFilters.customerName}
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
            {localFilters.status && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                Estado: {statusOptions.find(opt => opt.value === localFilters.status)?.label}
              </span>
            )}
            {localFilters.productCode && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
                Producto: {localFilters.productCode}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderFilters;
