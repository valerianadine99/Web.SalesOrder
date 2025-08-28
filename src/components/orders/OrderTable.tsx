// Componente de tabla para órdenes

import React from 'react';
import { useOrderStore } from '@/store/orderStore';
import { Order } from '@/types/api';
import { Button } from '@/components/ui';
import { Edit, Trash2, Eye, Package, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface OrderTableProps {
  onEdit: (order: Order) => void;
  onView: (order: Order) => void;
  onDelete: (order: Order) => void;
  isDeleting: number | null;
}

const OrderTable: React.FC<OrderTableProps> = ({ onEdit, onView, onDelete, isDeleting }) => {
  const { orders, pagination, isLoading } = useOrderStore();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
  };

  const calculateTotal = (order: Order) => {
    return order.orderDetails.reduce((total, detail) => {
      return total + (detail.quantity * detail.unitPrice);
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-secondary-400" />
        <h3 className="mt-2 text-sm font-medium text-secondary-900">No hay órdenes</h3>
        <p className="mt-1 text-sm text-secondary-500">
          No se encontraron órdenes con los filtros aplicados.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-secondary-200">
          <thead className="bg-secondary-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Orden
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Productos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Creado por
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-secondary-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-secondary-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                  #{order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-secondary-400" />
                    <div>
                      <div className="text-sm font-medium text-secondary-900">
                        {order.customerName}
                      </div>
                      <div className="text-sm text-secondary-500">
                        {order.customerEmail}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-secondary-400" />
                    <span className="text-sm text-secondary-900">
                      {formatDate(order.orderDate)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                  {formatCurrency(calculateTotal(order))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-secondary-400" />
                    <span className="text-sm text-secondary-900">
                      {order.orderDetails.length} producto{order.orderDetails.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                  {order.createdBy}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(order)}
                      className="text-primary-600 hover:text-primary-800"
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(order)}
                      className="text-secondary-600 hover:text-secondary-800"
                      title="Editar orden"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(order)}
                      className="text-danger-600 hover:text-danger-800"
                      title="Eliminar orden"
                      disabled={isDeleting === order.id}
                    >
                      {isDeleting === order.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-danger-600"></div>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Información de paginación */}
      {pagination.totalCount > 0 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-secondary-200 sm:px-6">
          <div className="text-sm text-secondary-700">
            Mostrando{' '}
            <span className="font-medium">
              {((pagination.pageNumber - 1) * pagination.pageSize) + 1}
            </span>{' '}
            a{' '}
            <span className="font-medium">
              {Math.min(pagination.pageNumber * pagination.pageSize, pagination.totalCount)}
            </span>{' '}
            de{' '}
            <span className="font-medium">{pagination.totalCount}</span>{' '}
            resultados
          </div>
          <div className="text-sm text-secondary-500">
            Página {pagination.pageNumber} de {pagination.totalPages}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
