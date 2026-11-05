import { supabase } from "@/lib/supabase/client";
import CatalogView from "@/components/catalog/CatalogView";
import { BadgeCheck, Truck, Shield, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

async function getCatalogData() {
  try {
    // 1. Obtener configuración
    const { data: config } = await supabase
      .from("configuracion_tienda")
      .select("*")
      .limit(1)
      .maybeSingle();

    // 2. Obtener categorías activas
    const { data: categories } = await supabase
      .from("categorias")
      .select("*")
      .eq("activo", true)
      .order("nombre", { ascending: true });

    // 3. Obtener productos activos con su categoría
    const { data: products } = await supabase
      .from("productos")
      .select("*, categorias(id, nombre, slug)")
      .eq("activo", true)
      .order("destacado", { ascending: false })
      .order("created_at", { ascending: false });

    return {
      storeConfig: config || {},
      categories: categories || [],
      products: products || [],
    };
  } catch (error) {
    console.error("Error al cargar datos del catálogo:", error);
    return {
      storeConfig: {},
      categories: [],
      products: [],
    };
  }
}

export default async function HomePage() {
  const { storeConfig, categories, products } = await getCatalogData();
  const rawPhone = (storeConfig?.telefono_whatsapp || "584120000000").replace(/\D/g, "");

  return (
    <div className="py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Banner de Bienvenida / Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-slate-800">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <BadgeCheck className="w-4 h-4 text-emerald-400" />
              Inventario disponible en tiempo real
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Encuentra tus repuestos y productos en segundos.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Arma tu pedido agregando artículos al carrito y envíalo con un solo clic directamente a nuestro WhatsApp oficial para coordinar pago y entrega inmediata.
            </p>

            {/* Badges de Beneficios */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Envíos y retiros acordados</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Garantía en todos los repuestos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Atención directa sin intermediarios</span>
              </div>
            </div>
          </div>

          {/* Adorno decorativo de fondo */}
          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Módulo Principal: Catálogo Interactivo */}
        <section>
          <CatalogView
            initialProducts={products}
            categories={categories}
            storeConfig={storeConfig}
          />
        </section>
      </div>
    </div>
  );
}
