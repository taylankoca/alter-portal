
"use client";

import { useLanguage } from '@/context/language-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function SettingsPage() {
    const { translations } = useLanguage();
    const t = translations.settings;

    return (
        <div className="container mx-auto p-4 sm:p-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-foreground">{t.title}</h1>
                <p className="text-muted-foreground">{t.description}</p>
            </header>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile">{t.profile_tab}</TabsTrigger>
                    <TabsTrigger value="company">{t.company_tab}</TabsTrigger>
                    <TabsTrigger value="preferences">{t.preferences_tab}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.profile_title}</CardTitle>
                            <CardDescription>{t.profile_desc}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                                    <AvatarFallback>KA</AvatarFallback>
                                </Avatar>
                                <Button variant="outline">{t.change_avatar_button}</Button>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username">{t.username_label}</Label>
                                <Input id="username" defaultValue="Kullanıcı Adı" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">{t.email_label}</Label>
                                <Input id="email" type="email" defaultValue="kullanici@alterfinans.com" />
                            </div>
                             <Button>{t.save_button}</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="company">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.company_title}</CardTitle>
                            <CardDescription>{t.company_desc}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="companyName">{t.company_name_label}</Label>
                                <Input id="companyName" defaultValue="Alter Finans A.Ş." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="taxId">{t.tax_id_label}</Label>
                                <Input id="taxId" defaultValue="1234567890" />
                            </div>
                             <Button>{t.save_button}</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                <TabsContent value="preferences">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t.preferences_title}</CardTitle>
                            <CardDescription>{t.preferences_desc}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>{t.currency_label}</Label>
                                 <Select defaultValue="try">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a currency" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="try">Türk Lirası (TRY)</SelectItem>
                                        <SelectItem value="usd">US Dollar (USD)</SelectItem>
                                        <SelectItem value="eur">Euro (EUR)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="flex items-center justify-between rounded-lg border p-4">
                                <div>
                                    <h3 className="text-base font-medium">{t.notifications_label}</h3>
                                    <p className="text-sm text-muted-foreground">{t.notifications_desc}</p>
                                </div>
                                <Switch defaultChecked={true} />
                            </div>
                             <Button>{t.save_button}</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
