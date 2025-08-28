// Store de órdenes usando Zustand

import { create } from 'zustand';
import { Order, CreateOrderCommand, UpdateOrderCommand, OrderFilters, PagedResult } from '@/types/api';
import { OrderService } from '@/lib/services/orderService';

interface OrderStore {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  
  // Actions
  fetchOrders: (filters?: OrderFilters) => Promise<void>;
  fetchOrderById: (id: number) => Promise<void>;
  createOrder: (orderData: CreateOrderCommand) => Promise<void>;
  updateOrder: (id: number, orderData: UpdateOrderCommand) => Promise<void>;
  deleteOrder: (id: number) => Promise<void>;
  setCurrentOrder: (order: Order | null) => void;
  clearError: () => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  pagination: {
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  },

  fetchOrders: async (filters: OrderFilters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const result = await OrderService.getOrders({
        pageNumber: get().pagination.pageNumber,
        pageSize: get().pagination.pageSize,
        ...filters,
      });
      
      set({
        orders: result.items,
        pagination: {
          pageNumber: result.pageNumber,
          pageSize: result.pageSize,
          totalCount: result.totalCount,
          totalPages: result.totalPages,
        },
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al cargar las órdenes',
        isLoading: false,
      });
    }
  },

  fetchOrderById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const order = await OrderService.getOrderById(id);
      set({ currentOrder: order, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al cargar la orden',
        isLoading: false,
      });
    }
  },

  createOrder: async (orderData: CreateOrderCommand) => {
    set({ isLoading: true, error: null });
    try {
      const newOrder = await OrderService.createOrder(orderData);
      set((state) => ({
        orders: [newOrder, ...state.orders],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al crear la orden',
        isLoading: false,
      });
      throw error;
    }
  },

  updateOrder: async (id: number, orderData: UpdateOrderCommand) => {
    set({ isLoading: true, error: null });
    try {
      const updatedOrder = await OrderService.updateOrder(id, orderData);
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === id ? updatedOrder : order
        ),
        currentOrder: state.currentOrder?.id === id ? updatedOrder : state.currentOrder,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al actualizar la orden',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteOrder: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await OrderService.deleteOrder(id);
      set((state) => ({
        orders: state.orders.filter((order) => order.id !== id),
        currentOrder: state.currentOrder?.id === id ? null : state.currentOrder,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al eliminar la orden',
        isLoading: false,
      });
      throw error;
    }
  },

  setCurrentOrder: (order: Order | null) => {
    set({ currentOrder: order });
  },

  clearError: () => {
    set({ error: null });
  },
}));
