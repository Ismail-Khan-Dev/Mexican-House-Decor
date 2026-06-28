import { useState, useEffect } from 'react'
import { productService, type Product } from '../../services/api'
import { Plus, Edit3, Trash2, Search, X } from 'lucide-react'
import { toast } from 'sonner'

const emptyProduct = {
  name: '', description: '', price: 0, originalPrice: 0, category: 'Decor',
  stock: 0, sku: '', thumbnail: '', images: [], materials: [],
  artisan: '', origin: '', isFeatured: false, rating: 0, reviews: 0,
}

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(emptyProduct)
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchProducts = async (p = page) => {
    try {
      setLoading(true)
      const res = await productService.getAll({ page: p, limit: 10, search })
      setProducts(res.data.data || [])
      setTotalPages(res.data.pagination?.pages || 1)
    } catch (err) {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [page, search])

  const openCreate = () => { setEditing(null); setForm(emptyProduct); setShowModal(true) }

  const openEdit = (product: Product) => {
    setEditing(product)
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      category: product.category,
      stock: product.stock,
      sku: product.sku || '',
      thumbnail: product.thumbnail || '',
      artisan: product.artisan || '',
      origin: product.origin || '',
      isFeatured: product.isFeatured || false,
    })
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await productService.update(editing._id, form)
        toast.success('Product updated')
      } else {
        await productService.create(form)
        toast.success('Product created')
      }
      setShowModal(false)
      fetchProducts(1)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    try {
      await productService.delete(id)
      toast.success('Product deleted')
      fetchProducts()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const categories = ['Textiles', 'Ceramics', 'Furniture', 'Lighting', 'Decor']

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="text-h3" style={{ color: 'var(--deep-espresso)' }}>Products</h1>
        <button onClick={openCreate} data-cursor-hover className="text-button"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', backgroundColor: 'var(--deep-espresso)', color: 'var(--white)', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div style={{ marginBottom: '16px', position: 'relative', maxWidth: '320px' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--warm-gray)' }} />
        <input placeholder="Search products..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '6px', border: '1px solid var(--adobe-clay)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
      </div>

      <div style={{ backgroundColor: 'var(--white)', borderRadius: '8px', border: '1px solid var(--adobe-clay)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#faf5ef', textAlign: 'left' }}>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Stock</th>
              <th style={thStyle}>Featured</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--warm-gray)' }}>Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--warm-gray)' }}>No products found.</td></tr>
            ) : products.map((p) => (
              <tr key={p._id} style={{ borderBottom: '1px solid var(--adobe-clay)' }}>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '4px', backgroundColor: 'var(--light-sand)', overflow: 'hidden', flexShrink: 0 }}>
                      <img src={p.thumbnail || p.images?.[0]?.url || '/images/placeholder.jpg'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <span className="text-body-sm" style={{ fontWeight: 500, color: 'var(--deep-espresso)' }}>{p.name}</span>
                  </div>
                </td>
                <td style={tdStyle}><span className="text-label" style={badgeStyle}>{p.category}</span></td>
                <td style={tdStyle}>${p.price}</td>
                <td style={tdStyle}>
                  <span style={{ color: p.stock <= 5 ? '#ef4444' : 'var(--deep-espresso)', fontWeight: 600 }}>{p.stock}</span>
                </td>
                <td style={tdStyle}>{p.isFeatured ? '⭐' : '—'}</td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <button onClick={() => openEdit(p)} data-cursor-hover style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--warm-gray)' }}>
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => handleDelete(p._id, p.name)} data-cursor-hover style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#ef4444' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--adobe-clay)', backgroundColor: p === page ? 'var(--deep-espresso)' : 'var(--white)', color: p === page ? 'var(--white)' : 'var(--deep-espresso)', cursor: 'pointer' }}>
              {p}
            </button>
          ))}
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: 'var(--white)', borderRadius: '12px', maxWidth: '600px', width: '100%', maxHeight: '80vh', overflow: 'auto', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 className="text-body" style={{ fontWeight: 600, color: 'var(--deep-espresso)' }}>{editing ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--warm-gray)' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={inp} />
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} style={inp} />
              <div style={{ display: 'flex', gap: '12px' }}>
                <input placeholder="Price" type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} required style={{ ...inp, flex: 1 }} />
                <input placeholder="Original price" type="number" step="0.01" min="0" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: parseFloat(e.target.value) || 0 })} style={{ ...inp, flex: 1 }} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ ...inp, flex: 1 }}>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input placeholder="Stock" type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} required style={{ ...inp, flex: 1 }} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} style={{ ...inp, flex: 1 }} />
                <input placeholder="Thumbnail URL" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} style={{ ...inp, flex: 1 }} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input placeholder="Artisan" value={form.artisan} onChange={(e) => setForm({ ...form, artisan: e.target.value })} style={{ ...inp, flex: 1 }} />
                <input placeholder="Origin" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} style={{ ...inp, flex: 1 }} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} style={{ accentColor: 'var(--terracotta)' }} />
                <span className="text-body-sm" style={{ color: 'var(--deep-espresso)' }}>Featured product</span>
              </label>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '10px', border: '1px solid var(--adobe-clay)', borderRadius: '6px', backgroundColor: 'var(--white)', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={saving} style={{ flex: 1, padding: '10px', backgroundColor: saving ? 'var(--warm-gray)' : 'var(--deep-espresso)', color: 'var(--white)', border: 'none', borderRadius: '6px', cursor: saving ? 'not-allowed' : 'pointer' }}>
                  {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const thStyle: React.CSSProperties = { padding: '12px 16px', fontSize: '12px', fontWeight: 600, color: 'var(--warm-gray)', textTransform: 'uppercase', letterSpacing: '0.05em' }
const tdStyle: React.CSSProperties = { padding: '12px 16px', fontSize: '14px' }
const badgeStyle: React.CSSProperties = { padding: '2px 8px', borderRadius: '100px', backgroundColor: '#faf5ef', color: 'var(--deep-espresso)', fontSize: '11px', fontWeight: 600 }
const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid var(--adobe-clay)', fontSize: '14px', outline: 'none', boxSizing: 'border-box', color: 'var(--deep-espresso)' }
