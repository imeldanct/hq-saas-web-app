
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/layout/logo';

export default function SuccessPage() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/inventory/catalogue');
        }, 3000); 

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <Logo />
                </div>
            </CardHeader>
            <CardContent className="text-center space-y-4">
                <CheckCircle2 className="h-16 w-16 mx-auto text-green-500" />
                <CardTitle className="font-headline text-2xl">Success!</CardTitle>
                <p className="text-muted-foreground font-sans">
                    Your account has been created. Redirecting you to the dashboard...
                </p>
            </CardContent>
        </Card>
    );
}
