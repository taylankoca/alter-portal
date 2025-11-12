

import { notFound } from 'next/navigation';
import ProjectDetailClient from './project-detail-client';
import translationsData from '@/locales/translations.json';
import { fetchProjects, fetchCommunications } from '@/lib/data-service';

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
    // Projeleri ve tüm yazışmaları paralel olarak çek
    const [projects, allCommunications] = await Promise.all([
        fetchProjects(),
        fetchCommunications()
    ]);

    const project = projects.find(p => p.short_name_slug === params.slug || p.slug === params.slug);

    if (!project) {
        notFound();
    }

    // İlgili projenin yazışmalarını filtrele
    const projectCommunications = allCommunications.filter(
        comm => comm.project_id?.toString() === project.id
    );

    // Proje nesnesine filtrelenmiş yazışmaları ekle
    const projectWithComms = {
        ...project,
        communications: projectCommunications,
    };

    // Çeviri verilerini al
    const t = translationsData.tr.projects_page;

    return <ProjectDetailClient project={projectWithComms} t={t} />;
}
