import { fetchData } from '@/lib/data-service';
import { notFound } from 'next/navigation';
import CorrespondenceDetailClient from './correspondence-detail-client';
import translationsData from '@/locales/translations.json';
import type { AppCommunication, AppProject } from '@/lib/data-service';


interface EnrichedCommunication extends AppCommunication {
    projectName: string;
    projectSlug: string;
}

export default async function CorrespondenceDetailPage({ params }: { params: { id: string } }) {
    const { projects } = await fetchData();
    const t = translationsData.tr.correspondence_page;

    let communication: EnrichedCommunication | undefined;

    for (const project of projects) {
        const foundComm = project.communications.find(c => c.id.toString() === params.id);
        if (foundComm) {
            communication = {
                ...foundComm,
                projectName: project.title,
                projectSlug: project.short_name_slug,
            };
            break;
        }
    }

    if (!communication) {
        notFound();
    }

    return (
        <div className="container mx-auto p-4 md:p-6">
            <CorrespondenceDetailClient communication={communication} t={t} />
        </div>
    );
}
