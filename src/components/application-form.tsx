"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
  MapPin,
  Globe,
  Plus,
  Trash2,
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
import { cn } from "@/lib/utils";

const createFormSchema = (translations: any) => z.object({
  name: z.string().min(2, { message: translations.form.validation.name_min }),
  email: z.string().email({ message: translations.form.validation.email_invalid }),
  phone: z.string().min(10, { message: translations.form.validation.phone_min }),
  country: z.string().min(2, { message: translations.form.validation.country_min }),
  city: z.string().min(2, { message: translations.form.validation.city_min }),
  resume: z.any().optional(),
  experience: z.array(z.object({ value: z.string() })).optional(),
  education: z.array(z.object({ value: z.string() })).optional(),
  hobbies: z.string().optional(),
});


export function ApplicationForm() {
  const { translations } = useLanguage();
  const t = translations.form;
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
      country: "",
      city: "",
      experience: [{ value: "" }],
      education: [{ value: "" }],
      hobbies: "",
    },
    mode: "onChange",
  });
  
  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control: form.control,
    name: "experience",
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control: form.control,
    name: "education",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: t.toast.file_too_large_title,
          description: t.toast.file_too_large_desc,
        });
        return;
      }
      setFileName(file.name);
      form.setValue('resume', file);
    }
  };

  const handleNext = async () => {
    const isValid = await form.trigger(["name", "email", "phone", "country", "city"]);
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
      title: t.toast.submit_success_title,
      description: t.toast.submit_success_desc,
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
              <CardTitle>{t.step1_title}</CardTitle>
              <CardDescription>
                {t.step1_desc}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.full_name}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder={t.full_name_placeholder} {...field} className="pl-10" />
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
                    <FormLabel>{t.email}</FormLabel>
                     <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="email" placeholder={t.email_placeholder} {...field} className="pl-10" />
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
                    <FormLabel>{t.phone}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="tel" placeholder={t.phone_placeholder} {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t.country}</FormLabel>
                        <FormControl>
                        <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder={t.country_placeholder} {...field} className="pl-10" />
                        </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t.city}</FormLabel>
                        <FormControl>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder={t.city_placeholder} {...field} className="pl-10" />
                        </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
              <FormItem>
                <FormLabel>{t.upload_resume}</FormLabel>
                 <div className="flex items-center space-x-4">
                   <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                     <UploadCloud className="mr-2 h-4 w-4" />
                     {t.select_resume}
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
                  {t.resume_desc}
                </FormDescription>
              </FormItem>
            </CardContent>
             <CardFooter className="flex justify-end">
                <Button type="button" onClick={handleNext}>
                  {t.next_button}
                </Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{t.step2_title}</CardTitle>
                <CardDescription>{t.step2_desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                   <FormLabel className="flex items-center"><Briefcase className="mr-2 h-4 w-4"/> {t.experience}</FormLabel>
                   {experienceFields.map((field, index) => (
                      <FormField
                        key={field.id}
                        control={form.control}
                        name={`experience.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2">
                             <FormControl>
                                <Input placeholder={t.experience_placeholder} {...field} />
                              </FormControl>
                            {experienceFields.length > 1 && (
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeExperience(index)} className="shrink-0">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            )}
                          </FormItem>
                        )}
                      />
                   ))}
                   <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendExperience({ value: "" })}>
                    <Plus className="mr-2 h-4 w-4" /> {t.add_experience}
                   </Button>
                </div>
                 <div className="space-y-4">
                   <FormLabel className="flex items-center"><GraduationCap className="mr-2 h-4 w-4"/> {t.education}</FormLabel>
                   {educationFields.map((field, index) => (
                      <FormField
                        key={field.id}
                        control={form.control}
                        name={`education.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2">
                             <FormControl>
                                <Input placeholder={t.education_placeholder} {...field} />
                              </FormControl>
                            {educationFields.length > 1 && (
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeEducation(index)} className="shrink-0">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            )}
                          </FormItem>
                        )}
                      />
                   ))}
                   <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendEducation({ value: "" })}>
                    <Plus className="mr-2 h-4 w-4" /> {t.add_education}
                   </Button>
                </div>
                 <FormField
                  control={form.control}
                  name="hobbies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Heart className="mr-2 h-4 w-4"/> {t.hobbies}</FormLabel>
                      <FormControl>
                        <Input placeholder={t.hobbies_placeholder} {...field} />
                      </FormControl>
                       <FormDescription>
                        {t.hobbies_desc}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> {t.back_button}
              </Button>
              <Button type="submit" size="lg">
                {t.submit_button}
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
}

    