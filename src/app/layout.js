import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { supabase } from "@/lib/supabase/client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Catálogo Digital Interactivo | Retail Express",
  description: "Catálogo virtual de repuestos y productos con pedidos directos a WhatsApp.",
};

const defaultConfig = {
  nombre_tienda: 'AutoPartes & Retail Pro',
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
        <Navbar storeConfig={storeConfig} />
        <main className="flex-1">{children}</main>
        <CartDrawer storeConfig={storeConfig} />
        <Footer storeConfig={storeConfig} />
      </body>
    </html>
  );
}
