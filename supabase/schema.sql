-- ==============================================================================
-- CATÁLOGO DIGITAL RETAIL - ESQUEMA DE BASE DE DATOS Y POLÍTICAS RLS (SUPABASE)
-- ==============================================================================

-- 1. EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: CATEGORIAS
CREATE TABLE IF NOT EXISTS public.categorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLA: PRODUCTOS
CREATE TABLE IF NOT EXISTS public.productos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    sku VARCHAR(100),
    precio NUMERIC(10, 2) NOT NULL CHECK (precio >= 0),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    imagen_url TEXT,
    destacado BOOLEAN DEFAULT false,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLA: CONFIGURACION_TIENDA (Singleton / 1 registro activo)
CREATE TABLE IF NOT EXISTS public.configuracion_tienda (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_tienda VARCHAR(150) NOT NULL DEFAULT 'Repuestos & Retail Express',
    telefono_whatsapp VARCHAR(30) NOT NULL DEFAULT '584120000000',
    mensaje_bienvenida TEXT DEFAULT '¡Hola! Deseo coordinar el pago y entrega de mi pedido del catálogo virtual:',
    metodos_pago TEXT[] DEFAULT ARRAY['Pago Móvil', 'Zelle', 'Efectivo Divisas', 'Transferencia Bancaria'],
    tasa_cambio NUMERIC(10, 2) NOT NULL DEFAULT 36.50,
    moneda_principal VARCHAR(10) DEFAULT 'USD',
    moneda_secundaria VARCHAR(10) DEFAULT 'Bs.',
    mostrar_moneda_secundaria BOOLEAN DEFAULT true,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TRIGGER AUTOMÁTICO PARA UPDATED_AT
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_productos_updated_at ON public.productos;
CREATE TRIGGER set_productos_updated_at
    BEFORE UPDATE ON public.productos
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_config_updated_at ON public.configuracion_tienda;
CREATE TRIGGER set_config_updated_at
    BEFORE UPDATE ON public.configuracion_tienda
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- Regla de oro: Lectura pública sin login | Modificación restringida al Admin
-- ==============================================================================

-- A. Habilitar RLS en las tablas
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracion_tienda ENABLE ROW LEVEL SECURITY;

-- B. Políticas para CATEGORIAS
DROP POLICY IF EXISTS "Lectura pública de categorías activas" ON public.categorias;
CREATE POLICY "Lectura pública de categorías activas"
    ON public.categorias
    FOR SELECT
    TO anon, authenticated
    USING (activo = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin puede gestionar categorías" ON public.categorias;
CREATE POLICY "Admin puede gestionar categorías"
    ON public.categorias
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- C. Políticas para PRODUCTOS
DROP POLICY IF EXISTS "Lectura pública de productos activos" ON public.productos;
CREATE POLICY "Lectura pública de productos activos"
    ON public.productos
    FOR SELECT
    TO anon, authenticated
    USING (activo = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin puede gestionar productos" ON public.productos;
CREATE POLICY "Admin puede gestionar productos"
    ON public.productos
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- D. Políticas para CONFIGURACIÓN DE LA TIENDA
DROP POLICY IF EXISTS "Lectura pública de configuración" ON public.configuracion_tienda;
CREATE POLICY "Lectura pública de configuración"
    ON public.configuracion_tienda
    FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Admin puede modificar configuración" ON public.configuracion_tienda;
CREATE POLICY "Admin puede modificar configuración"
    ON public.configuracion_tienda
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- CONFIGURACIÓN DEL BUCKET DE IMÁGENES (Supabase Storage)
-- ==============================================================================

-- Crear el bucket de 'productos' si no existe y hacerlo público
INSERT INTO storage.buckets (id, name, public)
VALUES ('productos', 'productos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Permitir descarga pública de imágenes
DROP POLICY IF EXISTS "Imágenes de productos accesibles públicamente" ON storage.objects;
CREATE POLICY "Imágenes de productos accesibles públicamente"
    ON storage.objects
    FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'productos');

-- Permitir subida y modificación solo a usuarios autenticados (Admin)
DROP POLICY IF EXISTS "Admin puede subir imágenes de productos" ON storage.objects;
CREATE POLICY "Admin puede subir imágenes de productos"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'productos');

DROP POLICY IF EXISTS "Admin puede actualizar y borrar imágenes de productos" ON storage.objects;
CREATE POLICY "Admin puede actualizar y borrar imágenes de productos"
    ON storage.objects
    FOR ALL
    TO authenticated
    USING (bucket_id = 'productos')
    WITH CHECK (bucket_id = 'productos');

-- ==============================================================================
-- DATOS INICIALES (SEED DATA DE PRUEBA)
-- ==============================================================================

-- 1. Insertar Categorías
INSERT INTO public.categorias (id, nombre, slug, descripcion) VALUES
('11111111-1111-1111-1111-111111111111', 'Frenos y Suspensión', 'frenos-suspension', 'Pastillas, discos, amortiguadores y terminales'),
('22222222-2222-2222-2222-222222222222', 'Motor y Encendido', 'motor-encendido', 'Bujías, bobinas, correas y empaquetaduras'),
('33333333-3333-3333-3333-333333333333', 'Lubricantes y Filtros', 'lubricantes-filtros', 'Aceites sintéticos, filtros de aceite y aire'),
('44444444-4444-4444-4444-444444444444', 'Herramientas y Accesorios', 'herramientas-accesorios', 'Herramientas de mano, aditivos y líquidos de freno')
ON CONFLICT (slug) DO NOTHING;

-- 2. Insertar Configuración Inicial de la Tienda
INSERT INTO public.configuracion_tienda (
    nombre_tienda, 
    telefono_whatsapp, 
    mensaje_bienvenida, 
    metodos_pago, 
    tasa_cambio, 
    moneda_principal, 
    moneda_secundaria
) VALUES (
    'AutoPartes & Retail Pro',
    '584120000000',
    '¡Hola! He generado mi pedido desde el catálogo online. Aquí tienes los detalles:',
    ARRAY['Pago Móvil', 'Zelle', 'Efectivo Divisas ($)', 'Transferencia Banesco/Mercantil'],
    36.50,
    'USD',
    'Bs.'
)
ON CONFLICT DO NOTHING;

-- 3. Insertar Productos de Muestra con Imágenes de Calidad (Unsplash CDN)
INSERT INTO public.productos (categoria_id, nombre, descripcion, sku, precio, stock, imagen_url, destacado) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'Pastillas de Freno Cerámicas Delanteras',
    'Pastillas cerámicas de alto rendimiento con bajo desgaste y cero ruido. Compatibles con sedanes y SUV medianos.',
    'BRK-CER-01',
    28.50,
    15,
    'https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?auto=format&fit=crop&w=600&q=80',
    true
),
(
    '33333333-3333-3333-3333-333333333333',
    'Aceite Sintético 5W-30 (Galón 4L)',
    'Lubricante 100% sintético con protección térmica avanzada para motores a gasolina de inyección directa.',
    'OIL-SYN-5W30',
    34.00,
    22,
    'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
    true
),
(
    '22222222-2222-2222-2222-222222222222',
    'Juego de Bujías de Iridio (Pack x4)',
    'Bujías de encendido rápido con punta de iridio de larga duración (vida útil hasta 100,000 km).',
    'SPK-IRID-04',
    22.00,
    30,
    'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
    true
),
(
    '33333333-3333-3333-3333-333333333333',
    'Filtro de Aire de Alto Flujo',
    'Filtro de aire lavable y reutilizable que optimiza la entrada de aire y mejora el consumo de combustible.',
    'FLT-AIR-HF',
    18.50,
    12,
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
    false
),
(
    '44444444-4444-4444-4444-444444444444',
    'Kit Llaves de Trinquete y Dados 46 Piezas',
    'Maletín organizador de herramientas cromovanadio para mecánica básica y mantenimiento automotriz.',
    'TLS-RAT-46',
    42.00,
    8,
    'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=600&q=80',
    true
)
ON CONFLICT DO NOTHING;
