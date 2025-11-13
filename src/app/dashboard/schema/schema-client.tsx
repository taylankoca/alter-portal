
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

export default function SchemaClient({ units, projects }: { units: ApiUnit[], projects: AppProject[] }) {
    const [view, setView] = useState('org');

    return (
        <div className="relative w-full">
            <Card className="absolute top-4 left-4 z-10 p-3 shadow-lg">
                <RadioGroup defaultValue="org" onValueChange={setView} className="flex flex-col gap-2">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="org" id="org-view" />
                        <Label htmlFor="org-view" className="cursor-pointer">Organizasyon Şeması</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="project" id="project-view" />
                        <Label htmlFor="project-view" className="cursor-pointer">Proje Şeması</Label>
                    </div>
                </RadioGroup>
            </Card>

            <div className="w-full h-full">
                {view === 'org' ? (
                    <OrgChartView units={units} />
                ) : (
                    <ProjectOrgChart projects={projects} />
                )}
            </div>
        </div>
    );
}
