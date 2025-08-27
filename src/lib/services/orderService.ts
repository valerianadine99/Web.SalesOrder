// Servicio para manejar órdenes

import { apiClient } from '../api';
import {
  Order,
  CreateOrderRequest,
  UpdateOrderRequest,
  OrderFilters,
  PaginatedResponse,
} from '@/types/api';

export class OrderService {
  // Obtener órdenes paginadas con filtros
  static async getOrders(filters: OrderFilters = {}): Promise<PaginatedResponse<Order>> {
    const params = new URLSearchParams();
    
    if (filters.customerName) params.append('customerName', filters.customerName);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.status) params.append('status', filters.status);
    if (filters.productCode) params.append('productCode', filters.productCode);
    if (filters.pageNumber) params.append('pageNumber', filters.pageNumber.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());

    const queryString = params.toString();
    const endpoint = `/orders${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<PaginatedResponse<Order>>(endpoint);
  }

  // Obtener una orden por ID
  static async getOrderById(id: number): Promise<Order> {
    return apiClient.get<Order>(`/orders/${id}`);
  }

  // Crear una nueva orden
  static async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    return apiClient.post<Order>('/orders', orderData);
  }

  // Actualizar una orden existente
  static async updateOrder(id: number, orderData: UpdateOrderRequest): Promise<Order> {
    return apiClient.put<Order>(`/orders/${id}`, orderData);
  }

  // Eliminar una orden (soft delete)
  static async deleteOrder(id: number): Promise<void> {
    return apiClient.delete<void>(`/orders/${id}`);
  }

  // Obtener órdenes por cliente y fecha
  static async getOrdersByCustomerAndDate(customerName: string, date: string): Promise<Order[]> {
    const params = new URLSearchParams({
      customerName,
      date,
    });
    
    return apiClient.get<Order[]>(`/orders/customer-date?${params.toString()}`);
  }

  // Obtener resumen de órdenes por estado
  static async getOrderSummaryByStatus(): Promise<any> {
    return apiClient.get('/orders/summary-by-status');
  }
}
