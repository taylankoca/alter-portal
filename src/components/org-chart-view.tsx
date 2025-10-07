
"use client";

import { Tree, TreeNode } from 'react-organizational-chart';
import styled from 'styled-components';
import { Card } from './ui/card';
import type { ApiUser } from '@/lib/data-service';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useRouter } from 'next/navigation';


const StyledNode = styled(Card)`
  padding: 1rem;
  border-radius: 8px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--card));
  min-width: 180px;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;

  &:hover {
    background-color: hsl(var(--accent));
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }
`;

const UserName = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  color: hsl(var(--foreground));
`;

const UserTitle = styled.div`
  font-size: 0.75rem;
  color: hsl(var(--muted-foreground));
`;


interface OrgChartViewProps {
    users: ApiUser[];
}

export default function OrgChartView({ users }: OrgChartViewProps) {
    const router = useRouter();

    const handleNodeClick = (userId: number) => {
        router.push(`/dashboard/people/${userId}`);
    };

    const renderUserNode = (user: ApiUser) => (
        <StyledNode onClick={() => handleNodeClick(user.id)}>
            <Avatar className="h-12 w-12 text-lg">
                <AvatarFallback>{user.first_name[0]}{user.last_name[0]}</AvatarFallback>
            </Avatar>
            <div>
                <UserName className="text-center">{user.first_name} {user.last_name}</UserName>
                {user.title && <UserTitle className="text-center">{user.title}</UserTitle>}
            </div>
        </StyledNode>
    );

    // Placeholder hierarchy - will be replaced with real data structure
    const rootUser = {
        id: 0,
        first_name: 'Alter',
        last_name: 'International',
        title: 'Holding',
    };

    if (!users || users.length === 0) {
        return <p>Kullanıcı bulunamadı.</p>
    }

    return (
       <div className="w-full overflow-x-auto p-4">
         <Tree
            lineWidth={'2px'}
            lineColor={'hsl(var(--border))'}
            lineBorderRadius={'10px'}
            label={
                <StyledNode>
                    <Avatar className="h-12 w-12 text-lg">
                        <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                     <div>
                        <UserName className="text-center">{rootUser.first_name} {rootUser.last_name}</UserName>
                        <UserTitle className="text-center">{rootUser.title}</UserTitle>
                    </div>
                </StyledNode>
            }
        >
            {users.map(user => (
                <TreeNode key={user.id} label={renderUserNode(user)} />
            ))}
        </Tree>
       </div>
    );
}

