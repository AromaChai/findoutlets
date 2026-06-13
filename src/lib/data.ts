export type BrandLink = {
  name: string;
  tagline?: string;
  swiggy?: string;
  zomato?: string;
};

export type Review = {
  name: string;
  rating: number;
  text: string;
};

export type Outlet = {
  code: string;
  slug: string;
  name: string;
  area: string;
  city: string;
  time: string;
  phone: number;
  map: string;
  description?: string;
  cover?: string; // hero banner photo
  gallery?: string[]; // swipeable gallery photos
  swiggy?: string;
  zomato?: string;
  facebook?: string;
  instagram?: string;
  rating?: number;
  reviews?: Review[];
  brands?: BrandLink[];
  menuOverrides?: Record<string, { off?: boolean; price?: number }>;
};

/* Brand-level defaults — used until each outlet gets its own links via the admin panel */

export const socialLinks = {
  facebook: "https://www.facebook.com/aromachai.outlet/",
  instagram: "https://www.instagram.com/aroma.chai/",
};

// PLACEHOLDER search links — replace with each outlet's real Swiggy/Zomato page links
const SWIGGY_DEFAULT = "https://www.swiggy.com/search?query=Aroma%20Chai";
const zomatoSearch = (citySlug: string) =>
  `https://www.zomato.com/${citySlug}/search?q=Aroma%20Chai`;

const defaultBrands = (citySlug: string): BrandLink[] => [
  {
    name: "BreadHub",
    tagline: "Fresh breads & sandwiches — online only",
    swiggy: "https://www.swiggy.com/search?query=BreadHub",
    zomato: `https://www.zomato.com/${citySlug}/search?q=BreadHub`,
  },
  {
    name: "My Fries",
    tagline: "Loaded fries & sides — online only",
    swiggy: "https://www.swiggy.com/search?query=My%20Fries",
    zomato: `https://www.zomato.com/${citySlug}/search?q=My%20Fries`,
  },
];

export const menuHighlights = [
  { name: "Kadak Masala Chai", image: "/images/menu/kadak-masala-chai-v2.jpg" },
  { name: "Special Chai", image: "/images/menu/special-chai-v2.jpg" },
  { name: "Vada Pav", image: "/images/menu/vada-pav-v2.jpg" },
  { name: "Peri Peri Fries", image: "/images/menu/peri-peri-fries-v2.jpg" },
  { name: "Oreo Milkshake", image: "/images/menu/oreo-milkshake-v2.jpg" },
  {
    name: "Bombay Masala Grill",
    image: "/images/menu/bombay-masala-grill-v2.jpg",
  },
];

export const aromaChaiOutlets: Outlet[] = [
  {
    code: "JUI",
    slug: "juinagar",
    name: "Aroma Chai – Juinagar",
    area: "Sector 23, Juinagar",
    city: "Navi Mumbai – 400706",
    time: "7:30 AM - 11:00 PM",
    phone: 7304867253,
    map: "https://maps.app.goo.gl/QgmDxgv7Fc1TnSH5A",
    description:
      "Looking for a chai café in Juinagar? Aroma Chai in Sector 23, Juinagar is your neighbourhood tea spot in Navi Mumbai — open every day from 7:30 AM to 11:00 PM. Enjoy freshly brewed kadak masala chai, adarak chai, elaichi chai and filter coffee, along with grilled sandwiches, vada pav, fries and milkshakes. Perfect for morning chai near Juinagar station, evening snacks with friends, or a quick tea break from work. Walk in, call ahead, or order online on Swiggy and Zomato.",
    swiggy: SWIGGY_DEFAULT,
    zomato: zomatoSearch("mumbai"),
    facebook: socialLinks.facebook,
    instagram: socialLinks.instagram,
    brands: defaultBrands("mumbai"),
  },
  {
    code: "NER",
    slug: "nerul",
    name: "Aroma Chai – Nerul",
    area: "Sector 1, Shiravane, Nerul",
    city: "Navi Mumbai – 400706",
    time: "8:00 AM - 11:00 PM",
    phone: 9702738068,
    map: "https://maps.app.goo.gl/b8VuEwnkpMQG8kqW9",
    description:
      "Aroma Chai in Shiravane, Sector 1, Nerul is among the favourite chai cafés in Nerul, Navi Mumbai — open daily from 8:00 AM to 11:00 PM. We serve signature kadak masala chai, adarak chai, coffee and refreshing shakes, plus grilled sandwiches, vada pav and quick bites. Whether you want a morning cutting chai in Nerul, an office tea break, or late-evening snacks, this is your spot. Visit us, call to order, or get it delivered via Swiggy and Zomato.",
    swiggy: SWIGGY_DEFAULT,
    zomato: zomatoSearch("mumbai"),
    facebook: socialLinks.facebook,
    instagram: socialLinks.instagram,
    brands: defaultBrands("mumbai"),
  },
  {
    code: "SEA",
    slug: "seawoods",
    name: "Aroma Chai – Seawoods",
    area: "Sector 40, Seawoods West Kendriya Vihar Nerul",
    city: "Navi Mumbai – 400706",
    time: "9:00 AM - 11:45 PM",
    phone: 8850705132,
    map: "https://maps.app.goo.gl/PtDHvgCk7giqqfD76",
    description:
      "Searching for a chai café in Seawoods? Aroma Chai near Kendriya Vihar, Sector 40, Seawoods West is open till 11:45 PM — one of the best late-night chai spots in Navi Mumbai. Enjoy kadak masala chai, elaichi chai, hot coffee, milkshakes, grilled sandwiches and fries. Ideal for late-evening chai after dinner, weekend hangouts with friends, or a quick tea near Seawoods station. Drop in any day from 9:00 AM, call us, or order home delivery on Swiggy and Zomato.",
    swiggy: SWIGGY_DEFAULT,
    zomato: zomatoSearch("mumbai"),
    facebook: socialLinks.facebook,
    instagram: socialLinks.instagram,
    brands: defaultBrands("mumbai"),
  },
  {
    code: "KHA",
    slug: "kopar-khairane",
    name: "Aroma Chai – Kopar Khairane",
    area: "Sector 4A, Kopar Khairane",
    city: "Navi Mumbai – 400709",
    time: "8:30 AM - 11:45 PM",
    phone: 9082732035,
    map: "https://maps.app.goo.gl/Ndf9vGyBYn2W217c6",
    description:
      "Aroma Chai in Sector 4A, Kopar Khairane is a popular tea café in Navi Mumbai, open daily from 8:30 AM to 11:45 PM. Sip on our signature kadak masala chai, adarak chai or coffee, and pair it with grilled sandwiches, vada pav, peri peri fries and milkshakes. A go-to chai tapri experience in Kopar Khairane for morning tea, office breaks and late-night chai cravings. Visit the outlet, call ahead, or order online on Swiggy and Zomato for home delivery.",
    swiggy: SWIGGY_DEFAULT,
    zomato: zomatoSearch("mumbai"),
    facebook: socialLinks.facebook,
    instagram: socialLinks.instagram,
    brands: defaultBrands("mumbai"),
  },
  {
    code: "THA",
    slug: "thane",
    name: "Aroma Chai – Thane",
    area: "Tulsi Chowk, Thane East",
    city: "Thane – 400603",
    time: "9:00 AM - 9:00 PM",
    phone: 9146979879,
    map: "https://maps.app.goo.gl/mo2EdMXLUUeBJ8U68",
    description:
      "Aroma Chai at Tulsi Chowk is your chai café in Thane East, open every day from 9:00 AM to 9:00 PM. We brew fresh kadak masala chai, adarak chai and coffee through the day, served with grilled sandwiches, vada pav and quick snacks. Conveniently located for a tea break near Thane station east side — perfect for your morning chai, office chai runs and evening snacks. Walk in, call us, or order on Swiggy and Zomato.",
    swiggy: SWIGGY_DEFAULT,
    zomato: zomatoSearch("mumbai"),
    facebook: socialLinks.facebook,
    instagram: socialLinks.instagram,
    brands: defaultBrands("mumbai"),
  },
  {
    code: "ULW",
    slug: "ulwe",
    name: "Aroma Chai – Ulwe",
    area: "Sector 5, Ulwe",
    city: "Navi Mumbai – 410206",
    time: "8:30 AM - 10:00 PM",
    phone: 9920572756,
    map: "https://maps.app.goo.gl/WzSHfCaP2uCgf6548",
    description:
      "Aroma Chai in Sector 5, Ulwe brings Navi Mumbai's favourite chai café experience to Ulwe — open daily from 8:30 AM to 10:00 PM. Enjoy hot kadak masala chai, elaichi chai, coffee and shakes, along with vada pav, grilled sandwiches and fries. Whether it's your morning tea in Ulwe, an evening chai with friends, or snacks on the way home, we've got you covered. Visit us, call to order, or get delivery via Swiggy and Zomato.",
    swiggy: SWIGGY_DEFAULT,
    zomato: zomatoSearch("mumbai"),
    facebook: socialLinks.facebook,
    instagram: socialLinks.instagram,
    brands: defaultBrands("mumbai"),
  },
  {
    code: "GHA",
    slug: "ghansoli",
    name: "Aroma Chai – Ghansoli",
    area: "Sector 8, Ghansoli Gaon",
    city: "Navi Mumbai – 400701",
    time: "7:00 AM - 10:00 PM",
    phone: 9664665550,
    map: "https://maps.app.goo.gl/Xd5K5S8MzVMjks2t7",
    description:
      "Aroma Chai in Sector 8, Ghansoli Gaon is one of our flagship chai cafés in Navi Mumbai — opening early at 7:00 AM for your morning chai and serving till 10:00 PM daily. Try our signature kadak masala chai, adarak chai, gud ki chai and coffee, with grilled sandwiches, vada pav, samosas and milkshakes. The perfect tea spot in Ghansoli for breakfast chai, office tea breaks and evening snacks. Walk in, call ahead, or order online on Swiggy and Zomato.",
    swiggy: SWIGGY_DEFAULT,
    zomato: zomatoSearch("mumbai"),
    facebook: socialLinks.facebook,
    instagram: socialLinks.instagram,
    brands: defaultBrands("mumbai"),
  },
  {
    code: "TUR",
    slug: "turbhe",
    name: "Aroma Chai – Turbhe",
    area: "Turbhe MIDC, Near Prabhat Dairy",
    city: "Navi Mumbai – 400705",
    time: "9:00 AM - 7:00 PM",
    phone: 9082212363,
    map: "https://maps.app.goo.gl/D1zuEqjKPYcyp7k39",
    description:
      "Aroma Chai at Turbhe MIDC, near Prabhat Dairy, is the favourite chai break spot for the Turbhe industrial area — open Monday to Sunday, 9:00 AM to 7:00 PM. Recharge with fresh kadak masala chai, adarak chai or coffee, and grab quick bites like vada pav, sandwiches and fries between shifts and meetings. The most convenient tea café near Turbhe MIDC for office groups and work breaks. Visit us, call ahead, or order on Swiggy and Zomato.",
    swiggy: SWIGGY_DEFAULT,
    zomato: zomatoSearch("mumbai"),
    facebook: socialLinks.facebook,
    instagram: socialLinks.instagram,
    brands: defaultBrands("mumbai"),
  },
  {
    code: "IDR",
    slug: "indore",
    name: "Aroma Chai – Indore",
    area: "Dawa Bazar, RNT Marg",
    city: "Indore – 452001",
    time: "12:00 PM - 9:00 PM",
    phone: 8770012534,
    map: "https://maps.app.goo.gl/mK1so8esNBeEViYF7",
    description:
      "Aroma Chai at Dawa Bazar, RNT Marg brings our signature chai café experience to central Indore — open daily from 12:00 PM to 9:00 PM. Enjoy kadak masala chai, adarak chai, coffee and milkshakes with grilled sandwiches, samosas and fries. Perfectly placed for a tea break near Dawa Bazar, RNT Marg and the surrounding market area. Drop in for an afternoon chai, call us, or order online on Swiggy and Zomato.",
    swiggy: SWIGGY_DEFAULT,
    zomato: zomatoSearch("indore"),
    facebook: socialLinks.facebook,
    instagram: socialLinks.instagram,
    brands: defaultBrands("indore"),
  },
  {
    code: "NAG",
    slug: "nagpur",
    name: "Aroma Chai – Nagpur",
    area: "Ganpati Nagar, Zingabai Takli",
    city: "Nagpur – 440030",
    time: "6:00 AM - 11:00 PM",
    phone: 9420805996,
    map: "https://maps.app.goo.gl/iaxkTXVfCxRH3dtJ7?g_st=aw",
    description:
      "Aroma Chai in Ganpati Nagar, Zingabai Takli opens at 6:00 AM — one of the earliest chai cafés in Nagpur — and serves till 11:00 PM every day. Start your morning with fresh kadak masala chai or adarak chai, and come back through the day for coffee, milkshakes, vada pav, sandwiches and snacks. Your dependable tea spot in Nagpur for morning chai, evening breaks and late-night cravings. Walk in, call ahead, or order on Swiggy and Zomato.",
    swiggy: SWIGGY_DEFAULT,
    zomato: zomatoSearch("nagpur"),
    facebook: socialLinks.facebook,
    instagram: socialLinks.instagram,
    brands: defaultBrands("nagpur"),
  },
];

export function getOutletBySlug(slug: string): Outlet | undefined {
  return aromaChaiOutlets.find((o) => o.slug === slug);
}

export function getLocality(o: Outlet): string {
  return o.name.replace("Aroma Chai – ", "").trim();
}

export function getCityName(o: Outlet): string {
  // city line looks like "Navi Mumbai – 400706"; tolerate any dash type
  return o.city.split(/[–—-]/)[0].trim();
}

/** "Navi Mumbai – 400706" → "navi-mumbai" (used for /{city} URLs) */
export function getCitySlug(o: Outlet): string {
  return getCityName(o)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getSeoPlace(o: Outlet): string {
  const locality = getLocality(o);
  const cityName = getCityName(o);
  return cityName.toLowerCase().includes(locality.toLowerCase())
    ? cityName
    : `${locality}, ${cityName}`;
}

