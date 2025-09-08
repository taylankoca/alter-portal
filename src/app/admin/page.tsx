"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ChevronRight, Download } from "lucide-react";

const applicants = [
  {
    id: "1",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    role: "Software Engineer",
    applied: "2023-10-27",
  },
  {
    id: "2",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Product Manager",
    applied: "2023-10-25",
  },
  {
    id: "3",
    name: "Emily White",
    email: "emily.white@example.com",
    role: "UX Designer",
    applied: "2023-10-22",
  },
];


function AdminDashboard() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    // In a real app, you would filter applicants based on the search term
    setSearchResults(applicants);
  };

  return (
     <div className="container mx-auto p-4 sm:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Search for applicants and manage applications.</p>
      </header>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Search Applicants</CardTitle>
            <CardDescription>Find applicants by name, email, or keywords.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
              <Input type="search" placeholder="e.g., Jane Doe, marketing, React" className="flex-1" />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        {hasSearched && (
          <Card>
              <CardHeader>
                  <CardTitle>Search Results</CardTitle>
                  <CardDescription>Found {searchResults.length} applicants matching your criteria.</CardDescription>
              </CardHeader>
              <CardContent>
                  <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Applied On</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.length > 0 ? (
                      searchResults.map((applicant) => (
                        <TableRow key={applicant.email}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{applicant.name}</p>
                              <p className="text-sm text-muted-foreground">{applicant.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{applicant.role}</TableCell>
                           <TableCell>{applicant.applied}</TableCell>
                          <TableCell className="text-right">
                              <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download CV</span>
                            </Button>
                            <Button asChild variant="ghost" size="icon">
                              <Link href={`/admin/applicant/${applicant.id}`}>
                                <ChevronRight className="h-4 w-4" />
                                <span className="sr-only">View Details</span>
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          No results found.
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

function PasswordScreen({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this should be a secure check against a server.
    if (password === "password") { 
      onUnlock();
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Admin Access</CardTitle>
          <CardDescription>Please enter the password to access the admin dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              Unlock
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <PasswordScreen onUnlock={() => setIsAuthenticated(true)} />;
  }

  return <AdminDashboard />;
}
