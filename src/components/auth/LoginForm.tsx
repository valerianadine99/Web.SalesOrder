// Componente de formulario de login

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { Truck, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  username: z.string().min(1, 'El email es requerido').email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log('Enviando datos:', data); // Debug
    try {
      await login(data.username, data.password);
      toast('¡Bienvenido!', { icon: '✅' });
    } catch (error: any) {
      console.error('Error en login:', error); // Debug
      if (error.status === 401) {
        setError('root', {
          message: 'Credenciales inválidas. Por favor, verifica tu email y contraseña.',
        });
      } else {
        setError('root', {
          message: 'Error al iniciar sesión. Por favor, intenta nuevamente.',
        });
      }
      toast('Error al iniciar sesión', { icon: '❌' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary-100">
            <Truck className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-secondary-900">
            Sistema de Gestión Logística
          </h2>
          <p className="mt-2 text-center text-sm text-secondary-600">
            Inicia sesión para acceder al sistema
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              error={errors.username?.message}
              {...register('username')}
            />

            <div className="relative">
              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                placeholder="Tu contraseña"
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-secondary-400" />
                ) : (
                  <Eye className="h-5 w-5 text-secondary-400" />
                )}
              </button>
            </div>
          </div>

          {errors.root && (
            <div className="rounded-md bg-danger-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-danger-800">
                    {errors.root.message}
                  </h3>
                </div>
              </div>
            </div>
          )}

          <div>
            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-secondary-500">
              Reto Técnico - Proveedor Logístico
            </p>
            <p className="text-xs text-secondary-400 mt-1">
              Sistema de Gestión de Órdenes de Venta
            </p>
          </div>
        </form>

        {/* Información de usuarios de prueba */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            Usuarios de Prueba
          </h4>
          <div className="text-xs text-blue-700 space-y-1">
            <p><strong>Admin:</strong> admin@logistics.com / admin123</p>
            <p><strong>Usuario:</strong> user@logistics.com / user123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

