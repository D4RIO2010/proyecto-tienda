'use client';

import Image from 'next/image';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { formatUSD } from '@/lib/utils/currency';
import { useCartStore } from '@/store/useCartStore';

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCartStore();

  const defaultImg =
    'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=600&q=80';

  const subtotal = item.precio * item.cantidad;

  return (
    <div className="flex gap-3 py-3 border-b border-slate-100 last:border-b-0 items-center">
      {/* Miniatura */}
      <div className="relative w-16 h-16 rounded-md overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
        <Image
          src={item.imagen_url || defaultImg}
          alt={item.nombre}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>

      {/* Detalles con alto contraste */}
      <div className="flex-1 min-w-0">
        <h4
          style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
          className="text-xs sm:text-sm font-bold text-[#0F172A] line-clamp-1"
        >
          {item.nombre}
        </h4>
        <div className="text-xs text-slate-600 font-semibold font-mono mt-0.5">
          {formatUSD(item.precio)} c/u
        </div>

        {/* Controles de cantidad y precio total de la fila */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-slate-300 rounded-md bg-white overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => updateQuantity(item.id, -1)}
              className="p-1 hover:bg-slate-100 text-slate-700 transition-colors"
              aria-label="Disminuir cantidad"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="px-2.5 text-xs font-black text-[#0F172A] min-w-[24px] text-center">
              {item.cantidad}
            </span>
            <button
              type="button"
              disabled={item.cantidad >= (item.stock ?? 999)}
              onClick={() => updateQuantity(item.id, 1)}
              className="p-1 hover:bg-slate-100 text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              aria-label="Aumentar cantidad"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div
            style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
            className="text-sm font-black text-[#0F172A]"
          >
            {formatUSD(subtotal)}
          </div>
        </div>
      </div>

      {/* Botón borrar */}
      <button
        type="button"
        onClick={() => removeItem(item.id)}
        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors ml-1 self-start"
        title="Eliminar del carrito"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
