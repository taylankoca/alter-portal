
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ApiUser } from '@/lib/data-service';
import { useLanguage } from '@/context/language-context';

interface PeopleListViewProps {
  users: ApiUser[];
}

export default function PeopleListView({ users }: PeopleListViewProps) {
  const { translations } = useLanguage();
  const t = translations.people_page;

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t.first_name}</TableHead>
            <TableHead>{t.last_name}</TableHead>
            <TableHead>{t.email}</TableHead>
            <TableHead>{t.title_label}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.first_name}</TableCell>
              <TableCell>{user.last_name}</TableCell>
              <TableCell>{user.email || '-'}</TableCell>
              <TableCell>{user.title || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
