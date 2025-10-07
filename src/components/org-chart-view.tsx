
"use client";

import { Tree, TreeNode } from 'react-organizational-chart';
import styled from 'styled-components';
import { Card } from './ui/card';
import type { ApiUnit, ApiUser } from '@/lib/data-service';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from './ui/avatar';

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
  max-width: 220px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;

  &:hover {
    background-color: hsl(var(--accent));
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }
`;

const UnitName = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  color: hsl(var(--foreground));
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

    const renderUserNode = (user: ApiUser) => {
        const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
        return (
            <TreeNode key={`user-${user.id}`} label={
                <StyledNode onClick={() => handleNodeClick(user.id)}>
                    <Avatar className="h-12 w-12 text-lg">
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                        <UserName className="text-center">{user.first_name} {user.last_name}</UserName>
                        {user.title && <UserTitle>{user.title}</UserTitle>}
                    </div>
                </StyledNode>
            }/>
        );
    };

    const renderTreeNodes = (nodes: TreeNodeData[]) => {
        return nodes.map(node => (
            <TreeNode key={node.id} label={<StyledNode><UnitName>{node.name}</UnitName></StyledNode>}>
                {node.children.length > 0 && renderTreeNodes(node.children)}
                {node.users && node.users.map(user => renderUserNode(user))}
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
