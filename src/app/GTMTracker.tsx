'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface DataLayerEvent {
  event: string;
  page?: string;
  [key: string]: unknown; // 使用unknown替代any
}


declare global {
  interface Window {
    dataLayer: DataLayerEvent[];
  }
}


export default function GTMTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'pageview',
        page: pathname + (searchParams ? '?' + searchParams.toString() : ''),
      });
    }
  }, [pathname, searchParams]);

  return null;
}
