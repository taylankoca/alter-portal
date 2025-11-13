
import { fetchProjects } from '@/lib/data-service';
import translationsData from '@/locales/translations.json';
import CalendarClient from './calendar-client';

export default async function CalendarPage() {
    const projects = await fetchProjects();
    const t_nav = translationsData.tr.navigation;
    const t_cal = translationsData.tr.calendar_page;

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t_nav.calendar}</h1>
                <p className="text-muted-foreground">{t_cal.description}</p>
            </header>
            <CalendarClient projects={projects} />
        </div>
    );
}
