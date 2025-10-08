

"use client";

import * as React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import type { AppProject, AppProjectMember, AppCommunication } from '@/lib/data-service';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// Define the types for the props

interface Translations {
    project_description: string;
    project_team: string;
    admin_role: string;
    correspondence: string;
    files: string;
    communication_direction: string;
    communication_code: string;
    communication_title: string;
    communication_institution: string;
    communication_date: string;
    communication_incoming: string;
    communication_outgoing: string;
    no_communication_found: string;
    search_placeholder: string;
}

interface ProjectDetailClientProps {
  project: AppProject;
  t: Translations;
}

type SortKey = keyof AppCommunication | 'projectName';
type SortDirection = 'ascending' | 'descending';


export default function ProjectDetailClient({ project, t }: ProjectDetailClientProps) {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [sortConfig, setSortConfig] = React.useState<{ key: SortKey; direction: SortDirection } | null>({ key: 'communicated_at', direction: 'descending' });
    const router = useRouter();
    
    const admins = project.members.filter(m => m.role === 'admin').sort((a, b) => a.name.localeCompare(b.name));
    const members = project.members.filter(m => m.role !== 'admin').sort((a, b) => a.name.localeCompare(b.name));
    

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

    const sortedAndFilteredCommunications = React.useMemo(() => {
        let filteredComms = [...project.communications];

        if (searchTerm) {
            const lowercasedFilter = searchTerm.toLowerCase();
            filteredComms = filteredComms.filter(comm =>
                comm.title.toLowerCase().includes(lowercasedFilter) ||
                comm.code.toLowerCase().includes(lowercasedFilter) ||
                comm.institution.toLowerCase().includes(lowercasedFilter)
            );
        }

        if (sortConfig !== null) {
            filteredComms.sort((a, b) => {
                const aValue = a[sortConfig.key as keyof AppCommunication];
                const bValue = b[sortConfig.key as keyof AppCommunication];

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
    }, [project.communications, searchTerm, sortConfig]);


    const renderMemberCard = (member: AppProjectMember, isAdmin: boolean) => {
        const initials = member.name.split(' ').map(n => n[0]).join('');
        return (
            <Card key={member.id} className={`flex flex-col items-center justify-center p-4 text-center aspect-square transition-colors ${isAdmin ? 'bg-primary/10' : 'bg-card'}`}>
                <div className="relative">
                    <Avatar className="h-16 w-16 border-4 border-background">
                        <AvatarFallback className={`${isAdmin ? 'bg-primary/20' : ''}`}>{initials}</AvatarFallback>
                    </Avatar>
                    {isAdmin && (
                        <Badge variant="default" className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                            {t.admin_role}
                        </Badge>
                    )}
                </div>
                <span className="text-sm font-medium mt-4 pt-1 truncate w-full" title={member.name}>{member.name}</span>
            </Card>
        );
    };
    
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
        <div className="space-y-8">
             <header className="bg-primary text-primary-foreground p-6 md:p-8 rounded-lg shadow-md">
                <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-4xl font-bold">{project.title}</h1>
                        <p className="text-lg text-primary-foreground/80 mt-2">
                            {project.description}
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center justify-center h-20 w-20 rounded-full bg-white text-primary text-2xl font-bold shadow-inner">
                           {project.alterProjectNo}
                        </div>
                        <span className="text-xs font-semibold text-primary-foreground/80">Alter Proje No</span>
                    </div>
                </div>
            </header>

            <div>
                <Tabs defaultValue="description" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="description">{t.project_description}</TabsTrigger>
                        <TabsTrigger value="team">{t.project_team}</TabsTrigger>
                        <TabsTrigger value="correspondence">{t.correspondence}</TabsTrigger>
                        <TabsTrigger value="files">{t.files}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="description" className="mt-6">
                        <div className="space-y-6 text-sm text-muted-foreground">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="font-medium text-foreground">İşveren</p>
                                    <p>{project.employer || '-'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="font-medium text-foreground">Konum</p>
                                    <p>{project.location}, {project.country}</p>
                                </div>
                            </div>
                            <Separator/>
                            <p className="leading-relaxed pt-4">
                                {project.description}
                            </p>
                        </div>
                    </TabsContent>
                    <TabsContent value="team" className="mt-6">
                        <div className="space-y-6">
                            {admins.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {admins.map(member => renderMemberCard(member, true))}
                                </div>
                            )}

                            {admins.length > 0 && members.length > 0 && (
                                <Separator className="my-6" />
                            )}

                            {members.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {members.map(member => renderMemberCard(member, false))}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="correspondence" className="mt-6 space-y-4">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={t.search_placeholder}
                                className="pl-9 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {sortedAndFilteredCommunications.length > 0 ? (
                           <div className="border rounded-lg">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[80px]">
                                                <Button variant="ghost" onClick={() => handleSort('direction')} className="p-0 hover:bg-transparent">
                                                    Gelen / Giden
                                                    {renderSortArrow('direction')}
                                                </Button>
                                            </TableHead>
                                             <TableHead>
                                                 <Button variant="ghost" onClick={() => handleSort('communicated_at')} className="p-0 hover:bg-transparent">
                                                    {t.communication_date}
                                                    {renderSortArrow('communicated_at')}
                                                </Button>
                                            </TableHead>
                                            <TableHead>
                                                 <Button variant="ghost" onClick={() => handleSort('title')} className="p-0 hover:bg-transparent">
                                                    {t.communication_title}
                                                    {renderSortArrow('title')}
                                                </Button>
                                            </TableHead>
                                            <TableHead>
                                                 <Button variant="ghost" onClick={() => handleSort('institution')} className="p-0 hover:bg-transparent">
                                                    {t.communication_institution}
                                                    {renderSortArrow('institution')}
                                                </Button>
                                            </TableHead>
                                            <TableHead>
                                                <Button variant="ghost" onClick={() => handleSort('code')} className="p-0 hover:bg-transparent">
                                                    {t.communication_code}
                                                    {renderSortArrow('code')}
                                                </Button>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sortedAndFilteredCommunications.map((comm) => (
                                            <TableRow key={comm.id} onClick={() => handleRowClick(comm.id)} className="cursor-pointer">
                                                <TableCell className="text-center">
                                                    {comm.direction === 'incoming' ? 
                                                        <span className="inline-flex items-center gap-1.5 text-blue-600">
                                                            <ArrowDown size={16}/> 
                                                        </span> : 
                                                        <span className="inline-flex items-center gap-1.5 text-green-600">
                                                            <ArrowUp size={16}/> 
                                                        </span>
                                                    }
                                                </TableCell>
                                                <TableCell>{new Date(comm.communicated_at).toLocaleDateString('tr-TR')}</TableCell>
                                                <TableCell className="font-medium">{comm.title}</TableCell>
                                                <TableCell>{comm.institution}</TableCell>
                                                <TableCell className="font-mono text-xs">{comm.code}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                           </div>
                        ) : (
                            <div className="space-y-4 text-center text-muted-foreground py-16">
                                <p>{t.no_communication_found}</p>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="files" className="mt-6">
                         <div className="space-y-4 text-center text-muted-foreground py-16">
                            <p>Henüz dosya bulunmamaktadır.</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
