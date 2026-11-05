'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import Link from 'next/link';
import {
  Package,
  Layers,
  PhoneCall,
  Coins,
  Plus,
  ExternalLink,
  Settings,
  ArrowRight,
} from 'lucide-react';
import { formatUSD } from '@/lib/utils/currency';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalCategories: 0,
    whatsappNumber: '',
    tasaCambio: 0,
    monedaSecundaria: 'Bs.',
    storeName: '',
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // 1. Conteo de productos
        const { data: prods } = await supabase
          .from('productos')
          .select('id, nombre, precio, stock, activo, imagen_url, created_at')
          .order('created_at', { ascending: false });

        // 2. Conteo de categorías
        const { data: cats } = await supabase.from('categorias').select('id');

        // 3. Configuración
        const { data: config } = await supabase
          .from('configuracion_tienda')
          .select('*')
          .limit(1)
          .maybeSingle();

        const allProds = prods || [];
        setStats({
          totalProducts: allProds.length,
          activeProducts: allProds.filter((p) => p.activo).length,
          totalCategories: (cats || []).length,
          whatsappNumber: config?.telefono_whatsapp || 'No configurado',
          tasaCambio: config?.tasa_cambio || 0,
          monedaSecundaria: config?.moneda_secundaria || 'Bs.',
          storeName: config?.nombre_tienda || 'Mi Tienda',
        });

        setRecentProducts(allProds.slice(0, 5));
      } catch (err) {
        console.error('Error cargando dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Saludo y acciones rápidas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Dashboard de Control
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Gestionando: <strong className="text-slate-800">{stats.storeName}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/productos"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Administrar Inventario</span>
          </Link>
          <Link
            href="/admin/configuracion"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Ajustes</span>
          </Link>
        </div>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Productos en Catálogo</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{stats.totalProducts}</span>
            <span className="text-xs text-slate-400 block mt-0.5">
              {stats.activeProducts} activos para venta
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Categorías</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">{stats.totalCategories}</span>
            <span className="text-xs text-slate-400 block mt-0.5">secciones activas</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tasa de Cambio</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-slate-900">
              {stats.monedaSecundaria} {stats.tasaCambio}
            </span>
            <span className="text-xs text-slate-400 block mt-0.5">por cada 1 USD</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">WhatsApp Receptor</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <PhoneCall className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-base font-bold font-mono text-slate-900 truncate block">
              +{stats.whatsappNumber}
            </span>
            <span className="text-xs text-emerald-600 block mt-0.5">Recepción de pedidos</span>
          </div>
        </div>
      </div>

      {/* Últimos productos agregados */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Productos Recientes</h2>
          <Link
            href="/admin/productos"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>Ver todos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {recentProducts.map((p) => (
            <div key={p.id} className="p-4 sm:px-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-slate-100 shrink-0 overflow-hidden border border-slate-200">
                  {p.imagen_url && (
                    <img src={p.imagen_url} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-slate-900 truncate">{p.nombre}</h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Stock: {p.stock} unidades
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-extrabold text-slate-900">
                  {formatUSD(p.precio)}
                </span>
                <span
                  className={`block text-[10px] font-semibold ${
                    p.activo ? 'text-emerald-600' : 'text-slate-400'
                  }`}
                >
                  {p.activo ? 'Activo' : 'Oculto'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
