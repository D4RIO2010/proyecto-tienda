'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, Check, Package, Sparkles } from 'lucide-react';
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
    <article className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 overflow-hidden">
      {/* Etiqueta de Destacado */}
      {product.destacado && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white shadow-xs">
          <Sparkles className="w-3 h-3" />
          <span>Destacado</span>
        </div>
      )}

      {/* Contenedor de Imagen */}
      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
        <Image
          src={displayImage}
          alt={product.nombre}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          onError={() => setImgError(true)}
          priority={false}
        />

        {/* Badge de Stock flotante */}
        <div className="absolute bottom-2.5 right-2.5">
          {isOutOfStock ? (
            <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-rose-50 text-rose-700 border border-rose-200">
              Agotado
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              {product.stock} disponibles
            </span>
          )}
        </div>
      </div>

      {/* Contenido / Información del producto */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Categoría y SKU */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <span className="font-medium text-emerald-700 truncate max-w-[160px]">
            {product.categorias?.nombre || 'General'}
          </span>
          {product.sku && (
            <span className="text-[11px] font-mono text-slate-400">
              SKU: {product.sku}
            </span>
          )}
        </div>

        {/* Título */}
        <h3 className="font-semibold text-slate-900 text-base line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
          {product.nombre}
        </h3>

        {/* Descripción corta */}
        {product.descripcion && (
          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.descripcion}
          </p>
        )}

        {/* Espaciador flexible */}
        <div className="mt-auto pt-4">
          <div className="flex items-end justify-between gap-3">
            {/* Precios */}
            <div>
              <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {formatUSD(product.precio)}
              </div>
              {showSecondary && (
                <div className="text-xs font-semibold text-slate-500 mt-0.5">
                  ≈ {formatSecondaryCurrency(product.precio, tasa, secondarySymbol)}
                </div>
              )}
            </div>

            {/* Botón de añadir al carrito */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              aria-label={`Añadir ${product.nombre} al carrito`}
              className={`relative inline-flex items-center justify-center p-3 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : isAdded
                  ? 'bg-emerald-600 text-white shadow-sm scale-95'
                  : 'bg-slate-900 text-white hover:bg-emerald-600 shadow-sm hover:shadow active:scale-95'
              }`}
            >
              {isAdded ? (
                <Check className="w-5 h-5 animate-in zoom-in-75 duration-150" />
              ) : (
                <ShoppingCart className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
