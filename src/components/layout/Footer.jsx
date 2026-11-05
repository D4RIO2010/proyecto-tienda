import Link from 'next/link';
import { MessageCircle, ShieldCheck, CreditCard } from 'lucide-react';

export default function Footer({ storeConfig }) {
  const storeName = storeConfig?.nombre_tienda || 'NexaStore';
  const metodos = storeConfig?.metodos_pago || ['Pago Móvil', 'Zelle', 'Efectivo', 'Transferencia'];
  const rawPhone = (storeConfig?.telefono_whatsapp || '584120000000').replace(/\D/g, '');

  return (
    <footer className="mt-20 bg-[#0F172A] text-slate-300 border-t border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Info NexaStore */}
          <div>
            <h3
              style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
              className="text-white text-base font-extrabold tracking-wider uppercase"
            >
              NEXASTORE
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed max-w-sm">
              Escaparate digital interactivo con pedidos directos a WhatsApp. Catálogo en tiempo real para cotizaciones y compras al instante.
            </p>
            <div className="mt-4">
              <a
                href={`https://wa.me/${rawPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold bg-[#059669] hover:bg-[#047857] text-white transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Atención directa por WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Métodos de Pago Aceptados */}
          <div>
            <h4
              style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
              className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 mb-3"
            >
              <CreditCard className="w-4 h-4 text-[#059669]" />
              <span>Formas de Pago Aceptadas</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {metodos.map((metodo, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-[11px] font-medium bg-[#1E293B] text-slate-300 rounded-md border border-slate-700/60"
                >
                  {metodo}
                </span>
              ))}
            </div>
            {storeConfig?.tasa_cambio && (
              <p className="mt-3 text-xs text-slate-400">
                Tasa de cambio operativa: <strong className="text-emerald-400">{storeConfig?.moneda_secundaria || 'Bs.'} {storeConfig.tasa_cambio}</strong>
              </p>
            )}
          </div>

          {/* Enlaces y Acceso de Administración */}
          <div className="md:text-right">
            <h4
              style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
              className="text-white text-xs font-bold uppercase tracking-wider mb-3"
            >
              Gestión Interna
            </h4>
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-[#059669]" />
              <span>Acceso Administrativo (Inventario y Precios)</span>
            </Link>
            <p className="mt-6 text-[11px] text-slate-500">
              © {new Date().getFullYear()} NEXASTORE. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
