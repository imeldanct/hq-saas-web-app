'use client';
import { useEffect, useState } from 'react';
import { getAuthenticatedUser } from '@/lib/auth-client';
import { redirect } from 'next/navigation';
import { Logo } from '@/components/layout/logo';

// This is a temporary loading component.
function LoadingSplash() {
    return (
        <div className="fixed inset-0 bg-background flex flex-col items-center justify-center gap-4">
            <Logo />
            <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
            </div>
        </div>
    )
}

// Redirect to the catalogue page as the default view for the inventory app.
export default function InventoryRoot() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuthAndRedirect() {
      const user = await getAuthenticatedUser();
      if(user) {
        redirect('/inventory/catalogue');
      } else {
        // If for some reason there's no user, push to login
        redirect('/auth/login');
      }
      // This part might not be reached due to redirect, but good practice.
      setLoading(false); 
    }
    checkAuthAndRedirect();
  }, []);

  // Display a loading splash screen while checking authentication
  if (loading) {
    return <LoadingSplash />;
  }

  return null;
}
