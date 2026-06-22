import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2, Plus, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSlides, resolveImage, type Slide } from "@/hooks/use-site-content";

export const Route = createFileRoute("/_authenticated/admin/slides")({
  component: AdminSlides,
});

function AdminSlides() {
  const { data: slides, isLoading, refetch } = useSlides(true);
  const [editing, setEditing] = useState<Slide | null>(null);
  const [creating, setCreating] = useState(false);
  const qc = useQueryClient();

  async function handleDelete(s: Slide) {
    if (!confirm("Delete this slide?")) return;
    const { error } = await supabase.from("home_slides").delete().eq("id", s.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["home_slides"] });
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-blush/70">{slides?.length ?? 0} slides — shown on home page</p>
        <button onClick={() => setCreating(true)} className="btn-primary inline-flex items-center gap-2">
          <Plus className="h-4 w-4" /> New Slide
        </button>
      </div>
      {isLoading && <p className="mt-6 text-sm text-blush/60">Loading…</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {slides?.map(s => (
          <div key={s.id} className="border border-border/40 bg-maroon-deep/40">
            {s.image_url && (
              <img src={resolveImage(s.image_url)} alt={s.alt_text} className="aspect-[4/5] w-full object-cover" />
            )}
            <div className="p-3 space-y-1">
              <p className="font-display text-blush-soft">{s.headline || "(no headline)"}</p>
              <p className="text-xs text-blush/60">Sort #{s.sort} · {s.active ? "Live" : "Hidden"}</p>
              <p className="text-xs text-blush/50 truncate">→ {s.link_url}</p>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setEditing(s)} className="p-2 text-blush/70 hover:text-blush" aria-label="Edit">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(s)} className="p-2 text-blush/70 hover:text-rose-300" aria-label="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {(editing || creating) && (
        <SlideModal
          slide={editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSaved={() => { setEditing(null); setCreating(false); refetch(); qc.invalidateQueries({ queryKey: ["home_slides"] }); }}
        />
      )}
    </div>
  );
}

function SlideModal({ slide, onClose, onSaved }: { slide: Slide | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    headline: slide?.headline ?? "",
    subtext: slide?.subtext ?? "",
    image_url: slide?.image_url ?? "",
    alt_text: slide?.alt_text ?? "",
    link_url: slide?.link_url ?? "/collections",
    sort: slide?.sort ?? 0,
    active: slide?.active ?? true,
    placement: slide?.placement ?? "hero",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `slides/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
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
      const payload = { ...form, sort: Number(form.sort) };
      if (slide) {
        const { error } = await supabase.from("home_slides").update(payload).eq("id", slide.id);
        if (error) throw error;
        toast.success("Updated");
      } else {
        const { error } = await supabase.from("home_slides").insert(payload);
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
          <h2 className="font-display text-2xl text-blush-soft">{slide ? "Edit Slide" : "New Slide"}</h2>
          <button type="button" onClick={onClose} className="text-blush/70 hover:text-blush" aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        <div className="mt-5 grid gap-4">
          <F label="Headline"><input value={form.headline} onChange={e => setForm({ ...form, headline: e.target.value })} className={inp} /></F>
          <F label="Subtext"><input value={form.subtext} onChange={e => setForm({ ...form, subtext: e.target.value })} className={inp} /></F>
          <div className="grid gap-4 sm:grid-cols-2">
            <F label="Link URL"><input value={form.link_url} onChange={e => setForm({ ...form, link_url: e.target.value })} className={inp} placeholder="/collections or /shop" /></F>
            <F label="Sort order"><input type="number" value={form.sort} onChange={e => setForm({ ...form, sort: Number(e.target.value) })} className={inp} /></F>
          </div>
          <F label="Placement">
            <select value={form.placement} onChange={e => setForm({ ...form, placement: e.target.value })} className={inp}>
              <option value="hero">Hero (top of home)</option>
              <option value="new_arrivals">New Arrivals carousel</option>
              <option value="story">Our Story image</option>
            </select>
          </F>
          <label className="flex items-center gap-2 text-sm text-blush/80">
            <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} /> Active (visible on home)
          </label>
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-blush/60 mb-1.5">Image *</p>
            <div className="flex items-center gap-4">
              {form.image_url && <img src={resolveImage(form.image_url)} alt="" className="h-24 w-20 object-cover bg-maroon/40" />}
              <label className="cursor-pointer inline-flex items-center gap-2 border border-blush/30 px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-blush hover:bg-blush hover:text-maroon-deep transition">
                <Upload className="h-3.5 w-3.5" />
                {uploading ? "Uploading…" : "Upload Image"}
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            </div>
            <input value={form.alt_text} onChange={e => setForm({ ...form, alt_text: e.target.value })} placeholder="Alt text" className={`${inp} mt-2`} />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border/40">
            <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
            <button disabled={saving} className="btn-primary disabled:opacity-60">{saving ? "Saving…" : slide ? "Save" : "Create"}</button>
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