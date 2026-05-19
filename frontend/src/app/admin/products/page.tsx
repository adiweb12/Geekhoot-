'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Search, X, Upload, ImageIcon } from 'lucide-react';
import api from '@/lib/api';
import { Product } from '@/types';
import { formatPrice, cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

const CATEGORIES = ['Custom T-Shirts', 'Name Slips', 'Printed Bottles', 'Custom Cups', 'Photo Frames', 'Keychain', 'Stationery', 'Tech Gadgets'];

type ProductFormData = {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  tags: string;
  features: string;
};

const defaultForm: ProductFormData = {
  name: '', description: '', price: '', category: 'Custom T-Shirts', stock: '', tags: '', features: '',
};

export default function AdminProductsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormData>(defaultForm);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'products', { search, page }],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '20', ...(search && { search }) });
      const { data } = await api.get(`/admin/products?${params}`);
      return data as { data: Product[]; pagination: { total: number } };
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/products/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }); toast.success('Product deactivated'); },
    onError: () => toast.error('Failed to delete product'),
  });

  const openEdit = (product: Product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      category: product.category,
      stock: String(product.stock),
      tags: product.tags.join(', '),
      features: product.features.join('\n'),
    });
    setImageFiles([]);
    setShowModal(true);
  };

  const openCreate = () => {
    setEditProduct(null);
    setForm(defaultForm);
    setImageFiles([]);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('category', form.category);
      formData.append('stock', form.stock);
      formData.append('tags', JSON.stringify(form.tags.split(',').map((t) => t.trim()).filter(Boolean)));
      formData.append('features', JSON.stringify(form.features.split('\n').map((f) => f.trim()).filter(Boolean)));
      imageFiles.forEach((f) => formData.append('images', f));

      if (editProduct) {
        formData.append('existingImages', JSON.stringify(editProduct.images));
        await api.put(`/admin/products/${editProduct.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated!');
      } else {
        await api.post('/admin/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product created!');
      }

      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      setShowModal(false);
    } catch {
      toast.error('Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Products</h1>
          <p className="text-sm text-[var(--fg-muted)]">{data?.pagination.total ?? 0} total products</p>
        </div>
        <Button onClick={openCreate} size="sm">
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--fg-muted)]" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search products…"
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
                <th className="text-left px-4 py-3 font-semibold text-[var(--fg-muted)] text-xs uppercase tracking-wide">Product</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--fg-muted)] text-xs uppercase tracking-wide hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--fg-muted)] text-xs uppercase tracking-wide">Price</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--fg-muted)] text-xs uppercase tracking-wide hidden md:table-cell">Stock</th>
                <th className="text-left px-4 py-3 font-semibold text-[var(--fg-muted)] text-xs uppercase tracking-wide">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-[var(--border)]">
                    {[...Array(6)].map((__, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded-lg" /></td>)}
                  </tr>
                ))
                : data?.data.map((product) => (
                  <tr key={product.id} className="border-b border-[var(--border)] hover:bg-[var(--bg-secondary)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        <span className="font-medium line-clamp-1 max-w-[140px]">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-[var(--fg-muted)]">{product.category}</td>
                    <td className="px-4 py-3 font-semibold">{formatPrice(product.price)}</td>
                    <td className="px-4 py-3 hidden md:table-cell text-[var(--fg-muted)]">{product.stock}</td>
                    <td className="px-4 py-3">
                      <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(product)} className="p-1.5 rounded-lg hover:bg-brand-50 hover:text-brand-500 transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteMutation.mutate(product.id)} className="p-1.5 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[var(--bg)] rounded-2xl border border-[var(--border)] shadow-xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-[var(--border)] sticky top-0 bg-[var(--bg)]">
                <h2 className="font-semibold">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-[var(--bg-secondary)]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <Input
                  label="Product Name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">Description <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Price (₹)"
                    type="number"
                    required
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                  <Input
                    label="Stock"
                    type="number"
                    required
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">Category <span className="text-red-500">*</span></label>
                  <select
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <Input
                  label="Tags (comma-separated)"
                  placeholder="keyboard, mechanical, gaming"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                />

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">Features (one per line)</label>
                  <textarea
                    rows={3}
                    value={form.features}
                    placeholder="Hot-swappable switches&#10;RGB backlight&#10;Bluetooth 5.0"
                    onChange={(e) => setForm({ ...form, features: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                  />
                </div>

                {/* Image upload */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium">Product Images</label>
                  <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-[var(--border)] hover:border-brand-400 cursor-pointer transition-colors">
                    <Upload className="w-6 h-6 text-[var(--fg-muted)]" />
                    <span className="text-sm text-[var(--fg-muted)]">
                      {imageFiles.length > 0 ? `${imageFiles.length} file(s) selected` : 'Click to upload images (max 5)'}
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setImageFiles(Array.from(e.target.files || []).slice(0, 5))}
                    />
                  </label>
                  {editProduct && editProduct.images.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {editProduct.images.map((img, i) => (
                        <img key={i} src={img} alt="" className="w-14 h-14 rounded-lg object-cover border border-[var(--border)]" />
                      ))}
                      <p className="text-xs text-[var(--fg-muted)] self-center">Existing images. New uploads will be added.</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                  <Button type="submit" isLoading={submitting}>{editProduct ? 'Save Changes' : 'Create Product'}</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
