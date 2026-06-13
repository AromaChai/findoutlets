# Tracking / Data Layer Reference

Every important interaction pushes an event to the GTM **dataLayer**
(container `GTM-5B8Q3VFB`, already installed). In GTM, create a
**Custom Event trigger** for each `event` name below, then fire your
Meta Pixel / Google Ads / GA4 tag on it.

Every event carries `outlet` (slug) and `city` (slug) where relevant, so you
can break results down by location.

## Conversion events (use these for ad optimization)

| event name | when it fires | extra data |
|---|---|---|
| `franchise_click` | tapped a Franchise CTA / nav button | `source`: outlet_cta \| nav |
| `order_now_open` | opened the Order Now sheet on an outlet page | outlet, city |
| `order_click` | tapped Swiggy/Zomato to actually order | `platform`: swiggy \| zomato, `source` |
| `call_click` | tapped a Call button | `source`: sticky \| details \| list |
| `directions_click` | tapped Get Directions / Map | `source`: sticky \| list |

**Most important for franchise ads:** `franchise_click`.
**Most important for ordering campaigns:** `order_click`.

## Engagement events (good for understanding behaviour)

| event name | when it fires | extra data |
|---|---|---|
| `outlet_select` | tapped an outlet card in a list | outlet, city |
| `city_filter` | tapped a city chip on the home page | `city` |
| `menu_expand` | opened the full menu | outlet, city |
| `brand_click` | tapped BreadHub / My Fries order link | `brand`, `platform` |
| `social_click` | tapped Instagram / Facebook | `platform` |
| `share_click` | tapped the share button | outlet, city |
| `nav_order_click` | tapped Order Now in the bottom nav | — |
| `shop_click` | tapped "Shop now" (top bar) | — |
| `pageview` | every page / route change (already existed) | `page` |

## Microsoft Clarity

The Clarity loader is already in the code but **dormant**. To turn it on:
1. Create a free project at https://clarity.microsoft.com
2. Copy the **Project ID**
3. In Vercel → Project → Settings → Environment Variables, add:
   `NEXT_PUBLIC_CLARITY_ID = your-project-id`
4. Redeploy. Clarity (heatmaps + session recordings) starts automatically.

No code change needed — just the env var.
