import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Plus, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useProducts, resolveImage, type DbProduct } from "@/hooks/use-products";

const CATEGORIES = ["Necklaces", "Earrings", "Bracelets", "Rings", "Desi Divas"];
const TAGS = ["New", "Bestseller", "Heritage", "Limited", "Sale"];

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminProducts,
});

function AdminProducts() {
  const { data: products, isLoading, refetch } = useProducts({ adminAll: true });
  const [editing, setEditing] = useState<DbProduct | null>(null);
  const [creating, setCreating] = useState(false);
  const qc = useQueryClient();

  async function handleDelete(p: DbProduct) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  async function handleToggleActive(p: DbProduct) {
    const { error } = await supabase.from("products").update({ active: !p.active }).eq("id", p.id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["products"] });
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-blush/70">{products?.length ?? 0} products</p>
        <button onClick={() => setCreating(true)} className="btn-primary inline-flex items-center gap-2">
          <Plus className="h-4 w-4" /> New Product
        </button>
      </div>

      {isLoading && <p className="mt-6 text-sm text-blush/60">Loading…</p>}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-[10px] uppercase tracking-[0.24em] text-blush/60">
            <tr className="border-b border-border/40">
              <th className="py-3">Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price (INR)</th>
              <th>Stock</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products?.map(p => (
              <tr key={p.id} className="border-b border-border/30 text-blush/90">
                <td className="py-3">
                  {p.image_url && (
                    <img src={resolveImage(p.image_url)} alt={p.alt_text} className="h-14 w-12 object-cover bg-maroon/40" />
                  )}
                </td>
                <td className="font-display text-blush-soft">{p.name}</td>
                <td>{p.category}</td>
                <td>₹ {p.price_inr.toLocaleString("en-IN")}</td>
                <td>{p.stock}</td>
                <td>
                  <button
                    onClick={() => handleToggleActive(p)}
                    className={`text-[10px] uppercase tracking-[0.2em] px-2 py-1 border ${
                      p.active ? "border-blush text-blush" : "border-blush/30 text-blush/40"
                    }`}
                  >
                    {p.active ? "Live" : "Hidden"}
                  </button>
                </td>
                <td className="text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditing(p)} className="p-2 text-blush/70 hover:text-blush" aria-label="Edit">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(p)} className="p-2 text-blush/70 hover:text-rose-300" aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(editing || creating) && (
        <ProductFormModal
          product={editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSaved={() => { setEditing(null); setCreating(false); refetch(); qc.invalidateQueries({ queryKey: ["products"] }); }}
        />
      )}
    </div>
  );
}

function ProductFormModal({ product, onClose, onSaved }: { product: DbProduct | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    category: product?.category ?? CATEGORIES[0],
    description: product?.description ?? "",
    materials: product?.materials ?? "",
    care: product?.care ?? "",
    shipping: product?.shipping ?? "Free insured shipping in India.",
    price_inr: product?.price_inr ?? 0,
    tag: product?.tag ?? "New",
    bestseller: product?.bestseller ?? false,
    stock: product?.stock ?? 10,
    active: product?.active ?? true,
    image_url: product?.image_url ?? "",
    alt_text: product?.alt_text ?? "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("product-images").upload(path, file, { upsert: false, contentType: file.type });
      if (upErr) throw upErr;
      setForm(f => ({ ...f, image_url: path, alt_text: f.alt_text || f.name }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = (form.slug || form.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const payload = { ...form, slug, price_inr: Number(form.price_inr), stock: Number(form.stock) };
      if (product) {
        const { error } = await supabase.from("products").update(payload).eq("id", product.id);
        if (error) throw error;
        toast.success("Updated");
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
        toast.success("Created");
      }
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center overflow-y-auto p-4">
      <form onSubmit={handleSave} className="my-8 w-full max-w-2xl bg-maroon-deep border border-border/60 p-6">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <h2 className="font-display text-2xl text-blush-soft">{product ? "Edit Product" : "New Product"}</h2>
          <button type="button" onClick={onClose} className="text-blush/70 hover:text-blush" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <F label="Name *"><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inp} /></F>
            <F label="Slug (auto)"><input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className={inp} placeholder="auto from name" /></F>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <F label="Category *">
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inp}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </F>
            <F label="Tag">
              <select value={form.tag} onChange={e => setForm({ ...form, tag: e.target.value })} className={inp}>
                {TAGS.map(c => <option key={c}>{c}</option>)}
              </select>
            </F>
            <F label="Price (INR) *"><input type="number" required min={0} value={form.price_inr} onChange={e => setForm({ ...form, price_inr: Number(e.target.value) })} className={inp} /></F>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <F label="Stock"><input type="number" min={0} value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} className={inp} /></F>
            <label className="flex items-end gap-2 text-sm text-blush/80">
              <input type="checkbox" checked={form.bestseller} onChange={e => setForm({ ...form, bestseller: e.target.checked })} /> Bestseller
            </label>
            <label className="flex items-end gap-2 text-sm text-blush/80">
              <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} /> Active (visible)
            </label>
          </div>
          <F label="Description"><textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={inp} /></F>
          <F label="Materials"><textarea rows={2} value={form.materials} onChange={e => setForm({ ...form, materials: e.target.value })} className={inp} /></F>
          <F label="Care"><textarea rows={2} value={form.care} onChange={e => setForm({ ...form, care: e.target.value })} className={inp} /></F>
          <F label="Shipping note"><textarea rows={2} value={form.shipping} onChange={e => setForm({ ...form, shipping: e.target.value })} className={inp} /></F>

          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-blush/60 mb-1.5">Image</p>
            <div className="flex items-center gap-4">
              {form.image_url && (
                <img src={resolveImage(form.image_url)} alt="" className="h-20 w-16 object-cover bg-maroon/40" />
              )}
              <label className="cursor-pointer inline-flex items-center gap-2 border border-blush/30 px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-blush hover:bg-blush hover:text-maroon-deep transition">
                <Upload className="h-3.5 w-3.5" />
                {uploading ? "Uploading…" : "Upload Image"}
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
              <input
                value={form.image_url}
                onChange={e => setForm({ ...form, image_url: e.target.value })}
                placeholder="…or paste an external URL"
                className={`${inp} flex-1`}
              />
            </div>
            <input
              value={form.alt_text}
              onChange={e => setForm({ ...form, alt_text: e.target.value })}
              placeholder="Alt text for accessibility"
              className={`${inp} mt-2`}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
            <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
            <button disabled={saving} className="btn-primary disabled:opacity-60">{saving ? "Saving…" : product ? "Save Changes" : "Create Product"}</button>
          </div>
        </div>
      </form>
    </div>
  );
}

const inp = "w-full bg-maroon-deep/60 border border-blush/30 px-3 py-2 text-sm text-blush-soft focus:border-blush focus:outline-none";

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.24em] text-blush/60 mb-1.5">{label}</span>
      {children}
    </label>
  );
}