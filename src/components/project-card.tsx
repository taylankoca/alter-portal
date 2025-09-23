
"use client";

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { useLanguage } from '@/context/language-context';

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
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-lg font-semibold hover:underline cursor-pointer">
          {project.title}
        </CardTitle>
        <CardDescription className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <p className="text-xs text-muted-foreground">{t.created_by} {project.owner}</p>
      </CardFooter>
    </Card>
  );
}
