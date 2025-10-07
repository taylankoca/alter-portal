
"use client";

import * as React from 'react';
import type { ApiUser } from '@/lib/data-service';
import { useLanguage } from '@/context/language-context';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from './ui/separator';

interface PeopleDirectoryProps {
  users: ApiUser[];
}

export default function PeopleDirectory({ users }: PeopleDirectoryProps) {
  const { translations } = useLanguage();
  const t = translations.people_page;

  const groupedUsers = users.reduce((acc, user) => {
    const firstLetter = user.last_name[0]?.toUpperCase() || '#';
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(user);
    return acc;
  }, {} as Record<string, ApiUser[]>);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

  const handleLetterClick = (letter: string) => {
    const element = document.getElementById(`letter-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
        <div className="flex justify-center gap-1 md:gap-2 mb-6 flex-wrap">
            {alphabet.map(letter => (
                <button
                    key={letter}
                    onClick={() => handleLetterClick(letter)}
                    className="h-8 w-8 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                    {letter}
                </button>
            ))}
        </div>
        <div className="space-y-8">
            {Object.keys(groupedUsers).sort().map(letter => (
                <div key={letter} id={`letter-${letter}`}>
                    <h2 className="text-2xl font-bold text-primary mb-4 pb-2 border-b">{letter}</h2>
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
                                {groupedUsers[letter].map(user => (
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
                </div>
            ))}
        </div>
    </div>
  );
}
