"use client";

import { useLanguage } from '@/context/language-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, ArrowUpRight, ArrowDownLeft, FileText, PlusCircle } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Button } from '@/components/ui/button';

const chartData = [
  { month: "Ocak", income: 1860, expense: 800 },
  { month: "Şubat", income: 3050, expense: 1398 },
  { month: "Mart", income: 2370, expense: 980 },
  { month: "Nisan", income: 730, expense: 398 },
  { month: "Mayıs", income: 2090, expense: 480 },
  { month: "Haziran", income: 2149, expense: 1180 },
];

const transactions = [
    { id: 1, date: "2024-07-28", description: "Yazılım Lisans Ücreti", category: "Yazılım", amount: -250.00 },
    { id: 2, date: "2024-07-27", description: "Proje A Ödemesi", category: "Müşteri Ödemesi", amount: 5000.00 },
    { id: 3, date: "2024-07-26", description: "Ofis Malzemeleri", category: "Ofis Giderleri", amount: -150.75 },
    { id: 4, date: "2024-07-25", description: "Proje B Avans", category: "Müşteri Ödemesi", amount: 2500.00 },
    { id: 5, date: "2024-07-24", description: "Sunucu Kiralama", category: "IT Giderleri", amount: -75.00 },
];

const formatCurrency = (amount: number, currency = "TRY") => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: currency }).format(amount);
}

export default function FinancialDashboard() {
  const { translations } = useLanguage();
  const t = translations.dashboard;

  const totalIncome = 12289;
  const totalExpense = 4236.75;
  const balance = totalIncome - totalExpense;

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-4xl font-bold text-foreground">{t.title}</h1>
            <p className="text-muted-foreground">{t.description}</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                {t.reports_button}
            </Button>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                {t.add_transaction_button}
            </Button>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.total_income}</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
            <p className="text-xs text-muted-foreground">{t.last_30_days}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.total_expense}</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpense)}</div>
             <p className="text-xs text-muted-foreground">{t.last_30_days}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t.balance}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
            <p className="text-xs text-muted-foreground">{t.current_balance}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{t.income_expense_chart_title}</CardTitle>
            <CardDescription>{t.income_expense_chart_desc}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
             <ChartContainer config={{}} className="min-h-[350px] w-full">
                 <BarChart data={chartData} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                    <YAxis tickLine={false} axisLine={false} stroke="#888888" fontSize={12} tickFormatter={(value) => `${value/1000}k`}/>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>{t.recent_transactions_title}</CardTitle>
                <CardDescription>{t.recent_transactions_desc}</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t.table_header_description}</TableHead>
                            <TableHead className="text-right">{t.table_header_amount}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell>
                                <div className="font-medium">{transaction.description}</div>
                                <div className="text-sm text-muted-foreground">{transaction.date}</div>
                            </TableCell>
                            <TableCell className={`text-right font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(transaction.amount)}
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
