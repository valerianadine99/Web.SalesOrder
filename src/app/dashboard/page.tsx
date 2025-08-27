// Página del dashboard principal

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import OrderFilters from '@/components/orders/OrderFilters';
import OrderTable from '@/components/orders/OrderTable';
import { Button } from '@/components/ui';
import { Order } from '@/types/api';
import { Plus, LogOut, User, Package } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { fetchOrders, deleteOrder } = useOrderStore();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  useEffect(() => {
    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    // Cargar órdenes al montar el componente
    fetchOrders();
  }, [isAuthenticated, router, fetchOrders]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
      toast.success('Sesión cerrada exitosamente');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const handleCreateOrder = () => {
    // TODO: Implementar modal de creación de orden
    toast.info('Funcionalidad de creación de orden en desarrollo');
  };

  const handleEditOrder = (order: Order) => {
    // TODO: Implementar modal de edición de orden
    toast.info(`Editando orden #${order.id}`);
  };

  const handleViewOrder = (order: Order) => {
    // TODO: Implementar modal de visualización de orden
    toast.info(`Viendo orden #${order.id}`);
  };

  const handleDeleteOrder = async (order: Order) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar la orden #${order.id}?`)) {
      return;
    }

    setIsDeleting(order.id);
    try {
      await deleteOrder(order.id);
      toast.success('Orden eliminada exitosamente');
    } catch (error) {
      toast.error('Error al eliminar la orden');
    } finally {
      setIsDeleting(null);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-xl font-semibold text-secondary-900">
                Sistema de Gestión Logística
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-secondary-700">
                <User className="h-4 w-4 mr-2" />
                {user?.name || user?.email}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-secondary-600 hover:text-secondary-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-secondary-900">
                Gestión de Órdenes
              </h2>
              <p className="mt-1 text-sm text-secondary-600">
                Administra y monitorea todas las órdenes de venta del sistema
              </p>
            </div>
            <Button
              onClick={handleCreateOrder}
              className="bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Orden
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <OrderFilters />

        {/* Tabla de Órdenes */}
        <OrderTable
          onEdit={handleEditOrder}
          onView={handleViewOrder}
          onDelete={handleDeleteOrder}
        />
      </main>

      {/* Toast Container */}
      <div id="toast-container" />
    </div>
  );
}
