
"use client";

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import type { ApiUser } from '@/lib/data-service';

const OrgChartView = dynamic(() => import('@/components/org-chart-view'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[500px]" />,
});

export default function SchemaClient({ users }: { users: ApiUser[] }) {
    return <OrgChartView users={users} />;
}
