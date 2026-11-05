'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  Settings,
  PhoneCall,
  Coins,
  Store,
  CreditCard,
  Plus,
  Trash2,
  Check,
  AlertCircle,
} from 'lucide-react';

export default function AdminConfiguracionPage() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [nuevoMetodo, setNuevoMetodo] = useState('');

  useEffect(() => {
    async function loadConfig() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('configuracion_tienda')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        if (data) setConfig(data);
      } catch (err) {
        console.error('Error al cargar configuración:', err);
        setErrorMessage('No se pudo cargar la configuración de la tienda.');
      } finally {
        setLoading(false);
      }
    }

    loadConfig();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const payload = {
        nombre_tienda: config.nombre_tienda.trim(),
        telefono_whatsapp: config.telefono_whatsapp.replace(/\D/g, ''),
        mensaje_bienvenida: config.mensaje_bienvenida.trim(),
        tasa_cambio: parseFloat(config.tasa_cambio),
        moneda_principal: config.moneda_principal.trim(),
        moneda_secundaria: config.moneda_secundaria.trim(),
        mostrar_moneda_secundaria: config.mostrar_moneda_secundaria,
        metodos_pago: config.metodos_pago || [],
      };

      if (config.id) {
        const { error } = await supabase
          .from('configuracion_tienda')
          .update(payload)
          .eq('id', config.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('configuracion_tienda')
          .insert([payload]);

        if (error) throw error;
      }

      setSuccessMessage('¡Configuración guardada exitosamente!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error al guardar configuración:', err);
      setErrorMessage(err.message || 'Error al guardar configuración.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddMetodo = () => {
    if (!nuevoMetodo.trim()) return;
    const actuales = config.metodos_pago || [];
    if (!actuales.includes(nuevoMetodo.trim())) {
      setConfig({
        ...config,
        metodos_pago: [...actuales, nuevoMetodo.trim()],
      });
      setNuevoMetodo('');
    }
  };

  const handleRemoveMetodo = (metodoToRemove) => {
    setConfig({
      ...config,
      metodos_pago: (config.metodos_pago || []).filter((m) => m !== metodoToRemove),
    });
  };

  if (loading) {
    return (
      <div className="p-12 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Cabecera */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Configuración Operativa de la Tienda
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Ajusta el número de WhatsApp receptor, la tasa de cambio y métodos de pago.
        </p>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Identidad de la Tienda y WhatsApp */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
            <Store className="w-4 h-4 text-emerald-600" />
            <span>Datos Generales y Contacto</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nombre de la Tienda
              </label>
              <input
                type="text"
                required
                value={config?.nombre_tienda || ''}
                onChange={(e) => setConfig({ ...config, nombre_tienda: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Número de WhatsApp Receptor (con código de país)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="584120000000"
                  value={config?.telefono_whatsapp || ''}
                  onChange={(e) => setConfig({ ...config, telefono_whatsapp: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Ingresa solo dígitos, sin signos `+`, espacios ni guiones (ej. 584121234567).
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Encabezado del Mensaje de WhatsApp
            </label>
            <input
              type="text"
              value={config?.mensaje_bienvenida || ''}
              onChange={(e) => setConfig({ ...config, mensaje_bienvenida: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Monedas y Tasa de Cambio */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
            <Coins className="w-4 h-4 text-emerald-600" />
            <span>Monedas y Tasa de Cambio</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Moneda Principal
              </label>
              <input
                type="text"
                value={config?.moneda_principal || 'USD'}
                onChange={(e) => setConfig({ ...config, moneda_principal: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Símbolo Moneda Secundaria
              </label>
              <input
                type="text"
                value={config?.moneda_secundaria || 'Bs.'}
                onChange={(e) => setConfig({ ...config, moneda_secundaria: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tasa de Cambio (1 USD = X)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={config?.tasa_cambio || ''}
                onChange={(e) => setConfig({ ...config, tasa_cambio: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 pt-1">
            <input
              type="checkbox"
              checked={config?.mostrar_moneda_secundaria ?? true}
              onChange={(e) =>
                setConfig({ ...config, mostrar_moneda_secundaria: e.target.checked })
              }
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>Mostrar conversión referencial en moneda secundaria en el catálogo y carrito</span>
          </label>
        </div>

        {/* Métodos de Pago */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>Métodos de Pago Aceptados</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {(config?.metodos_pago || []).map((m, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold border border-slate-200"
              >
                <span>{m}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveMetodo(m)}
                  className="text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 max-w-sm pt-2">
            <input
              type="text"
              value={nuevoMetodo}
              onChange={(e) => setNuevoMetodo(e.target.value)}
              placeholder="Ej. Binance Pay / USDT"
              className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
            <button
              type="button"
              onClick={handleAddMetodo}
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir</span>
            </button>
          </div>
        </div>

        {/* Botón Guardar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-2"
          >
            {saving ? 'Guardando cambios...' : 'Guardar Configuración'}
          </button>
        </div>
      </form>
    </div>
  );
}
