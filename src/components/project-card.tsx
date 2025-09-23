
"use client";

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { useLanguage } from '@/context/language-context';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Project {
  id: string;
  title: string;
  description: string;
  owner: string;
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
  const ownerInitials = project.owner.split(' ').map(n => n[0]).join('');

  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="p-0 relative h-36">
        <Image
          src={project.image.src}
          alt={project.title}
          fill
          className="object-cover"
          data-ai-hint={project.image['data-ai-hint']}
        />
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
      <CardContent className="flex-grow p-4 pt-8 relative">
        <Avatar className="absolute -top-6 left-1/2 -translate-x-1/2 h-12 w-12 border-4 border-card">
            <AvatarImage src={`https://i.pravatar.cc/150?u=${project.owner}`} />
            <AvatarFallback>{ownerInitials}</AvatarFallback>
        </Avatar>

        <CardTitle className="text-lg font-semibold hover:underline cursor-pointer text-center">
          {project.title}
        </CardTitle>
        <CardDescription className="mt-1 text-sm text-muted-foreground line-clamp-2 text-center">
          {project.description}
        </CardDescription>
         <div className="text-center mt-3">
            <p className="text-xs text-muted-foreground">{t.created_by} {project.owner}</p>
        </div>
      </CardContent>
    </Card>
  );
}
