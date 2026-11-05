'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Package,
  Settings,
  ExternalLink,
  LogOut,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    async function checkAuth() {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        setSession(currentSession);

        if (!currentSession && !isLoginPage) {
          router.replace('/admin/login');
        } else if (currentSession && isLoginPage) {
          router.replace('/admin');
        }
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession && !isLoginPage) {
        router.replace('/admin/login');
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [router, isLoginPage]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#059669] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-[#334155]">Cargando panel seguro NexaStore...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Productos', href: '/admin/productos', icon: Package },
    { label: 'Configuración', href: '/admin/configuracion', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      {/* Sidebar Desktop en Neutral Dark */}
      <aside className="hidden md:flex md:w-64 flex-col bg-[#0F172A] text-slate-200 border-r border-[#1E293B] shrink-0">
        <div className="p-6 border-b border-[#1E293B] flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-md overflow-hidden border border-emerald-500/40 bg-[#0F172A] shrink-0">
            <Image src="/logo.png" alt="NexaStore" fill sizes="40px" className="object-contain p-0.5" />
          </div>
          <div>
            <span
              style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
              className="font-extrabold text-sm text-white tracking-wider block uppercase"
            >
              NexaStore
            </span>
            <span className="text-[10px] text-slate-400 block font-mono truncate max-w-[140px]">
              {session.user.email}
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-md text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#059669] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-[#1E293B]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#1E293B] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-medium text-slate-400 hover:text-white hover:bg-[#1E293B] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Ver Tienda NexaStore</span>
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-medium text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Barra móvil */}
      <div className="md:hidden bg-[#0F172A] text-white px-4 py-3 flex items-center justify-between border-b border-[#1E293B] sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="relative w-7 h-7 rounded-md overflow-hidden border border-emerald-500/40 bg-[#0F172A] shrink-0">
            <Image src="/logo.png" alt="NexaStore" fill sizes="28px" className="object-contain" />
          </div>
          <span
            style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
            className="font-bold text-sm tracking-wider uppercase"
          >
            NexaStore Admin
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-slate-400 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menú desplegable móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F172A] border-b border-[#1E293B] p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2 rounded-md text-xs font-semibold ${
                  isActive ? 'bg-[#059669] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver Tienda</span>
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="text-xs text-rose-400 hover:text-rose-200 flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      )}

      {/* Contenido Principal Admin */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
