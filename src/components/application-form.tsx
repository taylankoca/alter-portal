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

const formSchema = z.object({
  name: z.string().min(2, { message: "İsim en az 2 karakter olmalıdır." }),
  email: z.string().email({ message: "Lütfen geçerli bir e-posta adresi girin." }),
  phone: z.string().min(10, { message: "Lütfen geçerli bir telefon numarası girin." }),
  resume: z.any().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  hobbies: z.string().optional(),
});

export function ApplicationForm() {
  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState<string | null>(null);
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
    mode: "onChange",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: "Dosya çok büyük",
          description: "Lütfen 5MB'den küçük bir CV yükleyin.",
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
      title: "Başvuru Gönderildi!",
      description: "Başvurunuz için teşekkür ederiz. Kısa süre içinde sizinle iletişime geçeceğiz.",
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
              <CardTitle>Kişisel Bilgiler</CardTitle>
              <CardDescription>
                Lütfen iletişim bilgilerinizi girin ve CV'nizi yükleyin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tam Adı</FormLabel>
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
                    <FormLabel>Email Adresi</FormLabel>
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
                  <FormItem>
                    <FormLabel>Telefon Numarası</FormLabel>
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
              <FormItem>
                <FormLabel>CV Yükle</FormLabel>
                 <div className="flex items-center space-x-4">
                   <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                     <UploadCloud className="mr-2 h-4 w-4" />
                     CV Seç
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
                  PDF veya Word dosyası (Maks. 5MB)
                </FormDescription>
              </FormItem>
            </CardContent>
             <CardFooter className="flex justify-end">
                <Button type="button" onClick={handleNext}>
                  İleri
                </Button>
            </CardFooter>
          </Card>
        )}

        {step === 2 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Profesyonel Detaylar</CardTitle>
                <CardDescription>Bize geçmişiniz ve ilgi alanlarınız hakkında daha fazla bilgi verin.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Briefcase className="mr-2 h-4 w-4"/> İş Deneyimi</FormLabel>
                      <FormControl>
                        <Textarea placeholder="İş deneyiminizi açıklayın..." {...field} rows={6} />
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
                      <FormLabel className="flex items-center"><GraduationCap className="mr-2 h-4 w-4"/> Eğitim</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Derecelerinizi ve sertifikalarınızı listeleyin..." {...field} rows={4} />
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
                      <FormLabel className="flex items-center"><Heart className="mr-2 h-4 w-4"/> Hobiler & İlgi Alanları</FormLabel>
                      <FormControl>
                        <Input placeholder="ör., Yürüyüş, satranç, açık kaynak katkıları" {...field} />
                      </FormControl>
                       <FormDescription>
                        Virgülle ayırın.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Geri
              </Button>
              <Button type="submit" size="lg">
                Başvuruyu Gönder
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
}
