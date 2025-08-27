// Tipos para la API SalesOrder

export interface Order {
  id: number;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy?: string;
  isDeleted: boolean;
  orderDetails: OrderDetail[];
}

export interface OrderDetail {
  id: number;
  orderId: number;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy?: string;
  isDeleted: boolean;
}

export enum OrderStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  Shipped = 'Shipped',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled'
}

export interface CreateOrderRequest {
  customerName: string;
  customerEmail: string;
  orderDate: string;
  orderDetails: CreateOrderDetailRequest[];
}

export interface CreateOrderDetailRequest {
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
}

export interface UpdateOrderRequest {
  id: number;
  customerName?: string;
  customerEmail?: string;
  orderDate?: string;
  status?: OrderStatus;
  orderDetails?: UpdateOrderDetailRequest[];
}

export interface UpdateOrderDetailRequest {
  id?: number;
  productName?: string;
  productCode?: string;
  quantity?: number;
  unitPrice?: number;
}

export interface OrderFilters {
  customerName?: string;
  startDate?: string;
  endDate?: string;
  status?: OrderStatus;
  productCode?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
