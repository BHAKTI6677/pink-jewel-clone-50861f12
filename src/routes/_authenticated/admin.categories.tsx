import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Plus, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSiteCategories, resolveImage, type SiteCategory } from "@/hooks/use-site-content";

export const Route = createFileRoute("/_authenticated/admin/categories")({
  component: AdminCategories,
});

function AdminCategories() {
  const { data: cats, isLoading, refetch } = useSiteCategories(true);
  const [editing, setEditing] = useState<SiteCategory | null>(null);
  const [creating, setCreating] = useState(false);
  const qc = useQueryClient();

  async function handleDelete(c: SiteCategory) {
    if (!confirm(`Delete category "${c.label}"?`)) return;
    const { error } = await supabase.from("site_categories").delete().eq("id", c.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["site_categories"] });
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-blush/70">{cats?.length ?? 0} categories — shown under “Shop by Category”</p>
        <button onClick={() => setCreating(true)} className="btn-primary inline-flex items-center gap-2">
          <Plus className="h-4 w-4" /> New Category
        </button>
      </div>
      {isLoading && <p className="mt-6 text-sm text-blush/60">Loading…</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cats?.map(c => (
          <div key={c.id} className="border border-border/40 bg-maroon-deep/40">
            {c.image_url && <img src={resolveImage(c.image_url)} alt={c.label} className="aspect-[3/4] w-full object-cover" />}
            <div className="p-3 space-y-1">
              <p className="font-display text-blush-soft">{c.label}</p>
              <p className="text-xs text-blush/60">slug: {c.slug} · #{c.sort} · {c.active ? "Live" : "Hidden"}</p>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setEditing(c)} className="p-2 text-blush/70 hover:text-blush" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => handleDelete(c)} className="p-2 text-blush/70 hover:text-rose-300" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {(editing || creating) && (
        <CategoryModal
          cat={editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSaved={() => { setEditing(null); setCreating(false); refetch(); qc.invalidateQueries({ queryKey: ["site_categories"] }); }}
        />
      )}
    </div>
  );
}

function CategoryModal({ cat, onClose, onSaved }: { cat: SiteCategory | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    label: cat?.label ?? "",
    slug: cat?.slug ?? "",
    image_url: cat?.image_url ?? "",
    sort: cat?.sort ?? 0,
    active: cat?.active ?? true,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `categories/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("product-images").upload(path, file, { upsert: false, contentType: file.type });
      if (upErr) throw upErr;
      setForm(f => ({ ...f, image_url: path }));
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
      const slug = (form.slug || form.label).trim();
      const payload = { ...form, slug, sort: Number(form.sort) };
      if (cat) {
        const { error } = await supabase.from("site_categories").update(payload).eq("id", cat.id);
        if (error) throw error;
        toast.success("Updated");
      } else {
        const { error } = await supabase.from("site_categories").insert(payload);
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
      <form onSubmit={handleSave} className="my-8 w-full max-w-xl bg-maroon-deep border border-border/60 p-6">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <h2 className="font-display text-2xl text-blush-soft">{cat ? "Edit Category" : "New Category"}</h2>
          <button type="button" onClick={onClose} className="text-blush/70 hover:text-blush" aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-5 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <F label="Label *"><input required value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} className={inp} /></F>
            <F label="Slug (filter value)"><input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="defaults to label" className={inp} /></F>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <F label="Sort order"><input type="number" value={form.sort} onChange={e => setForm({ ...form, sort: Number(e.target.value) })} className={inp} /></F>
            <label className="flex items-end gap-2 text-sm text-blush/80">
              <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} /> Active
            </label>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-blush/60 mb-1.5">Image</p>
            <div className="flex items-center gap-4">
              {form.image_url && <img src={resolveImage(form.image_url)} alt="" className="h-24 w-20 object-cover bg-maroon/40" />}
              <label className="cursor-pointer inline-flex items-center gap-2 border border-blush/30 px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-blush hover:bg-blush hover:text-maroon-deep transition">
                <Upload className="h-3.5 w-3.5" />
                {uploading ? "Uploading…" : "Upload Image"}
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
            <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
            <button disabled={saving} className="btn-primary disabled:opacity-60">{saving ? "Saving…" : cat ? "Save" : "Create"}</button>
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