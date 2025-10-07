
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the types for the props
interface Project {
  id: string;
  title: string;
  description: string;
  members: string[];
}

interface Translations {
    project_description: string;
    project_team: string;
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
                         <TooltipProvider>
                            <div className="flex flex-wrap gap-4">
                                {project.members.map((member, index) => {
                                    const initials = member.split(' ').map(n => n[0]).join('');
                                    return (
                                        <Tooltip key={index}>
                                            <TooltipTrigger>
                                                <div className="flex flex-col items-center gap-2">
                                                    <Avatar className="h-20 w-20 border-4 border-card transition-transform transform hover:scale-110">
                                                        <AvatarFallback>{initials}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="text-sm text-center font-medium">{member}</span>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{member}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    );
                                })}
                            </div>
                        </TooltipProvider>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
