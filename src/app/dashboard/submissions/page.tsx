
import { fetchSubmissions } from '@/lib/data-service';
import translationsData from '@/locales/translations.json';
import SubmissionsClient from './submissions-client';

export default async function SubmissionsPage() {
  const { mine, pending_approvals } = await fetchSubmissions();
  const t = translationsData.tr.submissions_page;
  const navT = translationsData.tr.navigation;

  // Sort by date, newest first
  mine.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());
  pending_approvals.sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());


  return (
    <div className="space-y-6">
       <header>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{navT.submissions}</h1>
          <p className="text-muted-foreground">{t.description}</p>
        </div>
      </header>
      <SubmissionsClient mySubmissions={mine} pendingApprovals={pending_approvals} />
    </div>
  );
}
