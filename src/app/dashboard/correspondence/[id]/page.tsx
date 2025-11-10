
import { fetchProjects, fetchCommunicationById } from '@/lib/data-service';
import { notFound } from 'next/navigation';
import CorrespondenceDetailClient from './correspondence-detail-client';
import translationsData from '@/locales/translations.json';
import type { AppCommunication } from '@/lib/data-service';
import { slugify } from '@/lib/utils';


interface EnrichedCommunication extends AppCommunication {
    projectName: string;
    projectSlug: string;
}

export default async function CorrespondenceDetailPage({ params }: { params: { id: string } }) {
    // Önce sadece ilgili yazışmayı çekiyoruz.
    const comm = await fetchCommunicationById(params.id);
    
    if (!comm) {
        notFound();
    }
    
    // Proje adını ve slug'ını bulmak için tüm projeleri çekiyoruz.
    // Bu, gelecekte tek bir proje çekme endpoint'i ile optimize edilebilir.
    const projects = await fetchProjects();
    const t = translationsData.tr.correspondence_page;
    
    const projectForComm = comm.project_id ? projects.find(p => p.id === comm.project_id?.toString()) : undefined;

    const projectName = projectForComm?.title || comm.project_short_name || 'N/A';
    const projectSlug = projectForComm?.short_name_slug || slugify(comm.project_short_name || '');

    const communication: EnrichedCommunication = {
        ...comm,
        projectName: projectName,
        projectSlug: projectSlug,
    };

    return (
        <div className="container mx-auto p-4 md:p-6">
            <CorrespondenceDetailClient communication={communication} t={t} />
        </div>
    );
}
