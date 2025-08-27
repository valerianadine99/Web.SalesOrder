// Store de órdenes usando Zustand

import { create } from 'zustand';
import { Order, OrderFilters, PaginatedResponse } from '@/types/api';
import { OrderService } from '@/lib/services/orderService';

interface OrderStore {
  orders: Order[];
  currentOrder: Order | null;
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  filters: OrderFilters;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchOrders: (filters?: OrderFilters) => Promise<void>;
  fetchOrderById: (id: number) => Promise<void>;
  createOrder: (orderData: any) => Promise<void>;
  updateOrder: (id: number, orderData: any) => Promise<void>;
  deleteOrder: (id: number) => Promise<void>;
  setFilters: (filters: Partial<OrderFilters>) => void;
  setPage: (pageNumber: number) => void;
  setPageSize: (pageSize: number) => void;
  clearError: () => void;
  resetStore: () => void;
}

const initialState = {
  orders: [],
  currentOrder: null,
  pagination: {
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  },
  filters: {
    pageNumber: 1,
    pageSize: 10,
  },
  isLoading: false,
  error: null,
};

export const useOrderStore = create<OrderStore>((set, get) => ({
  ...initialState,

  fetchOrders: async (filters?: OrderFilters) => {
    const currentFilters = get().filters;
    const newFilters = { ...currentFilters, ...filters };
    
    set({ isLoading: true, error: null });
    
    try {
      const response = await OrderService.getOrders(newFilters);
      
      set({
        orders: response.items,
        pagination: {
          pageNumber: response.pageNumber,
          pageSize: response.pageSize,
          totalCount: response.totalCount,
          totalPages: response.totalPages,
        },
        filters: newFilters,
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

  createOrder: async (orderData: any) => {
    set({ isLoading: true, error: null });
    
    try {
      await OrderService.createOrder(orderData);
      // Recargar las órdenes después de crear una nueva
      await get().fetchOrders();
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al crear la orden',
        isLoading: false,
      });
      throw error;
    }
  },

  updateOrder: async (id: number, orderData: any) => {
    set({ isLoading: true, error: null });
    
    try {
      await OrderService.updateOrder(id, orderData);
      // Recargar las órdenes después de actualizar
      await get().fetchOrders();
      set({ isLoading: false });
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
      // Recargar las órdenes después de eliminar
      await get().fetchOrders();
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al eliminar la orden',
        isLoading: false,
      });
      throw error;
    }
  },

  setFilters: (filters: Partial<OrderFilters>) => {
    const currentFilters = get().filters;
    const newFilters = { ...currentFilters, ...filters, pageNumber: 1 }; // Reset a página 1
    set({ filters: newFilters });
  },

  setPage: (pageNumber: number) => {
    const currentFilters = get().filters;
    const newFilters = { ...currentFilters, pageNumber };
    set({ filters: newFilters });
    get().fetchOrders(newFilters);
  },

  setPageSize: (pageSize: number) => {
    const currentFilters = get().filters;
    const newFilters = { ...currentFilters, pageSize, pageNumber: 1 }; // Reset a página 1
    set({ filters: newFilters });
    get().fetchOrders(newFilters);
  },

  clearError: () => {
    set({ error: null });
  },

  resetStore: () => {
    set(initialState);
  },
}));
