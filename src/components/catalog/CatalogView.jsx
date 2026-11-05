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

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    if (selectedCategory) {
      result = result.filter((p) => p.categoria_id === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.nombre?.toLowerCase().includes(q) ||
          p.descripcion?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q)
      );
    }

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
          <span className="text-xs text-[#334155] font-medium hidden sm:inline">Ordenar:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-semibold text-[#0F172A] bg-white border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] shadow-2xs"
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
      <div className="flex items-center justify-between text-xs text-[#334155] pt-1">
        <span>
          Mostrando <strong className="text-[#0F172A]">{filteredProducts.length}</strong> de {initialProducts.length} productos
        </span>
        {(searchQuery || selectedCategory) && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-[#059669] hover:underline font-semibold cursor-pointer"
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
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center my-6">
          <div className="w-16 h-16 rounded-md bg-[#F8FAFC] border border-slate-200 mx-auto flex items-center justify-center text-slate-400 mb-3">
            <PackageOpen className="w-8 h-8" />
          </div>
          <h3
            style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
            className="text-sm sm:text-base font-bold text-[#0F172A] mb-1 uppercase tracking-wide"
          >
            No se encontraron productos
          </h3>
          <p className="text-xs text-[#334155] max-w-sm mx-auto mb-5">
            No hay artículos que coincidan con los criterios de búsqueda o categoría seleccionada.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold bg-[#059669] hover:bg-[#047857] text-white transition-colors shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ver todo el catálogo</span>
          </button>
        </div>
      )}
    </div>
  );
}
