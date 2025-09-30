
"use client";

import { Check } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";


const languageOptions = [
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Skeleton className="h-9 w-28" />;
  }

  const selectedLanguage = languageOptions.find((l) => l.code === language) || languageOptions[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <span className="font-bold">{selectedLanguage.flag}</span>
          <span className="hidden sm:inline">{selectedLanguage.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languageOptions.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center gap-2"
          >
            <span className="font-bold w-6">{lang.flag}</span>
            <span>{lang.name}</span>
            <Check
              className={`ml-auto h-4 w-4 ${
                language === lang.code ? "opacity-100" : "opacity-0"
              }`}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
