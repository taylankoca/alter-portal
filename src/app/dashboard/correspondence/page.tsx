import { fetchData } from '@/lib/data-service';
import CorrespondenceView from '@/components/correspondence-view';
import translationsData from '@/locales/translations.json';
import type { AppCommunication, AppProject } from '@/lib/data-service';

interface EnrichedCommunication extends AppCommunication {
    projectName: string;
    projectSlug: string;
}

export default async function CorrespondencePage() {
    const { projects } = await fetchData();
    const t = translationsData.tr.navigation;
    const correspondenceT = translationsData.tr.correspondence_page;

    const allCommunications: EnrichedCommunication[] = projects.reduce((acc: EnrichedCommunication[], project: AppProject) => {
        const enrichedComms = project.communications.map(comm => ({
            ...comm,
            projectName: project.title,
            projectSlug: project.short_name_slug,
        }));
        return [...acc, ...enrichedComms];
    }, []);

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
