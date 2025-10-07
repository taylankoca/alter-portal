import { notFound } from 'next/navigation';
import { slugify } from '@/lib/utils';
import ProjectDetailClient from './project-detail-client';
import translationsData from '@/locales/translations.json';
import { fetchData } from '@/lib/data-service';

// This is now a Server Component
export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
    const { projects } = await fetchData();
    const project = projects.find(p => slugify(p.title) === params.slug);

    if (!project) {
        notFound();
    }

    // Since this is a server component, we can't use the useLanguage hook.
    // We'll pass down the translations for the default language or determine it differently.
    // For now, let's assume 'tr' and pass the relevant object.
    const t = translationsData.tr.projects_page;

    return <ProjectDetailClient project={project} t={t} />;
}
