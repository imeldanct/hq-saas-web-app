
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { cn } from '@/lib/utils';

const sections = [
  { id: 'welcome', title: 'Welcome', href: '/onboarding' },
  { id: 'founders', title: 'Founders', href: '/onboarding/founders' },
  { id: 'departments', title: 'Departments', href: '/onboarding/departments' },
  { id: 'handbook', title: 'Handbook', href: '/onboarding/handbook' },
];

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="bg-background text-foreground">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <Logo />
          <nav className="hidden md:flex items-center space-x-6">
            {sections.map(section => (
              <Link
                key={section.id}
                href={section.href}
                className={cn(
                  "font-medium text-sm text-muted-foreground hover:text-primary transition-colors",
                  pathname === section.href && "text-primary"
                )}
              >
                {section.title}
              </Link>
            ))}
          </nav>
          <Button asChild>
            <Link href="/auth/login">Go to Inventory</Link>
          </Button>
        </div>
      </header>
      {children}
    </div>
  );
}
