"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export default function TokenModal({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState('');
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const { translations } = useLanguage();
    const t = translations.user_menu;

    useEffect(() => {
        if (open) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; auth_token=`);
            if (parts.length === 2) {
                const tokenValue = parts.pop()?.split(';').shift();
                setToken(tokenValue || '');
            }
        }
    }, [open]);

    const handleCopy = () => {
        navigator.clipboard.writeText(token);
        toast({
            title: t.token_copied_title,
            description: t.token_copied_description,
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{t.auth_token_title}</DialogTitle>
                    <DialogDescription>{t.auth_token_description}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="token" className="text-right">
                            Token
                        </Label>
                        <Input id="token" value={token} readOnly className="col-span-3" />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleCopy}>
                        <Copy className="mr-2 h-4 w-4" />
                        {t.copy_token}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
