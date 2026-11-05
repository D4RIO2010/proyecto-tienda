import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import MobileCartPill from "@/components/cart/MobileCartPill";
import FloatingWhatsApp from "@/components/ui/FloatingWhatsApp";
import { supabase } from "@/lib/supabase/client";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata = {
  title: "NexaStore | Catálogo Digital & Pedidos Directos",
  description: "Escaparate virtual interactivo de repuestos y productos con pedidos directos a WhatsApp.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

const defaultConfig = {
  nombre_tienda: 'NexaStore',
  telefono_whatsapp: '584120000000',
  metodos_pago: ['Pago Móvil', 'Zelle', 'Efectivo Divisas ($)', 'Transferencia Bancaria'],
  tasa_cambio: 36.50,
  moneda_principal: 'USD',
  moneda_secundaria: 'Bs.',
  mostrar_moneda_secundaria: true,
};

async function getStoreConfig() {
  try {
    const { data } = await supabase
      .from('configuracion_tienda')
      .select('*')
      .limit(1)
      .maybeSingle();

    return data || defaultConfig;
  } catch {
    return defaultConfig;
  }
}

export default async function RootLayout({ children }) {
  const storeConfig = await getStoreConfig();

  return (
    <html
      lang="es"
      className={`${inter.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#334155] selection:bg-[#059669] selection:text-white">
        <Navbar storeConfig={storeConfig} />
        <main className="flex-1">{children}</main>
        <CartDrawer storeConfig={storeConfig} />
        <MobileCartPill storeConfig={storeConfig} />
        <FloatingWhatsApp storeConfig={storeConfig} />
        <Footer storeConfig={storeConfig} />
      </body>
    </html>
  );
}
