"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { slugify } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';

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

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { translations } = useLanguage();
  const t = translations.projects_page;
  const projectUrl = `/dashboard/projects/${slugify(project.title)}`;

  return (
    <Card className="flex flex-col overflow-hidden group">
       <CardHeader className="p-0 relative h-36">
        <Link href={projectUrl}>
          <Image
            src={project.image.src}
            alt={project.title}
            fill
            className="object-cover"
            data-ai-hint={project.image['data-ai-hint']}
          />
        </Link>
        <div className="absolute top-2 right-2">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-black/20 hover:bg-black/40 text-white hover:text-white">
                <MoreVertical size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{t.edit}</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">{t.delete}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-2 relative">
         <div className="flex justify-end -mt-10 mb-2 relative z-10">
            <TooltipProvider>
                <div className="flex -space-x-3">
                    {project.members.map((member, index) => {
                        const initials = member.split(' ').map(n => n[0]).join('');
                        return (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                    <Avatar className="h-14 w-14 border-4 border-card transition-transform transform hover:scale-110 hover:z-20">
                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${member}`} />
                                        <AvatarFallback>{initials}</AvatarFallback>
                                    </Avatar>
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

        <Link href={projectUrl}>
            <CardTitle className="text-lg font-semibold hover:underline cursor-pointer">
              {project.title}
            </CardTitle>
        </Link>
        <CardDescription className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
