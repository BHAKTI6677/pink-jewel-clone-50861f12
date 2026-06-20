# SVOJAS.CO — Backend + Content Expansion

Admin email: **bhaktibb15@gmail.com** (auto-promoted to admin role on signup)

---

## Phase 1 — Content pages + Currency switcher (no backend dependency)

1. **Privacy Policy** — add Email `svojas27@gmail.com` and mailing address `Karnataka, KA, 585102, IN` in the contact section.
2. **Refund Policy** — new route `/refund-policy` with your provided "Strict No-Refund Policy" copy.
3. **Terms of Service** — new route `/terms-of-service` with all 17 sections.
4. **Returns** — new route `/returns` with the No Returns & Exchange-Only policy.
5. **Order Tracking (info)** — new route `/order-tracking-info` with your tracking guidance.
6. **International Shipping** — new route `/international-shipping` with your worldwide-shipping copy.
7. **Footer** — link all of the above.
8. **Currency switcher** — top-right of nav.
   - Auto-detect country via `ipapi.co/json` (free, no key).
   - Live FX rates from `exchangerate.host` (free, no key), cached for 1 hour in localStorage.
   - Dropdown lets user override (INR, USD, EUR, GBP, AED, AUD, CAD, SGD, JPY).
   - All product/cart prices reformat live; checkout total stays in INR with a note.

## Phase 2 — Lovable Cloud + Auth

1. Enable **Lovable Cloud**.
2. Wire real Supabase auth into existing `/auth` page (email/password + Google).
3. Create tables:
   - `profiles` (id, full_name, phone, created_at) — auto-created via trigger.
   - `user_roles` (user_id, role enum: 'admin'|'customer') + `has_role()` security-definer fn.
   - Trigger: on signup, if email = `bhaktibb15@gmail.com` → insert admin role; else customer.
4. Update `_authenticated/` gate (Cloud integration handles this).

## Phase 3 — Products table + Admin panel

1. `products` table: id, name, slug, description, price_inr, image_url, category, stock, active, created_at.
2. Storage bucket `product-images` for admin uploads.
3. Migrate static `src/data/products.ts` into the database (seed via migration).
4. Shop/Collections/Home read from DB via TanStack Query.
5. `/admin` route (gated by admin role):
   - Table view of all products with edit/delete.
   - "Add product" form with image upload to storage.
   - Inline edit price/stock/active toggle.

## Phase 4 — Orders + Stripe Checkout

1. `orders` table: id, user_id, status (pending/paid/shipped/delivered/cancelled), total_inr, shipping_address (jsonb), tracking_number, courier, stripe_session_id, created_at.
2. `order_items` table: order_id, product_id, name, price_inr, qty.
3. Replace mock checkout with **multi-step checkout**: cart → address → review → Stripe Checkout.
4. Enable Stripe via `enable_stripe_payments` (seamless, no keys needed).
5. Webhook (`/api/public/webhooks/stripe`) marks order paid and clears cart.
6. `/my-orders` route (auth-gated):
   - List of orders with status, total, date.
   - Order detail page: items, shipping address, tracking number + courier link, payment status, reorder button.
7. Admin orders view at `/admin/orders` to update status + add tracking number/courier.

---

## Technical notes
- Currency conversion is **display-only**; payments processed in INR (matches your Terms §5).
- Auto-detect uses a single client-side fetch on first load; cached in localStorage for the session.
- All policy pages use the existing typography/layout — no new design system.
- RLS: products readable by anyone; only admin can write. Orders/order_items only readable by owner + admin.
- Stripe webhooks verify signature before any DB write.

I'll execute Phase 1 immediately after you approve, then proceed through 2 → 3 → 4 in follow-up turns (each phase is too large to ship in one).