"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useTransition, useRef } from "react";
import {
  Briefcase,
  GraduationCap,
  Heart,
  Loader2,
  Mail,
  Phone,
  UploadCloud,
  User,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { parseUploadedResume } from "@/ai/flows/parse-uploaded-resume";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  education: z.string().optional(),
  experience: z.string().optional(),
  hobbies: z.string().optional(),
});

export function ApplicationForm() {
  const [isParsing, startTransition] = useTransition();
  const [fileName, setFileName] = useState<string | null>(null);
  const [resumeDataUri, setResumeDataUri] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      education: "",
      experience: "",
      hobbies: "",
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload a resume smaller than 5MB.",
        });
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        setResumeDataUri(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleParseResume = () => {
    if (!resumeDataUri) {
      toast({
        variant: "destructive",
        title: "No resume selected",
        description: "Please select a resume file to parse.",
      });
      return;
    }

    startTransition(async () => {
      try {
        const result = await parseUploadedResume({ resumeDataUri });

        if (result.name) form.setValue('name', result.name, { shouldValidate: true });
        if (result.email) form.setValue('email', result.email, { shouldValidate: true });
        if (result.phone) form.setValue('phone', result.phone, { shouldValidate: true });
        if (result.education) form.setValue('education', result.education.join('\n\n'));
        if (result.experience) form.setValue('experience', result.experience.join('\n\n'));
        if (result.hobbies) form.setValue('hobbies', result.hobbies.join(', '));
        
        toast({
          title: "Resume Parsed Successfully!",
          description: "Your information has been filled in. Please review and submit.",
        });
      } catch (error) {
        console.error("Parsing failed:", error);
        toast({
          variant: "destructive",
          title: "Parsing Failed",
          description: "We couldn't parse your resume. Please fill out the form manually.",
        });
      }
    });
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Application Submitted!",
      description: "Thank you for applying. We will be in touch shortly.",
    });
    form.reset();
    setFileName(null);
    setResumeDataUri(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Application</CardTitle>
            <CardDescription>
              Upload your resume (PDF or Word) and let our AI fill in the details for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center space-x-4">
               <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                 <UploadCloud className="mr-2 h-4 w-4" />
                 Select Resume
               </Button>
               <Input 
                 ref={fileInputRef}
                 type="file"
                 className="hidden"
                 onChange={handleFileChange}
                 accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
               />
               {fileName && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{fileName}</span>
                </div>
               )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="button" onClick={handleParseResume} disabled={isParsing || !resumeDataUri}>
              {isParsing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isParsing ? 'Parsing...' : 'Parse with AI'}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Please provide your contact details.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Jane Doe" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                   <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="email" placeholder="jane.doe@example.com" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="tel" placeholder="(123) 456-7890" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Professional Details</CardTitle>
            <CardDescription>Tell us more about your background and interests.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Briefcase className="mr-2 h-4 w-4"/> Work Experience</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your work experience..." {...field} rows={6} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="education"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><GraduationCap className="mr-2 h-4 w-4"/> Education</FormLabel>
                  <FormControl>
                    <Textarea placeholder="List your degrees and certifications..." {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="hobbies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Heart className="mr-2 h-4 w-4"/> Hobbies & Interests</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Hiking, chess, open-source contributions" {...field} />
                  </FormControl>
                   <FormDescription>
                    Separated by commas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isParsing}>
            Submit Application
          </Button>
        </div>
      </form>
    </Form>
  );
}
