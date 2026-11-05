'use client';

export default function CategoryFilter({ categories = [], selectedCategory, onSelectCategory }) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 min-w-max pb-1">
        <button
          type="button"
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer ${
            selectedCategory === null
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
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
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
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
