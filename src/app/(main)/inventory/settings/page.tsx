
'use client';

import { getAuthenticatedUser } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { useEffect, useState, useRef, useActionState, startTransition } from "react";
import type { User } from "@/lib/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { changePassword, updateProfile, type PasswordChangeState } from "@/lib/actions";
import { passwordSchema } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useRouter } from 'next/navigation';

const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) return `${names[0][0]}${names[names.length - 1][0]}`;
    return name.substring(0, 2);
};

type PasswordFormData = z.infer<typeof passwordSchema>;

function ChangePasswordForm() {
    const { toast } = useToast();
    const initialState: PasswordChangeState = { message: '', errors: undefined };
    const [state, formAction] = useActionState(changePassword, initialState);
    const formRef = useRef<HTMLFormElement>(null);

    const form = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        if (state?.message) {
            toast({
                title: "Success",
                description: state.message,
            });
            form.reset();
        } else if (state?.errors?.fieldErrors) {
            if (state.errors.fieldErrors.currentPassword) form.setError("currentPassword", { type: "server", message: state.errors.fieldErrors.currentPassword[0] });
            if (state.errors.fieldErrors.newPassword) form.setError("newPassword", { type: "server", message: state.errors.fieldErrors.newPassword[0] });
            if (state.errors.fieldErrors.confirmPassword) form.setError("confirmPassword", { type: "server", message: state.errors.fieldErrors.confirmPassword[0] });
        }
    }, [state, toast, form]);
    
    return (
        <Form {...form}>
            <form 
                ref={formRef} 
                action={formAction}
                onSubmit={form.handleSubmit(() => formRef.current?.submit())} 
                className="space-y-4"
            >
                {state?.errors?.formErrors && state.errors.formErrors.length > 0 && (
                    <Alert variant="destructive">
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{state.errors.formErrors.join(', ')}</AlertDescription>
                    </Alert>
                )}
                 <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Saving...' : 'Update Password'}
                </Button>
            </form>
        </Form>
    )
}

export default function SettingsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        async function loadUser() {
            const authenticatedUser = await getAuthenticatedUser();
            setUser(authenticatedUser);
            if (authenticatedUser) {
                setAvatarPreview(authenticatedUser.avatar);
            }
        }
        loadUser();
    }, []);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
     const handleProfileUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!user) return;

        const formData = new FormData(event.currentTarget);
        formData.append('userId', user.id);
        if (avatarPreview && avatarPreview !== user.avatar) {
             formData.append('avatar', avatarPreview);
        }

        const result = await updateProfile(formData);

        if (result.error) {
            toast({ title: 'Error', description: result.error, variant: 'destructive'});
        } else {
            toast({ title: 'Success', description: result.message });
            startTransition(() => {
                router.refresh();
            });
        }
    };

    if (!user) {
        // You can render a loading skeleton here
        return (
            <div className="max-w-2xl mx-auto py-8 space-y-8 px-4 sm:px-6 lg:px-8">
                 <div className="space-y-2">
                    <h1 className="text-3xl font-bold font-headline">Account Settings</h1>
                    <p className="text-muted-foreground font-sans">Update your display name and password.</p>
                </div>
                <Card>
                    <CardHeader><div className="h-8 w-48 bg-muted rounded-md animate-pulse" /></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="h-10 w-full bg-muted rounded-md animate-pulse" />
                        <div className="h-10 w-full bg-muted rounded-md animate-pulse" />
                        <div className="h-10 w-24 bg-muted rounded-md animate-pulse" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8 space-y-8 px-4 sm:px-6 lg:px-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold font-headline">Account Settings</h1>
                <p className="text-muted-foreground font-sans">Update your display name, password, and profile picture.</p>
            </div>
            
            <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                     <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={avatarPreview || user.avatar} alt={user.name} />
                            <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <Pencil className="h-6 w-6 text-white" />
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/png, image/jpeg, image/gif"
                            name="avatarFile"
                        />
                    </div>
                    <div>
                        <CardTitle className="font-headline text-xl">{user.name}</CardTitle>
                        <CardDescription className="font-sans">View and edit your personal information.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 font-sans">
                    <form onSubmit={handleProfileUpdate}>
                        <div className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="email">Email (View-only)</Label>
                                <Input id="email" value={user.email} disabled />
                                <p className="text-xs text-muted-foreground">Your email address cannot be changed.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="displayName">Display Name</Label>
                                <Input id="displayName" name="displayName" defaultValue={user.name} />
                            </div>
                        </div>
                        <Button className="mt-6 w-full sm:w-auto">Save Profile Changes</Button>
                    </form>

                    <Card className="bg-secondary/50">
                        <CardHeader>
                            <CardTitle className="font-headline text-lg">Change Password</CardTitle>
                        </CardHeader>
                        <CardContent className="font-sans">
                           <ChangePasswordForm />
                        </CardContent>
                    </Card>

                </CardContent>
            </Card>
        </div>
    );
}
