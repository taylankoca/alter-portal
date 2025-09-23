
"use client";

import { notFound } from 'next/navigation';
import Image from 'next/image';
import { projects } from '@/lib/project-data';
import { slugify } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
    const { translations } = useLanguage();
    const t = translations.projects_page;
    const { slug } = params;

    const project = projects.find(p => slugify(p.title) === slug);

    if (!project) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden">
                <Image
                    src={project.image.src}
                    alt={project.title}
                    fill
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 md:p-8">
                    <h1 className="text-3xl md:text-5xl font-bold text-white shadow-lg">{project.title}</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-0 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                         <h2 className="text-2xl font-semibold text-foreground border-b pb-2">Proje Açıklaması</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            {project.description}
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold text-foreground border-b pb-2">Proje Ekibi</h2>
                        <TooltipProvider>
                            <div className="flex flex-wrap gap-4">
                                {project.members.map((member, index) => {
                                    const initials = member.split(' ').map(n => n[0]).join('');
                                    return (
                                        <Tooltip key={index}>
                                            <TooltipTrigger>
                                                <div className="flex flex-col items-center gap-2">
                                                    <Avatar className="h-20 w-20 border-4 border-card transition-transform transform hover:scale-110">
                                                        <AvatarImage src={`https://i.pravatar.cc/150?u=${member}`} />
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
