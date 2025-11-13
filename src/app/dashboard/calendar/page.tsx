
"use client";

import React from "react";
import { useLanguage } from '@/context/language-context';
import { Calendar as SmallCalendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, addMonths, subMonths } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from "lucide-react";

// Örnek veriler (Kasım 2025 için)
const sampleEvents = [
  { date: new Date('2025-11-03T10:00:00'), title: 'Proje Başlangıç Toplantısı', type: 'meeting' },
  { date: new Date('2025-11-05T14:00:00'), title: 'Tasarım Sunumu', type: 'presentation' },
  { date: new Date('2025-11-10T09:00:00'), title: 'Hakediş Raporu Teslimi', type: 'deadline' },
  { date: new Date('2025-11-10T11:00:00'), title: 'İç Değerlendirme', type: 'meeting' },
  { date: new Date('2025-11-17T13:00:00'), title: 'Müşteri Revizyon Toplantısı', type: 'meeting' },
  { date: new Date('2025-11-25T18:00:00'), title: 'Faz 1 Teslimi', type: 'deadline' },
];

type ViewMode = 'month' | 'week' | 'day' | 'list';


export default function CalendarPage() {
  const { translations } = useLanguage();
  const t = translations.navigation;
  
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date('2025-11-10'));
  const [currentMonth, setCurrentMonth] = React.useState(new Date('2025-11-01'));
  const [view, setView] = React.useState<ViewMode>('month');

  const days = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Ayın ilk gününün haftanın hangi gününe denk geldiğini bul (Pazar 0, Pzt 1, ...). getDay() Pazar=0 döndürdüğü için düzeltme yap.
  const startingDayIndex = (getDay(monthStart) + 6) % 7;


  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
        setCurrentMonth(startOfMonth(date));
    }
  }

  const renderMonthView = () => (
    <div className="grid grid-cols-7 border-t border-l">
        {days.map(day => (
            <div key={day} className="text-center font-semibold p-2 border-r border-b bg-muted/30 text-muted-foreground text-sm">
                {day}
            </div>
        ))}
        {Array.from({ length: startingDayIndex }).map((_, index) => (
            <div key={`empty-${index}`} className="border-r border-b"></div>
        ))}
        {daysInMonth.map(day => {
            const dayEvents = sampleEvents.filter(event => isSameDay(event.date, day));
            return (
                <div key={day.toString()} className={`relative p-2 h-32 border-r border-b ${isSameDay(day, selectedDate || new Date()) ? 'bg-primary/10' : ''}`}>
                    <time dateTime={day.toISOString()} className={`absolute top-2 right-2 text-xs ${isSameDay(day, new Date()) ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                        {format(day, 'd')}
                    </time>
                    <div className="space-y-1 mt-6 overflow-y-auto max-h-20">
                        {dayEvents.map(event => (
                             <div key={event.title} className={`text-xs p-1 rounded-md text-white ${event.type === 'deadline' ? 'bg-red-500' : 'bg-blue-500'}`}>
                                {event.title}
                            </div>
                        ))}
                    </div>
                </div>
            )
        })}
    </div>
  );

  // Placeholder for other views
  const renderOtherViews = (viewName: string) => (
      <div className="flex items-center justify-center h-full text-muted-foreground p-16 border rounded-lg">
          {viewName} görünümü yakında eklenecektir.
      </div>
  );
  
   const renderListView = () => (
     <div className="border rounded-lg">
       <ul className="divide-y">
         {sampleEvents.filter(e => e.date.getMonth() === currentMonth.getMonth()).sort((a,b) => a.date.getTime() - b.date.getTime()).map(event => (
           <li key={event.title} className="p-4 flex items-center gap-4">
             <div className="flex flex-col items-center justify-center w-16">
               <span className="font-bold text-lg text-primary">{format(event.date, 'dd')}</span>
               <span className="text-xs text-muted-foreground">{format(event.date, 'EEE', { locale: tr })}</span>
             </div>
             <div className="flex-grow">
               <p className="font-semibold">{event.title}</p>
               <p className="text-sm text-muted-foreground">{format(event.date, 'p', { locale: tr })}</p>
             </div>
             <div className={`w-3 h-3 rounded-full ${event.type === 'deadline' ? 'bg-red-500' : 'bg-blue-500'}`} />
           </li>
         ))}
       </ul>
     </div>
  );


  return (
    <div className="space-y-6">
      <header>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t.calendar}</h1>
      </header>
       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sol Sütun - Küçük Takvim ve Etkinlikler */}
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardContent className="p-0">
                   <SmallCalendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    month={currentMonth}
                    onMonthChange={setCurrentMonth}
                    className="rounded-md w-full"
                    />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Yaklaşan Etkinlikler</CardTitle>
                </CardHeader>
                <CardContent>
                   <p className="text-sm text-muted-foreground">Yakında burada yaklaşan etkinlikleriniz listelenecek.</p>
                </CardContent>
            </Card>
        </div>

        {/* Sağ Sütun - Büyük Takvim Görünümü */}
        <div className="lg:col-span-3">
            <Card>
                <CardHeader className="flex-row items-center justify-between">
                     <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <h2 className="text-lg font-semibold capitalize">
                            {format(currentMonth, 'MMMM yyyy', { locale: tr })}
                        </h2>
                        <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2 rounded-md bg-muted p-1">
                        <Button variant={view === 'month' ? 'default' : 'ghost'} size="sm" onClick={() => setView('month')}>Ay</Button>
                        <Button variant={view === 'week' ? 'default' : 'ghost'} size="sm" onClick={() => setView('week')}>Hafta</Button>
                        <Button variant={view === 'day' ? 'default' : 'ghost'} size="sm" onClick={() => setView('day')}>Gün</Button>
                        <Button variant={view === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setView('list')}>Liste</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {view === 'month' && renderMonthView()}
                    {view === 'week' && renderOtherViews('Hafta')}
                    {view === 'day' && renderOtherViews('Gün')}
                    {view === 'list' && renderListView()}
                </CardContent>
            </Card>
        </div>
       </div>
    </div>
  );
}
