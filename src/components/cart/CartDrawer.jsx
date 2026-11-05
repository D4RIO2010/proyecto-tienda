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

    sendWhatsAppOrder({
      items,
      clienteNombre: clienteNombre.trim(),
      metodoPago,
      notaEntrega: notaEntrega.trim(),
      totalUSD,
      tasa,
      monedaSecundaria: secondarySymbol,
      telefonoWhatsApp: storeConfig?.telefono_whatsapp || '584120000000',
      nombreTienda: storeConfig?.nombre_tienda || 'NexaStore',
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
          {/* Header del Carrito en Neutral Dark */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#0F172A] text-white border-b border-[#1E293B]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#059669] text-white rounded-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2
                  style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                  className="text-base font-bold text-white tracking-wide"
                >
                  Tu Carrito
                </h2>
                <p className="text-xs text-slate-300">
                  {totalItems} {totalItems === 1 ? 'producto' : 'productos'} en la orden
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="p-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-[#1E293B] rounded-md transition-colors"
                  title="Vaciar carrito"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={closeCart}
                className="p-2 text-slate-400 hover:text-white hover:bg-[#1E293B] rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cuerpo: Lista o Estado Vacío */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#F8FAFC]">
              <div className="w-20 h-20 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-400 mb-4 shadow-2xs">
                <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
              </div>
              <h3
                style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                className="text-base font-bold text-[#0F172A] mb-1"
              >
                Tu carrito está vacío
              </h3>
              <p className="text-xs text-[#334155] max-w-xs mb-6">
                Explora el catálogo de NexaStore y añade los artículos que necesites.
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#059669] text-white font-semibold text-xs hover:bg-[#047857] transition-colors shadow-xs"
              >
                <span>Explorar Catálogo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1 divide-y divide-slate-100 bg-white">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* Footer de Checkout */}
          {items.length > 0 && (
            <div className="border-t border-slate-200 bg-[#F8FAFC] p-6 space-y-4">
              {/* Resumen de totales */}
              <div className="space-y-1.5 bg-white p-3.5 rounded-md border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-[#334155]">
                  <span>Subtotal en Divisas:</span>
                  <span className="font-semibold text-[#0F172A]">{formatUSD(totalUSD)}</span>
                </div>
                {showSecondary && (
                  <div className="flex items-center justify-between text-xs text-[#334155]">
                    <span>Tasa de cambio ref.:</span>
                    <span className="font-mono text-slate-600">{secondarySymbol} {tasa}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                  <span
                    style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                    className="text-xs font-bold text-[#0F172A] uppercase tracking-wider"
                  >
                    Total a pagar:
                  </span>
                  <div className="text-right">
                    <span
                      style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                      className="text-xl font-extrabold text-[#0F172A]"
                    >
                      {formatUSD(totalUSD)}
                    </span>
                    {showSecondary && (
                      <p className="text-xs font-bold text-[#059669]">
                        ≈ {formatSecondaryCurrency(totalUSD, tasa, secondarySymbol)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Formulario */}
              <form onSubmit={handleCheckout} className="space-y-3">
                {errorValidacion && (
                  <div className="flex items-center gap-2 p-2.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorValidacion}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Tu Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={clienteNombre}
                    onChange={(e) => setClienteNombre(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full px-3 py-2 text-xs rounded-md border border-slate-200 bg-white placeholder-slate-400 text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                      Método de pago
                    </label>
                    <select
                      value={metodoPago}
                      onChange={(e) => setMetodoPago(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs rounded-md border border-slate-200 bg-white text-[#334155] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                    >
                      {metodosDisponibles.map((metodo) => (
                        <option key={metodo} value={metodo}>
                          {metodo}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                      Entrega / Retiro
                    </label>
                    <input
                      type="text"
                      value={notaEntrega}
                      onChange={(e) => setNotaEntrega(e.target.value)}
                      placeholder="Retiro / Envío"
                      className="w-full px-2.5 py-2 text-xs rounded-md border border-slate-200 bg-white placeholder-slate-400 text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669]"
                    />
                  </div>
                </div>

                {/* Botón WhatsApp Checkout Flat con Verde Nexa y rounded-md */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-md font-bold text-white bg-[#059669] hover:bg-[#047857] active:scale-[0.99] transition-all duration-150 shadow-sm flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Confirmar y Enviar a WhatsApp</span>
                </button>
              </form>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
