
"use client";

import { Home, PanelLeft, FolderKanban, CheckSquare, Users, MessageSquare, Network, Calendar, FileText } from "lucide-react";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "@/components/language-switcher";
import UserMenu from "@/components/user-menu";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { translations } = useLanguage();
  const pathname = usePathname();
  const t = translations.navigation;

  const navLinks = [
    { href: "/dashboard", label: t.dashboard, icon: Home },
    { href: "/dashboard/projects", label: t.projects, icon: FolderKanban },
    { href: "/dashboard/people", label: t.people, icon: Users },
    { href: "/dashboard/correspondence", label: t.correspondence, icon: MessageSquare },
    { href: "/dashboard/schema", label: t.schema, icon: Network },
    { href: "/dashboard/tasks", label: t.tasks, icon: CheckSquare },
    { href: "/dashboard/calendar", label: t.calendar, icon: Calendar },
    { href: "/dashboard/forms", label: t.forms, icon: FileText },
  ];

  return (
    <SidebarProvider>
      <Sidebar variant="floating">
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Image src="/alter_logo_ready.png" alt="Alter Portal Logo" width={140} height={40} />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navLinks.map((link) => (
              <SidebarMenuItem key={link.href}>
                <Link href={link.href} passHref>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(link.href) && (link.href === '/dashboard' ? pathname.length === link.href.length : true)}
                    tooltip={link.label}
                  >
                    <link.icon />
                    <span>{link.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b md:p-6 sticky top-0 bg-background/80 backdrop-blur-sm z-10">
            <SidebarTrigger>
                <PanelLeft />
            </SidebarTrigger>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <UserMenu />
            </div>
        </header>
        <main className="p-4 md:p-6">
         {children}
        </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
