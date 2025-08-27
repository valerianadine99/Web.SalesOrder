// Componente de tabla para órdenes

import React from 'react';
import { useOrderStore } from '@/store/orderStore';
import { Order, OrderStatus } from '@/types/api';
import { Button } from '@/components/ui';
import { Edit, Trash2, Eye, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface OrderTableProps {
  onEdit: (order: Order) => void;
  onView: (order: Order) => void;
  onDelete: (order: Order) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({ onEdit, onView, onDelete }) => {
  const { orders, pagination, isLoading, setPage, setPageSize } = useOrderStore();

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return <Clock className="w-4 h-4 text-warning-600" />;
      case OrderStatus.Confirmed:
        return <CheckCircle className="w-4 h-4 text-success-600" />;
      case OrderStatus.Shipped:
        return <Truck className="w-4 h-4 text-primary-600" />;
      case OrderStatus.Delivered:
        return <Package className="w-4 h-4 text-success-600" />;
      case OrderStatus.Cancelled:
        return <XCircle className="w-4 h-4 text-danger-600" />;
      default:
        return <Clock className="w-4 h-4 text-secondary-600" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return 'bg-warning-100 text-warning-800';
      case OrderStatus.Confirmed:
        return 'bg-success-100 text-success-800';
      case OrderStatus.Shipped:
        return 'bg-primary-100 text-primary-800';
      case OrderStatus.Delivered:
        return 'bg-success-100 text-success-800';
      case OrderStatus.Cancelled:
        return 'bg-danger-100 text-danger-800';
      default:
        return 'bg-secondary-100 text-secondary-800';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return 'Pendiente';
      case OrderStatus.Confirmed:
        return 'Confirmado';
      case OrderStatus.Shipped:
        return 'Enviado';
      case OrderStatus.Delivered:
        return 'Entregado';
      case OrderStatus.Cancelled:
        return 'Cancelado';
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
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
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                Productos
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
                  <div>
                    <div className="text-sm font-medium text-secondary-900">
                      {order.customerName}
                    </div>
                    <div className="text-sm text-secondary-500">
                      {order.customerEmail}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                  {formatDate(order.orderDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{getStatusLabel(order.status)}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                  {formatCurrency(order.total)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">
                  {order.orderDetails.length} producto{order.orderDetails.length !== 1 ? 's' : ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(order)}
                      className="text-primary-600 hover:text-primary-800"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(order)}
                      className="text-secondary-600 hover:text-secondary-800"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(order)}
                      className="text-danger-600 hover:text-danger-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-secondary-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(pagination.pageNumber - 1)}
            disabled={pagination.pageNumber <= 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(pagination.pageNumber + 1)}
            disabled={pagination.pageNumber >= pagination.totalPages}
          >
            Siguiente
          </Button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-secondary-700">
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
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(pagination.pageNumber - 1)}
                disabled={pagination.pageNumber <= 1}
                className="rounded-l-md"
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(pagination.pageNumber + 1)}
                disabled={pagination.pageNumber >= pagination.totalPages}
                className="rounded-r-md"
              >
                Siguiente
              </Button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTable;
