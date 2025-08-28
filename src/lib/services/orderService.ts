// Servicio de órdenes

import { apiClient } from '../api';
import { 
  Order, 
  CreateOrderCommand, 
  UpdateOrderCommand, 
  OrderFilters, 
  PagedResult 
} from '@/types/api';

export class OrderService {
  // Obtener todas las órdenes con paginación y filtros
  static async getOrders(filters: OrderFilters = {}): Promise<PagedResult<Order>> {
    const params = new URLSearchParams();
    
    if (filters.pageNumber) params.append('pageNumber', filters.pageNumber.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters.customerFilter) params.append('customerFilter', filters.customerFilter);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);

    const queryString = params.toString();
    const endpoint = queryString ? `/Orders?${queryString}` : '/Orders';
    
    return apiClient.get<PagedResult<Order>>(endpoint);
  }

  // Obtener orden por ID
  static async getOrderById(id: number): Promise<Order> {
    return apiClient.get<Order>(`/Orders/${id}`);
  }

  // Crear nueva orden
  static async createOrder(orderData: CreateOrderCommand): Promise<Order> {
    return apiClient.post<Order>('/Orders', orderData);
  }

  // Actualizar orden existente
  static async updateOrder(id: number, orderData: UpdateOrderCommand): Promise<Order> {
    return apiClient.put<Order>(`/Orders/${id}`, orderData);
  }

  // Eliminar orden
  static async deleteOrder(id: number): Promise<void> {
    return apiClient.delete(`/Orders/${id}`);
  }
}
