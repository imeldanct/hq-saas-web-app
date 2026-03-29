
'use client';

import { Suspense } from 'react';
import { verifyOtp } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/layout/logo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function VerificationForm({ error }: { error?: string }) {
    const { toast } = useToast();

    const handleResend = () => {
        // In a real app, this would trigger a server action to resend the OTP
        console.log("(Simulation) Resending OTP...");
        toast({
            title: "Code Sent",
            description: "A new verification code has been sent to your email.",
        });
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                <Logo />
                </div>
                <CardTitle className="font-headline text-2xl">Check your email</CardTitle>
                <CardDescription>
                    We've sent a 4-digit code to your email address. For this prototype, any 4-digit number will work.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle className="font-headline">Error</AlertTitle>
                        <AlertDescription className="font-sans">{error}</AlertDescription>
                    </Alert>
                )}
                <form action={verifyOtp} className="space-y-4 font-sans">
                    <div className="space-y-2">
                        <Label htmlFor="otp">Verification Code</Label>
                        <Input
                            id="otp"
                            name="otp"
                            type="text"
                            maxLength={4}
                            placeholder="_ _ _ _"
                            required
                            className="text-center text-2xl tracking-[1.5em]"
                        />
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        Verify
                    </Button>
                </form>
                <div className="mt-4 text-center text-sm font-sans">
                    <p className="text-muted-foreground">
                        Didn&apos;t receive a code?{' '}
                        <button onClick={handleResend} className="font-medium text-primary hover:underline">
                            Resend
                        </button>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export default function VerifyPage({ searchParams }: { searchParams: { error?: string }}) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <VerificationForm error={searchParams.error} />
      </Suspense>
    );
}
