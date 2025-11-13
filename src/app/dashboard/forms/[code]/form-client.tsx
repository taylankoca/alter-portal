
'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLanguage } from '@/context/language-context';
import type { FormDetail } from '@/lib/data-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface FormClientProps {
  form: FormDetail;
}

export default function FormClient({ form }: FormClientProps) {
  const { translations } = useLanguage();
  const t = translations.forms_page;
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamically build Zod schema from form fields
  const schema = z.object(
    [...form.static_fields, ...form.fields].reduce((acc, field) => {
      if (field.read_only) return acc; // Don't add validation for read-only fields

      let fieldSchema: z.ZodTypeAny;

      switch (field.type) {
        case 'checkbox':
          fieldSchema = z.boolean().default(field.default === 'true');
          break;
        case 'number':
           fieldSchema = z.string().regex(/^\d+$/, "Sadece rakam girilmelidir").optional();
          break;
        default:
          fieldSchema = z.string();
      }

      if (field.required) {
          if (field.type === 'checkbox') {
             fieldSchema = fieldSchema.refine(val => val === true, {
                message: "Bu alan işaretlenmelidir.",
             });
          } else {
            fieldSchema = (fieldSchema as z.ZodString).min(1, "Bu alan gereklidir.");
          }
      } else {
        fieldSchema = fieldSchema.optional();
      }

      acc[field.key] = fieldSchema;
      return acc;
    }, {} as Record<string, z.ZodTypeAny>)
  );
  
  type FormValues = z.infer<typeof schema>;

  const defaultValues = [...form.static_fields, ...form.fields].reduce((acc, field) => {
      if(field.read_only) return acc;

      const key = field.key as keyof FormValues;
      switch(field.type) {
          case 'checkbox':
              acc[key] = field.default === 'true';
              break;
          case 'date':
               acc[key] = field.default ? new Date(field.default).toISOString().split('T')[0] : '';
               break;
          default:
              acc[key] = field.default || '';
      }
      return acc;
  }, {} as Partial<FormValues>);


  const formHook = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setError(null);

    const submissionData: Record<string, any> = {
        formCode: form.code,
        fields: {}
    };

    // Add static fields that are not read-only
    form.static_fields.forEach(field => {
        if (!field.read_only) {
            submissionData[field.key] = values[field.key];
        }
    });

    // Add dynamic fields
    form.fields.forEach(field => {
        submissionData.fields[field.key] = values[field.key];
    });


    try {
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'An unknown error occurred');
      }

      toast({
        title: t.submit_success_title,
        description: t.submit_success_description,
      });
      router.push('/dashboard/submissions');
      router.refresh();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (field: any, formField: any) => {
    const { ref, ...rest } = formField;

    switch (field.type) {
        case 'textarea':
            return <Textarea {...rest} ref={ref} readOnly={field.read_only} />;
        case 'checkbox':
            return <Checkbox {...rest} ref={ref} checked={formField.value} onCheckedChange={formField.onChange} disabled={field.read_only} />;
        case 'radio':
            return (
                <RadioGroup onValueChange={formField.onChange} defaultValue={formField.value} className="flex flex-col space-y-1" disabled={field.read_only}>
                    {(field.options || []).map((option: string) => (
                        <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                             <FormControl>
                                <RadioGroupItem value={option} />
                            </FormControl>
                            <FormLabel className="font-normal">{option}</FormLabel>
                        </FormItem>
                    ))}
                </RadioGroup>
            );
        case 'select':
            return (
                <Select onValueChange={formField.onChange} defaultValue={formField.value} disabled={field.read_only}>
                    <FormControl>
                        <SelectTrigger><SelectValue placeholder={`Select ${field.label}`} /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {(field.options || []).map((option: string) => (
                            <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        default:
            return <Input type={field.type || 'text'} {...rest} ref={ref} readOnly={field.read_only} />;
    }
  };
  
  const allFields = [...form.static_fields, ...form.fields].sort((a,b) => (a.sort_order || 99) - (b.sort_order || 99));

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...formHook}>
          <form onSubmit={formHook.handleSubmit(onSubmit)} className="space-y-8">
            {error && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>{t.submit_error_title}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[...form.static_fields, ...form.fields].map((field) => {
                    const fieldName = field.key as FieldPath<FormValues>;
                    return (
                         <FormField
                            key={field.key}
                            control={formHook.control}
                            name={fieldName}
                            render={({ field: formField }) => (
                                <FormItem>
                                    <FormLabel>{field.label}</FormLabel>
                                    <FormControl>{renderField(field, formField)}</FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )
                })}
            </div>
            
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t.submitting_button : t.submit_button}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
