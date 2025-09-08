
"use client";

import React from "react";
import { useLanguage } from '@/context/language-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Download, Filter } from "lucide-react";
import { format } from "date-fns";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";

const yearlyIncomeData = [
  { year: "2021", income: 450000 },
  { year: "2022", income: 520000 },
  { year: "2023", income: 680000 },
  { year: "2024", income: 750000 },
];

const expenseCategoryData = [
  { name: 'Maaşlar', value: 400 },
  { name: 'Pazarlama', value: 300 },
  { name: 'Ofis Giderleri', value: 300 },
  { name: 'Yazılım', value: 200 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


export default function ReportsPage() {
    const { translations } = useLanguage();
    const t = translations.reports;
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(2024, 0, 1),
        to: new Date(),
    });

    return (
        <div className="container mx-auto p-4 sm:p-8">
            <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-foreground">{t.title}</h1>
                    <p className="text-muted-foreground">{t.description}</p>
                </div>
                <div className="flex items-center gap-2">
                     <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className="w-full sm:w-[280px] justify-start text-left font-normal"
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                            date.to ? (
                                <>
                                {format(date.from, "LLL dd, y")} -{" "}
                                {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                            ) : (
                            <span>{t.pick_date}</span>
                            )}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                        />
                        </PopoverContent>
                    </Popover>
                    <Button>
                        <Filter className="mr-2 h-4 w-4" />
                        {t.filter_button}
                    </Button>
                     <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        {t.download_button}
                    </Button>
                </div>
            </header>

            <div className="grid gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>{t.yearly_income_title}</CardTitle>
                        <CardDescription>{t.yearly_income_desc}</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ChartContainer config={{}} className="min-h-[300px] w-full">
                            <BarChart data={yearlyIncomeData}>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="year" tickLine={false} tickMargin={10} axisLine={false} />
                                <YAxis tickLine={false} axisLine={false} stroke="#888888" fontSize={12} tickFormatter={(value) => `${value/1000}k`} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>{t.expense_distribution_title}</CardTitle>
                        <CardDescription>{t.expense_distribution_desc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{}} className="min-h-[300px] w-full">
                            <PieChart>
                                <Pie data={expenseCategoryData} cx="50%" cy="50%" labelLine={false} outerRadius={120} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                    {expenseCategoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Minimal type for DateRange for simplicity
type DateRange = {
    from: Date;
    to?: Date;
}
