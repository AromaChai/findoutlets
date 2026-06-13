# Aroma Chai Outlets — Setup & Daily Use Guide

Written for a non-technical admin. Three one-time setup steps, then daily
use is just a simple form.

---

## ONE-TIME SETUP

### Step 1 — Create the database (Supabase, ~10 minutes)

1. Go to **supabase.com** and log in.
2. Click **New project**.
   - Name: `aromachai-outlets`
   - Database password: click *Generate* and save it somewhere safe
   - Region: **Mumbai (ap-south-1)**
3. Wait ~2 minutes for the project to be created.
4. In the left sidebar, click **SQL Editor** → **New query**.
5. Open the file `supabase-setup.sql` (in this project folder), copy ALL of
   it, paste into the editor, and press **Run**.
   - This creates the outlets table, the photo storage, and pre-loads all
     10 current outlets.
6. Get your two keys: left sidebar → **Project Settings** → **API**:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **service_role key** (under "Project API keys" — click reveal/copy.
     KEEP THIS SECRET — it has full access.)

### Step 2 — Add the three settings in Vercel (~5 minutes)

1. Go to **vercel.com** → your **findoutlets** project →
   **Settings** → **Environment Variables**.
2. Add these three (for all environments):

   | Name | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | the Project URL from Step 1 |
   | `SUPABASE_SERVICE_ROLE_KEY` | the service_role key from Step 1 |
   | `ADMIN_PASSWORD` | a strong password you choose — this is your admin login |

3. Save. (The settings take effect on the next deployment.)

### Step 3 — Deploy the new code

The new code must be pushed to GitHub (`AromaChai/findoutlets`, main
branch). Vercel then deploys automatically in ~2 minutes.
Claude will guide you through this — it needs a one-time GitHub login.

---

## DAILY USE — managing outlets

### Open the admin panel

Go to: **findus.aromachai.in/admin**
Log in with your `ADMIN_PASSWORD`. Stays logged in for 30 days.

### Add a new outlet

1. Click **+ Add outlet**.
2. Fill the form top to bottom:
   - **Outlet name** — e.g. `Aroma Chai – Vashi`. The page link and badge
     code fill in automatically.
   - **Area / City** — exactly as you'd say the address.
   - **Timings** — must look like `9:00 AM - 10:00 PM`.
   - **Phone** — 10 digits, no +91.
   - **Google Maps link** — open the outlet in Google Maps → Share →
     Copy link.
   - **About** — 70–90 words. Mention the locality 2–3 times, nearby
     landmarks, menu items and timings. (This is your local SEO text.)
   - **Photos** — shopfront, counter, seating, chai being served.
   - **Swiggy/Zomato links** — open the outlet's page in the app/site and
     copy the link.
   - **Rating & reviews** — copy real reviews from the outlet's Google
     Maps listing (name + stars + text, word for word).
   - **Brands** — add BreadHub / My Fries with their Swiggy/Zomato links.
3. Press **Create outlet**. The page goes live automatically with proper
   SEO, and the outlet appears in the list on the homepage.

### Edit / hide / delete

- **Edit**: pencil icon → change anything → **Save changes**.
  The live page updates within ~5 minutes.
- **Hide temporarily** (e.g. renovation): edit → turn OFF
  **Show on website** → save. Nothing is lost.
- **Delete permanently**: edit → **Delete** (asks for confirmation).

### After adding a new outlet (good habits)

1. Create/claim the outlet's **Google Business Profile** and put the new
   page link (findus.aromachai.in/its-slug) as the website.
2. In **Search Console**, paste the new URL into URL Inspection → Request
   indexing.

---

## IF SOMETHING LOOKS WRONG

- **"Supabase is not connected"** in admin → the three environment
  variables in Vercel are missing or misspelled. Re-check Step 2, then
  redeploy (Vercel → Deployments → ⋯ → Redeploy).
- **Changes not showing on the site** → wait 5 minutes and refresh. Pages
  refresh automatically on a 5-minute cycle.
- **Forgot admin password** → change `ADMIN_PASSWORD` in Vercel and
  redeploy. There is no "forgot password" email — it's just that setting.
