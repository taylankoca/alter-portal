
'use client';

import type { FormSubmissionDetail } from "@/lib/data-service";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/context/language-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


interface SubmissionDetailClientProps {
  submission: FormSubmissionDetail;
}

export default function SubmissionDetailClient({ submission }: SubmissionDetailClientProps) {
  const { translations } = useLanguage();
  const t = translations.submissions_page;
  const router = useRouter();
  const { toast } = useToast();

  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState<'approve' | 'reject' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
        case 'approved':
        case 'onaylandı':
            return 'default';
        case 'rejected':
        case 'reddedildi':
            return 'destructive';
        case 'pending':
        case 'beklemede':
            return 'secondary';
        default:
            return 'outline';
    }
  }
  
  const handleAction = async (action: 'approve' | 'reject') => {
      setIsLoading(action);
      setError(null);
      
       try {
            const response = await fetch('/api/submissions/action', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ submissionId: submission.id, action, note }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'An unknown error occurred');
            }

            toast({
                title: t.action_success_title,
                description: t.action_success_description,
            });
            router.refresh();

        } catch (err: any) {
            setError(err.message);
            toast({
                variant: 'destructive',
                title: t.action_error_title,
                description: err.message,
            });
        } finally {
            setIsLoading(null);
        }
  }

  const userInitials = `${submission.user.first_name[0] || ''}${submission.user.last_name[0] || ''}`.toUpperCase();

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t.submitted_data}</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {submission.records.map(record => (
                <div key={record.id} className="space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground">{record.field_name}</dt>
                  <dd className="text-sm text-foreground">{record.value || '-'}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
        {submission.can_approve && submission.status.toLowerCase() === 'pending' && (
            <Card>
                <CardHeader>
                    <CardTitle>İşlem Yap</CardTitle>
                </CardHeader>
                <CardContent>
                     <Textarea
                        placeholder={t.rejection_reason}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        />
                </CardContent>
                <CardFooter className="flex justify-end gap-4">
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="destructive" disabled={!!isLoading}>
                            {isLoading === 'reject' ? t.rejecting : t.reject}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Başvuruyu Reddet</AlertDialogTitle>
                            <AlertDialogDescription>
                                Bu başvuruyu reddetmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleAction('reject')} className="bg-destructive hover:bg-destructive/90">
                                Evet, Reddet
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    
                    <Button onClick={() => handleAction('approve')} disabled={!!isLoading}>
                         {isLoading === 'approve' ? t.approving : t.approve}
                    </Button>
                </CardFooter>
            </Card>
        )}
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{t.submission_details}</CardTitle>
             <Badge variant={getStatusVariant(submission.status)} className="capitalize">{submission.status}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 text-sm">
                    <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{`${submission.user.first_name} ${submission.user.last_name}`}</p>
                    <p className="text-xs text-muted-foreground">{submission.user.email}</p>
                </div>
            </div>
             <Separator />
             <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{t.submitted_at}</p>
                <p className="text-sm">{new Date(submission.submitted_at).toLocaleString('tr-TR')}</p>
             </div>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>{t.approval_history}</CardTitle>
            </CardHeader>
            <CardContent>
                {submission.approvals.length > 0 ? (
                    <ul className="space-y-4">
                        {submission.approvals.map(approval => (
                            <li key={approval.id} className="flex items-start gap-4">
                                <Badge variant={getStatusVariant(approval.status)} className="capitalize mt-1">{approval.status}</Badge>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium">
                                        Onaylayan ID: {approval.approver_id}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(approval.approved_at!).toLocaleString('tr-TR')}
                                    </p>
                                    {approval.note && <p className="text-sm italic text-muted-foreground">"{approval.note}"</p>}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">{t.no_approval_history}</p>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
