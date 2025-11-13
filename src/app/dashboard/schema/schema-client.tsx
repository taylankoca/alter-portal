
"use client";

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { ApiUnit, AppProject } from '@/lib/data-service';
import { Card } from '@/components/ui/card';

const OrgChartView = dynamic(() => import('@/components/org-chart-view'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[500px]" />,
});

const ProjectOrgChart = dynamic(() => import('@/components/project-org-chart'), {
    ssr: false,
    loading: () => <Skeleton className="w-full h-[500px]" />,
});

const LocationOrgChart = dynamic(() => import('@/components/location-org-chart'), {
    ssr: false,
    loading: () => <Skeleton className="w-full h-[500px]" />,
});

type ViewMode = 'org' | 'project' | 'location';

export default function SchemaClient({ units, projects }: { units: ApiUnit[], projects: AppProject[] }) {
    const [view, setView] = useState<ViewMode>('org');

    return (
        <div className="relative w-full">
            <Card className="absolute top-4 left-4 z-10 p-3 shadow-lg">
                <RadioGroup defaultValue="org" onValueChange={(value) => setView(value as ViewMode)} className="flex flex-col gap-2">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="org" id="org-view" />
                        <Label htmlFor="org-view" className="cursor-pointer">İdari Şema</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="project" id="project-view" />
                        <Label htmlFor="project-view" className="cursor-pointer">Proje Şeması</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="location" id="location-view" />
                        <Label htmlFor="location-view" className="cursor-pointer">Konum Şeması</Label>
                    </div>
                </RadioGroup>
            </Card>

            <div className="w-full h-full">
                {view === 'org' && <OrgChartView units={units} />}
                {view === 'project' && <ProjectOrgChart projects={projects} />}
                {view === 'location' && <LocationOrgChart projects={projects} />}
            </div>
        </div>
    );
}
