import { supabase } from "@/lib/supabase/client";
import CatalogView from "@/components/catalog/CatalogView";
import { BadgeCheck, Truck, Shield, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

async function getCatalogData() {
  try {
    const { data: config } = await supabase
      .from("configuracion_tienda")
      .select("*")
      .limit(1)
      .maybeSingle();

    const { data: categories } = await supabase
      .from("categorias")
      .select("*")
      .eq("activo", true)
      .order("nombre", { ascending: true });

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

  return (
    <div className="py-8 sm:py-10 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Banner de Bienvenida / Hero NexaStore */}
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white p-6 sm:p-10 shadow-md border border-slate-800">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-[#059669]/20 text-emerald-300 border border-[#059669]/40 uppercase tracking-wider">
              <BadgeCheck className="w-4 h-4 text-[#059669]" />
              Catálogo Oficial en Tiempo Real
            </span>

            <h1
              style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
              className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white uppercase"
            >
              Encuentra tus repuestos y productos en NexaStore
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Agrega los artículos al carrito y envía el pedido estructurado directamente a nuestro WhatsApp oficial para coordinar pago y entrega inmediata.
            </p>

            {/* Badges de Beneficios */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#059669]" />
                <span>Envíos y retiros coordinados</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#059669]" />
                <span>Garantía asegurada</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-[#059669]" />
                <span>Atención directa al vendedor</span>
              </div>
            </div>
          </div>

          <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-[#059669]/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Catálogo Interactivo */}
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
