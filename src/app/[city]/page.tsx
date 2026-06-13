import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCityName, getCitySlug } from "@/lib/data";
import { getAllOutlets } from "@/lib/outlets";
import { getOffer } from "@/lib/menu";
import OutletList from "@/component/OutletList";

type Props = {
  params: Promise<{ city: string }>;
};

export const revalidate = 300;
export const dynamicParams = true; // a new city appears automatically with its first outlet

export async function generateStaticParams() {
  const outlets = await getAllOutlets();
  const cities = [...new Set(outlets.map((o) => getCitySlug(o)))];
  return cities.map((city) => ({ city }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const outlets = (await getAllOutlets()).filter(
    (o) => getCitySlug(o) === city
  );
  if (outlets.length === 0) return {};

  const cityName = getCityName(outlets[0]);
  const title = `Chai Cafés in ${cityName} | Aroma Chai – ${outlets.length} Outlet${
    outlets.length > 1 ? "s" : ""
  }`;
  const description = `Find Aroma Chai outlets in ${cityName} with timings, phone, menu & directions. Kadak masala chai, snacks & shakes. Order on Swiggy & Zomato or visit us.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://findus.aromachai.in/${city}`,
    },
    openGraph: {
      title,
      description,
      url: `https://findus.aromachai.in/${city}`,
      siteName: "Aroma Chai",
      type: "website",
    },
  };
}

export default async function CityPage({ params }: Props) {
  const { city } = await params;
  const outlets = (await getAllOutlets()).filter(
    (o) => getCitySlug(o) === city
  );
  if (outlets.length === 0) notFound();

  const offer = await getOffer();
  const cityName = getCityName(outlets[0]);

  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Aroma Chai Outlets in ${cityName}`,
    numberOfItems: outlets.length,
    itemListElement: outlets.map((outlet, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: outlet.name,
      url: `https://findus.aromachai.in/${getCitySlug(outlet)}/${outlet.slug}`,
    })),
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
        item: `https://findus.aromachai.in/${city}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <OutletList
        outlets={outlets}
        offer={offer}
        heading={`Aroma Chai Outlets in ${cityName}`}
        subheading={`${outlets.length} chai café${
          outlets.length > 1 ? "s" : ""
        } in ${cityName} — timings, menu, directions & online ordering`}
        showBackLink
      />
    </>
  );
}
