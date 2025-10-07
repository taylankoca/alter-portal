
"use client";

import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Download } from "lucide-react";
import type { AppCommunication } from "@/lib/data-service";
import Link from "next/link";

interface EnrichedCommunication extends AppCommunication {
    projectName: string;
    projectSlug: string;
}
interface CorrespondenceDetailClientProps {
  communication: EnrichedCommunication;
  t: any; // Using 'any' for simplicity, could be typed more strictly
}

export default function CorrespondenceDetailClient({ communication, t }: CorrespondenceDetailClientProps) {
  const { toast } = useToast();
  
  const handleDownload = () => {
    // This is a placeholder for the actual file download logic
    toast({
        title: t.download_not_available_title,
        description: t.download_not_available_description,
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
        <Card className="overflow-hidden">
            <CardHeader className="p-6">
                <CardTitle className="text-2xl md:text-3xl">{communication.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    <div className="flex items-center gap-3">
                        <span className="font-semibold text-muted-foreground w-24">{t.project}:</span>
                        <Link href={`/dashboard/projects/${communication.projectSlug}`} className="font-medium text-primary hover:underline">
                            {communication.projectName}
                        </Link>
                    </div>
                     <div className="flex items-center gap-3">
                        <span className="font-semibold text-muted-foreground w-24">{t.direction}:</span>
                        <span className="flex items-center gap-2 font-medium">
                             {communication.direction === 'incoming' ? 
                                <span className="inline-flex items-center gap-1.5 text-blue-600">
                                    <ArrowDown size={16}/> Gelen
                                </span> : 
                                <span className="inline-flex items-center gap-1.5 text-green-600">
                                    <ArrowUp size={16}/> Giden
                                </span>
                            }
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-semibold text-muted-foreground w-24">{t.code}:</span>
                        <span className="font-mono text-xs bg-muted px-2 py-1 rounded-md">{communication.code}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="font-semibold text-muted-foreground w-24">{t.institution}:</span>
                        <span>{communication.institution}</span>
                    </div>
                     <div className="flex items-center gap-3">
                        <span className="font-semibold text-muted-foreground w-24">{t.date}:</span>
                        <span>{new Date(communication.communicated_at).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="p-6 bg-muted/30">
                <Button onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    {t.download_file}
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}

