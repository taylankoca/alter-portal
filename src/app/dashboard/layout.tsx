"use client";

import { Home, PanelLeft, Settings, FileText } from "lucide-react";
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { translations } = useLanguage();
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: translations.navigation.dashboard, icon: Home },
    { href: "/dashboard/reports", label: translations.navigation.reports, icon: FileText },
    { href: "/dashboard/settings", label: translations.navigation.settings, icon: Settings },
  ];

  return (
    <SidebarProvider>
      <Sidebar variant="floating">
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-sidebar-primary">Alter Finans</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navLinks.map((link) => (
              <SidebarMenuItem key={link.href}>
                <Link href={link.href} passHref>
                  <SidebarMenuButton
                    isActive={pathname === link.href}
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
        <header className="flex items-center justify-between p-4 border-b md:p-6">
            <SidebarTrigger>
                <PanelLeft />
            </SidebarTrigger>
            <div>{/* Top right actions can go here */}</div>
        </header>
        {children}
        </SidebarInset>
    </SidebarProvider>
  );
}
