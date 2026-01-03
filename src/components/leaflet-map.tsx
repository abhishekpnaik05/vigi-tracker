
'use client';

import { Suspense, useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';
import type { Device } from '@/lib/types';

const LiveMap = dynamic(() => import('@/components/live-map'), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

type LeafletMapProps = {
  devices?: Device[];
};

export default function LeafletMap({ devices = [] }: LeafletMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {isClient ? (
        <Suspense fallback={<Skeleton className="h-full w-full" />}>
          <LiveMap devices={devices} />
        </Suspense>
      ) : (
        <Skeleton className="h-full w-full" />
      )}
    </div>
  );
}
