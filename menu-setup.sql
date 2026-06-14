-- ============================================================
-- AROMA CHAI — Menu + Offer banner setup
-- Paste this whole file into: Supabase → SQL Editor → Run
-- ============================================================

create table if not exists settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table settings enable row level security;
grant all on table settings to service_role;

alter table outlets add column if not exists menu_overrides jsonb not null default '{}'::jsonb;

-- Master menu (from the printed menu card). Edit anytime at /admin/menu.
insert into settings (key, value) values ('menu', '[
{"id":"everyday-value-meal","category":"Aroma Combos (Best Deal)","name":"Everyday Value Meal — Burger/Sandwich/Wraps + Fries/Appetizers + Cold Coffee/Shakes (Save ₹99)","price":229},
{"id":"mini-snacks-meal","category":"Aroma Combos (Best Deal)","name":"Mini Snacks Meal — Fusion Fries/Appetizers + Cold Refresher/Cold Coffee/Shakes (Save ₹40)","price":158},
{"id":"special-chai-combo","category":"Aroma Combos (Best Deal)","name":"Special Chai Combo — 2 Special Chai + 2 Bun Maska/Vada Pav/Punjabi Samosa (Save ₹35)","price":145},
{"id":"special-chai","category":"Garam Chai","name":"Special Chai (Lemon Grass / Kesar Elaichi / Chocolate)","price":60},
{"id":"without-low-sugar-chai","category":"Garam Chai","name":"Without / Low Sugar Chai","price":50},
{"id":"gud-ki-chai","category":"Garam Chai","name":"Gud Ki Chai","price":50},
{"id":"adrak-kadak-masala-chai","category":"Garam Chai","name":"Adrak / Kadak Masala Chai","price":40},
{"id":"elaichi-chai","category":"Garam Chai","name":"Elaichi Chai","price":30},
{"id":"lemon-masala-tea","category":"Tea Without Milk","name":"Lemon / Lemon Masala Tea","price":40},
{"id":"green-black-tea","category":"Tea Without Milk","name":"Green Tea / Black Tea (With Honey +₹20)","price":50},
{"id":"coffee","category":"Hot Coffee","name":"Coffee","price":50},
{"id":"without-low-sugar-coffee","category":"Hot Coffee","name":"Without / Low Sugar Coffee (Make it Strong +₹10)","price":55},
{"id":"black-coffee","category":"Hot Coffee","name":"Black Coffee","price":60},
{"id":"chocolate-coffee","category":"Hot Coffee","name":"Chocolate Coffee","price":70},
{"id":"hot-chocolate","category":"Hot Special","name":"Hot Chocolate","price":69},
{"id":"kesar-dryfruit-milk","category":"Hot Special","name":"Kesar Dryfruit Milk","price":69},
{"id":"chocolate-cold-coffee","category":"Cold Craft","name":"Chocolate Cold Coffee","price":139},
{"id":"classic-cold-coffee","category":"Cold Craft","name":"Classic Cold Coffee (With Ice-Cream +₹30)","price":119},
{"id":"kitkat-milkshake","category":"Cold Craft","name":"KitKat Milkshake","price":159},
{"id":"oreo-milkshake","category":"Cold Craft","name":"Oreo Milkshake","price":149},
{"id":"mango-milkshake","category":"Cold Craft","name":"Mango Milkshake","price":149},
{"id":"strawberry-milkshake","category":"Cold Craft","name":"Strawberry Milkshake","price":149},
{"id":"kesar-badam-thandai","category":"Cold Craft","name":"Kesar Badam Thandai","price":149},
{"id":"lemon-fizz","category":"Cold Refresher","name":"Lemon Fizz","price":69},
{"id":"nimbu-pani","category":"Cold Refresher","name":"Nimbu Pani","price":49},
{"id":"aam-panna-lemon-ice-tea","category":"Cold Refresher","name":"Aam Panna / Lemon Ice Tea","price":59},
{"id":"veg-spring-roll","category":"Appetizers","name":"Veg Spring Roll (4 Pcs)","price":140},
{"id":"cheese-corn-balls","category":"Appetizers","name":"Cheese Corn Balls (6 Pcs)","price":150},
{"id":"pizza-samosa","category":"Appetizers","name":"Pizza Samosa (4 Pcs)","price":150},
{"id":"paneer-tandoori-grill","category":"Grilled Sandwiches","name":"Paneer Tandoori Grill","price":160},
{"id":"paneer-mexican-grill","category":"Grilled Sandwiches","name":"Paneer Mexican Grill","price":160},
{"id":"bombay-masala-grill","category":"Grilled Sandwiches","name":"Bombay Masala Grill (With Cheese +₹30)","price":110},
{"id":"chilli-cheese-grill","category":"Grilled Sandwiches","name":"Chilli Cheese Grill","price":150},
{"id":"corn-cheese-grill","category":"Grilled Sandwiches","name":"Corn Cheese Grill","price":150},
{"id":"spinach-corn-cheese-grill","category":"Grilled Sandwiches","name":"Spinach Corn Cheese Grill","price":170},
{"id":"aloo-cheese-grill","category":"Grilled Sandwiches","name":"Aloo Cheese Grill","price":130},
{"id":"paneer-cheese-wraps","category":"Grilled Wraps","name":"Paneer Cheese Wraps (Chilli / Tandoori / Mexican)","price":180},
{"id":"masala-cheese-wraps","category":"Grilled Wraps","name":"Masala Cheese Wraps","price":140},
{"id":"paneer-burger","category":"Burgers","name":"Paneer Burger","price":140},
{"id":"crispy-veg-burger","category":"Burgers","name":"Crispy Veg Burger (With Cheese +₹30 / Chilli-Tandoori +₹30)","price":110},
{"id":"classic-salted-fries","category":"Crispy Fries","name":"Classic Salted Fries","price":99},
{"id":"peri-peri-fries","category":"Crispy Fries","name":"Peri Peri Fries","price":120},
{"id":"crinkles-salted-fries","category":"Crispy Fries","name":"Crinkles Salted Fries","price":110},
{"id":"crinkles-peri-peri-fries","category":"Crispy Fries","name":"Crinkles Peri Peri Fries (Upgrade to Fusion Fries +₹40)","price":130},
{"id":"sabudana-vada","category":"Quick Bite","name":"Sabudana Vada (2 Pcs)","price":79},
{"id":"panjabi-samosa","category":"Quick Bite","name":"Panjabi Samosa (2 Pcs)","price":69},
{"id":"vada-pav","category":"Quick Bite","name":"Vada Pav (2 Pcs)","price":60},
{"id":"bun-maska","category":"Quick Bite","name":"Bun Maska (Amul Butter; Jam/Chocolate/Extra Butter +₹25)","price":45},
{"id":"cheese-corn-maggi","category":"Maggi","name":"Cheese Corn Maggi","price":99},
{"id":"vegetable-maggi","category":"Maggi","name":"Vegetable Maggi","price":89},
{"id":"classic-maggi","category":"Maggi","name":"Classic Maggi (Peri Peri/Butter/Cheese +₹30)","price":79},
{"id":"vanilla-icecream-chocolate","category":"Dessert","name":"Vanilla Ice-Cream with Chocolate","price":69},
{"id":"choco-lava-cake","category":"Dessert","name":"Choco Lava Cake","price":99}
]'::jsonb)
on conflict (key) do nothing;
