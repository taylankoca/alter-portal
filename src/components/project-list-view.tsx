
"use client";

import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AppProject } from '@/lib/data-service';
import { useLanguage } from '@/context/language-context';
import { slugify } from '@/lib/utils';
import ProjectTeamPopover from './project-team-popover';

interface ProjectListViewProps {
  projects: AppProject[];
}

export default function ProjectListView({ projects }: ProjectListViewProps) {
  const { translations } = useLanguage();
  const t = translations.projects_page;

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Proje Adı</TableHead>
            <TableHead>Alter Proje No</TableHead>
            <TableHead>İşveren</TableHead>
            <TableHead>Konum</TableHead>
            <TableHead>Ekip</TableHead>
            <TableHead className="text-right">Aksiyonlar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>
                 <Link href={`/dashboard/projects/${slugify(project.title)}`}>
                    <div className="font-medium hover:underline cursor-pointer">{project.title}</div>
                    <div className="text-sm text-muted-foreground line-clamp-1">{project.description}</div>
                </Link>
              </TableCell>
              <TableCell>{project.alterProjectNo}</TableCell>
              <TableCell>{project.employer}</TableCell>
              <TableCell>{project.location}</TableCell>
              <TableCell>
                <ProjectTeamPopover members={project.members} />
              </TableCell>
              <TableCell className="text-right">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
