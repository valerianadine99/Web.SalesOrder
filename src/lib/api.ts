// Configuración de la API

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7028/api';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: string[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('ApiClient: Haciendo request a:', url);
    console.log('ApiClient: Opciones:', { ...options, body: options.body ? '[BODY]' : undefined });
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Agregar headers adicionales si existen
    if (options.headers) {
      if (options.headers instanceof Headers) {
        options.headers.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(options.headers)) {
        options.headers.forEach(([key, value]) => {
          headers[key] = value;
        });
      } else {
        Object.assign(headers, options.headers);
      }
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
      console.log('ApiClient: Token incluido en headers');
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    try {
      console.log('ApiClient: Enviando request...');
      const response = await fetch(url, config);
      console.log('ApiClient: Respuesta recibida:', response.status, response.statusText);
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        let errors: string[] = [];

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          errors = errorData.errors || [];
        } catch {
          // Si no se puede parsear el error, usar el mensaje por defecto
        }

        console.error('ApiClient: Error en respuesta:', errorMessage);
        throw new ApiError(errorMessage, response.status, errors);
      }

      // Si la respuesta es 204 (No Content), retornar null
      if (response.status === 204) {
        console.log('ApiClient: Respuesta 204 - No Content');
        return null as T;
      }

      // Intentar parsear la respuesta JSON
      try {
        const data = await response.json();
        console.log('ApiClient: Respuesta parseada:', data);
        return data;
      } catch {
        // Si no es JSON, retornar la respuesta como texto
        const text = await response.text();
        console.log('ApiClient: Respuesta como texto:', text);
        return text as T;
      }
    } catch (error) {
      console.error('ApiClient: Error en request:', error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
    }
  }

  // Métodos HTTP
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Instancia global del cliente API
export const apiClient = new ApiClient();

// Función helper para obtener el token del localStorage
export const getStoredToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

// Función helper para establecer el token en localStorage
export const setStoredToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
};

// Función helper para remover el token del localStorage
export const removeStoredToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

// Inicializar el token si existe en localStorage
if (typeof window !== 'undefined') {
  const token = getStoredToken();
  if (token) {
    apiClient.setToken(token);
  }
}
