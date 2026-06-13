-- ============================================================
-- AROMA CHAI OUTLETS — Supabase setup
-- Paste this whole file into: Supabase Dashboard → SQL Editor → Run
-- Safe to run once on a fresh project.
-- ============================================================

create table if not exists outlets (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  code text not null,
  name text not null,
  area text not null,
  city text not null,
  time text not null,
  phone text not null,
  map text not null,
  description text,
  images jsonb not null default '[]',
  swiggy text,
  zomato text,
  facebook text,
  instagram text,
  rating numeric,
  reviews jsonb not null default '[]',
  brands jsonb not null default '[]',
  sort_order integer not null default 100,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Lock the table down: only the service key (used by the website server) can access it.
alter table outlets enable row level security;

-- Public bucket for outlet photos
insert into storage.buckets (id, name, public)
values ('outlet-images', 'outlet-images', true)
on conflict (id) do nothing;

-- ============================================================
-- Seed: the 10 current outlets
-- ============================================================

insert into outlets (slug, code, name, area, city, time, phone, map, description, swiggy, zomato, facebook, instagram, brands, sort_order) values
(
  'juinagar', 'JUI', 'Aroma Chai – Juinagar', 'Sector 23, Juinagar', 'Navi Mumbai – 400706',
  '7:30 AM - 11:00 PM', '7304867253', 'https://maps.app.goo.gl/QgmDxgv7Fc1TnSH5A',
  'Looking for a chai café in Juinagar? Aroma Chai in Sector 23, Juinagar is your neighbourhood tea spot in Navi Mumbai — open every day from 7:30 AM to 11:00 PM. Enjoy freshly brewed kadak masala chai, adarak chai, elaichi chai and filter coffee, along with grilled sandwiches, vada pav, fries and milkshakes. Perfect for morning chai near Juinagar station, evening snacks with friends, or a quick tea break from work. Walk in, call ahead, or order online on Swiggy and Zomato.',
  'https://www.swiggy.com/search?query=Aroma%20Chai', 'https://www.zomato.com/mumbai/search?q=Aroma%20Chai',
  'https://www.facebook.com/aromachai.outlet/', 'https://www.instagram.com/aroma.chai/',
  '[{"name":"BreadHub","tagline":"Fresh breads & sandwiches — online only","swiggy":"https://www.swiggy.com/search?query=BreadHub","zomato":"https://www.zomato.com/mumbai/search?q=BreadHub"},{"name":"My Fries","tagline":"Loaded fries & sides — online only","swiggy":"https://www.swiggy.com/search?query=My%20Fries","zomato":"https://www.zomato.com/mumbai/search?q=My%20Fries"}]',
  10
),
(
  'nerul', 'NER', 'Aroma Chai – Nerul', 'Sector 1, Shiravane, Nerul', 'Navi Mumbai – 400706',
  '8:00 AM - 11:00 PM', '9702738068', 'https://maps.app.goo.gl/b8VuEwnkpMQG8kqW9',
  'Aroma Chai in Shiravane, Sector 1, Nerul is among the favourite chai cafés in Nerul, Navi Mumbai — open daily from 8:00 AM to 11:00 PM. We serve signature kadak masala chai, adarak chai, coffee and refreshing shakes, plus grilled sandwiches, vada pav and quick bites. Whether you want a morning cutting chai in Nerul, an office tea break, or late-evening snacks, this is your spot. Visit us, call to order, or get it delivered via Swiggy and Zomato.',
  'https://www.swiggy.com/search?query=Aroma%20Chai', 'https://www.zomato.com/mumbai/search?q=Aroma%20Chai',
  'https://www.facebook.com/aromachai.outlet/', 'https://www.instagram.com/aroma.chai/',
  '[{"name":"BreadHub","tagline":"Fresh breads & sandwiches — online only","swiggy":"https://www.swiggy.com/search?query=BreadHub","zomato":"https://www.zomato.com/mumbai/search?q=BreadHub"},{"name":"My Fries","tagline":"Loaded fries & sides — online only","swiggy":"https://www.swiggy.com/search?query=My%20Fries","zomato":"https://www.zomato.com/mumbai/search?q=My%20Fries"}]',
  20
),
(
  'seawoods', 'SEA', 'Aroma Chai – Seawoods', 'Sector 40, Seawoods West Kendriya Vihar Nerul', 'Navi Mumbai – 400706',
  '9:00 AM - 11:45 PM', '8850705132', 'https://maps.app.goo.gl/PtDHvgCk7giqqfD76',
  'Searching for a chai café in Seawoods? Aroma Chai near Kendriya Vihar, Sector 40, Seawoods West is open till 11:45 PM — one of the best late-night chai spots in Navi Mumbai. Enjoy kadak masala chai, elaichi chai, hot coffee, milkshakes, grilled sandwiches and fries. Ideal for late-evening chai after dinner, weekend hangouts with friends, or a quick tea near Seawoods station. Drop in any day from 9:00 AM, call us, or order home delivery on Swiggy and Zomato.',
  'https://www.swiggy.com/search?query=Aroma%20Chai', 'https://www.zomato.com/mumbai/search?q=Aroma%20Chai',
  'https://www.facebook.com/aromachai.outlet/', 'https://www.instagram.com/aroma.chai/',
  '[{"name":"BreadHub","tagline":"Fresh breads & sandwiches — online only","swiggy":"https://www.swiggy.com/search?query=BreadHub","zomato":"https://www.zomato.com/mumbai/search?q=BreadHub"},{"name":"My Fries","tagline":"Loaded fries & sides — online only","swiggy":"https://www.swiggy.com/search?query=My%20Fries","zomato":"https://www.zomato.com/mumbai/search?q=My%20Fries"}]',
  30
),
(
  'kopar-khairane', 'KHA', 'Aroma Chai – Kopar Khairane', 'Sector 4A, Kopar Khairane', 'Navi Mumbai – 400709',
  '8:30 AM - 11:45 PM', '9082732035', 'https://maps.app.goo.gl/Ndf9vGyBYn2W217c6',
  'Aroma Chai in Sector 4A, Kopar Khairane is a popular tea café in Navi Mumbai, open daily from 8:30 AM to 11:45 PM. Sip on our signature kadak masala chai, adarak chai or coffee, and pair it with grilled sandwiches, vada pav, peri peri fries and milkshakes. A go-to chai tapri experience in Kopar Khairane for morning tea, office breaks and late-night chai cravings. Visit the outlet, call ahead, or order online on Swiggy and Zomato for home delivery.',
  'https://www.swiggy.com/search?query=Aroma%20Chai', 'https://www.zomato.com/mumbai/search?q=Aroma%20Chai',
  'https://www.facebook.com/aromachai.outlet/', 'https://www.instagram.com/aroma.chai/',
  '[{"name":"BreadHub","tagline":"Fresh breads & sandwiches — online only","swiggy":"https://www.swiggy.com/search?query=BreadHub","zomato":"https://www.zomato.com/mumbai/search?q=BreadHub"},{"name":"My Fries","tagline":"Loaded fries & sides — online only","swiggy":"https://www.swiggy.com/search?query=My%20Fries","zomato":"https://www.zomato.com/mumbai/search?q=My%20Fries"}]',
  40
),
(
  'thane', 'THA', 'Aroma Chai – Thane', 'Tulsi Chowk', 'Thane East – 400603',
  '9:00 AM - 9:00 PM', '9146979879', 'https://maps.app.goo.gl/mo2EdMXLUUeBJ8U68',
  'Aroma Chai at Tulsi Chowk is your chai café in Thane East, open every day from 9:00 AM to 9:00 PM. We brew fresh kadak masala chai, adarak chai and coffee through the day, served with grilled sandwiches, vada pav and quick snacks. Conveniently located for a tea break near Thane station east side — perfect for your morning chai, office chai runs and evening snacks. Walk in, call us, or order on Swiggy and Zomato.',
  'https://www.swiggy.com/search?query=Aroma%20Chai', 'https://www.zomato.com/mumbai/search?q=Aroma%20Chai',
  'https://www.facebook.com/aromachai.outlet/', 'https://www.instagram.com/aroma.chai/',
  '[{"name":"BreadHub","tagline":"Fresh breads & sandwiches — online only","swiggy":"https://www.swiggy.com/search?query=BreadHub","zomato":"https://www.zomato.com/mumbai/search?q=BreadHub"},{"name":"My Fries","tagline":"Loaded fries & sides — online only","swiggy":"https://www.swiggy.com/search?query=My%20Fries","zomato":"https://www.zomato.com/mumbai/search?q=My%20Fries"}]',
  50
),
(
  'ulwe', 'ULW', 'Aroma Chai – Ulwe', 'Sector 5, Ulwe', 'Navi Mumbai – 410206',
  '8:30 AM - 10:00 PM', '9920572756', 'https://maps.app.goo.gl/WzSHfCaP2uCgf6548',
  'Aroma Chai in Sector 5, Ulwe brings Navi Mumbai''s favourite chai café experience to Ulwe — open daily from 8:30 AM to 10:00 PM. Enjoy hot kadak masala chai, elaichi chai, coffee and shakes, along with vada pav, grilled sandwiches and fries. Whether it''s your morning tea in Ulwe, an evening chai with friends, or snacks on the way home, we''ve got you covered. Visit us, call to order, or get delivery via Swiggy and Zomato.',
  'https://www.swiggy.com/search?query=Aroma%20Chai', 'https://www.zomato.com/mumbai/search?q=Aroma%20Chai',
  'https://www.facebook.com/aromachai.outlet/', 'https://www.instagram.com/aroma.chai/',
  '[{"name":"BreadHub","tagline":"Fresh breads & sandwiches — online only","swiggy":"https://www.swiggy.com/search?query=BreadHub","zomato":"https://www.zomato.com/mumbai/search?q=BreadHub"},{"name":"My Fries","tagline":"Loaded fries & sides — online only","swiggy":"https://www.swiggy.com/search?query=My%20Fries","zomato":"https://www.zomato.com/mumbai/search?q=My%20Fries"}]',
  60
),
(
  'ghansoli', 'GHA', 'Aroma Chai – Ghansoli', 'Sector 8, Ghansoli Gaon', 'Navi Mumbai – 400701',
  '7:00 AM - 10:00 PM', '9664665550', 'https://maps.app.goo.gl/Xd5K5S8MzVMjks2t7',
  'Aroma Chai in Sector 8, Ghansoli Gaon is one of our flagship chai cafés in Navi Mumbai — opening early at 7:00 AM for your morning chai and serving till 10:00 PM daily. Try our signature kadak masala chai, adarak chai, gud ki chai and coffee, with grilled sandwiches, vada pav, samosas and milkshakes. The perfect tea spot in Ghansoli for breakfast chai, office tea breaks and evening snacks. Walk in, call ahead, or order online on Swiggy and Zomato.',
  'https://www.swiggy.com/search?query=Aroma%20Chai', 'https://www.zomato.com/mumbai/search?q=Aroma%20Chai',
  'https://www.facebook.com/aromachai.outlet/', 'https://www.instagram.com/aroma.chai/',
  '[{"name":"BreadHub","tagline":"Fresh breads & sandwiches — online only","swiggy":"https://www.swiggy.com/search?query=BreadHub","zomato":"https://www.zomato.com/mumbai/search?q=BreadHub"},{"name":"My Fries","tagline":"Loaded fries & sides — online only","swiggy":"https://www.swiggy.com/search?query=My%20Fries","zomato":"https://www.zomato.com/mumbai/search?q=My%20Fries"}]',
  70
),
(
  'turbhe', 'TUR', 'Aroma Chai – Turbhe', 'Turbhe MIDC, Near Prabhat Dairy', 'Navi Mumbai – 400705',
  '9:00 AM - 7:00 PM', '9082212363', 'https://maps.app.goo.gl/D1zuEqjKPYcyp7k39',
  'Aroma Chai at Turbhe MIDC, near Prabhat Dairy, is the favourite chai break spot for the Turbhe industrial area — open Monday to Sunday, 9:00 AM to 7:00 PM. Recharge with fresh kadak masala chai, adarak chai or coffee, and grab quick bites like vada pav, sandwiches and fries between shifts and meetings. The most convenient tea café near Turbhe MIDC for office groups and work breaks. Visit us, call ahead, or order on Swiggy and Zomato.',
  'https://www.swiggy.com/search?query=Aroma%20Chai', 'https://www.zomato.com/mumbai/search?q=Aroma%20Chai',
  'https://www.facebook.com/aromachai.outlet/', 'https://www.instagram.com/aroma.chai/',
  '[{"name":"BreadHub","tagline":"Fresh breads & sandwiches — online only","swiggy":"https://www.swiggy.com/search?query=BreadHub","zomato":"https://www.zomato.com/mumbai/search?q=BreadHub"},{"name":"My Fries","tagline":"Loaded fries & sides — online only","swiggy":"https://www.swiggy.com/search?query=My%20Fries","zomato":"https://www.zomato.com/mumbai/search?q=My%20Fries"}]',
  80
),
(
  'indore', 'IDR', 'Aroma Chai – Indore', 'Dawa Bazar, RNT Marg', 'Indore – 452001',
  '12:00 PM - 9:00 PM', '8770012534', 'https://maps.app.goo.gl/mK1so8esNBeEViYF7',
  'Aroma Chai at Dawa Bazar, RNT Marg brings our signature chai café experience to central Indore — open daily from 12:00 PM to 9:00 PM. Enjoy kadak masala chai, adarak chai, coffee and milkshakes with grilled sandwiches, samosas and fries. Perfectly placed for a tea break near Dawa Bazar, RNT Marg and the surrounding market area. Drop in for an afternoon chai, call us, or order online on Swiggy and Zomato.',
  'https://www.swiggy.com/search?query=Aroma%20Chai', 'https://www.zomato.com/indore/search?q=Aroma%20Chai',
  'https://www.facebook.com/aromachai.outlet/', 'https://www.instagram.com/aroma.chai/',
  '[{"name":"BreadHub","tagline":"Fresh breads & sandwiches — online only","swiggy":"https://www.swiggy.com/search?query=BreadHub","zomato":"https://www.zomato.com/indore/search?q=BreadHub"},{"name":"My Fries","tagline":"Loaded fries & sides — online only","swiggy":"https://www.swiggy.com/search?query=My%20Fries","zomato":"https://www.zomato.com/indore/search?q=My%20Fries"}]',
  90
),
(
  'nagpur', 'NAG', 'Aroma Chai – Nagpur', 'Ganpati Nagar, Zingabai Takli', 'Nagpur – 440030',
  '6:00 AM - 11:00 PM', '9420805996', 'https://maps.app.goo.gl/iaxkTXVfCxRH3dtJ7?g_st=aw',
  'Aroma Chai in Ganpati Nagar, Zingabai Takli opens at 6:00 AM — one of the earliest chai cafés in Nagpur — and serves till 11:00 PM every day. Start your morning with fresh kadak masala chai or adarak chai, and come back through the day for coffee, milkshakes, vada pav, sandwiches and snacks. Your dependable tea spot in Nagpur for morning chai, evening breaks and late-night cravings. Walk in, call ahead, or order on Swiggy and Zomato.',
  'https://www.swiggy.com/search?query=Aroma%20Chai', 'https://www.zomato.com/nagpur/search?q=Aroma%20Chai',
  'https://www.facebook.com/aromachai.outlet/', 'https://www.instagram.com/aroma.chai/',
  '[{"name":"BreadHub","tagline":"Fresh breads & sandwiches — online only","swiggy":"https://www.swiggy.com/search?query=BreadHub","zomato":"https://www.zomato.com/nagpur/search?q=BreadHub"},{"name":"My Fries","tagline":"Loaded fries & sides — online only","swiggy":"https://www.swiggy.com/search?query=My%20Fries","zomato":"https://www.zomato.com/nagpur/search?q=My%20Fries"}]',
  100
)
on conflict (slug) do nothing;
