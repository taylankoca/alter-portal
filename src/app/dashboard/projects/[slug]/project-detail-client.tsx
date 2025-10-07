
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the types for the props
interface ProjectMember {
  name: string;
  role: 'admin' | 'member';
}
interface Project {
  id: string;
  title: string;
  description: string;
  members: ProjectMember[];
}

interface Translations {
    project_description: string;
    project_team: string;
    admin_role: string;
}

interface ProjectDetailClientProps {
  project: Project;
  t: Translations;
}

export default function ProjectDetailClient({ project, t }: ProjectDetailClientProps) {
    return (
        <div className="space-y-8">
             <div className="p-6 md:p-8">
                <h1 className="text-3xl md:text-5xl font-bold text-foreground">{project.description}</h1>
                 <p className="text-lg text-muted-foreground mt-2">{project.title}</p>
            </div>

            <div className="container mx-auto px-4 md:px-0 max-w-4xl">
                <Tabs defaultValue="description" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="description">{t.project_description}</TabsTrigger>
                        <TabsTrigger value="team">{t.project_team}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="description" className="mt-6">
                        <div className="space-y-4">
                            <p className="text-muted-foreground leading-relaxed">
                                {project.description}
                            </p>
                        </div>
                    </TabsContent>
                    <TabsContent value="team" className="mt-6">
                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {project.members
                                .sort((a, b) => {
                                    if (a.role === 'admin' && b.role !== 'admin') return -1;
                                    if (a.role !== 'admin' && b.role === 'admin') return 1;
                                    return a.name.localeCompare(b.name);
                                })
                                .map((member, index) => {
                                const initials = member.name.split(' ').map(n => n[0]).join('');
                                const isAdmin = member.role === 'admin';
                                return (
                                    <Card key={index} className={`flex flex-col items-center justify-center p-4 text-center aspect-square transition-colors ${isAdmin ? 'bg-primary/10' : 'bg-card'}`}>
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
                            })}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
