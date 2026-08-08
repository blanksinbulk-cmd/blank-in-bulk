# Blanks In Bulk — Wholesale Store

A real, database-backed e-commerce site: public storefront + secure admin dashboard.
Products, categories, printing services, media (images/video), and contact info all
live in a real database — nothing is hard-coded.

**Stack:** Next.js (hosted free on Vercel) + Supabase (free database, auth, and file storage).

Total cost to run this: **R0/month** on the free tiers, until you outgrow them (which,
for a small wholesale catalog, won't happen for a long time).

---

## Part 1 — Create your Supabase project (the database)

1. Go to https://supabase.com and sign up (free, no card needed).
2. Click **New project**. Pick any name (e.g. "blanks-in-bulk"), set a database
   password (save it somewhere), pick a region close to South Africa (e.g. `eu-west` or `af-south-1` if offered), and click **Create new project**. Wait ~2 minutes for it to spin up.
3. In the left sidebar, go to **SQL Editor** → **New query**.
4. Open `supabase/schema.sql` from this project, copy the whole file, paste it into the
   SQL editor.
5. **Before running it**, find this line near the top and change the email to your own:
   ```sql
   insert into admin_emails (email) values ('you@example.com')
   ```
6. Click **Run**. You should see "Success. No rows returned."
7. Open `supabase/storage.sql`, copy it, paste into a **new** SQL query, and click **Run**.
   This creates the storage bucket for your product photos/videos.
8. Go to **Authentication** → **Providers** in the sidebar. Under **Email**, make sure
   **"Allow new users to sign up"** is turned **OFF**. This is what keeps your admin
   area locked to just you — nobody else will ever be able to create an account.
9. Go to **Authentication** → **Users** → **Add user** → **Create new user**. Enter the
   *same email* you put in step 5, and set a password. This is your admin login —
   remember it.
10. Go to **Settings** → **API** in the sidebar. Copy two values, you'll need them next:
    - **Project URL**
    - **anon / public key**

---

## Part 2 — Get the code running

You need [Node.js](https://nodejs.org) installed (any recent version, 18+).

1. Unzip this project and open a terminal inside the folder.
2. Run:
   ```
   npm install
   ```
3. Copy `.env.local.example` to a new file called `.env.local`, and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` — the Project URL from step 10 above
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — the anon key from step 10 above
   - `ADMIN_EMAIL` — the same email you used in steps 5 and 9
4. Run:
   ```
   npm run dev
   ```
5. Open http://localhost:3000 — you should see your homepage (empty catalog for now).
6. Open http://localhost:3000/admin/login and log in with the email + password from
   step 9. You're now in your dashboard — add a category, then a product with photos,
   and check it shows up on the homepage.

If anything errors here, copy the exact error message back to me and I'll fix it.

---

## Part 3 — Put it on the internet (Vercel, free)

1. Push this project to a GitHub repository (create one at github.com if you don't
   have one, then follow GitHub's instructions to push this folder to it).
2. Go to https://vercel.com, sign up with your GitHub account (free).
3. Click **Add New** → **Project**, and import the repository you just pushed.
4. Before deploying, expand **Environment Variables** and add the same three (plus a
   fourth) from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ADMIN_EMAIL`
   - `NEXT_PUBLIC_SITE_URL` — leave this blank for now, you'll add it after step 5
5. Click **Deploy**. Wait a minute or two.
6. Once it's live, Vercel gives you a URL like `blanks-in-bulk.vercel.app`. Copy it.
7. Go back to your Vercel project → **Settings** → **Environment Variables**, edit
   `NEXT_PUBLIC_SITE_URL` to `https://blanks-in-bulk.vercel.app` (your real URL), save,
   then go to **Deployments** and redeploy (so the SEO tags pick it up).

That URL is now your live, permanent website. Pin it anywhere — social bio, WhatsApp
Business, Google Business Profile, etc.

### Using your own domain (e.g. blanksinbulk.co.za)
In Vercel: **Settings** → **Domains** → add your domain, then update your domain's DNS
records the way Vercel shows you (usually one CNAME record). Takes a few minutes to a
few hours to go live once DNS updates.

---

## Using the admin dashboard day to day

- Go to `yourdomain.com/admin/login`, log in.
- **Products**: add/edit/delete, set price, "was" price, stock status, MOQ, sizes,
  colours, SKU, category, and upload up to 5 photos + 1 video per product.
- **Categories**: add/edit/delete/reorder the tiles shown on the homepage.
- **Printing Services**: add/edit/delete DTF/Sublimation/Embroidery (or any others),
  each with its own starting price and up to 5 photos + 1 video.
- **Contact & About**: update your email, phone/WhatsApp number, and About Us text.

Every change is live on the site immediately — no redeploying needed for content
changes (only needed if you edit the code itself).

---

## What's actually secure here, and what isn't

- Your admin login is real Supabase authentication — a proper password check, not a
  passcode sitting in the page's code.
- The database has row-level security: anyone can *view* products, but only your one
  admin account can create/edit/delete anything, enforced at the database level (not
  just hidden in the interface).
- Public sign-ups are disabled, so nobody else can ever create an account on your
  project.
- Keep your Supabase database password and your admin login private. Don't commit
  `.env.local` to a public GitHub repo (the `.gitignore` in this project already
  excludes it).

---

## If you get stuck

Paste me the exact error message (from the terminal, the browser console, or Vercel's
deployment log) and I'll help you fix it.
