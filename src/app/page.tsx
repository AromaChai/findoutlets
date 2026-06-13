import OutletList from "@/component/OutletList";
import { getAllOutlets } from "@/lib/outlets";
import { getCitySlug } from "@/lib/data";
import { getOffer } from "@/lib/menu";

export const revalidate = 300; // refresh outlet data every 5 minutes

export default async function Home() {
  const outlets = await getAllOutlets();
  const offer = await getOffer();

  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Aroma Chai Outlets",
    numberOfItems: outlets.length,
    itemListElement: outlets.map((outlet, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: outlet.name,
      url: `https://findus.aromachai.in/${getCitySlug(outlet)}/${outlet.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listJsonLd) }}
      />
      <OutletList
        outlets={outlets}
        offer={offer}
        subheading="Chai cafés in Navi Mumbai, Thane, Indore & Nagpur — timings, menu, directions & online ordering"
        showCityFilter
      />
    </>
  );
}
