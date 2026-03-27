
import { Header } from '@/components/layout/header';
import { getAuthenticatedUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CartProvider } from '@/context/cart-context';
import { NotificationProvider } from '@/context/notification-context';

export default async function MainAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();
  if (!user) {
    redirect('/auth/login');
  }

  return (
    <NotificationProvider user={user}>
      <CartProvider>
        <div className="flex min-h-screen flex-col bg-background">
          <Header />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </CartProvider>
    </NotificationProvider>
  );
}
