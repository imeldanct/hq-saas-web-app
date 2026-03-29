

'use client';

import { getAuthenticatedUser } from '@/lib/auth-client';
import { requests as initialRequests, users } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, isAfter, subDays } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User, ItemRequest } from '@/lib/types';
import { useEffect, useState, useActionState, useMemo, startTransition } from 'react';
import { approveRequest, declineRequest, returnItem, markRequestsAsRead } from '@/lib/actions';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Undo2 } from 'lucide-react';
import { EmptyState } from '@/components/layout/empty-state';
import { CartSheet } from '@/components/cart/cart-sheet';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Approved': return 'default';
    case 'Pending': return 'secondary';
    case 'Declined': return 'destructive';
    default: return 'outline';
  }
};

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) return `${names[0][0]}${names[names.length - 1][0]}`;
    return name.substring(0, 2);
};

function RequestDetailsDialog({ request, children }: { request: ItemRequest, children: React.ReactNode}) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-headline">Request Details</DialogTitle>
                    <DialogDescription className="font-sans">
                        Full details for the request of {request.item.name}.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 font-sans">
                    <div className="space-y-1">
                        <h4 className="font-semibold">Requester</h4>
                        <p className="text-sm">{request.user.name} ({request.user.email})</p>
                    </div>
                     <div className="space-y-1">
                        <h4 className="font-semibold">Department</h4>
                        <p className="text-sm text-muted-foreground">{request.department}</p>
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-semibold">Item</h4>
                        <p className="text-sm">{request.item.name}</p>
                    </div>
                     <div className="space-y-1">
                        <h4 className="font-semibold">Status</h4>
                        <div className="text-sm"><Badge variant={getStatusVariant(request.status)}>{request.status}</Badge></div>
                    </div>
                    <Separator />
                    <div className="space-y-1">
                        <h4 className="font-semibold">Intended Use Duration</h4>
                        <p className="text-sm text-muted-foreground">{request.intendedUseDuration}</p>
                    </div>
                     <div className="space-y-1">
                        <h4 className="font-semibold">Reason for Need</h4>
                        <p className="text-sm text-muted-foreground">{request.reasonForNeed}</p>
                    </div>
                    {request.status !== 'Pending' && (
                        <>
                            <Separator />
                            <div className="space-y-1">
                                <h4 className="font-semibold">Resolved By</h4>
                                <p className="text-sm">{request.resolvedBy}</p>
                            </div>
                             <div className="space-y-1">
                                <h4 className="font-semibold">Resolved Date</h4>
                                <p className="text-sm">{format(new Date(request.resolvedDate!), 'MMM d, yyyy')}</p>
                            </div>
                            {request.status === 'Declined' && request.declineReason && (
                                <div className="space-y-1">
                                    <h4 className="font-semibold">Reason for Decline</h4>
                                    <p className="text-sm text-muted-foreground">{request.declineReason}</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
                 <DialogFooter>
                    <DialogClose asChild>
                        <Button>Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

function DeclineRequestDialog({ requestId }: { requestId: string }) {
    const { toast } = useToast();
    const initialState = { message: '', error: '' };
    const [state, formAction] = useActionState(declineRequest, initialState);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (state.message) {
            toast({ title: "Success", description: state.message });
            setOpen(false);
            startTransition(() => {
                router.refresh();
            });
        } else if (state.error) {
            toast({ title: "Error", description: state.error, variant: 'destructive'});
        }
    }, [state, toast, router]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">Decline</Button>
            </DialogTrigger>
            <DialogContent>
                <form action={formAction}>
                    <DialogHeader>
                        <DialogTitle className="font-headline">Decline Request</DialogTitle>
                        <DialogDescription className="font-sans">
                            Please provide a reason for declining this request. This will be visible to the user.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2 font-sans">
                        <input type="hidden" name="requestId" value={requestId} />
                        <Label htmlFor="declineReason">Reason for Decline (Required)</Label>
                        <Textarea id="declineReason" name="declineReason" required />
                        {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Confirm Decline</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function ApproveRequestDialog({ requestId }: { requestId: string }) {
    const { toast } = useToast();
    const initialState = { message: '', error: '' };
    const [state, formAction] = useActionState(approveRequest, initialState);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (state?.message) {
            toast({ title: "Success", description: state.message });
            setOpen(false);
            startTransition(() => {
                router.refresh();
            });
        } else if (state?.error) {
            toast({ title: "Error", description: state.error, variant: 'destructive'});
        }
    }, [state, toast, router]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                 <Button size="sm">Approve</Button>
            </DialogTrigger>
            <DialogContent>
                <form action={formAction}>
                    <DialogHeader>
                        <DialogTitle className="font-headline">Approve Request</DialogTitle>
                        <DialogDescription className="font-sans">
                            You are about to approve this request. You can add an optional note below.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2 font-sans">
                        <input type="hidden" name="requestId" value={requestId} />
                        <Label htmlFor="approvalNote">Note (Optional)</Label>
                        <Textarea id="approvalNote" name="approvalNote" placeholder="e.g., Please pick up from IT office." />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Confirm Approval</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

const RequestsTable = ({ reqs, user, showResolver, showAssignedAdmin, showStatus = true, onReturnItem }: { reqs: ItemRequest[], user: User, showResolver?: boolean, showAssignedAdmin?: boolean, showStatus?: boolean, onReturnItem?: (itemId: string) => void }) => {
    
    const findAssignedAdmin = (category: string) => {
        return users.find(u => u.role === 'admin' && u.assignedCategories?.includes(category));
    };

    const { toast } = useToast();
    const initialState = { message: '', error: '' };
    const [returnState, returnAction] = useActionState(returnItem, initialState);
    const router = useRouter();

    useEffect(() => {
        if(returnState.message) {
            toast({ title: "Success", description: returnState.message });
            startTransition(() => {
                router.refresh();
            });
        } else if (returnState.error) {
            toast({ title: "Error", description: returnState.error, variant: 'destructive' });
        }
    }, [returnState, toast, router]);
    
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[25%] font-headline">Requester</TableHead>
                    <TableHead className="font-headline">Item</TableHead>
                    <TableHead className="w-[120px] font-headline">Date</TableHead>
                    {showStatus && <TableHead className="font-headline">Status</TableHead>}
                    {showAssignedAdmin && <TableHead className="w-[150px] font-headline">Category</TableHead>}
                    {showAssignedAdmin && <TableHead className="w-[150px] font-headline">Assigned To</TableHead>}
                    {showResolver && <TableHead className="font-headline">Resolved By</TableHead>}
                    {showResolver && <TableHead className="font-headline">Resolved Date</TableHead>}
                    <TableHead className="text-right font-headline">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {reqs.length > 0 ? reqs.map(req => {
                    const assignedAdmin = showAssignedAdmin ? findAssignedAdmin(req.item.category) : null;
                    return (
                        <TableRow key={req.id} className="font-sans">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={req.user.avatar} alt={req.user.name} />
                                        <AvatarFallback>{getInitials(req.user.name)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium truncate">{req.user.name}</div>
                                        <div className="text-sm text-muted-foreground truncate">{req.user.email}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{req.item.name}</TableCell>
                            <TableCell>{format(new Date(req.requestDate), 'MMM d, yyyy')}</TableCell>
                            {showStatus && <TableCell><Badge variant={getStatusVariant(req.status)}>{req.status}</Badge></TableCell>}
                            {showAssignedAdmin && <TableCell>{req.item.category}</TableCell>}
                            {showAssignedAdmin && <TableCell>{assignedAdmin?.name || 'N/A'}</TableCell>}
                            {showResolver && <TableCell>{req.resolvedBy || 'N/A'}</TableCell>}
                            {showResolver && <TableCell>{req.resolvedDate ? format(new Date(req.resolvedDate), 'MMM d, yyyy') : 'N/A'}</TableCell>}
                            <TableCell className="text-right">
                                {req.status === 'Pending' && (user.role === 'admin' || user.role === 'superAdmin') && (user.assignedCategories?.includes(req.item.category) || user.role === 'superAdmin') ? (
                                    <div className="flex gap-2 justify-end">
                                        <DeclineRequestDialog requestId={req.id} />
                                        <ApproveRequestDialog requestId={req.id} />
                                    </div>
                                ) : req.status === 'Approved' && req.userId === user.id ? (
                                    <form action={returnAction}>
                                        <input type="hidden" name="itemId" value={req.itemId} />
                                        <Button size="sm" variant="outline">
                                            <Undo2 className="mr-2 h-4 w-4" />
                                            Return Item
                                        </Button>
                                    </form>
                                ) : (
                                     <RequestDetailsDialog request={req}>
                                        <Button size="sm" variant="ghost">View Details</Button>
                                     </RequestDetailsDialog>
                                )}
                            </TableCell>
                        </TableRow>
                    )
                }) : (
                    <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                            <EmptyState message="No requests found." />
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default function RequestsPage() {
    const [user, setUser] = useState<User | null>(null);
    const [requests, setRequests] = useState(initialRequests);
    const router = useRouter();
    
    // This effect will re-fetch data on navigation, but a more robust solution
    // would involve real-time updates (e.g., websockets) or periodic refetching.
    useEffect(() => {
        async function loadUserAndData() {
            const authenticatedUser = await getAuthenticatedUser();
            setUser(authenticatedUser);
            setRequests(initialRequests);
            if (authenticatedUser) {
                // Once the page loads, mark the request notifications as read for the user.
                await markRequestsAsRead(authenticatedUser.id);
                 // We manually refresh the router here to ensure the notification count in the header updates.
                 router.refresh();
            }
        }
        loadUserAndData();
    }, [router]);

    const handleReturnItem = (itemId: string) => {
        // This is a client-side simulation. The server action will handle the real logic.
        console.log("Simulating return for item:", itemId);
    }
    
    if (!user) {
        return <div className="px-4 sm:px-6 lg:px-8 py-8"><p>Loading...</p></div>
    }

    const StaffView = () => {
        const myRequests = useMemo(() => requests.filter(r => r.userId === user.id), [requests, user.id]);
        const sevenDaysAgo = subDays(new Date(), 7);
        const recentRequests = useMemo(() => myRequests.filter(r => isAfter(new Date(r.requestDate), sevenDaysAgo)), [myRequests]);

        return (
             <div className="space-y-8">
                <Tabs defaultValue="my-requests">
                    <div className="space-y-4">
                         <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold font-headline">My Requests</h1>
                                <p className="text-muted-foreground font-sans">Track your item requests and view your activity.</p>
                            </div>
                             <div className="flex items-center gap-2">
                                 <CartSheet />
                                 <Button asChild>
                                    <Link href="/inventory/catalogue">Make a Request</Link>
                                 </Button>
                            </div>
                        </div>
                         <TabsList>
                            <TabsTrigger value="my-requests">All My Requests</TabsTrigger>
                            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                         </TabsList>
                    </div>
                    <TabsContent value="my-requests">
                         <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-xl">My Personal Requests</CardTitle>
                                <CardDescription className="font-sans">A log of all requests you have personally made.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <RequestsTable reqs={myRequests} user={user} showResolver onReturnItem={handleReturnItem} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="activity">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-xl">My Recent Activity</CardTitle>
                                <CardDescription className="font-sans">Your request activity from the last 7 days.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <RequestsTable reqs={recentRequests} user={user} onReturnItem={handleReturnItem}/>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        )
    };

    const AdminView = () => {
        // Guard against rendering before user data is available
        if (!user || !user.assignedCategories) {
            return null; // Or a loading indicator
        }
        
        const myRequests = useMemo(() => requests.filter(r => r.userId === user.id), [requests, user.id]);
        const receivedRequests = useMemo(() => requests.filter(r => r.status === 'Pending' && user.assignedCategories?.includes(r.item.category)), [requests, user.assignedCategories]);
        const history = useMemo(() => requests.filter(r => r.resolvedBy === user.name), [requests, user.name]);

        return (
            <div className="space-y-8">
                <Tabs defaultValue="pending">
                     <div className="space-y-4">
                         <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold font-headline">Manage Requests</h1>
                                <p className="text-muted-foreground font-sans">Manage incoming requests for your assigned categories.</p>
                            </div>
                             <div className="flex items-center gap-2">
                                 <CartSheet />
                                  <Button asChild>
                                    <Link href="/inventory/catalogue">Make a Request</Link>
                                 </Button>
                            </div>
                        </div>
                         <TabsList>
                            <TabsTrigger value="pending">Pending ({receivedRequests.length})</TabsTrigger>
                            <TabsTrigger value="history">My Resolved</TabsTrigger>
                            <TabsTrigger value="my-requests">My Requests</TabsTrigger>
                         </TabsList>
                    </div>
                     <TabsContent value="pending">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-xl">Pending Requests for My Categories</CardTitle>
                                <CardDescription className="font-sans">Approve or decline requests for items in categories you manage.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <RequestsTable reqs={receivedRequests} user={user} onReturnItem={handleReturnItem} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="history">
                         <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-xl">My Resolution History</CardTitle>
                                <CardDescription className="font-sans">A log of all requests you have personally approved or declined.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0"><RequestsTable reqs={history} user={user} showResolver onReturnItem={handleReturnItem} /></CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="my-requests">
                         <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-xl">My Personal Requests</CardTitle>
                                <CardDescription className="font-sans">A log of all requests you have personally made.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <RequestsTable reqs={myRequests} user={user} showResolver onReturnItem={handleReturnItem} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        );
    };

    const SuperAdminView = () => {
        const myRequests = useMemo(() => requests.filter(r => r.userId === user.id), [requests, user.id]);
        const allRequests = useMemo(() => requests, [requests]);
        const pendingRequests = useMemo(() => requests.filter(r => r.status === 'Pending'), [requests]);

        return (
            <div className="space-y-8">
                <Tabs defaultValue="pending">
                    <div className="space-y-4">
                         <div className="flex justify-between items-start">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold font-headline">Manage Requests</h1>
                                <p className="text-muted-foreground font-sans">View and manage all requests across the organization.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                 <CartSheet />
                                 <Button asChild>
                                    <Link href="/inventory/catalogue">Make a Request</Link>
                                 </Button>
                            </div>
                        </div>
                         <TabsList>
                            <TabsTrigger value="pending">All Pending ({pendingRequests.length})</TabsTrigger>
                            <TabsTrigger value="all">Complete History</TabsTrigger>
                            <TabsTrigger value="my-requests">My Requests</TabsTrigger>
                         </TabsList>
                    </div>
                     <TabsContent value="pending">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-xl">All Pending Requests</CardTitle>
                                <CardDescription className="font-sans">Approve or decline requests from any category.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="relative overflow-x-auto">
                                    <RequestsTable reqs={pendingRequests} user={user} showAssignedAdmin showStatus={false} onReturnItem={handleReturnItem} />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="all" className="space-y-8">
                         <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-xl">Complete Request History</CardTitle>
                                <CardDescription className="font-sans">View a log of every request made in the system.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0"><RequestsTable reqs={allRequests} user={user} showResolver onReturnItem={handleReturnItem} /></CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="my-requests">
                         <Card>
                            <CardHeader>
                                <CardTitle className="font-headline text-xl">My Personal Requests</CardTitle>
                                <CardDescription className="font-sans">A log of all requests you have personally made.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                <RequestsTable reqs={myRequests} user={user} showResolver onReturnItem={handleReturnItem} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        );
    };

    const renderView = () => {
        switch (user.role) {
            case 'staff':
                return <StaffView />;
            case 'admin':
                return <AdminView />;
            case 'superAdmin':
                return <SuperAdminView />;
            default:
                return <p>You do not have permission to view this page.</p>;
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            {renderView()}
        </div>
    );
}
