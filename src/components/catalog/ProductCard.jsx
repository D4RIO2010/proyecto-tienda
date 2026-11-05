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
    <article className="group relative flex flex-col bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Etiqueta de Destacado */}
      {product.destacado && (
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#059669] text-white shadow-xs">
          <Sparkles className="w-3 h-3" />
          <span>Destacado</span>
        </div>
      )}

      {/* Contenedor de Imagen */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden border-b border-slate-100">
        <Image
          src={displayImage}
          alt={product.nombre}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-102 transition-transform duration-300 ease-out"
          onError={() => setImgError(true)}
          priority={false}
        />

        {/* Badge de Stock */}
        <div className="absolute bottom-2 right-2">
          {isOutOfStock ? (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-50 text-rose-700 border border-rose-200">
              Agotado
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-emerald-50 text-[#059669] border border-emerald-200">
              {product.stock} disponibles
            </span>
          )}
        </div>
      </div>

      {/* Contenido / Información */}
      <div className="flex flex-col flex-1 p-4">
        {/* Categoría y SKU */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span className="font-semibold text-[#059669] uppercase tracking-wider text-[11px] truncate max-w-[150px]">
            {product.categorias?.nombre || 'General'}
          </span>
          {product.sku && (
            <span className="text-[10px] font-mono text-slate-400">
              SKU: {product.sku}
            </span>
          )}
        </div>

        {/* Título en Montserrat */}
        <h3
          style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
          className="font-bold text-[#0F172A] text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-[#059669] transition-colors"
        >
          {product.nombre}
        </h3>

        {/* Descripción en Inter (#334155) */}
        {product.descripcion && (
          <p className="mt-1 text-xs text-[#334155] line-clamp-2 leading-relaxed">
            {product.descripcion}
          </p>
        )}

        {/* Footer de la tarjeta con Precios y Botón Flat rounded-md */}
        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between gap-2">
            <div>
              <div
                style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                className="text-lg sm:text-xl font-extrabold text-[#0F172A] tracking-tight"
              >
                {formatUSD(product.precio)}
              </div>
              {showSecondary && (
                <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                  ≈ {formatSecondaryCurrency(product.precio, tasa, secondarySymbol)}
                </div>
              )}
            </div>

            {/* Botón Flat con Verde Nexa y rounded-md */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              aria-label={`Añadir ${product.nombre} al carrito`}
              className={`relative inline-flex items-center justify-center p-2.5 rounded-md font-medium transition-all duration-150 cursor-pointer ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : isAdded
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-[#059669] hover:bg-[#047857] text-white shadow-xs active:scale-95'
              }`}
            >
              {isAdded ? (
                <Check className="w-4 h-4 animate-in zoom-in-75" />
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
