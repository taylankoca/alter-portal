
import { fetchSubmissionById } from '@/lib/data-service';
import { notFound } from 'next/navigation';
import translationsData from '@/locales/translations.json';
import SubmissionDetailClient from './submission-detail-client';

export default async function SubmissionDetailPage({ params }: { params: { id: string } }) {
  const submission = await fetchSubmissionById(params.id);

  if (!submission) {
    notFound();
  }
  
  const t = translationsData.tr.submissions_page;

  return (
     <div className="space-y-6">
       <header>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{submission.form.title}</h1>
          <p className="text-muted-foreground">#{submission.form_number}</p>
        </div>
      </header>
       <SubmissionDetailClient submission={submission} />
    </div>
  );
}
