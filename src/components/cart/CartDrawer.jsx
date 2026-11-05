'use client';

import { useState, useEffect } from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, MessageCircle, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatUSD, formatSecondaryCurrency } from '@/lib/utils/currency';
import CartItem from './CartItem';
import { sendWhatsAppOrder } from '@/lib/utils/whatsapp';

export default function CartDrawer({ storeConfig }) {
  const { items, isOpen, closeCart, clearCart, getTotalPrice, getTotalItems } =
    useCartStore();

  const [clienteNombre, setClienteNombre] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [notaEntrega, setNotaEntrega] = useState('');
  const [errorValidacion, setErrorValidacion] = useState('');
  const [mounted, setMounted] = useState(false);

  // Evitar hydration mismatch en persist
  useEffect(() => {
    setMounted(true);
  }, []);

  const metodosDisponibles = storeConfig?.metodos_pago || [
    'Pago Móvil',
    'Zelle',
    'Efectivo Divisas ($)',
    'Transferencia Bancaria',
  ];

  useEffect(() => {
    if (metodosDisponibles.length > 0 && !metodoPago) {
      setMetodoPago(metodosDisponibles[0]);
    }
  }, [metodosDisponibles, metodoPago]);

  // Bloquear scroll de la página cuando el drawer esté abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted) return null;
  if (!isOpen) return null;

  const totalUSD = getTotalPrice();
  const totalItems = getTotalItems();
  const tasa = storeConfig?.tasa_cambio || 36.5;
  const secondarySymbol = storeConfig?.moneda_secundaria || 'Bs.';
  const showSecondary = storeConfig?.mostrar_moneda_secundaria ?? true;

  const handleCheckout = (e) => {
    e.preventDefault();
    setErrorValidacion('');

    if (!clienteNombre.trim()) {
      setErrorValidacion('Por favor indica tu nombre para que podamos atenderte por WhatsApp.');
      return;
    }

    if (items.length === 0) {
      setErrorValidacion('Tu carrito está vacío.');
      return;
    }

    // Ejecuta la redirección a WhatsApp con formato ordenado
    sendWhatsAppOrder({
      items,
      clienteNombre: clienteNombre.trim(),
      metodoPago,
      notaEntrega: notaEntrega.trim(),
      totalUSD,
      tasa,
      monedaSecundaria: secondarySymbol,
      telefonoWhatsApp: storeConfig?.telefono_whatsapp || '584120000000',
      nombreTienda: storeConfig?.nombre_tienda || 'Catálogo Digital',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop oscuro con blur */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
          {/* Header del Carrito */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Tu Carrito</h2>
                <p className="text-xs text-slate-500">
                  {totalItems} {totalItems === 1 ? 'producto' : 'productos'} añadidos
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="p-2 text-xs font-medium text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Vaciar carrito"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={closeCart}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cuerpo: Lista de Productos o Estado Vacío */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Tu carrito está vacío</h3>
              <p className="text-sm text-slate-500 max-w-xs mb-6">
                Explora el catálogo y añade los repuestos o artículos que necesites.
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-medium text-sm hover:bg-emerald-600 transition-colors shadow-xs"
              >
                <span>Ver catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1 divide-y divide-slate-100">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* Footer de Checkout (Solo si hay items) */}
          {items.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50/70 p-6 space-y-4">
              {/* Resumen de totales */}
              <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-slate-200/70 shadow-2xs">
                <div className="flex items-center justify-between text-slate-600 text-xs">
                  <span>Subtotal en Divisas:</span>
                  <span className="font-semibold text-slate-900">{formatUSD(totalUSD)}</span>
                </div>
                {showSecondary && (
                  <div className="flex items-center justify-between text-slate-600 text-xs">
                    <span>Tasa de cambio ref.:</span>
                    <span className="font-mono text-slate-700">{secondarySymbol} {tasa}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-slate-900">Total a pagar:</span>
                  <div className="text-right">
                    <span className="text-xl font-black text-slate-900">
                      {formatUSD(totalUSD)}
                    </span>
                    {showSecondary && (
                      <p className="text-xs font-semibold text-emerald-700">
                        ≈ {formatSecondaryCurrency(totalUSD, tasa, secondarySymbol)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Formulario rápido para el pedido por WhatsApp */}
              <form onSubmit={handleCheckout} className="space-y-3">
                {errorValidacion && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorValidacion}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tu Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={clienteNombre}
                    onChange={(e) => setClienteNombre(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Método de pago
                    </label>
                    <select
                      value={metodoPago}
                      onChange={(e) => setMetodoPago(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    >
                      {metodosDisponibles.map((metodo) => (
                        <option key={metodo} value={metodo}>
                          {metodo}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Entrega / Retiro
                    </label>
                    <input
                      type="text"
                      value={notaEntrega}
                      onChange={(e) => setNotaEntrega(e.target.value)}
                      placeholder="Retiro en tienda / Envío"
                      className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    />
                  </div>
                </div>

                {/* Botón WhatsApp Checkout */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] transition-all duration-150 shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2.5 cursor-pointer text-sm"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Enviar Pedido a WhatsApp</span>
                </button>
              </form>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
