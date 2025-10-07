
"use client";

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { useLanguage } from '@/context/language-context';
import type { AppProject } from '@/lib/data-service';

interface ProjectCardProps {
  project: AppProject;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { translations } = useLanguage();
  const t = translations.projects_page;
  const projectUrl = `/dashboard/projects/${project.short_name_slug}`;

  return (
    <Card className="flex flex-col overflow-hidden group">
       <CardHeader className="p-4 flex-row items-start justify-between">
         <div className="flex-1">
            <Link href={projectUrl}>
                <CardTitle className="text-lg font-semibold hover:underline cursor-pointer line-clamp-2">
                  {project.title}
                </CardTitle>
            </Link>
             <p className="text-sm text-muted-foreground mt-1">
                Alter Proje No: {project.alterProjectNo}
            </p>
        </div>
        <div className="relative -top-2 -right-2">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
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
      <CardContent className="flex-grow p-4 pt-0">
        <CardDescription className="mt-1 text-sm text-muted-foreground line-clamp-3 h-[60px]">
          {project.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
