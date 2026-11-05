import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, ShieldCheck, CreditCard, Clock, Phone, MapPin } from 'lucide-react';

export default function Footer({ storeConfig }) {
  const storeName = storeConfig?.nombre_tienda || 'NexaStore';
  const metodos = storeConfig?.metodos_pago || ['Pago Móvil', 'Zelle', 'Efectivo Divisas ($)', 'Transferencia Bancaria'];
  const rawPhone = (storeConfig?.telefono_whatsapp || '584120000000').replace(/\D/g, '');

  return (
    <footer className="mt-20 bg-[#0F172A] text-slate-200 border-t border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          
          {/* Columna 1: Identidad con Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-emerald-500/40 bg-[#0F172A] shadow-md">
                <Image
                  src="/logo.png"
                  alt="NexaStore Logo"
                  fill
                  sizes="48px"
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <span
                  style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                  className="font-black text-xl text-white tracking-wider uppercase block"
                >
                  NEXASTORE
                </span>
                <span className="text-xs font-bold text-emerald-400 block">
                  Catálogo Digital Interactivo
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              Plataforma oficial para cotizar y comprar repuestos, herramientas y productos de calidad con atención inmediata y pedidos directos por WhatsApp.
            </p>

            <div className="pt-1">
              <a
                href={`https://wa.me/${rawPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-xs font-bold bg-[#059669] hover:bg-[#047857] text-white shadow-md transition-all active:scale-98"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Atención y Cotizaciones WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Columna 2: Métodos de Pago con contraste nítido */}
          <div className="space-y-3">
            <h4
              style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
              className="text-white text-xs font-extrabold uppercase tracking-wider flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Métodos de Pago Aceptados</span>
            </h4>
            <p className="text-xs text-slate-300">
              Aceptamos los métodos más cómodos para tu compra:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {metodos.map((metodo, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 text-xs font-bold bg-[#1E293B] text-white rounded-md border border-slate-700 shadow-2xs"
                >
                  {metodo}
                </span>
              ))}
            </div>
            {storeConfig?.tasa_cambio && (
              <div className="mt-4 p-3 rounded-md bg-[#1E293B]/60 border border-slate-700/80">
                <span className="text-[11px] font-bold uppercase text-slate-300 block">
                  Tasa de cambio de referencia:
                </span>
                <span className="text-sm font-extrabold text-emerald-400 font-mono">
                  1 USD = {storeConfig?.moneda_secundaria || 'Bs.'} {storeConfig.tasa_cambio}
                </span>
              </div>
            )}
          </div>

          {/* Columna 3: Información y Enlaces */}
          <div className="space-y-3 md:text-right">
            <h4
              style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
              className="text-white text-xs font-extrabold uppercase tracking-wider"
            >
              Atención y Gestión
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2 md:justify-end">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Lunes a Sábado: 8:00 AM - 6:00 PM</span>
              </div>
              <div className="flex items-center gap-2 md:justify-end">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+{rawPhone}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Acceso Administrativo NexaStore</span>
              </Link>
              <p className="mt-4 text-[11px] font-semibold text-slate-400">
                © {new Date().getFullYear()} NEXASTORE. Todos los derechos reservados.
              </p>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
