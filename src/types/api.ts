// Tipos para la API SalesOrder

export interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  orderDetails: OrderDetail[];
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderDetail {
  id: number;
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface CreateOrderDetailDto {
  productName: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderCommand {
  customerName: string;
  customerEmail: string;
  orderDate: string;
  orderDetails: CreateOrderDetailDto[];
}

export interface UpdateOrderCommand {
  id: number;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  orderDetails: CreateOrderDetailDto[];
}

export interface OrderFilters {
  pageNumber?: number;
  pageSize?: number;
  customerFilter?: string;
  startDate?: string;
  endDate?: string;
}

export interface PagedResult<T> {
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
  username: string;
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
