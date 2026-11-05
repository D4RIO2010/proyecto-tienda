'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export default function FloatingWhatsApp({ storeConfig }) {
  const [showTooltip, setShowTooltip] = useState(true);
  const rawPhone = (storeConfig?.telefono_whatsapp || '584120000000').replace(/\D/g, '');

  return (
    <aside aria-label="Contacto por WhatsApp" className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Tooltip de atención rápida */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0F172A] text-white text-xs font-semibold shadow-xl border border-slate-700 animate-in fade-in slide-in-from-right-4 duration-300">
          <span>¿Dudas con un repuesto? ¡Escríbenos!</span>
          <button
            type="button"
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white ml-1 p-0.5"
            aria-label="Cerrar aviso"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Botón flotante animado */}
      <a
        href={`https://wa.me/${rawPhone}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar a NexaStore por WhatsApp"
        className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-[#059669] hover:bg-[#047857] text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
      >
        {/* Anillo de pulso animado */}
        <span className="absolute inset-0 rounded-full bg-[#059669] opacity-40 animate-ping pointer-events-none" />
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>
    </aside>
  );
}
