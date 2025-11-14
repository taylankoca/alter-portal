
"use client";

import React from "react";
import { useLanguage } from '@/context/language-context';
import type { AppProject } from "@/lib/data-service";
import { Calendar as SmallCalendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, eachHourOfInterval, setHours, isSameHour, startOfDay, endOfDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from "lucide-react";

// Örnek veriler (Kasım 2025 için, proje ID'leri ile)
const sampleEvents = [
  { date: new Date('2025-11-03T10:00:00'), title: 'Proje Başlangıç Toplantısı', type: 'meeting', projectId: '1' },
  { date: new Date('2025-11-05T14:00:00'), title: 'Tasarım Sunumu', type: 'presentation', projectId: '2' },
  { date: new Date('2025-11-10T09:00:00'), title: 'Hakediş Raporu Teslimi', type: 'deadline', projectId: '1' },
  { date: new Date('2025-11-10T11:00:00'), title: 'İç Değerlendirme', type: 'meeting', projectId: '3' },
  { date: new Date('2025-11-12T15:00:00'), title: 'Statik Analiz Raporu', type: 'deadline', projectId: '2' },
  { date: new Date('2025-11-17T13:00:00'), title: 'Müşteri Revizyon Toplantısı', type: 'meeting', projectId: '1' },
  { date: new Date('2025-11-25T18:00:00'), title: 'Faz 1 Teslimi', type: 'deadline', projectId: '3' },
];

type ViewMode = 'month' | 'week' | 'day' | 'list';

interface CalendarClientProps {
    projects: AppProject[];
}

export default function CalendarClient({ projects }: CalendarClientProps) {
  const { translations } = useLanguage();
  const t_cal = translations.calendar_page;
  
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date('2025-11-10'));
  const [currentDate, setCurrentDate] = React.useState(new Date('2025-11-01'));
  const [view, setView] = React.useState<ViewMode>('month');
  const [selectedProject, setSelectedProject] = React.useState('all');

  const filteredEvents = React.useMemo(() => {
    if (selectedProject === 'all') {
      return sampleEvents;
    }
    return sampleEvents.filter(event => event.projectId === selectedProject);
  }, [selectedProject]);


  const daysOfWeek = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
        setCurrentDate(startOfMonth(date));
    }
  }

  const goToPrevious = () => {
    if (view === 'month') setCurrentDate(subMonths(currentDate, 1));
    if (view === 'week') setCurrentDate(subMonths(currentDate, 1)); // TODO: change to subWeeks
    if (view === 'day') setCurrentDate(subMonths(currentDate, 1)); // TODO: change to subDays
  };

  const goToNext = () => {
    if (view === 'month') setCurrentDate(addMonths(currentDate, 1));
    if (view === 'week') setCurrentDate(addMonths(currentDate, 1)); // TODO: change to addWeeks
    if (view === 'day') setCurrentDate(addMonths(currentDate, 1)); // TODO: change to addDays
  };
  
  const getEventColor = (type: string) => {
    switch(type) {
        case 'deadline': return 'bg-red-500';
        case 'meeting': return 'bg-blue-500';
        case 'presentation': return 'bg-purple-500';
        default: return 'bg-gray-500';
    }
  }

  // AY GÖRÜNÜMÜ
  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startingDayIndex = (getDay(monthStart) + 6) % 7;

    return (
        <div className="grid grid-cols-7 border-t border-l">
            {daysOfWeek.map(day => (
                <div key={day} className="text-center font-semibold p-2 border-r border-b bg-muted/30 text-muted-foreground text-sm">
                    {day}
                </div>
            ))}
            {Array.from({ length: startingDayIndex }).map((_, index) => (
                <div key={`empty-month-${index}`} className="border-r border-b"></div>
            ))}
            {daysInMonth.map(day => {
                const dayEvents = filteredEvents.filter(event => isSameDay(event.date, day));
                return (
                    <div key={day.toString()} className={`relative p-2 h-32 border-r border-b ${isSameDay(day, selectedDate || new Date()) ? 'bg-primary/10' : ''}`}>
                        <time dateTime={day.toISOString()} className={`absolute top-2 right-2 text-xs ${isSameDay(day, new Date()) ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                            {format(day, 'd')}
                        </time>
                        <div className="space-y-1 mt-6 overflow-y-auto max-h-20">
                            {dayEvents.map((event, index) => (
                                <div key={`${event.title}-${index}`} className={`text-xs p-1 rounded-md text-white ${getEventColor(event.type)}`}>
                                    {event.title}
                                </div>
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
      );
  }

  // HAFTA GÖRÜNÜMÜ
  const renderWeekView = () => {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
      const hours = eachHourOfInterval({ start: setHours(new Date(), 8), end: setHours(new Date(), 17) });

      return (
          <div className="flex border-t">
              <div className="w-16 border-r"> {/* Saat sütunu */}
                <div className="h-10 border-b"></div>
                {hours.map(hour => (
                  <div key={hour.getHours()} className="h-12 border-b text-center text-xs text-muted-foreground pt-1">{format(hour, 'HH:mm')}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 flex-1">
                  {daysInWeek.map(day => (
                      <div key={day.toString()} className="border-r relative">
                          {hours.map(hour => {
                              const dayEvents = filteredEvents.filter(event => isSameDay(event.date, day) && isSameHour(event.date, hour));
                              return (
                                  <div key={hour.toISOString()} className="h-12 border-b p-1">
                                      {dayEvents.map((event, index) => (
                                           <div key={`${event.title}-${index}`} className={`text-xs p-1 rounded-md text-white ${getEventColor(event.type)}`}>
                                                {event.title}
                                            </div>
                                      ))}
                                  </div>
                              )
                          })}
                      </div>
                  ))}
              </div>
          </div>
      );
  }

  // GÜN GÖRÜNÜMÜ
  const renderDayView = () => {
    const dayStart = startOfDay(selectedDate || new Date());
    const dayEnd = endOfDay(selectedDate || new Date());
    const hours = eachHourOfInterval({ start: setHours(dayStart, 8), end: setHours(dayStart, 17) });
    
    return (
        <div className="border-t">
             {hours.map(hour => {
                const hourEvents = filteredEvents.filter(event => isSameDay(event.date, dayStart) && isSameHour(event.date, hour));
                return (
                    <div key={hour.toISOString()} className="flex items-start h-20 border-b">
                        <div className="w-24 text-center text-sm text-muted-foreground p-2 border-r">
                           {format(hour, 'HH:mm')} - {format(addMonths(hour, 1), 'HH:mm')}
                        </div>
                        <div className="flex-1 p-2 space-y-1">
                            {hourEvents.map((event, index) => (
                                <div key={`${event.title}-${index}`} className={`flex items-center p-2 rounded-lg text-white ${getEventColor(event.type)}`}>
                                    <div>
                                        <p className="font-semibold">{event.title}</p>
                                        <p className="text-xs opacity-80">{format(event.date, 'p', { locale: tr })}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
             })}
        </div>
    );
  }

  // LİSTE GÖRÜNÜMÜ
  const renderListView = () => (
     <div className="border rounded-lg">
       <ul className="divide-y">
         {filteredEvents.filter(e => e.date.getMonth() === currentDate.getMonth()).sort((a,b) => a.date.getTime() - b.date.getTime()).map((event, index) => (
           <li key={`${event.title}-${index}`} className="p-4 flex items-center gap-4">
             <div className="flex flex-col items-center justify-center w-16">
               <span className="font-bold text-lg text-primary">{format(event.date, 'dd')}</span>
               <span className="text-xs text-muted-foreground">{format(event.date, 'EEE', { locale: tr })}</span>
             </div>
             <div className="flex-grow">
               <p className="font-semibold">{event.title}</p>
               <p className="text-sm text-muted-foreground">{format(event.date, 'p', { locale: tr })}</p>
             </div>
             <div className={`w-3 h-3 rounded-full ${getEventColor(event.type)}`} />
           </li>
         ))}
       </ul>
     </div>
  );
  
  const renderCurrentView = () => {
    switch (view) {
        case 'month': return renderMonthView();
        case 'week': return renderWeekView();
        case 'day': return renderDayView();
        case 'list': return renderListView();
        default: return renderMonthView();
    }
  }


  return (
       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sol Sütun - Küçük Takvim ve Kontroller */}
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t_cal.project_filter}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Select value={selectedProject} onValueChange={setSelectedProject}>
                        <SelectTrigger>
                            <SelectValue placeholder={t_cal.select_project} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">{t_cal.general_calendar}</SelectItem>
                            {projects.map(project => (
                                <SelectItem key={project.id} value={project.id}>
                                    {project.title} ({project.alterProjectNo})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-0">
                   <SmallCalendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        month={currentDate}
                        onMonthChange={setCurrentDate}
                        className="rounded-md w-full"
                    />
                </CardContent>
            </Card>
        </div>

        {/* Sağ Sütun - Büyük Takvim Görünümü */}
        <div className="lg:col-span-3">
            <Card>
                <CardHeader className="flex-row items-center justify-between">
                     <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={goToPrevious}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <h2 className="text-lg font-semibold capitalize">
                            {format(currentDate, 'MMMM yyyy', { locale: tr })}
                        </h2>
                        <Button variant="outline" size="icon" onClick={goToNext}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2 rounded-md bg-muted p-1">
                        <Button variant={view === 'month' ? 'default' : 'ghost'} size="sm" onClick={() => setView('month')}>{t_cal.view_month}</Button>
                        <Button variant={view === 'week' ? 'default' : 'ghost'} size="sm" onClick={() => setView('week')}>{t_cal.view_week}</Button>
                        <Button variant={view === 'day' ? 'default' : 'ghost'} size="sm" onClick={() => setView('day')}>{t_cal.view_day}</Button>
                        <Button variant={view === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setView('list')}>{t_cal.view_list}</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {renderCurrentView()}
                </CardContent>
            </Card>
        </div>
       </div>
  );
}
