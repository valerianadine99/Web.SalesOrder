// Página principal de la aplicación

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import LoginForm from '@/components/auth/LoginForm';

export default function HomePage() {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticación al cargar la página
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Si está autenticado, redirigir al dashboard
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Si no está autenticado, mostrar el formulario de login
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Mientras verifica la autenticación, mostrar loading
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );
}
