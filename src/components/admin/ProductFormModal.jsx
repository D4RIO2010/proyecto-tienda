'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { X, Upload, Loader2, Image as ImageIcon, AlertCircle } from 'lucide-react';

export default function ProductFormModal({ isOpen, onClose, productToEdit, categories = [], onSaved }) {
  const [formData, setFormData] = useState({
    nombre: '',
    categoria_id: '',
    descripcion: '',
    sku: '',
    precio: '',
    stock: '',
    imagen_url: '',
    destacado: false,
    activo: true,
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        nombre: productToEdit.nombre || '',
        categoria_id: productToEdit.categoria_id || (categories[0]?.id || ''),
        descripcion: productToEdit.descripcion || '',
        sku: productToEdit.sku || '',
        precio: productToEdit.precio || '',
        stock: productToEdit.stock ?? 0,
        imagen_url: productToEdit.imagen_url || '',
        destacado: Boolean(productToEdit.destacado),
        activo: Boolean(productToEdit.activo ?? true),
      });
    } else {
      setFormData({
        nombre: '',
        categoria_id: categories[0]?.id || '',
        descripcion: '',
        sku: '',
        precio: '',
        stock: 10,
        imagen_url: '',
        destacado: false,
        activo: true,
      });
    }
    setErrorMsg('');
  }, [productToEdit, categories, isOpen]);

  if (!isOpen) return null;

  // Manejador de subida de archivos a Supabase Storage
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo y peso máximo (4MB)
    if (!file.type.startsWith('image/')) {
      setErrorMsg('El archivo seleccionado debe ser una imagen (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setErrorMsg('La imagen no debe superar los 4MB.');
      return;
    }

    try {
      setUploadingImage(true);
      setErrorMsg('');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `items/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('productos')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data } = supabase.storage.from('productos').getPublicUrl(filePath);

      if (data?.publicUrl) {
        setFormData((prev) => ({ ...prev, imagen_url: data.publicUrl }));
      }
    } catch (err) {
      console.error('Error al subir imagen:', err);
      setErrorMsg('Error al subir la imagen al Storage de Supabase. Verifica tus políticas de storage.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.nombre.trim()) {
      setErrorMsg('El nombre del producto es obligatorio.');
      return;
    }

    if (isNaN(formData.precio) || Number(formData.precio) < 0) {
      setErrorMsg('El precio debe ser un número válido mayor o igual a 0.');
      return;
    }

    setSaving(true);

    try {
      const payload = {
        nombre: formData.nombre.trim(),
        categoria_id: formData.categoria_id || null,
        descripcion: formData.descripcion.trim(),
        sku: formData.sku.trim(),
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock, 10) || 0,
        imagen_url: formData.imagen_url.trim(),
        destacado: formData.destacado,
        activo: formData.activo,
      };

      if (productToEdit?.id) {
        // Actualizar
        const { error } = await supabase
          .from('productos')
          .update(payload)
          .eq('id', productToEdit.id);

        if (error) throw error;
      } else {
        // Crear nuevo
        const { error } = await supabase.from('productos').insert([payload]);
        if (error) throw error;
      }

      onSaved?.();
      onClose();
    } catch (err) {
      console.error('Error guardando producto:', err);
      setErrorMsg(err.message || 'Error al guardar el producto.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">
            {productToEdit ? 'Editar Producto' : 'Nuevo Producto para Catálogo'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="my-3 flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nombre del Producto *
            </label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej. Kit Correa de Distribución"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Categoría
              </label>
              <select
                value={formData.categoria_id}
                onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Código / SKU
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="Ej. COR-TIM-90"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Precio (USD $) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                placeholder="25.00"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Stock Disponible *
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="10"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Descripción o Compatibilidad
            </label>
            <textarea
              rows={2}
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Especificaciones técnicas o vehículos compatibles..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          {/* Subida de Imagen conectada a Supabase Storage */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Imagen del Producto (Supabase Storage o URL)
            </label>
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 cursor-pointer text-xs font-medium transition-colors">
                {uploadingImage ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                ) : (
                  <Upload className="w-4 h-4 text-emerald-600" />
                )}
                <span>{uploadingImage ? 'Subiendo...' : 'Subir archivo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingImage}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              <div className="flex-1">
                <input
                  type="url"
                  value={formData.imagen_url}
                  onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
                  placeholder="https://... o sube una imagen"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-mono"
                />
              </div>

              {formData.imagen_url && (
                <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  <img src={formData.imagen_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={formData.destacado}
                onChange={(e) => setFormData({ ...formData, destacado: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Marcar como Destacado ⭐</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Visible en catálogo (Activo)</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-emerald-600 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
            >
              {saving ? 'Guardando...' : productToEdit ? 'Actualizar Producto' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
