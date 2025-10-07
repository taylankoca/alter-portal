
"use client";

import { Tree, TreeNode } from 'react-organizational-chart';
import styled from 'styled-components';
import { Card } from './ui/card';
import type { ApiUnit } from '@/lib/data-service';

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
  cursor: default;
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

interface OrgChartViewProps {
    units: ApiUnit[];
}

interface TreeNodeData extends ApiUnit {
    children: TreeNodeData[];
}

export default function OrgChartView({ units }: OrgChartViewProps) {

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

    const renderTreeNodes = (nodes: TreeNodeData[]) => {
        return nodes.map(node => (
            <TreeNode key={node.id} label={<StyledNode><UnitName>{node.name}</UnitName></StyledNode>}>
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
