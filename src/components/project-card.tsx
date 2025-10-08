
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
      <div className="relative bg-primary h-[120px] p-4 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <Link href={projectUrl} className="flex-1">
              <CardTitle className="text-lg font-semibold text-primary-foreground hover:underline cursor-pointer line-clamp-2 leading-tight" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
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
         <span className="text-xs text-primary-foreground bg-black/20 px-2 py-1 rounded-full self-start">
            Alter Proje No: {project.alterProjectNo}
        </span>
      </div>
      <CardContent className="flex-grow p-4 pt-4">
        <CardDescription className="text-sm text-muted-foreground line-clamp-2 h-[40px]">
          {project.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
