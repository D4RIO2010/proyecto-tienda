'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ShieldCheck, MessageCircle, Coins } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export default function Navbar({ storeConfig }) {
  const { toggleCart, getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalItems = mounted ? getTotalItems() : 0;
  const storeName = storeConfig?.nombre_tienda || 'NexaStore';
  const rawPhone = (storeConfig?.telefono_whatsapp || '584120000000').replace(/\D/g, '');
  const tasa = storeConfig?.tasa_cambio;
  const secondarySymbol = storeConfig?.moneda_secundaria || 'Bs.';

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0F172A]/95 backdrop-blur-md shadow-lg py-1'
          : 'bg-[#0F172A] py-2'
      } border-b border-[#1E293B] text-white`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3 sm:gap-4">
          
          {/* Logo Oficial NexaStore con imagen */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-lg overflow-hidden border border-emerald-500/30 group-hover:border-emerald-400 group-hover:scale-105 transition-all shadow-md bg-[#0F172A]">
              <Image
                src="/logo.png"
                alt="NexaStore Logo Oficial"
                fill
                sizes="48px"
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span
                  style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                  className="font-black text-xl sm:text-2xl text-white tracking-wider block leading-none uppercase group-hover:text-emerald-400 transition-colors"
                >
                  NEXASTORE
                </span>
                <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 tracking-wider uppercase mt-1">
                Catálogo Digital Retail
              </span>
            </div>
          </Link>

          {/* Tasa del día (Centro / Oculto en móviles pequeños) */}
          {tasa && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#1E293B]/80 border border-slate-700/60 text-xs font-semibold">
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300">Tasa del día:</span>
              <span className="text-white font-mono font-bold">1 USD = {secondarySymbol} {tasa}</span>
            </div>
          )}

          {/* Acciones de Cabecera */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Botón WhatsApp directo */}
            <a
              href={`https://wa.me/${rawPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-white bg-[#1E293B] hover:bg-[#334155] border border-emerald-500/40 rounded-md transition-all duration-150 shadow-xs hover:border-emerald-400 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
              <span>Soporte WhatsApp</span>
            </a>

            {/* Acceso Admin */}
            <Link
              href="/admin/login"
              className="p-2 sm:px-3 sm:py-2 text-xs font-bold text-slate-200 hover:text-white hover:bg-[#1E293B] rounded-md transition-colors inline-flex items-center gap-1.5 border border-transparent hover:border-slate-700"
              title="Panel Administrativo"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">Admin</span>
            </Link>

            {/* Botón Carrito interactivo con badge animado */}
            <button
              type="button"
              onClick={toggleCart}
              aria-label="Abrir carrito de compras"
              className="relative inline-flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-2.5 rounded-md bg-[#059669] hover:bg-[#047857] active:scale-95 text-white font-bold transition-all duration-150 shadow-md shadow-emerald-950/40 cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
              <span className="hidden sm:inline text-xs uppercase tracking-wider font-extrabold">Carrito</span>
              {totalItems > 0 ? (
                <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 text-xs font-black rounded-full bg-white text-[#0F172A] shadow-sm animate-bounce">
                  {totalItems}
                </span>
              ) : (
                <span className="hidden sm:inline-flex items-center justify-center min-w-[18px] h-[18px] text-[10px] text-emerald-100 font-bold">
                  0
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
