
import Link from "next/link";
import { login } from "@/lib/actions";
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
import { Separator } from "@/components/ui/separator";
import { GoogleSignInButton } from "@/components/auth/google-signin-button";

export default function LoginPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
            <Logo />
        </div>
        <CardTitle className="font-headline text-2xl">Sign In</CardTitle>
        <CardDescription>
            Enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={login} className="space-y-4 font-sans">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="name@osoft.com" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Sign In
            </Button>
        </form>
        <Separator className="my-6" />
        <div className="space-y-4">
            <GoogleSignInButton />
        </div>
      </CardContent>
      <div className="p-6 pt-4 text-center text-sm text-muted-foreground font-sans">
        Don&apos;t have an account?{" "}
        <Link href="/auth/signup" className="font-medium text-primary hover:underline">
            Sign Up
        </Link>
      </div>
    </Card>
  );
}
