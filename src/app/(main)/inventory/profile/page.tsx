
'use client';

import { getAuthenticatedUser } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import type { User, InventoryItem, ItemRequest } from "@/lib/types";
import { inventoryItems, requests } from "@/lib/data";
import { Box, CheckCircle2, Clock, XCircle, Hourglass } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";

const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) return `${names[0][0]}${names[names.length - 1][0]}`;
    return name.substring(0, 2);
};

const getRoleDisplayName = (role: string) => {
    if (role === 'superAdmin') return 'Super Admin';
    return role.charAt(0).toUpperCase() + role.slice(1);
}

const RequestStatusIcon = ({ status }: { status: ItemRequest['status']}) => {
    switch(status) {
        case 'Approved': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
        case 'Pending': return <Hourglass className="h-4 w-4 text-yellow-500" />;
        case 'Declined': return <XCircle className="h-4 w-4 text-red-500" />;
        default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
}

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [assignedItems, setAssignedItems] = useState<InventoryItem[]>([]);
    const [myRequests, setMyRequests] = useState<ItemRequest[]>([]);

    useEffect(() => {
        async function loadData() {
            const authenticatedUser = await getAuthenticatedUser();
            setUser(authenticatedUser);
            if (authenticatedUser) {
                setAssignedItems(inventoryItems.filter(item => item.assignedTo === authenticatedUser.id));
                setMyRequests(requests.filter(req => req.userId === authenticatedUser.id).slice(0, 5));
            }
        }
        loadData();
    }, []);
    
    if (!user) {
        // You can render a loading skeleton here
        return (
            <div className="max-w-6xl mx-auto py-8 space-y-8 px-4 sm:px-6 lg:px-8">
                 <div className="space-y-2">
                    <h1 className="text-3xl font-bold font-headline">My HQ</h1>
                </div>
                 <div className="h-48 w-full bg-muted rounded-md animate-pulse" />
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="h-64 w-full bg-muted rounded-md animate-pulse" />
                    <div className="h-64 w-full bg-muted rounded-md animate-pulse" />
                 </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-8 space-y-8 px-4 sm:px-6 lg:px-8">
            <Card className="overflow-hidden">
                 <CardHeader className="bg-secondary/30 flex-row items-center gap-6 p-6">
                    <Avatar className="h-24 w-24 border-2 border-primary">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-4xl">{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <CardTitle className="font-headline text-3xl">{user.name}</CardTitle>
                        <CardDescription className="text-base font-sans">{user.email}</CardDescription>
                        <CardDescription className="text-sm capitalize pt-1 font-sans">Role: {getRoleDisplayName(user.role)}</CardDescription>
                    </div>
                </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl flex items-center gap-2">
                           <Box /> My Assigned Items
                        </CardTitle>
                        <CardDescription className="font-sans">Items currently checked out to you.</CardDescription>
                    </CardHeader>
                    <CardContent className="font-sans">
                        {assignedItems.length > 0 ? (
                            <ul className="space-y-4">
                                {assignedItems.map(item => (
                                    <li key={item.id} className="flex items-center gap-4">
                                        <Image src={item.imageUrl} alt={item.name} width={64} height={64} className="rounded-md object-cover h-16 w-16" />
                                        <div>
                                            <p className="font-semibold">{item.name}</p>
                                            {item.assignedSince && (
                                                <p className="text-xs text-muted-foreground">Assigned on {format(new Date(item.assignedSince), 'MMM d, yyyy')}</p>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-8">You have no items assigned to you.</p>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-xl flex items-center gap-2">
                           <Clock /> Recent Requests
                        </CardTitle>
                        <CardDescription className="font-sans">Your last 5 item requests.</CardDescription>
                    </CardHeader>
                    <CardContent className="font-sans">
                         {myRequests.length > 0 ? (
                            <ul className="space-y-4">
                                {myRequests.map(req => (
                                    <li key={req.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <RequestStatusIcon status={req.status} />
                                            <div>
                                                <p className="font-semibold">{req.item.name}</p>
                                                <p className="text-xs text-muted-foreground">{format(new Date(req.requestDate), 'MMM d, yyyy')}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium">{req.status}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                           <p className="text-sm text-muted-foreground text-center py-8">You haven't made any requests yet.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
