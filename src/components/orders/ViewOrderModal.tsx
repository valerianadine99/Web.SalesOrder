// Modal para ver el detalle de una orden

import React from 'react';
import { Order } from '@/types/api';
import { X, Calendar, User, Mail, Package, DollarSign } from 'lucide-react';

interface ViewOrderModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
}

const ViewOrderModal: React.FC<ViewOrderModalProps> = ({ isOpen, order, onClose }) => {
  if (!isOpen || !order) return null;

  const calculateTotal = () => {
    return order.orderDetails.reduce((total, detail) => {
      return total + (detail.quantity * detail.unitPrice);
    }, 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">
            Detalle de la Orden #{order.id}
          </h2>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Información del Cliente */}
          <div className="bg-secondary-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-secondary-900 mb-4">
              Información del Cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-secondary-500" />
                <div>
                  <p className="text-sm text-secondary-600">Nombre</p>
                  <p className="font-medium text-secondary-900">{order.customerName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-secondary-500" />
                <div>
                  <p className="text-sm text-secondary-600">Email</p>
                  <p className="font-medium text-secondary-900">{order.customerEmail}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Información de la Orden */}
          <div className="bg-secondary-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-secondary-900 mb-4">
              Información de la Orden
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-secondary-500" />
                <div>
                  <p className="text-sm text-secondary-600">Fecha de la Orden</p>
                  <p className="font-medium text-secondary-900">
                    {formatDate(order.orderDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-secondary-500" />
                <div>
                  <p className="text-sm text-secondary-600">Productos</p>
                  <p className="font-medium text-secondary-900">
                    {order.orderDetails.length} producto{order.orderDetails.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-secondary-900">
              Productos de la Orden
            </h3>
            <div className="border border-secondary-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-secondary-200">
                <thead className="bg-secondary-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Cantidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Precio Unitario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-secondary-200">
                  {order.orderDetails.map((detail, index) => (
                    <tr key={index} className="hover:bg-secondary-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                        {detail.productName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                        {detail.productCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                        {detail.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                        ${detail.unitPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                        ${detail.subtotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-secondary-200 pt-4">
            <div className="flex justify-end">
              <div className="text-right">
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-6 w-6 text-primary-600" />
                  <span className="text-2xl font-bold text-primary-600">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-secondary-500">Total de la Orden</p>
              </div>
            </div>
          </div>

          {/* Metadatos */}
          <div className="bg-secondary-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-secondary-700 mb-3">
              Información del Sistema
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-secondary-600">Creado por:</p>
                <p className="text-secondary-900">{order.createdBy}</p>
                <p className="text-secondary-500">{formatDateTime(order.createdAt)}</p>
              </div>
              {order.updatedBy && (
                <div>
                  <p className="text-secondary-600">Actualizado por:</p>
                  <p className="text-secondary-900">{order.updatedBy}</p>
                  <p className="text-secondary-500">{formatDateTime(order.updatedAt!)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-secondary-600 text-white rounded-md hover:bg-secondary-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewOrderModal;

