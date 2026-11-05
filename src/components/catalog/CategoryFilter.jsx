'use client';

export default function CategoryFilter({ categories = [], selectedCategory, onSelectCategory }) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 min-w-max pb-1">
        <button
          type="button"
          onClick={() => onSelectCategory(null)}
          className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer ${
            selectedCategory === null
              ? 'bg-[#0F172A] text-white shadow-2xs'
              : 'bg-white text-[#334155] hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Todos los Productos
        </button>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-[#059669] text-white shadow-2xs ring-1 ring-[#059669]'
                  : 'bg-white text-[#334155] hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.nombre}
            </button>
          );
        })}
      </div>
    </div>
  );
}
