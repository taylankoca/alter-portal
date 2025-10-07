
"use client";

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { ApiUnit } from '@/lib/data-service';

const OrgChartView = dynamic(() => import('@/components/org-chart-view'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[500px]" />,
});

export default function SchemaClient({ units }: { units: ApiUnit[] }) {
    return <OrgChartView units={units} />;
}
