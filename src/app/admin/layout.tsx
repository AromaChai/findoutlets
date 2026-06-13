import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aroma Chai Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f3faf5] text-[#155126]">{children}</div>
  );
}
