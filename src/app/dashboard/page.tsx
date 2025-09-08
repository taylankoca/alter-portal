
"use client";

import { useLanguage } from '@/context/language-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Bell, Calendar, CheckCircle, Clock, Gift, Users } from 'lucide-react';

export default function PortalDashboard() {
  const { translations } = useLanguage();
  const t = translations.dashboard;

  const summaryCards = [
    { title: t.today_events, value: "3", icon: Calendar, color: "text-blue-500" },
    { title: t.overdue_tasks, value: "5", icon: Clock, color: "text-red-500" },
    { title: t.birthdays, value: "2", icon: Gift, color: "text-pink-500" },
    { title: "Onay Bekleyenler", value: "4", icon: Bell, color: "text-yellow-500" },
  ];

  const upcomingTasks = [
      { id: 1, title: "Proje A sunumunu hazırla", dueDate: "2024-09-10", priority: "High" },
      { id: 2, title: "Müşteri geri bildirimlerini topla", dueDate: "2024-09-12", priority: "Medium" },
      { id: 3, title: "Q3 raporunu tamamla", dueDate: "2024-09-15", priority_desc: "Yüksek", priority: "High" },
  ];

  const pendingApprovals = [
      { id: 1, type: "İzin Formu", applicant: "Ahmet Yılmaz", date: "2024-09-08" },
      { id: 2, type: "Masraf Formu", applicant: "Ayşe Kaya", date: "2024-09-07" },
  ]

  const recentActivities = [
    { id: 1, user: "Zeynep Öztürk", action: "yeni bir görev oluşturdu:", target: "UI/UX Revizyonu", time: "2 saat önce" },
    { id: 2, user: "Mehmet Demir", action: "projeye bir yorum ekledi:", target: "Mobil Uygulama Geliştirme", time: "5 saat önce" },
  ]


  return (
    <div className="space-y-6">
      <header className="flex justify-between items-start">
        <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t.title}</h1>
            <p className="text-muted-foreground">{t.description}</p>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card, index) => (
             <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                    <card.icon className={`h-5 w-5 ${card.color}`} />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{card.value}</div>
                </CardContent>
            </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>{t.upcoming_tasks_title}</CardTitle>
                        <CardDescription>{t.upcoming_tasks_desc}</CardDescription>
                    </div>
                     <Button variant="ghost" size="sm">
                        {t.view_all} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {upcomingTasks.map(task => (
                            <li key={task.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                                <div className='flex items-center gap-3'>
                                    <CheckCircle className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium text-foreground">{task.title}</p>
                                        <p className="text-sm text-muted-foreground">Son Tarih: {task.dueDate}</p>
                                    </div>
                                </div>
                                <Badge variant={task.priority === 'High' ? 'destructive' : 'secondary'}>{task.priority}</Badge>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                     <div>
                        <CardTitle>{t.pending_approvals_title}</CardTitle>
                        <CardDescription>{t.pending_approvals_desc}</CardDescription>
                    </div>
                     <Button variant="ghost" size="sm">
                        {t.view_all} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {pendingApprovals.map(approval => (
                            <li key={approval.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                                <div>
                                    <p className="font-medium text-foreground">{approval.type}</p>
                                    <p className="text-sm text-muted-foreground">Başvuran: {approval.applicant}</p>
                                </div>
                                <Button variant="outline" size="sm">İncele</Button>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>{t.recent_activity_title}</CardTitle>
                    <CardDescription>{t.recent_activity_desc}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                       {recentActivities.map(activity => (
                             <li key={activity.id} className="flex items-start gap-3">
                                <Avatar className="h-9 w-9">
                                     <AvatarImage src={`https://i.pravatar.cc/150?u=${activity.user}`} />
                                    <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm">
                                        <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium text-primary">{activity.target}</span>
                                    </p>
                                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                                </div>
                            </li>
                       ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
