'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ShieldCheck, MessageCircle, Store } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function Navbar({ storeConfig }) {
  const { toggleCart, getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? getTotalItems() : 0;
  const storeName = storeConfig?.nombre_tienda || 'NexaStore';
  const rawPhone = (storeConfig?.telefono_whatsapp || '584120000000').replace(/\D/g, '');

  return (
    <header className="sticky top-0 z-40 bg-[#0F172A] border-b border-[#1E293B] shadow-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Logo e Identidad NexaStore */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-md bg-[#059669] text-white flex items-center justify-center shadow-xs group-hover:bg-[#047857] transition-colors">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span
                style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                className="font-extrabold text-lg sm:text-xl text-white tracking-wider block leading-tight uppercase"
              >
                NEXASTORE
              </span>
              <span className="text-[11px] font-medium text-emerald-400 block tracking-tight">
                {storeName !== 'NexaStore' ? storeName : 'Catálogo Digital Retail'}
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
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-300 bg-[#1E293B] hover:bg-[#334155] border border-emerald-500/30 rounded-md transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#059669]" />
              <span>WhatsApp Tienda</span>
            </a>

            {/* Acceso Admin */}
            <Link
              href="/admin/login"
              className="p-2 sm:px-3 sm:py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-[#1E293B] rounded-md transition-colors inline-flex items-center gap-1.5"
              title="Panel Administrativo"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">Administración</span>
            </Link>

            {/* Botón Carrito con Verde Nexa y rounded-md */}
            <button
              type="button"
              onClick={toggleCart}
              aria-label="Abrir carrito de compras"
              className="relative inline-flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-md bg-[#059669] hover:bg-[#047857] active:scale-98 text-white font-semibold transition-all duration-150 shadow-sm cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-bold">Carrito</span>
              {totalItems > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-black rounded-full bg-white text-[#059669] animate-in zoom-in-50">
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
