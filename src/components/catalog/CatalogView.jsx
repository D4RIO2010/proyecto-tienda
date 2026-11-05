'use client';

import { useState, useMemo } from 'react';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import ProductCard from './ProductCard';
import { SlidersHorizontal, PackageOpen, RotateCcw } from 'lucide-react';

export default function CatalogView({ initialProducts = [], categories = [], storeConfig = {} }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortBy, setSortBy] = useState('destacados');

  // Filtrado y ordenamiento dinámico
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // 1. Filtro por Categoría
    if (selectedCategory) {
      result = result.filter((p) => p.categoria_id === selectedCategory);
    }

    // 2. Filtro por Búsqueda (Nombre, Descripción o SKU)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.nombre?.toLowerCase().includes(q) ||
          p.descripcion?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q)
      );
    }

    // 3. Ordenamiento
    result.sort((a, b) => {
      if (sortBy === 'destacados') {
        if (a.destacado && !b.destacado) return -1;
        if (!a.destacado && b.destacado) return 1;
        return new Date(b.created_at) - new Date(a.created_at);
      }
      if (sortBy === 'precio-asc') {
        return Number(a.precio) - Number(b.precio);
      }
      if (sortBy === 'precio-desc') {
        return Number(b.precio) - Number(a.precio);
      }
      if (sortBy === 'nombre-asc') {
        return a.nombre.localeCompare(b.nombre);
      }
      return 0;
    });

    return result;
  }, [initialProducts, selectedCategory, searchQuery, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSortBy('destacados');
  };

  return (
    <div className="space-y-6">
      {/* Barra de Búsqueda y Ordenamiento */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        <div className="flex items-center gap-2 self-end md:self-auto">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">Ordenar:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 shadow-2xs"
          >
            <option value="destacados">Destacados y Recientes</option>
            <option value="precio-asc">Menor precio</option>
            <option value="precio-desc">Mayor precio</option>
            <option value="nombre-asc">Nombre (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Filtro por Categorías */}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Conteo de Resultados */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <span>
          Mostrando <strong className="text-slate-800">{filteredProducts.length}</strong> de {initialProducts.length} productos
        </span>
        {(searchQuery || selectedCategory) && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>

      {/* Grilla de Productos */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              storeConfig={storeConfig}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center my-6">
          <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400 mb-3">
            <PackageOpen className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            No se encontraron productos
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
            No hay artículos que coincidan con los criterios de búsqueda o categoría seleccionada.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-emerald-600 transition-colors shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ver todo el inventario</span>
          </button>
        </div>
      )}
    </div>
  );
}
