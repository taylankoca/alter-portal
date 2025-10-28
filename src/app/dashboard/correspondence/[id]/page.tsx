import { fetchCommunications, fetchProjects } from '@/lib/data-service';
import { notFound } from 'next/navigation';
import CorrespondenceDetailClient from './correspondence-detail-client';
import translationsData from '@/locales/translations.json';
import type { AppCommunication, AppProject } from '@/lib/data-service';
import { slugify } from '@/lib/utils';


interface EnrichedCommunication extends AppCommunication {
    projectName: string;
    projectSlug: string;
}

export default async function CorrespondenceDetailPage({ params }: { params: { id: string } }) {
    const [communications, projects] = await Promise.all([
        fetchCommunications(),
        fetchProjects()
    ]);
    const t = translationsData.tr.correspondence_page;

    const comm = communications.find(c => c.id.toString() === params.id);
    
    if (!comm) {
        notFound();
    }
    
    const project = comm.project_id ? projects.find(p => p.id === comm.project_id?.toString()) : undefined;

    const communication: EnrichedCommunication = {
        ...comm,
        projectName: project?.title || comm.project_short_name || 'N/A',
        projectSlug: project?.short_name_slug || slugify(comm.project_short_name || ''),
    };


    if (!communication) {
        notFound();
    }

    return (
        <div className="container mx-auto p-4 md:p-6">
            <CorrespondenceDetailClient communication={communication} t={t} />
        </div>
    );
}
