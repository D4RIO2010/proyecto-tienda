'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Check, Sparkles } from 'lucide-react';
import { formatUSD, formatSecondaryCurrency } from '@/lib/utils/currency';
import { useCartStore } from '@/store/useCartStore';

export default function ProductCard({ product, storeConfig }) {
  const [isAdded, setIsAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const isOutOfStock = product.stock <= 0;
  const tasa = storeConfig?.tasa_cambio || 36.5;
  const secondarySymbol = storeConfig?.moneda_secundaria || 'Bs.';
  const showSecondary = storeConfig?.mostrar_moneda_secundaria ?? true;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const defaultPlaceholder =
    'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=600&q=80';
  const displayImage = imgError || !product.imagen_url ? defaultPlaceholder : product.imagen_url;

  return (
    <article className="group relative flex flex-col bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-emerald-400/60 transition-all duration-200">
      {/* Etiqueta de Destacado */}
      {product.destacado && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-black bg-[#059669] text-white shadow-md uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Destacado</span>
        </div>
      )}

      {/* Contenedor de Imagen con Efecto Hover */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden border-b border-slate-100">
        <Image
          src={displayImage}
          alt={product.nombre}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-106 transition-transform duration-300 ease-out"
          onError={() => setImgError(true)}
          priority={false}
        />

        {/* Badge de Stock con alto contraste */}
        <div className="absolute bottom-2.5 right-2.5 z-10">
          {isOutOfStock ? (
            <span className="px-2.5 py-1 text-[11px] font-black rounded-md bg-rose-100 text-rose-900 border border-rose-300 shadow-xs">
              Agotado
            </span>
          ) : (
            <span className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-white/95 backdrop-blur-xs text-[#047857] border border-emerald-300 shadow-xs">
              {product.stock} disponibles
            </span>
          )}
        </div>
      </div>

      {/* Información del Producto con Textos Ultra-Nítidos */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Categoría y SKU */}
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-extrabold text-[#047857] uppercase tracking-wider text-[11px] truncate max-w-[160px]">
            {product.categorias?.nombre || 'General'}
          </span>
          {product.sku && (
            <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
              #{product.sku}
            </span>
          )}
        </div>

        {/* Título en Montserrat Bold */}
        <h3
          style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
          className="font-black text-[#0F172A] text-base leading-snug line-clamp-2 group-hover:text-[#059669] transition-colors"
        >
          {product.nombre}
        </h3>

        {/* Descripción con texto legible */}
        {product.descripcion && (
          <p className="mt-1.5 text-xs text-[#334155] line-clamp-2 leading-relaxed">
            {product.descripcion}
          </p>
        )}

        {/* Footer de Tarjeta: Precios y Botón */}
        <div className="mt-auto pt-4 border-t border-slate-100">
          <div className="flex items-end justify-between gap-2">
            <div>
              <div
                style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight leading-none"
              >
                {formatUSD(product.precio)}
              </div>
              {showSecondary && (
                <div className="text-xs font-bold text-[#059669] mt-1 flex items-center gap-1">
                  <span>≈ {formatSecondaryCurrency(product.precio, tasa, secondarySymbol)}</span>
                </div>
              )}
            </div>

            {/* Botón Flat con Verde Nexa y micro-animación */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              aria-label={`Añadir ${product.nombre} al carrito`}
              className={`relative inline-flex items-center justify-center p-3 rounded-md font-bold transition-all duration-150 cursor-pointer shadow-xs ${
                isOutOfStock
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : isAdded
                  ? 'bg-emerald-700 text-white scale-95 shadow-inner'
                  : 'bg-[#059669] hover:bg-[#047857] text-white hover:shadow-md hover:scale-105 active:scale-95'
              }`}
            >
              {isAdded ? (
                <div className="flex items-center gap-1 text-xs">
                  <Check className="w-4 h-4 animate-in zoom-in-75" />
                  <span className="hidden sm:inline">Listo</span>
                </div>
              ) : (
                <ShoppingCart className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
