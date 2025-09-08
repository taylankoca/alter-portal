"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/context/language-context";

export default function PositionsPage() {
    const { translations } = useLanguage();
    const positions = translations.positions.jobs;

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl font-headline">
          {translations.positions.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {translations.positions.description}
        </p>
      </header>

      <Card>
        <CardHeader>
            <CardTitle>{translations.positions.list_title}</CardTitle>
            <CardDescription>{translations.positions.list_description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {positions.map((position, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-left">
                    <div className="flex flex-col">
                        <span className="font-semibold text-lg text-primary">{position.title}</span>
                        <span className="text-sm text-muted-foreground">{position.location}</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p className="font-semibold">{position.intro}</p>
                  <ul className="list-disc list-inside space-y-2">
                    {position.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                  <p>
                    <span className="font-semibold">{translations.positions.application_label}</span>
                    <span>{position.application}</span>
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
