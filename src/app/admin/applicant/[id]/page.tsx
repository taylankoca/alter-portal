"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Briefcase, Download, GraduationCap, Heart, Mail, User } from "lucide-react";


const applicantData = {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    role: "Software Engineer",
    applied: "2023-10-27",
    experience: "5+ years of experience in full-stack development, specializing in React and Node.js. Led a team of 3 engineers at previous company.",
    education: "B.S. in Computer Science from University of Example",
    hobbies: "Hiking, chess, open-source contributions"
};

export default function ApplicantDetailPage({ params }: { params: { id: string } }) {

  return (
    <div className="container mx-auto p-4 sm:p-8">
       <div className="mb-8">
        <Button asChild variant="outline" size="sm">
            <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Applicants
            </Link>
        </Button>
       </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                        <CardTitle className="text-3xl flex items-center gap-3">
                            <User className="h-8 w-8 text-muted-foreground" />
                            {applicantData.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 pt-2">
                             <Mail className="h-4 w-4" /> {applicantData.email}
                        </CardDescription>
                         <CardDescription className="flex items-center gap-2 pt-1">
                             <Briefcase className="h-4 w-4" /> Applied for {applicantData.role} on {applicantData.applied}
                        </CardDescription>
                    </div>
                     <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Download CV
                     </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg mb-2 flex items-center"><Briefcase className="mr-2 h-5 w-5 text-primary" /> Experience</h3>
                        <p className="text-muted-foreground">{applicantData.experience}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg mb-2 flex items-center"><GraduationCap className="mr-2 h-5 w-5 text-primary" /> Education</h3>
                        <p className="text-muted-foreground">{applicantData.education}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg mb-2 flex items-center"><Heart className="mr-2 h-5 w-5 text-primary" /> Hobbies</h3>
                        <p className="text-muted-foreground">{applicantData.hobbies}</p>
                    </div>
                </CardContent>
            </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>İletişime Geç</CardTitle>
            <CardDescription>Contact an applicant via email or SMS.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="sms">SMS</TabsTrigger>
              </TabsList>
              <TabsContent value="email" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email-recipient">Recipient Email</Label>
                  <Input id="email-recipient" type="email" defaultValue={applicantData.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-subject">Subject</Label>
                  <Input id="email-subject" placeholder="Regarding your application..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-body">Message</Label>
                  <Textarea id="email-body" placeholder="Your message here..." rows={4} />
                </div>
                <Button className="w-full">Send Email</Button>
              </TabsContent>
              <TabsContent value="sms" className="space-y-4 pt-4">
                 <div className="space-y-2">
                  <Label htmlFor="sms-recipient">Recipient Phone</Label>
                  <Input id="sms-recipient" type="tel" placeholder="+1234567890" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sms-body">Message</Label>
                  <Textarea id="sms-body" placeholder="Your SMS message here..." rows={4} />
                </div>
                <Button className="w-full">Send SMS</Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
