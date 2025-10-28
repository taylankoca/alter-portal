import { fetchCommunications, fetchProjects } from '@/lib/data-service';
import CorrespondenceView from '@/components/correspondence-view';
import translationsData from '@/locales/translations.json';
import type { AppCommunication, AppProject } from '@/lib/data-service';

interface EnrichedCommunication extends AppCommunication {
    projectName: string;
    projectSlug: string;
}

export default async function CorrespondencePage() {
    const [communications, projects] = await Promise.all([
        fetchCommunications(),
        fetchProjects()
    ]);

    const t = translationsData.tr.navigation;
    const correspondenceT = translationsData.tr.correspondence_page;

    const projectMap = new Map<string, { name: string, slug: string }>();
    projects.forEach(p => {
        projectMap.set(p.id, { name: p.title, slug: p.short_name_slug });
    });

    const allCommunications: EnrichedCommunication[] = communications.map(comm => {
        const projectInfo = comm.project_id ? projectMap.get(comm.project_id.toString()) : undefined;
        return {
            ...comm,
            projectName: projectInfo?.name || comm.project_short_name || 'N/A',
            projectSlug: projectInfo?.slug || slugify(comm.project_short_name || ''),
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
