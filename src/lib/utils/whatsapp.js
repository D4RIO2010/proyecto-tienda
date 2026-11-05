import { formatUSD, formatSecondaryCurrency } from './currency';

/**
 * Genera el texto estructurado para WhatsApp y redirige a la API wa.me
 */
export function generateWhatsAppMessage({
  items = [],
  clienteNombre,
  metodoPago,
  notaEntrega,
  totalUSD,
  tasa,
  monedaSecundaria,
  nombreTienda,
}) {
  const lineasProductos = items.map((item, index) => {
    const subtotalItem = item.precio * item.cantidad;
    const skuTexto = item.sku ? ` [SKU: ${item.sku}]` : '';
    return `${index + 1}. *${item.cantidad}x* ${item.nombre}${skuTexto} — ${formatUSD(subtotalItem)}`;
  });

  const totalSecundario = formatSecondaryCurrency(totalUSD, tasa, monedaSecundaria);

  const mensaje = [
    `🛍️ *NUEVO PEDIDO - ${nombreTienda?.toUpperCase() || 'CATÁLOGO VIRTUAL'}*`,
    `──────────────────────────`,
    `👤 *Cliente:* ${clienteNombre}`,
    notaEntrega ? `📍 *Entrega:* ${notaEntrega}` : null,
    metodoPago ? `💳 *Método de pago preferido:* ${metodoPago}` : null,
    `──────────────────────────`,
    `📦 *DETALLE DE PRODUCTOS:*`,
    ...lineasProductos,
    `──────────────────────────`,
    `💵 *TOTAL (USD):* ${formatUSD(totalUSD)}`,
    tasa && tasa > 1 ? `🇻🇪 *TOTAL REF (${monedaSecundaria || 'Bs.'}):* ${totalSecundario} (Tasa: ${tasa})` : null,
    `──────────────────────────`,
    `_Por favor confirme la disponibilidad de los artículos y los datos para realizar el pago._`,
  ]
    .filter(Boolean)
    .join('\n');

  return mensaje;
}

/**
 * Limpia el número telefónico y abre la ventana de WhatsApp
 */
export function sendWhatsAppOrder(params) {
  const rawPhone = params.telefonoWhatsApp || '584120000000';
  // Eliminar espacios, signos +, guiones o paréntesis
  const cleanPhone = rawPhone.replace(/\D/g, '');

  const text = generateWhatsAppMessage(params);
  const encodedText = encodeURIComponent(text);
  const url = `https://wa.me/${cleanPhone}?text=${encodedText}`;

  // Abrir en nueva pestaña
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
