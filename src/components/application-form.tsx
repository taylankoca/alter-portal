"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useRef } from "react";
import {
  Briefcase,
  GraduationCap,
  Heart,
  Mail,
  Phone,
  UploadCloud,
  User,
  FileText,
  ArrowLeft,
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
import { useLanguage } from "@/context/language-context";

const createFormSchema = (translations: any) => z.object({
  name: z.string().min(2, { message: translations.form.validation.name_min }),
  email: z.string().email({ message: translations.form.validation.email_invalid }),
  phone: z.string().min(10, { message: translations.form.validation.phone_min }),
  resume: z.any().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  hobbies: z.string().optional(),
});


export function ApplicationForm() {
  const { translations } = useLanguage();
  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const formSchema = createFormSchema(translations);

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
    mode: "onChange",
  });
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: translations.form.toast.file_too_large_title,
          description: translations.form.toast.file_too_large_desc,
        });
        return;
      }
      setFileName(file.name);
      form.setValue('resume', file);
    }
  };

  const handleNext = async () => {
    const isValid = await form.trigger(["name", "email", "phone"]);
    if (isValid) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: translations.form.toast.submit_success_title,
      description: translations.form.toast.submit_success_desc,
    });
    form.reset();
    setFileName(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
    setStep(1);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {step === 1 && (
           <Card>
            <CardHeader>
              <CardTitle>{translations.form.step1_title}</CardTitle>
              <CardDescription>
                {translations.form.step1_desc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translations.form.full_name}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder={translations.form.full_name_placeholder} {...field} className="pl-10" />
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
                    <FormLabel>{translations.form.email}</FormLabel>
                     <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="email" placeholder={translations.form.email_placeholder} {...field} className="pl-10" />
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
                  <FormItem>
                    <FormLabel>{translations.form.phone}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="tel" placeholder={translations.form.phone_placeholder} {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>{translations.form.upload_resume}</FormLabel>
                 <div className="flex items-center space-x-4">
                   <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                     <UploadCloud className="mr-2 h-4 w-4" />
                     {translations.form.select_resume}
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
                <FormDescription>
                  {translations.form.resume_desc}
                </FormDescription>
              </FormItem>
            </CardContent>
             <CardFooter className="flex justify-end">
                <Button type="button" onClick={handleNext}>
                  {translations.form.next_button}
                </Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{translations.form.step2_title}</CardTitle>
                <CardDescription>{translations.form.step2_desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Briefcase className="mr-2 h-4 w-4"/> {translations.form.experience}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={translations.form.experience_placeholder} {...field} rows={6} />
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
                      <FormLabel className="flex items-center"><GraduationCap className="mr-2 h-4 w-4"/> {translations.form.education}</FormLabel>
                      <FormControl>
                        <Textarea placeholder={translations.form.education_placeholder} {...field} rows={4} />
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
                      <FormLabel className="flex items-center"><Heart className="mr-2 h-4 w-4"/> {translations.form.hobbies}</FormLabel>
                      <FormControl>
                        <Input placeholder={translations.form.hobbies_placeholder} {...field} />
                      </FormControl>
                       <FormDescription>
                        {translations.form.hobbies_desc}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> {translations.form.back_button}
              </Button>
              <Button type="submit" size="lg">
                {translations.form.submit_button}
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
}
