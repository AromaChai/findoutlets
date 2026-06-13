import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getLocality,
  getCityName,
  getSeoPlace,
  getCitySlug,
} from "@/lib/data";
import { getAllOutlets, getOutlet } from "@/lib/outlets";
import { getMasterMenu, computeOutletMenu, getOffer } from "@/lib/menu";
import { parseTime } from "@/lib/time";
import OutletDetail from "./OutletDetail";

type Props = {
  params: Promise<{ city: string; slug: string }>;
};

export const revalidate = 300; // refresh outlet data every 5 minutes
export const dynamicParams = true; // new outlets added in admin get pages automatically

export async function generateStaticParams() {
  const outlets = await getAllOutlets();
  return outlets.map((outlet) => ({
    city: getCitySlug(outlet),
    slug: outlet.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, slug } = await params;
  const outlet = await getOutlet(slug);
  if (!outlet || getCitySlug(outlet) !== city) return {};

  const locality = getLocality(outlet);
  const cityName = getCityName(outlet);
  const place = getSeoPlace(outlet);

  // Title ≤ 60 chars, description ≤ 155 chars, both matching the H1 keyword
  const title = `Chai Café in ${place} | Aroma Chai`;
  const description = `Chai café in ${place}. Open ${outlet.time} daily. Kadak masala chai, vada pav, snacks & shakes. Order on Swiggy & Zomato.`;

  return {
    title,
    description,
    keywords: [
      `chai cafe in ${locality}`,
      `tea cafe in ${locality}`,
      `chai near ${locality}`,
      `Aroma Chai ${locality}`,
      `tea shop ${cityName}`,
      `chai in ${cityName}`,
    ],
    alternates: {
      canonical: `https://findus.aromachai.in/${getCitySlug(outlet)}/${outlet.slug}`,
    },
    openGraph: {
      title,
      description: `${outlet.area}, ${outlet.city} · Open ${outlet.time} · Order on Swiggy & Zomato`,
      url: `https://findus.aromachai.in/${getCitySlug(outlet)}/${outlet.slug}`,
      siteName: "Aroma Chai",
      type: "website",
      images: [
        {
          url: "https://findus.aromachai.in/images/menu/kadak-masala-chai.jpg",
          width: 1200,
          height: 900,
          alt: `Aroma Chai ${locality} – kadak masala chai`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: `${outlet.area}, ${outlet.city} · Open ${outlet.time}`,
    },
  };
}

export default async function OutletPage({ params }: Props) {
  const { city, slug } = await params;
  const outlet = await getOutlet(slug);
  if (!outlet || getCitySlug(outlet) !== city) notFound();

  const masterMenu = await getMasterMenu();
  const menu = computeOutletMenu(masterMenu, outlet.menuOverrides);
  const offer = await getOffer();

  const pincodeMatch = outlet.city.match(/(\d{6})/);
  const cityName = getCityName(outlet);
  const citySlug = getCitySlug(outlet);
  const pageUrl = `https://findus.aromachai.in/${citySlug}/${outlet.slug}`;

  // machine-readable opening hours (e.g. opens "07:30", closes "23:00")
  const parsed = parseTime(outlet.time);
  const pad = (n: number) => String(n).padStart(2, "0");
  const allDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "@id": pageUrl,
    name: outlet.name,
    alternateName: `Aroma Chai ${getLocality(outlet)}`,
    description: `Chai café in ${getSeoPlace(outlet)} serving kadak masala chai, coffee, sandwiches, vada pav, fries and milkshakes.`,
    url: pageUrl,
    telephone: `+91${outlet.phone}`,
    servesCuisine: ["Tea", "Coffee", "Snacks", "Fast Food"],
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI, Cards",
    address: {
      "@type": "PostalAddress",
      streetAddress: outlet.area,
      addressLocality: cityName,
      addressRegion:
        cityName === "Indore" ? "Madhya Pradesh" : "Maharashtra",
      postalCode: pincodeMatch ? pincodeMatch[1] : undefined,
      addressCountry: "IN",
    },
    areaServed: {
      "@type": "City",
      name: cityName,
    },
    hasMap: outlet.map,
    openingHoursSpecification: parsed
      ? [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: allDays,
            opens: `${pad(parsed.openHour)}:${pad(parsed.openMin)}`,
            closes: `${pad(parsed.closeHour)}:${pad(parsed.closeMin)}`,
          },
        ]
      : undefined,
    image: "https://findus.aromachai.in/images/menu/kadak-masala-chai.jpg",
    sameAs: [outlet.facebook, outlet.instagram].filter(Boolean),
    parentOrganization: {
      "@type": "Organization",
      name: "Aroma Chai",
      url: "https://aromachai.in",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "All Outlets",
        item: "https://findus.aromachai.in/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `Aroma Chai in ${cityName}`,
        item: `https://findus.aromachai.in/${citySlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: outlet.name,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <OutletDetail outlet={outlet} menu={menu} offer={offer} />
    </>
  );
}
