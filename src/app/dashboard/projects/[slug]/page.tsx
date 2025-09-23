
import { notFound } from 'next/navigation';
import { projects } from '@/lib/project-data';
import { slugify } from '@/lib/utils';
import ProjectDetailClient from './project-detail-client';
import translationsData from '@/locales/translations.json';

// This is now a Server Component
export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
    const project = projects.find(p => slugify(p.title) === params.slug);

    if (!project) {
        notFound();
    }

    // Since this is a server component, we can't use the useLanguage hook.
    // We'll pass down the translations for the default language or determine it differently.
    // For now, let's assume 'tr' or 'en' and pass the relevant object.
    const t = translationsData.tr.projects_page;


    return <ProjectDetailClient project={project} t={t} />;
}
