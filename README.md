# Pawhaven (placeholder name)
Animal rescue prototype: reports with an interactive map, adoptions, donations, feedback and an admin console.

## Run locally
1. Start MySQL (XAMPP or Workbench). Create an empty database named `pawhaven` (or import `schema.sql` for sample animals).
2. `cp .env.example .env` and edit it. Tables and columns are created or updated automatically on first start.
3. `npm install && npm run dev` then open http://localhost:3000. Admin: /admin

## Deploy on Vercel
1. Create a hosted MySQL (TiDB Cloud, Aiven or PlanetScale-compatible). Create the database.
2. Push to GitHub, import the repo in Vercel.
3. Add every variable from `.env.example` in Vercel > Settings > Environment Variables. Set `DB_SSL=true`, a long `ADMIN_PASSWORD` and `SESSION_SECRET`, and your Cloudflare Turnstile keys.
4. Redeploy after changing variables.

## Notes
- Security check (Turnstile) appears once when a visitor opens the site. Without keys the always-pass test keys are used.
- Photos and receipts are stored in MySQL. Move to Cloudinary or Vercel Blob before heavy traffic.
- Address lookup uses OpenStreetMap Nominatim, fine for a prototype. Use Google or Mapbox geocoding at scale.
- Donations are confirmed manually in admin. Add PayMongo or Xendit for automatic confirmation.
