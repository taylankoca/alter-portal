"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/language-context";

const applicants = [
  {
    id: "1",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+1-202-555-0104",
    country: "USA",
    city: "New York",
    applied: "2023-10-27",
  },
  {
    id: "2",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+44-20-7946-0958",
    country: "UK",
    city: "London",
    applied: "2023-10-25",
  },
  {
    id: "3",
    name: "Emily White",
    email: "emily.white@example.com",
    phone: "+90-555-123-4567",
    country: "Turkey",
    city: "Ankara",
    applied: "2023-10-22",
  },
];


export default function AdminDashboard() {
  const { translations } = useLanguage();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    // In a real app, you would filter applicants based on the search term
    setSearchResults(applicants);
  };

  const t = translations.admin.dashboard;

  return (
     <div className="container mx-auto p-4 sm:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">{t.title}</h1>
        <p className="text-muted-foreground">{t.description}</p>
      </header>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{t.search_card_title}</CardTitle>
            <CardDescription>{t.search_card_description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
              <Input type="search" placeholder={t.search_placeholder} className="flex-1" />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
                <span className="sr-only">{t.search_button}</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        {hasSearched && (
          <Card>
              <CardHeader>
                  <CardTitle>{t.results_card_title}</CardTitle>
                  <CardDescription>{t.results_card_description.replace('{count}', searchResults.length.toString())}</CardDescription>
              </CardHeader>
              <CardContent>
                  <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.table_header_name}</TableHead>
                      <TableHead>{t.table_header_email}</TableHead>
                      <TableHead>{t.table_header_phone}</TableHead>
                      <TableHead>{t.table_header_country}</TableHead>
                      <TableHead>{t.table_header_city}</TableHead>
                      <TableHead>{t.table_header_applied}</TableHead>
                      <TableHead className="text-right">{t.table_header_actions}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.length > 0 ? (
                      searchResults.map((applicant) => (
                        <TableRow key={applicant.id}>
                          <TableCell className="font-medium">{applicant.name}</TableCell>
                          <TableCell>{applicant.email}</TableCell>
                          <TableCell>{applicant.phone}</TableCell>
                          <TableCell>{applicant.country}</TableCell>
                          <TableCell>{applicant.city}</TableCell>
                          <TableCell>{applicant.applied}</TableCell>
                          <TableCell className="text-right">
                            <Button asChild variant="ghost" size="icon">
                              <Link href={`/admin/applicant/${applicant.id}`}>
                                <ChevronRight className="h-4 w-4" />
                                <span className="sr-only">{t.view_details_button}</span>
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                          {t.no_results}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
