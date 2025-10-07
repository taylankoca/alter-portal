

"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDown, ArrowUp } from "lucide-react";
import type { AppProject, AppProjectMember } from '@/lib/data-service';

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
}

interface ProjectDetailClientProps {
  project: AppProject;
  t: Translations;
}

export default function ProjectDetailClient({ project, t }: ProjectDetailClientProps) {
    const admins = project.members.filter(m => m.role === 'admin').sort((a, b) => a.name.localeCompare(b.name));
    const members = project.members.filter(m => m.role !== 'admin').sort((a, b) => a.name.localeCompare(b.name));
    
    const sortedCommunications = project.communications.sort((a, b) => new Date(b.communicated_at).getTime() - new Date(a.communicated_at).getTime());

    const renderMemberCard = (member: AppProjectMember, isAdmin: boolean) => {
        const initials = member.name.split(' ').map(n => n[0]).join('');
        return (
            <Card key={member.name} className={`flex flex-col items-center justify-center p-4 text-center aspect-square transition-colors ${isAdmin ? 'bg-primary/10' : 'bg-card'}`}>
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

    return (
        <div className="space-y-8">
             <div className="p-6 md:p-8">
                <h1 className="text-3xl md:text-5xl font-bold text-foreground">{project.description}</h1>
                 <p className="text-lg text-muted-foreground mt-2">
                    {project.title} (Alter Proje No: {project.alterProjectNo})
                 </p>
            </div>

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
                    <TabsContent value="correspondence" className="mt-6">
                        {sortedCommunications.length > 0 ? (
                           <div className="border rounded-lg">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[80px] text-center">{t.communication_direction}</TableHead>
                                            <TableHead>{t.communication_code}</TableHead>
                                            <TableHead>{t.communication_title}</TableHead>
                                            <TableHead>{t.communication_institution}</TableHead>
                                            <TableHead className="text-right">{t.communication_date}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sortedCommunications.map((comm) => (
                                            <TableRow key={comm.id}>
                                                <TableCell className="text-center">
                                                    {comm.direction === 'incoming' ? 
                                                        <span className="inline-flex items-center gap-1.5 text-blue-600">
                                                            <ArrowDown size={16}/> 
                                                            {/* {t.communication_incoming} */}
                                                        </span> : 
                                                        <span className="inline-flex items-center gap-1.5 text-green-600">
                                                            <ArrowUp size={16}/> 
                                                            {/* {t.communication_outgoing} */}
                                                        </span>
                                                    }
                                                </TableCell>
                                                <TableCell className="font-mono text-xs">{comm.code}</TableCell>
                                                <TableCell className="font-medium">{comm.title}</TableCell>
                                                <TableCell>{comm.institution}</TableCell>
                                                <TableCell className="text-right">{new Date(comm.communicated_at).toLocaleDateString('tr-TR')}</TableCell>
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
