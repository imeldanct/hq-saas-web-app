
'use client';

import { getAuthenticatedUser } from '@/lib/auth-client';
import { users as initialUsers } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuGroup } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, UserPlus, Search, PlusCircle, MinusCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@/lib/types';
import { useEffect, useState, useActionState, useMemo, startTransition, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { inventoryItems } from '@/lib/data';
import { demoteUser, promoteUser, removeUser, inviteUser, assignCategories, type ActionState } from '@/lib/actions';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { EmptyState } from '@/components/layout/empty-state';
import { useRouter } from 'next/navigation';

const getRoleVariant = (role: string) => {
  switch (role) {
    case 'superAdmin': return 'default';
    case 'admin': return 'secondary';
    case 'staff': return 'outline';
    default: return 'outline';
  }
};

const getRoleDisplayName = (role: string) => {
    if (role === 'superAdmin') return 'Super Admin';
    return role.charAt(0).toUpperCase() + role.slice(1);
}

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) return `${names[0][0]}${names[names.length - 1][0]}`;
    return name.substring(0, 2);
};

function AssignCategoriesDialog({ user, children }: { user: User, children: React.ReactNode }) {
    const allCategories = [...new Set(inventoryItems.map(item => item.category))];
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const [state, formAction] = useActionState(assignCategories, { message: '', error: ''});

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formAction(formData);
    };

    useEffect(() => {
        if (state.error) {
            toast({ title: 'Error', description: state.error, variant: 'destructive'});
        } else if (state.message) {
            toast({ title: 'Success', description: state.message });
            setOpen(false);
            startTransition(() => {
                router.refresh();
            });
        }
    }, [state, toast, router]);


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-headline">Assign Categories to {user.name}</DialogTitle>
                    <DialogDescription className="font-sans">
                        Select the inventory categories this administrator will be responsible for.
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-4 py-4 font-sans" onSubmit={handleSubmit}>
                    <input type="hidden" name="userId" value={user.id} />
                    <div className="space-y-2">
                        {allCategories.map(category => (
                             <div key={category} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`${user.id}-${category}`}
                                    name="categories"
                                    value={category}
                                    defaultChecked={user.assignedCategories?.includes(category)}
                                />
                                <Label htmlFor={`${user.id}-${category}`}>{category}</Label>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function UserAction({ action, initialState, children }: { action: (state: any, payload: FormData) => Promise<any>, initialState: any, children: React.ReactNode }) {
    const { toast } = useToast();
    const router = useRouter();
    const [state, formAction] = useActionState(action, initialState);

    useEffect(() => {
        if (state?.message) {
            toast({ title: 'Success', description: state.message });
            startTransition(() => {
                router.refresh();
            });
        } else if (state?.error) {
            toast({ title: 'Error', description: state.error, variant: 'destructive' });
        }
    }, [state, toast, router]);

    return <form action={formAction}>{children}</form>;
}


function UserTableRow({ u, currentUser }: { u: User, currentUser: User }) {
    const initialState: ActionState = { message: '', error: '' };

    return (
        <TableRow className="font-sans">
            <TableCell>
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={u.avatar} alt={u.name} />
                        <AvatarFallback>{getInitials(u.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-sm text-muted-foreground">{u.email}</div>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <Badge variant={getRoleVariant(u.role)} className="capitalize">{getRoleDisplayName(u.role)}</Badge>
            </TableCell>
            <TableCell>
                {u.assignedCategories?.join(', ') || 'N/A'}
            </TableCell>
            <TableCell className="text-right">
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={u.id === currentUser.id || (currentUser.role !== 'superAdmin' && u.role === 'superAdmin')}>
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                            {u.role === 'staff' && (
                                <>
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Promote to Admin</DropdownMenuItem>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="font-headline">Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription className="font-sans">
                                                    This will grant {u.name} administrative privileges. They will be able to manage inventory stock and approve requests.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <UserAction action={promoteUser} initialState={initialState}>
                                                    <input type="hidden" name="userId" value={u.id} />
                                                    <input type="hidden" name="newRole" value="admin" />
                                                    <AlertDialogAction type="submit">Continue</AlertDialogAction>
                                                </UserAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Promote to Super Admin</DropdownMenuItem>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="font-headline">Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription className="font-sans">
                                                    This will grant {u.name} full system privileges, including personnel management. This action is highly sensitive.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <UserAction action={promoteUser} initialState={initialState}>
                                                    <input type="hidden" name="userId" value={u.id} />
                                                    <input type="hidden" name="newRole" value="superAdmin" />
                                                    <AlertDialogAction type="submit">Continue</AlertDialogAction>
                                                </UserAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </>
                            )}
                            {u.role === 'admin' && (
                                <>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                             <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Demote to Staff</DropdownMenuItem>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="font-headline">Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription className="font-sans">
                                                    This will revoke {u.name}'s administrative privileges. They will no longer be able to manage stock or approve requests.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <UserAction action={demoteUser} initialState={initialState}>
                                                    <input type="hidden" name="userId" value={u.id} />
                                                    <AlertDialogAction type="submit">Continue</AlertDialogAction>
                                                </UserAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Promote to Super Admin</DropdownMenuItem>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle className="font-headline">Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription className="font-sans">
                                                    This will grant {u.name} full system privileges, including personnel management. This action is highly sensitive.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                 <UserAction action={promoteUser} initialState={initialState}>
                                                    <input type="hidden" name="userId" value={u.id} />
                                                    <input type="hidden" name="newRole" value="superAdmin" />
                                                    <AlertDialogAction type="submit">Continue</AlertDialogAction>
                                                </UserAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </>
                            )}
                        </DropdownMenuGroup>
                        {u.role === 'admin' && (
                            <>
                            <DropdownMenuSeparator />
                             <AssignCategoriesDialog user={u}>
                                <div className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                   Assign Categories
                                </div>
                            </AssignCategoriesDialog>
                            </>
                        )}
                        <DropdownMenuSeparator />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">Remove User</DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="font-headline">Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription className="font-sans">
                                        This action cannot be undone. This will permanently remove {u.name} from the system.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <UserAction action={removeUser} initialState={initialState}>
                                        <input type="hidden" name="userId" value={u.id} />
                                        <AlertDialogAction type="submit">Continue</AlertDialogAction>
                                    </UserAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
        </TableRow>
    );
}

function InviteUserDialog() {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction] = useActionState(inviteUser, { message: '', error: '' });

    useEffect(() => {
        if (state.message) {
            toast({
                title: "Success",
                description: state.message,
            });
            formRef.current?.reset();
            setOpen(false);
        } else if (state.error) {
             toast({
                title: "Error",
                description: state.error,
                variant: "destructive",
            });
        }
    }, [state, toast]);

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            formRef.current?.reset();
        }
    };
    
    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Invite User
                </Button>
            </DialogTrigger>
            <DialogContent>
                 <DialogHeader>
                    <DialogTitle className="font-headline">Invite New Users</DialogTitle>
                    <DialogDescription className="font-sans">
                        Enter the email addresses of the users you want to invite. They will receive an email with instructions to sign up.
                    </DialogDescription>
                </DialogHeader>
                <form ref={formRef} action={formAction} className="space-y-4 py-4 font-sans">
                    <div className="space-y-2">
                        <Label htmlFor="emails">Email Addresses</Label>
                        <Input id="emails" name="emails" placeholder="name@osoft.com" required/>
                        <p className="text-xs text-muted-foreground">You can add multiple emails separated by commas.</p>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="ghost">Cancel</Button></DialogClose>
                        <Button type="submit">Send Invite(s)</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}


export default function PersonnelPage() {
    const [user, setUser] = useState<User | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState<User[]>(initialUsers);
    const router = useRouter();

    useEffect(() => {
        async function loadUser() {
            const authenticatedUser = await getAuthenticatedUser();
            setUser(authenticatedUser);
            // This is a mock way to "refetch" data.
            // In a real app, this would be handled by a proper data fetching library.
            setUsers(initialUsers);
        }
        loadUser();
    }, [router]);

    const filteredUsers = useMemo(() => {
        const roleOrder: { [key in User['role']]: number } = { superAdmin: 0, admin: 1, staff: 2 };
        const sortedUsers = [...users].sort((a, b) => roleOrder[a.role] - roleOrder[b.role]);
        
        if (!searchQuery) {
            return sortedUsers;
        }
        return sortedUsers.filter(u =>
            u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, users]);

    if (!user) {
         return (
            <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold font-headline">Personnel Management</h1>
                </div>
                <Card><CardContent className="p-0"><Table><TableBody><TableRow><TableCell className="h-24 text-center">Loading...</TableCell></TableRow></TableBody></Table></CardContent></Card>
            </div>
        )
    }

    if (user?.role !== 'superAdmin') {
        return (
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                <Card className="text-center p-8">
                    <CardTitle className="font-headline text-2xl">Access Denied</CardTitle>
                    <CardDescription className="mt-2 font-sans">You do not have permission to view the personnel page.</CardDescription>
                </Card>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-4">
            <div className="space-y-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold font-headline">Personnel Management</h1>
                    <p className="text-muted-foreground font-sans">Promote, demote, and manage user roles and permissions.</p>
                </div>
                <div className="flex justify-between items-center gap-4">
                    <div className="relative w-full md:max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search by name or email..." 
                            className="pl-9" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {user.role === 'superAdmin' && <InviteUserDialog />}
                </div>
            </div>
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-headline">User</TableHead>
                                <TableHead className="font-headline">Role</TableHead>
                                <TableHead className="font-headline">Assigned Categories</TableHead>
                                <TableHead className="text-right font-headline">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length > 0 ? filteredUsers.map(u => (
                               <UserTableRow key={u.id} u={u} currentUser={user} />
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                       <EmptyState message="No users found." />
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
