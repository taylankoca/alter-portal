import { fetchProjects } from '@/lib/data-service';
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
    const projects = await fetchProjects();
    const t = translationsData.tr.correspondence_page;

    let comm: AppCommunication | undefined;
    let projectForComm: AppProject | undefined;

    for (const p of projects) {
        const foundComm = p.communications.find(c => c.id.toString() === params.id);
        if (foundComm) {
            comm = foundComm;
            projectForComm = p;
            break;
        }
    }
    
    if (!comm) {
        notFound();
    }
    
    const projectName = projectForComm?.title || comm.project_short_name || 'N/A';
    const projectSlug = projectForComm?.short_name_slug || slugify(comm.project_short_name || '');

    const communication: EnrichedCommunication = {
        ...comm,
        projectName: projectName,
        projectSlug: projectSlug,
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
