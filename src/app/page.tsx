
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/layout/logo';

function InfoCard({ icon, title, description, buttonText, href }: { icon: React.ReactNode, title: string, description: string, buttonText: string, href: string }) {
  return (
    <div
      className="relative rounded-2xl bg-black/40 backdrop-blur-sm transition-colors duration-300 hover:bg-card-hover"
      style={{ boxShadow: '0 0 10px 1px rgba(255, 255, 255, 0.2)' }}
    >
        <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {icon}
              </div>
              <div>
                  <h3 className="font-bold font-headline text-lg text-white">{title}</h3>
                  <p className="text-sm text-neutral-300 font-sans">{description}</p>
              </div>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90 rounded-lg whitespace-nowrap ml-4">
                <Link href={href}>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    <span>{buttonText}</span>
                </Link>
            </Button>
        </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white overflow-hidden">
       <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(var(--primary) / 0.4), transparent)',
        }}
      />
      <header className="relative z-10 p-4 sm:p-6 h-24 flex items-center">
        <Logo />
      </header>
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        
        <div className="text-center max-w-4xl w-full">
          <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white">
            Welcome to HQ
          </h1>
          <p className="mt-4 text-lg text-neutral-300 max-w-2xl mx-auto">
            Your guide to Osoft + your inventory in one place
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 items-stretch gap-6 max-w-4xl mx-auto text-left">
            <InfoCard 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="h-6 w-6">
                    <path fill="currentColor" d="M8 13h8v-2H8zm0 3h8v-2H8zm0 3h5v-2H8zm-2 3q-.825 0-1.412-.587T4 20V4q0-.825.588-1.412T6 2h8l6 6v12q0 .825-.587 1.413T18 22zm7-13V4H6v16h12V9zM6 4v5zv16z"/>
                </svg>
              }
              title="Onboarding Guide"
              description="Get familiar with how Osoft works"
              buttonText="Open"
              href="/onboarding"
            />
            <InfoCard 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 56 56" className="h-6 w-6">
                  <path fill="currentColor" d="m7.586 42.742l18.398 10.453c1.36.774 2.625.797 4.032 0l18.398-10.453c2.18-1.242 3.375-2.508 3.375-5.906V18.273c0-2.601-1.031-4.078-2.953-5.18l-16.57-9.421c-2.883-1.664-5.696-1.64-8.532 0l-16.57 9.422c-1.922 1.101-2.953 2.578-2.953 5.18v18.562c0 3.398 1.195 4.664 3.375 5.906m31.43-22.945L21.086 9.672l4.313-2.461c1.78-1.008 3.374-1.031 5.203 0l15.257 8.719ZM28 26.03l-17.86-10.1l7.008-4.008l17.86 10.148ZM9.79 39.461c-1.337-.75-1.782-1.477-1.782-2.742V19.234l18.023 10.29v19.171Zm36.421 0l-16.242 9.234V29.523l18.023-10.289V36.72c0 1.265-.445 1.992-1.781 2.742"/>
                </svg>
              }
              title="Go to Inventory"
              description="Request and track resources"
              buttonText="Enter"
              href="/auth/login"
            />
          </div>
        </div>
      </main>
      <footer className="relative z-10 p-4 text-center text-sm text-neutral-500">
        © {new Date().getFullYear()} Osoft Inc. All rights reserved.
      </footer>
    </div>
  );
}
