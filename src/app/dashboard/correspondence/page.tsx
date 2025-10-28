
import { fetchProjects, fetchCommunications } from '@/lib/data-service';
import CorrespondenceView from '@/components/correspondence-view';
import translationsData from '@/locales/translations.json';
import type { AppCommunication, AppProject } from '@/lib/data-service';
import { slugify } from '@/lib/utils';

interface EnrichedCommunication extends AppCommunication {
    projectName: string;
    projectSlug: string;
}

export default async function CorrespondencePage() {
    const projects = await fetchProjects();
    const communications = await fetchCommunications();

    const t = translationsData.tr.navigation;
    const correspondenceT = translationsData.tr.correspondence_page;

    const projectMap = new Map(projects.map(p => [p.id, p]));

    const allCommunications: EnrichedCommunication[] = communications.map(comm => {
        const project = comm.project_id ? projectMap.get(comm.project_id.toString()) : undefined;
        const projectName = project?.title || comm.project_short_name || 'N/A';
        const projectSlug = project?.short_name_slug || slugify(comm.project_short_name || '');
        
        return {
            ...comm,
            projectName,
            projectSlug,
        };
    });

    // Sort all communications by date, most recent first
    allCommunications.sort((a, b) => new Date(b.communicated_at).getTime() - new Date(a.communicated_at).getTime());

    return (
        <div className="space-y-6">
            <header>
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t.correspondence}</h1>
                    <p className="text-muted-foreground">{correspondenceT.description}</p>
                </div>
            </header>
            <CorrespondenceView communications={allCommunications} />
        </div>
    );
}
