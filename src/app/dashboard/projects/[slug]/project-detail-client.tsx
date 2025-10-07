
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define the types for the props
interface Project {
  id: string;
  title: string;
  description: string;
  members: string[];
  image: {
    src: string;
    width: number;
    height: number;
    "data-ai-hint": string;
  };
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
                <h1 className="text-3xl md:text-5xl font-bold text-foreground">{project.title}</h1>
            </div>

            <div className="container mx-auto px-4 md:px-0 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                         <h2 className="text-2xl font-semibold text-foreground border-b pb-2">{t.project_description}</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            {project.description}
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold text-foreground border-b pb-2">{t.project_team}</h2>
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
                    </div>
                </div>
            </div>
        </div>
    );
}
