
"use client";

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ApiUnit, AppProject } from '@/lib/data-service';

const OrgChartView = dynamic(() => import('@/components/org-chart-view'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[500px]" />,
});

const ProjectOrgChart = dynamic(() => import('@/components/project-org-chart'), {
    ssr: false,
    loading: () => <Skeleton className="w-full h-[500px]" />,
});

export default function SchemaClient({ units, projects }: { units: ApiUnit[], projects: AppProject[] }) {
    const [view, setView] = useState('org');

    return (
        <Tabs defaultValue="org" onValueChange={setView} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="org">Organizasyon Şeması</TabsTrigger>
                <TabsTrigger value="project">Proje Şeması</TabsTrigger>
            </TabsList>
            <TabsContent value="org">
                <OrgChartView units={units} />
            </TabsContent>
            <TabsContent value="project">
                <ProjectOrgChart projects={projects} />
            </TabsContent>
        </Tabs>
    );
}
