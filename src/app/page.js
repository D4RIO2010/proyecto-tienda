import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import CatalogView from "@/components/catalog/CatalogView";
import { BadgeCheck, Truck, Shield, MessageCircle, ArrowDown, Sparkles } from "lucide-react";

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
  const rawPhone = (storeConfig?.telefono_whatsapp || "584120000000").replace(/\D/g, "");

  return (
    <div className="py-6 sm:py-8 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        {/* Banner Hero NexaStore Interactivo */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-slate-800">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Texto y llamada a la acción */}
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-[#059669]/25 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Escaparate Digital NexaStore</span>
              </div>

              <h1
                style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
                className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white uppercase"
              >
                Tus repuestos y productos al mejor precio.
              </h1>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-xl font-normal">
                Selecciona tus artículos, arma tu carrito en segundos y envía el pedido estructurado con 1 solo clic directamente a nuestro WhatsApp para coordinar pago y entrega.
              </p>

              {/* Botón rápido y beneficios */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-200">
                <a
                  href={`https://wa.me/${rawPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-[#059669] hover:bg-[#047857] text-white font-bold transition-all shadow-md active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Cotizar por WhatsApp</span>
                </a>
                <a
                  href="#catalogo"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-[#1E293B] hover:bg-[#334155] text-white border border-slate-700 transition-colors"
                >
                  <span>Explorar inventario</span>
                  <ArrowDown className="w-4 h-4 text-emerald-400" />
                </a>
              </div>

              {/* Badges de Garantía */}
              <div className="pt-4 flex flex-wrap items-center gap-5 text-xs text-slate-300 border-t border-slate-800">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>Envíos y retiros inmediatos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Garantía en todos los repuestos</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BadgeCheck className="w-4 h-4 text-emerald-400" />
                  <span>Precios actualizados</span>
                </div>
              </div>
            </div>

            {/* Logo NexaStore destacado en el Hero */}
            <div className="relative shrink-0 flex items-center justify-center">
              <div className="relative w-44 h-44 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-2xl bg-[#0F172A] p-2 hover:scale-105 transition-transform duration-300">
                <Image
                  src="/logo.png"
                  alt="NexaStore Logo Hero"
                  fill
                  sizes="(max-width: 640px) 176px, 256px"
                  className="object-contain p-2"
                  priority
                />
              </div>
            </div>

          </div>

          {/* Luces difuminadas de fondo */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#059669]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Sección de Catálogo */}
        <section id="catalogo">
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
