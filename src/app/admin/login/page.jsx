'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(
          error.message === 'Invalid login credentials'
            ? 'Credenciales inválidas. Verifica tu correo y contraseña.'
            : error.message
        );
        return;
      }

      if (data?.session) {
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setErrorMessage('Ocurrió un error inesperado al iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0F172A] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo Público</span>
        </Link>

        {/* Logo Oficial */}
        <div className="relative w-16 h-16 rounded-xl overflow-hidden mx-auto shadow-xl border border-emerald-500/40 bg-[#0F172A]">
          <Image
            src="/logo.png"
            alt="NexaStore Logo"
            fill
            sizes="64px"
            className="object-contain p-1"
            priority
          />
        </div>

        <h2
          style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
          className="mt-4 text-center text-2xl font-black text-[#0F172A] tracking-tight uppercase"
        >
          NEXASTORE ADMIN
        </h2>
        <p className="mt-1 text-center text-xs font-semibold text-slate-500">
          Inicia sesión para gestionar inventario, precios y pedidos.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200 rounded-xl sm:px-10">
          <form className="space-y-4" onSubmit={handleLogin}>
            {errorMessage && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nexastore.com"
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-medium rounded-md border border-slate-200 bg-white placeholder-slate-400 text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 text-xs font-medium rounded-md border border-slate-200 bg-white placeholder-slate-400 text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-md font-bold text-xs text-white bg-[#059669] hover:bg-[#047857] disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center cursor-pointer uppercase tracking-wider"
            >
              {loading ? 'Verificando credenciales...' : 'Ingresar al Panel'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
