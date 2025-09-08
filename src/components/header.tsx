"use client";

import Link from "next/link";
import LanguageSwitcher from "./language-switcher";
import { useLanguage } from "@/context/language-context";
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";


export default function Header() {
    const { translations } = useLanguage();
    const pathname = usePathname();

    const navLinks = [
        { href: "/", label: translations.navigation.home },
        { href: "/positions", label: translations.navigation.positions },
        { href: "/admin", label: translations.navigation.admin },
    ];

    return (
        <header className="bg-card border-b">
            <div className="container mx-auto flex justify-between items-center p-4">
                <nav className="flex items-center gap-6">
                    <Link href="/" className="text-2xl font-bold text-primary">
                        Alter
                    </Link>
                    <div className="hidden md:flex gap-4">
                        {navLinks.map(link => (
                             <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    pathname === link.href ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </nav>
                <LanguageSwitcher />
            </div>
        </header>
    )
}
