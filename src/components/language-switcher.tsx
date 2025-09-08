"use client";

import { useState } from "react";
import { Check, Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  { code: "tr", name: "Türkçe" },
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
];

export default function LanguageSwitcher() {
  const [selectedLanguage, setSelectedLanguage] = useState("tr");

  // In a real app, you'd use a routing or i18n library to change the locale.
  // For now, this just updates the state.
  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    console.log(`Language changed to: ${langCode}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Languages className="mr-2 h-4 w-4" />
          {languages.find((l) => l.code === selectedLanguage)?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
          >
            <Check
              className={`mr-2 h-4 w-4 ${
                selectedLanguage === lang.code ? "opacity-100" : "opacity-0"
              }`}
            />
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
