import type { Metadata } from 'next';
import { PT_Sans, Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'HQ: Inventory & Onboarding',
  description: 'Your guide to Osoft + your inventory in one place.',
};

const fontSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sans",
})

const fontHeading = Poppins({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-heading',
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={cn(
        "font-sans antialiased",
        fontSans.variable,
        fontHeading.variable
      )}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
