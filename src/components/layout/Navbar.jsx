'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ShieldCheck, Wrench, MessageCircle } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function Navbar({ storeConfig }) {
  const { toggleCart, getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? getTotalItems() : 0;
  const storeName = storeConfig?.nombre_tienda || 'Catálogo Digital';
  const rawPhone = (storeConfig?.telefono_whatsapp || '584120000000').replace(/\D/g, '');

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo y Nombre de Tienda */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-900 to-emerald-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight block leading-tight">
                {storeName}
              </span>
              <span className="text-[11px] font-medium text-emerald-600 block">
                Catálogo Digital & Pedidos Directos
              </span>
            </div>
          </Link>

          {/* Acciones de Cabecera */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Botón WhatsApp directo */}
            <a
              href={`https://wa.me/${rawPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600" />
              <span>WhatsApp Tienda</span>
            </a>

            {/* Acceso Admin */}
            <Link
              href="/admin/login"
              className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors inline-flex items-center gap-1.5"
              title="Panel Administrativo"
            >
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline">Administración</span>
            </Link>

            {/* Botón Carrito */}
            <button
              type="button"
              onClick={toggleCart}
              aria-label="Abrir carrito de compras"
              className="relative inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-slate-900 text-white hover:bg-emerald-600 active:scale-95 transition-all duration-150 shadow-xs cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-semibold">Carrito</span>
              {totalItems > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-black rounded-full bg-emerald-500 text-white animate-in zoom-in-50">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
