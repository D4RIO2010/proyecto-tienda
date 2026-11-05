'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatUSD, formatSecondaryCurrency } from '@/lib/utils/currency';

export default function MobileCartPill({ storeConfig }) {
  const { openCart, getTotalItems, getTotalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalItems = getTotalItems();
  const totalUSD = getTotalPrice();
  const tasa = storeConfig?.tasa_cambio || 36.5;
  const secondarySymbol = storeConfig?.moneda_secundaria || 'Bs.';
  const showSecondary = storeConfig?.mostrar_moneda_secundaria ?? true;

  if (totalItems === 0) return null;

  return (
    <div className="sm:hidden fixed bottom-5 left-4 right-4 z-30 animate-in slide-in-from-bottom-5 duration-300">
      <button
        type="button"
        onClick={openCart}
        className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white p-3.5 rounded-xl shadow-2xl border border-slate-700/80 flex items-center justify-between gap-3 active:scale-[0.99] transition-all cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <div className="relative p-2 bg-[#059669] text-white rounded-lg">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-1.5 -right-1.5 bg-white text-[#0F172A] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
              {totalItems}
            </span>
          </div>
          <div className="text-left">
            <span className="text-xs font-bold text-white block">
              {totalItems} {totalItems === 1 ? 'artículo' : 'artículos'}
            </span>
            {showSecondary && (
              <span className="text-[10px] font-semibold text-emerald-400 block">
                {formatSecondaryCurrency(totalUSD, tasa, secondarySymbol)}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-extrabold text-white font-mono">
            {formatUSD(totalUSD)}
          </span>
          <div className="p-1.5 bg-[#059669] text-white rounded-md">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </button>
    </div>
  );
}
