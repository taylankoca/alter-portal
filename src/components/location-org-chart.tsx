
"use client";

import { Tree, TreeNode } from 'react-organizational-chart';
import styled from 'styled-components';
import { Card } from './ui/card';
import type { AppProject } from '@/lib/data-service';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

const StyledNode = styled(Card)`
  padding: 1rem;
  border-radius: 8px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--card));
  min-width: 200px;
  text-align: center;
`;

const NodeName = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: hsl(var(--foreground));
  cursor: default;
`;

const ProjectNode = styled(StyledNode)`
    min-width: 220px;
    cursor: pointer;
`;

const ProjectName = styled.div`
  font-weight: 500;
  font-size: 0.9rem;
`;

interface LocationOrgChartProps {
    projects: AppProject[];
}

export default function LocationOrgChart({ projects }: LocationOrgChartProps) {
    const router = useRouter();

    const handleProjectClick = (slug: string) => {
        router.push(`/dashboard/projects/${slug}`);
    };

    const locationTree = useMemo(() => {
        const locations: Record<string, AppProject[]> = {};
        projects.forEach(project => {
            const locationKey = project.location || "Belirtilmemiş";
            if (!locations[locationKey]) {
                locations[locationKey] = [];
            }
            locations[locationKey].push(project);
        });
        return locations;
    }, [projects]);


    if (!projects || projects.length === 0) {
        return <p>Proje bulunamadı.</p>
    }

    return (
       <div className="w-full overflow-x-auto p-4 bg-background">
         <Tree
            lineWidth={'2px'}
            lineColor={'hsl(var(--border))'}
            lineBorderRadius={'10px'}
            label={<StyledNode><NodeName>Tüm Konumlar</NodeName></StyledNode>}
        >
            {Object.entries(locationTree).map(([location, projectList]) => (
                <TreeNode key={location} label={<StyledNode><NodeName>{location}</NodeName></StyledNode>}>
                    {projectList.map(project => (
                        <TreeNode key={project.id} label={
                             <ProjectNode onClick={() => handleProjectClick(project.short_name_slug)}>
                                <ProjectName>{project.title}</ProjectName>
                                <p className="text-xs font-mono text-muted-foreground">#{project.alterProjectNo}</p>
                            </ProjectNode>
                        } />
                    ))}
                </TreeNode>
            ))}
        </Tree>
       </div>
    );
}

