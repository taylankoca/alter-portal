
"use client";

import { Tree, TreeNode } from 'react-organizational-chart';
import styled from 'styled-components';
import { Card } from './ui/card';
import type { AppProject, AppProjectMember } from '@/lib/data-service';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';

const StyledNode = styled(Card)`
  padding: 1rem;
  border-radius: 8px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--card));
  min-width: 240px;
  text-align: center;
`;

const NodeName = styled.div`
  font-weight: 600;
  font-size: 1rem;
  color: hsl(var(--foreground));
`;

const UserRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 6px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: hsl(var(--accent));
  }
`;

const UserInfo = styled.div`
    display: flex;
    flex-direction: column;
`;

const UserName = styled.div`
  font-weight: 500;
  font-size: 0.8rem;
  color: hsl(var(--foreground));
`;

const UsersContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: 100%;
    margin-top: 0.75rem;
`;


interface ProjectOrgChartProps {
    projects: AppProject[];
}

export default function ProjectOrgChart({ projects }: ProjectOrgChartProps) {
    const router = useRouter();

    const handleUserClick = (userId: number) => {
        router.push(`/dashboard/people/${userId}`);
    };

    const handleProjectClick = (slug: string) => {
        router.push(`/dashboard/projects/${slug}`);
    };

    const renderUser = (member: AppProjectMember) => {
        const initials = member.name.split(' ').map(n => n[0]).join('');
        return (
            <UserRow key={member.id} onClick={() => handleUserClick(member.id)}>
                <Avatar className="h-9 w-9 text-xs">
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <UserInfo>
                    <UserName>{member.name}</UserName>
                </UserInfo>
                {member.role === 'admin' && <Badge variant="secondary" className="ml-auto">Yönetici</Badge>}
            </UserRow>
        );
    }

    const renderProjectNode = (project: AppProject) => {
        const admins = project.members.filter(m => m.role === 'admin');
        const otherMembers = project.members.filter(m => m.role !== 'admin');

        return (
            <TreeNode key={project.id} label={
                <StyledNode onClick={() => handleProjectClick(project.short_name_slug)} className="cursor-pointer">
                    <NodeName>{project.title}</NodeName>
                    <p className="text-xs text-muted-foreground">{project.description}</p>
                     {project.members && project.members.length > 0 && (
                        <>
                            <Separator className="my-1" />
                            <UsersContainer>
                                {admins.map(user => renderUser(user))}
                                {otherMembers.map(user => renderUser(user))}
                            </UsersContainer>
                        </>
                    )}
                </StyledNode>
            }>
            </TreeNode>
        );
    };

    if (!projects || projects.length === 0) {
        return <p>Proje bulunamadı.</p>
    }

    return (
       <div className="w-full overflow-x-auto p-4 bg-background">
         <Tree
            lineWidth={'2px'}
            lineColor={'hsl(var(--border))'}
            lineBorderRadius={'10px'}
            label={<StyledNode><NodeName>Tüm Projeler</NodeName></StyledNode>}
        >
            {projects.map(renderProjectNode)}
        </Tree>
       </div>
    );
}
