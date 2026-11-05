import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      // Control del Drawer
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      // Añadir producto al carrito
      addItem: (product, qty = 1) => {
        const { items } = get();
        const existingIndex = items.findIndex((i) => i.id === product.id);

        if (existingIndex > -1) {
          const updatedItems = [...items];
          const newQty = updatedItems[existingIndex].cantidad + qty;
          const maxStock = product.stock ?? 999;
          updatedItems[existingIndex].cantidad = Math.min(newQty, maxStock);
          set({ items: updatedItems, isOpen: true });
        } else {
          const initialQty = Math.min(qty, product.stock ?? 999);
          set({
            items: [
              ...items,
              {
                id: product.id,
                nombre: product.nombre,
                precio: Number(product.precio),
                imagen_url: product.imagen_url,
                stock: product.stock ?? 999,
                sku: product.sku || '',
                cantidad: Math.max(1, initialQty),
              },
            ],
            isOpen: true,
          });
        }
      },

      // Eliminar producto
      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.id !== productId),
        });
      },

      // Modificar cantidad con delta (+1 o -1)
      updateQuantity: (productId, delta) => {
        const { items } = get();
        const updatedItems = items
          .map((item) => {
            if (item.id === productId) {
              const newQty = item.cantidad + delta;
              if (newQty <= 0) return null;
              const maxStock = item.stock ?? 999;
              return { ...item, cantidad: Math.min(newQty, maxStock) };
            }
            return item;
          })
          .filter(Boolean);

        set({ items: updatedItems });
      },

      // Ajustar cantidad directa
      setQuantity: (productId, quantity) => {
        const { items } = get();
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const updatedItems = items.map((item) => {
          if (item.id === productId) {
            const maxStock = item.stock ?? 999;
            return { ...item, cantidad: Math.min(quantity, maxStock) };
          }
          return item;
        });

        set({ items: updatedItems });
      },

      // Vaciar carrito
      clearCart: () => set({ items: [] }),

      // Métricas calculadas
      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.cantidad, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + item.precio * item.cantidad,
          0
        );
      },
    }),
    {
      name: 'shopping-cart-storage',
      storage: createJSONStorage(() => localStorage),
      // Evitar que isOpen se persista para que el drawer no se abra al recargar
      partialize: (state) => ({ items: state.items }),
    }
  )
);
