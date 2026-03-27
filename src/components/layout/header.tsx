

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { ProfileDropdown } from './profile-dropdown';
import type { User, Notification } from '@/lib/types';
import React, { useEffect, useState } from 'react';
import { getAuthenticatedUser } from '@/lib/auth-client';
import { getUnreadRequestCount } from '@/lib/data';


const navLinks = [
  { href: '/inventory/catalogue', label: 'Catalogue', roles: ['staff', 'admin', 'superAdmin'] },
  { href: '/inventory/requests', label: 'Requests', roles: ['staff', 'admin', 'superAdmin'], notificationType: 'request' },
  { href: '/inventory/docs', label: 'Docs', roles: ['staff', 'admin', 'superAdmin'] },
  { href: '/inventory/stock', label: 'Stock', roles: ['admin', 'superAdmin'] },
  { href: '/inventory/personnel', label: 'Personnel', roles: ['superAdmin'] },
];

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    async function loadData() {
      const authenticatedUser = await getAuthenticatedUser();
      setUser(authenticatedUser);
      if (authenticatedUser) {
        setUnreadCount(getUnreadRequestCount(authenticatedUser.id));
      }
    }
    loadData();
  }, [pathname]); // Re-check on path change to update notifications

  if (!user) {
    // Render a skeleton or null while user is loading
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8 animate-pulse">
                <Logo />
                <div className="h-6 w-20 rounded-md bg-muted" />
                <div className="h-6 w-20 rounded-md bg-muted" />
                <div className="h-6 w-20 rounded-md bg-muted" />
            </div>
            <div className="h-9 w-9 rounded-full bg-muted" />
        </div>
      </header>
    );
  }

  const availableLinks = navLinks.filter(link => link.roles.includes(user.role));

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <Logo />
            <nav className="hidden md:flex items-center space-x-16 text-sm font-medium">
            {availableLinks.map(link => {
                const isActive = pathname.startsWith(link.href);
                const hasNotification = link.notificationType === 'request' && unreadCount > 0;
                return (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                    "relative text-foreground/60 transition-colors hover:text-primary",
                    isActive && "text-primary"
                    )}
                >
                    {link.label}
                     {hasNotification && (
                        <span className="absolute top-[-4px] right-[-12px] flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                        </span>
                      )}
                    {isActive && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-primary rounded-full" />
                    )}
                </Link>
                );
            })}
            </nav>
            <ProfileDropdown user={user} />
        </div>
    </header>
  );
}
