// Servicio de autenticación

import { apiClient, setStoredToken, removeStoredToken } from '../api';
import { LoginRequest, LoginResponse, User } from '@/types/api';

export class AuthService {
  // Login del usuario
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    console.log('AuthService: Iniciando login con credenciales:', { ...credentials, password: '***' });
    try {
      console.log('AuthService: Haciendo POST a /Auth/login...');
      const response = await apiClient.post<LoginResponse>('/Auth/login', credentials);
      console.log('AuthService: Respuesta del servidor:', response);
      
      // Guardar el token en localStorage y en el cliente API
      if (response.token) {
        console.log('AuthService: Guardando token...');
        setStoredToken(response.token);
        apiClient.setToken(response.token);
        console.log('AuthService: Token guardado correctamente');
      } else {
        console.warn('AuthService: No se recibió token en la respuesta');
      }
      
      return response;
    } catch (error) {
      console.error('AuthService: Error en login:', error);
      throw error;
    }
  }

  // Logout del usuario
  static async logout(): Promise<void> {
    try {
      // Llamar al endpoint de logout si existe
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Si falla el logout en el servidor, continuar con el logout local
      console.warn('Logout del servidor falló, continuando con logout local');
    } finally {
      // Limpiar token local
      removeStoredToken();
      apiClient.clearToken();
    }
  }

  // Verificar si el usuario está autenticado
  static isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token;
  }

  // Obtener información del usuario actual
  static async getCurrentUser(): Promise<User | null> {
    try {
      const user = await apiClient.get<User>('/auth/me');
      return user;
    } catch (error) {
      // Si falla, limpiar token y retornar null
      removeStoredToken();
      apiClient.clearToken();
      return null;
    }
  }

  // Refrescar el token
  static async refreshToken(): Promise<string | null> {
    try {
      const response = await apiClient.post<{ token: string }>('/auth/refresh');
      if (response.token) {
        setStoredToken(response.token);
        apiClient.setToken(response.token);
        return response.token;
      }
      return null;
    } catch (error) {
      // Si falla el refresh, hacer logout
      await this.logout();
      return null;
    }
  }

  // Verificar si el token ha expirado
  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
}
