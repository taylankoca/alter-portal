
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
import { Search, ArrowDown, ArrowUp } from 'lucide-react';
import type { AppCommunication } from '@/lib/data-service';

interface EnrichedCommunication extends AppCommunication {
    projectName: string;
    projectSlug: string;
}

interface CorrespondenceViewProps {
  communications: EnrichedCommunication[];
}

export default function CorrespondenceView({ communications }: CorrespondenceViewProps) {
  const { translations } = useLanguage();
  const t_projects = translations.projects_page;
  const t_corr = translations.correspondence_page;
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredCommunications = React.useMemo(() => {
    if (!searchTerm) return communications;
    const lowercasedFilter = searchTerm.toLowerCase();
    return communications.filter(comm => {
      return (
        comm.title.toLowerCase().includes(lowercasedFilter) ||
        comm.projectName.toLowerCase().includes(lowercasedFilter) ||
        comm.institution.toLowerCase().includes(lowercasedFilter) ||
        comm.code.toLowerCase().includes(lowercasedFilter)
      );
    });
  }, [searchTerm, communications]);

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
             {filteredCommunications.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px] text-center">{t_projects.communication_direction}</TableHead>
                            <TableHead>{t_corr.project_name}</TableHead>
                            <TableHead>{t_projects.communication_code}</TableHead>
                            <TableHead>{t_projects.communication_title}</TableHead>
                            <TableHead>{t_projects.communication_institution}</TableHead>
                            <TableHead className="text-right">{t_projects.communication_date}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCommunications.map((comm) => (
                            <TableRow key={comm.id}>
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
