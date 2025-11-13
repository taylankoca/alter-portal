
"use client";

import React from "react";
import { useLanguage } from '@/context/language-context';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";

export default function CalendarPage() {
  const { translations } = useLanguage();
  const t = translations.navigation;
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="space-y-6">
      <header>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t.calendar}</h1>
      </header>
       <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-0">
           <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md w-full"
            />
        </CardContent>
      </Card>
    </div>
  );
}
