
"use client";

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { AppProjectMember } from '@/lib/data-service';
import { Separator } from './ui/separator';

interface ProjectTeamPopoverProps {
  members: AppProjectMember[];
}

export default function ProjectTeamPopover({ members }: ProjectTeamPopoverProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [open, setOpen] = useState(false);

  const { admins, otherMembers } = useMemo(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    
    const filtered = members.filter(member => 
      member.name.toLowerCase().includes(lowercasedFilter)
    );

    const admins = filtered.filter(member => member.role === 'admin').sort((a,b) => a.name.localeCompare(b.name));
    const otherMembers = filtered.filter(member => member.role !== 'admin').sort((a,b) => a.name.localeCompare(b.name));

    return { admins, otherMembers };
  }, [members, searchTerm]);


  const handleMemberClick = (memberId: number) => {
    router.push(`/dashboard/people/${memberId}`);
    setOpen(false); // Close the popover after navigation
  };

  const renderMemberButton = (member: AppProjectMember) => (
    <Button
      key={member.id}
      variant="ghost"
      className="w-full justify-start text-sm h-9"
      onClick={() => handleMemberClick(member.id)}
    >
      {member.role === 'admin' && <Shield className="h-4 w-4 mr-2 text-primary" />}
      <span className={member.role === 'admin' ? 'font-semibold' : ''}>{member.name}</span>
    </Button>
  );

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
            <div className="max-h-60 overflow-y-auto space-y-1">
                {admins.length === 0 && otherMembers.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground p-4">Üye bulunamadı.</p>
                ) : (
                  <>
                    {admins.map(renderMemberButton)}
                    {admins.length > 0 && otherMembers.length > 0 && <Separator className="my-2" />}
                    {otherMembers.map(renderMemberButton)}
                  </>
                )}
            </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
