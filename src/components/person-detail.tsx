
"use client";

import type { ApiUser } from "@/lib/data-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, Building } from "lucide-react";

interface PersonDetailProps {
  user: ApiUser;
}

export default function PersonDetail({ user }: PersonDetailProps) {
  const initials = `${user.first_name[0] || ''}${user.last_name[0] || ''}`.toUpperCase();

  return (
    <div className="max-w-2xl mx-auto">
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-col items-center text-center p-6 bg-muted/30">
                 <Avatar className="h-24 w-24 mb-4 border-4 border-background text-3xl">
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-3xl">{user.first_name} {user.last_name}</CardTitle>
                <CardDescription className="text-lg text-muted-foreground">{user.title || 'Unvan belirtilmemiş'}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-foreground">İletişim Bilgileri</h3>
                <div className="grid gap-4 text-sm">
                   {user.email && (
                     <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <a href={`mailto:${user.email}`} className="text-primary hover:underline">
                            {user.email}
                        </a>
                    </div>
                   )}
                   {user.phone && (
                     <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <span>{user.phone}</span>
                    </div>
                   )}
                   {user.location && (
                     <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-muted-foreground" />
                        <span>{user.location}</span>
                    </div>
                   )}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
