
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { useLanguage } from '@/context/language-context';
import type { AppProject } from '@/lib/data-service';
import { Avatar, AvatarFallback } from './ui/avatar';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface ProjectCardProps {
  project: AppProject;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { translations } = useLanguage();
  const t = translations.projects_page;
  const projectUrl = `/dashboard/projects/${project.short_name_slug}`;
  const admins = project.members.filter(m => m.role === 'admin');

  return (
    <Card className="flex flex-col overflow-hidden group">
      {/* Header with blue background */}
      <CardHeader className="bg-primary text-primary-foreground p-4 flex flex-col justify-between !space-y-0 min-h-[120px]">
        <div className="flex items-start justify-between">
            <Link href={projectUrl} className="flex-1">
                <CardTitle className="text-lg font-semibold text-primary-foreground hover:underline cursor-pointer leading-tight">
                    {project.title}
                </CardTitle>
            </Link>
            <div className="relative -top-2 -right-2">
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground/80 hover:bg-white/20 hover:text-primary-foreground">
                    <MoreVertical size={18} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>{t.edit}</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">{t.delete}</DropdownMenuItem>
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
        
        <div className="flex justify-between items-end mt-2">
            <span className="text-xs text-primary-foreground font-mono">
                {/* Placeholder for future info if needed */}
            </span>

            <div className="flex -space-x-2">
                <TooltipProvider>
                {admins.map((admin, index) => (
                    <Tooltip key={admin.id}>
                        <TooltipTrigger asChild>
                            <Avatar className={cn("h-8 w-8 border-2 border-primary/80", `z-${(admins.length - index) * 10}`)}>
                                <AvatarFallback>{admin.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{admin.name}</p>
                        </TooltipContent>
                    </Tooltip>
                ))}
                </TooltipProvider>
            </div>
        </div>
      </CardHeader>
      
      {/* Content Area */}
      <CardContent className="flex-grow p-4 space-y-2">
        <span className="text-xs text-white bg-primary/80 px-2 py-1 rounded-full">
            Alter Proje No: {project.alterProjectNo}
        </span>
        <CardDescription className="text-sm text-muted-foreground line-clamp-2 h-[40px]">
            {project.employer}
        </CardDescription>
        <CardDescription className="text-sm text-muted-foreground line-clamp-1">
            {project.location}, {project.country}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

