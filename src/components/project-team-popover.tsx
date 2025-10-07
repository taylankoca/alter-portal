
"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { AppProjectMember } from '@/lib/data-service';

interface ProjectTeamPopoverProps {
  members: AppProjectMember[];
}

export default function ProjectTeamPopover({ members }: ProjectTeamPopoverProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);

  const filteredMembers = useMemo(() => {
    if (!searchTerm) return members;
    const lowercasedFilter = searchTerm.toLowerCase();
    return members.filter(member => member.name.toLowerCase().includes(lowercasedFilter));
  }, [members, searchTerm]);

  const handleMemberClick = (memberId: number) => {
    router.push(`/dashboard/people/${memberId}`);
    setOpen(false); // Close the popover after navigation
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 font-normal hover:bg-transparent">
            {members.length} Üye
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <div className="flex flex-col gap-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Ekip üyesi ara..."
                    className="pl-9 h-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="max-h-60 overflow-y-auto">
                {filteredMembers.length > 0 ? (
                    filteredMembers.map(member => (
                    <Button
                        key={member.id}
                        variant="ghost"
                        className="w-full justify-start text-sm"
                        onClick={() => handleMemberClick(member.id)}
                    >
                        {member.name}
                    </Button>
                    ))
                ) : (
                    <p className="text-center text-sm text-muted-foreground p-4">Üye bulunamadı.</p>
                )}
            </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
