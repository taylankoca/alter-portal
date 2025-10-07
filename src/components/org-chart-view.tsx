
"use client";

import { Tree, TreeNode } from 'react-organizational-chart';
import styled from 'styled-components';
import { Card } from './ui/card';
import type { ApiUnit, ApiUser } from '@/lib/data-service';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';

const StyledNode = styled(Card)`
  padding: 1rem;
  border-radius: 8px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid hsl(var(--border));
  background-color: hsl(var(--card));
  min-width: 220px;
  text-align: center;
`;

const UnitName = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
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

const UserTitle = styled.div`
    font-size: 0.7rem;
    color: hsl(var(--muted-foreground));
`;

const UsersContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    width: 100%;
    margin-top: 0.75rem;
`;


interface OrgChartViewProps {
    units: ApiUnit[];
}

interface TreeNodeData extends ApiUnit {
    children: TreeNodeData[];
}

export default function OrgChartView({ units }: OrgChartViewProps) {
    const router = useRouter();

    const handleNodeClick = (userId: number) => {
        router.push(`/dashboard/people/${userId}`);
    };

    const buildTree = (items: ApiUnit[]): TreeNodeData[] => {
        const itemMap: { [key: number]: TreeNodeData } = {};
        items.forEach(item => {
            itemMap[item.id] = { ...item, children: [] };
        });

        const tree: TreeNodeData[] = [];
        items.forEach(item => {
            if (item.parent_id !== null && itemMap[item.parent_id]) {
                itemMap[item.parent_id].children.push(itemMap[item.id]);
            } else {
                tree.push(itemMap[item.id]);
            }
        });
        return tree;
    };

    const renderUser = (user: ApiUser) => {
        const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
        return (
            <UserRow key={user.id} onClick={() => handleNodeClick(user.id)}>
                <Avatar className="h-9 w-9 text-xs">
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <UserInfo>
                    <UserName>{user.first_name} {user.last_name}</UserName>
                    {user.title && <UserTitle>{user.title}</UserTitle>}
                </UserInfo>
            </UserRow>
        );
    }

    const renderTreeNodes = (nodes: TreeNodeData[]) => {
        return nodes.map(node => (
            <TreeNode key={node.id} label={
                <StyledNode>
                    <UnitName>{node.name}</UnitName>
                    {node.users && node.users.length > 0 && (
                        <>
                            <Separator className="my-1" />
                            <UsersContainer>
                                {node.users.map(user => renderUser(user))}
                            </UsersContainer>
                        </>
                    )}
                </StyledNode>
            }>
                {node.children.length > 0 && renderTreeNodes(node.children)}
            </TreeNode>
        ));
    };

    if (!units || units.length === 0) {
        return <p>Birim bulunamadı.</p>
    }

    const treeData = buildTree(units);

    return (
       <div className="w-full overflow-x-auto p-4 bg-background">
         <Tree
            lineWidth={'2px'}
            lineColor={'hsl(var(--border))'}
            lineBorderRadius={'10px'}
            label={<StyledNode><UnitName>Alter International</UnitName></StyledNode>}
        >
            {renderTreeNodes(treeData)}
        </Tree>
       </div>
    );
}
