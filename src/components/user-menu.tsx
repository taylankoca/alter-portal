
"use client";

import { LogOut, KeyRound, Settings } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import type { ApiUser } from "@/lib/data-service";
import TokenModal from "./token-modal";


export default function UserMenu() {
  const { translations } = useLanguage();
  const router = useRouter();
  const t = translations.user_menu;
  
  const [user, setUser] = useState<ApiUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        localStorage.removeItem('user');
    }
  }, []);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    localStorage.removeItem('user');
    setUser(null);
    router.push("/");
  };
  
  const handleSettings = () => {
    router.push("/dashboard/settings");
  }

  if (!mounted) {
    return <Skeleton className="h-9 w-28" />;
  }
  
  if (!user) {
    return null;
  }

  const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
  const fullName = `${user.first_name} ${user.last_name}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            {/* user.photo is not available in the API response yet */}
            {/* {user?.photo && <AvatarImage src={user.photo} alt={fullName} />} */}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
           <span className="hidden sm:inline">{fullName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
         <DropdownMenuItem onClick={handleSettings}>
            <Settings className="mr-2 h-4 w-4" />
            <span>{t.settings}</span>
        </DropdownMenuItem>
        <TokenModal>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <KeyRound className="mr-2 h-4 w-4" />
                <span>{t.token}</span>
            </DropdownMenuItem>
        </TokenModal>
         <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t.logout}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
