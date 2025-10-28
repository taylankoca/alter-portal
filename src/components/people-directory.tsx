
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
import { useRouter } from 'next/navigation';
import { Input } from './ui/input';
import { Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface PeopleDirectoryProps {
  users: ApiUser[];
}

export default function PeopleDirectory({ users }: PeopleDirectoryProps) {
  const { translations } = useLanguage();
  const router = useRouter();
  const t = translations.people_page;
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredUsers = React.useMemo(() => {
    if (!searchTerm) return users;
    const lowercasedFilter = searchTerm.toLowerCase();
    return users.filter(user => {
      return (
        user.first_name.toLowerCase().includes(lowercasedFilter) ||
        user.last_name.toLowerCase().includes(lowercasedFilter) ||
        (user.email && user.email.toLowerCase().includes(lowercasedFilter)) ||
        (user.title && user.title.toLowerCase().includes(lowercasedFilter)) ||
        (user.location && user.location.toLowerCase().includes(lowercasedFilter)) ||
        (user.phone && user.phone.toLowerCase().includes(lowercasedFilter))
      );
    });
  }, [searchTerm, users]);

  const groupedUsers = filteredUsers.reduce((acc, user) => {
    const firstLetter = user.last_name[0]?.toLocaleUpperCase('tr') || '#';
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(user);
    return acc;
  }, {} as Record<string, ApiUser[]>);

  const alphabet = "ABCÇDEFGHIİJKLMNOÖPRSŞTUÜVYZ".split('');

  const handleLetterClick = (letter: string) => {
    const element = document.getElementById(`letter-header-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleRowClick = (userId: number) => {
    router.push(`/dashboard/people/${userId}`);
  };

  return (
    <div className="space-y-6">
        <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
                placeholder={t.search_placeholder}
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
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
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[120px]">Üye</TableHead>
                        <TableHead className="bg-primary text-primary-foreground">{t.first_name}</TableHead>
                        <TableHead className="bg-primary text-primary-foreground">{t.last_name}</TableHead>
                        <TableHead>{t.email}</TableHead>
                        <TableHead>{t.title_label}</TableHead>
                        <TableHead>{t.location_label}</TableHead>
                        <TableHead>Telefon</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Object.keys(groupedUsers).sort((a, b) => a.localeCompare(b, 'tr')).map(letter => (
                        <React.Fragment key={letter}>
                            <TableRow id={`letter-header-${letter}`} className="hover:bg-transparent">
                                <TableCell colSpan={7} className="p-0">
                                    <div className="bg-muted/50 px-4 py-2">
                                      <h2 className="text-xl font-bold text-primary">{letter}</h2>
                                    </div>
                                </TableCell>
                            </TableRow>
                            {groupedUsers[letter].map(user => {
                              const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
                              return (
                                <TableRow 
                                    key={user.id} 
                                    onClick={() => handleRowClick(user.id)}
                                    className="cursor-pointer"
                                >
                                    <TableCell>
                                      <Avatar className="h-9 w-9 text-xs">
                                          {/* <AvatarImage src={...} /> */}
                                          <AvatarFallback>{initials}</AvatarFallback>
                                      </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium bg-primary/10">{user.first_name}</TableCell>
                                    <TableCell className="bg-primary/10">{user.last_name}</TableCell>
                                    <TableCell>{user.email || '-'}</TableCell>
                                    <TableCell>{user.title || '-'}</TableCell>
                                    <TableCell>{user.location || '-'}</TableCell>
                                    <TableCell>{user.phone || '-'}</TableCell>
                                </TableRow>
                              )
                            })}
                        </React.Fragment>
                    ))}
                </TableBody>
            </Table>
        </div>
    </div>
  );
}
