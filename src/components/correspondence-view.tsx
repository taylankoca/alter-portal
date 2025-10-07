

"use client";

import * as React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/language-context';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from './ui/input';
import { Search, ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import type { AppCommunication } from '@/lib/data-service';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

interface EnrichedCommunication extends AppCommunication {
    projectName: string;
    projectSlug: string;
}

interface CorrespondenceViewProps {
  communications: EnrichedCommunication[];
}

type SortKey = keyof EnrichedCommunication;
type SortDirection = 'ascending' | 'descending';

export default function CorrespondenceView({ communications }: CorrespondenceViewProps) {
  const { translations } = useLanguage();
  const router = useRouter();
  const t_projects = translations.projects_page;
  const t_corr = translations.correspondence_page;
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{ key: SortKey; direction: SortDirection } | null>({ key: 'communicated_at', direction: 'descending' });

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const handleRowClick = (id: number) => {
    router.push(`/dashboard/correspondence/${id}`);
  };

  const filteredAndSortedCommunications = React.useMemo(() => {
    let filteredComms = [...communications];

    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      filteredComms = filteredComms.filter(comm => 
        comm.title.toLowerCase().includes(lowercasedFilter) ||
        comm.projectName.toLowerCase().includes(lowercasedFilter) ||
        comm.institution.toLowerCase().includes(lowercasedFilter) ||
        comm.code.toLowerCase().includes(lowercasedFilter)
      );
    }
    
    if (sortConfig !== null) {
      filteredComms.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === undefined || bValue === undefined) return 0;

        if (sortConfig.key === 'communicated_at') {
            const dateA = new Date(aValue as string).getTime();
            const dateB = new Date(bValue as string).getTime();
            if (dateA < dateB) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (dateA > dateB) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        }
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          if (aValue.localeCompare(bValue, 'tr') < 0) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (aValue.localeCompare(bValue, 'tr') > 0) return sortConfig.direction === 'ascending' ? 1 : -1;
        }

        return 0;
      });
    }

    return filteredComms;
  }, [searchTerm, communications, sortConfig]);

  const renderSortArrow = (key: SortKey) => {
    if (sortConfig?.key !== key) {
        return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />;
    }
    return sortConfig.direction === 'ascending' ? (
        <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
        <ArrowDown className="ml-2 h-4 w-4" />
    );
  };


  return (
    <div className="space-y-6">
        <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder={t_corr.search_placeholder}
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <div className="border rounded-lg">
             {filteredAndSortedCommunications.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">
                                 <Button variant="ghost" onClick={() => handleSort('direction')} className="p-0 hover:bg-transparent">
                                    {t_projects.communication_direction}
                                    {renderSortArrow('direction')}
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('projectName')} className="p-0 hover:bg-transparent">
                                    {t_corr.project_name}
                                    {renderSortArrow('projectName')}
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('code')} className="p-0 hover:bg-transparent">
                                    {t_projects.communication_code}
                                    {renderSortArrow('code')}
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('title')} className="p-0 hover:bg-transparent">
                                    {t_projects.communication_title}
                                    {renderSortArrow('title')}
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button variant="ghost" onClick={() => handleSort('institution')} className="p-0 hover:bg-transparent">
                                    {t_projects.communication_institution}
                                    {renderSortArrow('institution')}
                                </Button>
                            </TableHead>
                            <TableHead className="text-right">
                                <Button variant="ghost" onClick={() => handleSort('communicated_at')} className="p-0 hover:bg-transparent">
                                    {t_projects.communication_date}
                                    {renderSortArrow('communicated_at')}
                                </Button>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAndSortedCommunications.map((comm) => (
                            <TableRow key={comm.id} onClick={() => handleRowClick(comm.id)} className="cursor-pointer">
                                <TableCell className="text-center">
                                    {comm.direction === 'incoming' ? 
                                        <span className="inline-flex items-center gap-1.5 text-blue-600" title={t_projects.communication_incoming}>
                                            <ArrowDown size={16}/> 
                                        </span> : 
                                        <span className="inline-flex items-center gap-1.5 text-green-600" title={t_projects.communication_outgoing}>
                                            <ArrowUp size={16}/> 
                                        </span>
                                    }
                                </TableCell>
                                <TableCell>
                                    <Link href={`/dashboard/projects/${comm.projectSlug}`}>
                                        <span className="font-medium hover:underline cursor-pointer">{comm.projectName}</span>
                                    </Link>
                                </TableCell>
                                <TableCell className="font-mono text-xs">{comm.code}</TableCell>
                                <TableCell className="font-medium">{comm.title}</TableCell>
                                <TableCell>{comm.institution}</TableCell>
                                <TableCell className="text-right">{new Date(comm.communicated_at).toLocaleDateString('tr-TR')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <div className="space-y-4 text-center text-muted-foreground py-16">
                    <p>{t_corr.no_communication_found}</p>
                </div>
            )}
        </div>
    </div>
  );
}
