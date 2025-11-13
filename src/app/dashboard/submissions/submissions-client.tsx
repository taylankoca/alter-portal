
"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/language-context";
import { FormSubmissionListItem } from "@/lib/data-service";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface SubmissionsClientProps {
  mySubmissions: FormSubmissionListItem[];
  pendingApprovals: FormSubmissionListItem[];
}

export default function SubmissionsClient({ mySubmissions, pendingApprovals }: SubmissionsClientProps) {
  const { translations } = useLanguage();
  const t = translations.submissions_page;
  const router = useRouter();

  const handleRowClick = (id: number) => {
    router.push(`/dashboard/submissions/${id}`);
  };
  
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

  const renderTable = (submissions: FormSubmissionListItem[], isPendingTable: boolean) => {
    if (submissions.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <p className="mt-2 text-sm text-muted-foreground">
              {isPendingTable ? t.no_pending_approvals : t.no_submissions}
            </p>
        </div>
      );
    }

    return (
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.form_name}</TableHead>
              <TableHead>{t.form_number}</TableHead>
              {isPendingTable && <TableHead>{t.submitted_by}</TableHead>}
              <TableHead>{t.submitted_at}</TableHead>
              <TableHead className="text-right">{t.status}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((sub) => (
              <TableRow key={sub.id} onClick={() => handleRowClick(sub.id)} className="cursor-pointer">
                <TableCell className="font-medium">{sub.form.title}</TableCell>
                <TableCell>{sub.form_number}</TableCell>
                {isPendingTable && (
                  <TableCell>{sub.user ? `${sub.user.first_name} ${sub.user.last_name}` : '-'}</TableCell>
                )}
                <TableCell>{new Date(sub.submitted_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}</TableCell>
                <TableCell className="text-right">
                    <Badge variant={getStatusVariant(sub.status)} className="capitalize">{sub.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Tabs defaultValue="my-submissions" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="my-submissions">{t.my_submissions}</TabsTrigger>
        <TabsTrigger value="pending-approvals">
            {t.pending_approvals}
            {pendingApprovals.length > 0 && <Badge className="ml-2">{pendingApprovals.length}</Badge>}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="my-submissions" className="mt-4">
        {renderTable(mySubmissions, false)}
      </TabsContent>
      <TabsContent value="pending-approvals" className="mt-4">
        {renderTable(pendingApprovals, true)}
      </TabsContent>
    </Tabs>
  );
}
