

'use client';

import { getAuthenticatedUser } from '@/lib/auth-client';
import { inventoryItems as initialInventoryItems } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, History, Search } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useMemo, startTransition } from 'react';
import type { InventoryItem, User, InventoryLogEntry } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { createOrUpdateItem, deleteItem } from '@/lib/actions';

const getStatusVariant = (quantity: number) => {
  return quantity > 0 ? 'default' : 'destructive';
};
const getStatusText = (quantity: number) => {
  return quantity > 0 ? 'Available' : 'Unavailable';
};

function LogDialog({ item, open, onOpenChange }: { item: InventoryItem, open: boolean, onOpenChange: (open: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">Activity Log: {item.name}</DialogTitle>
                    <DialogDescription className="font-sans">
                        A complete history of all changes made to this item.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-headline">Date</TableHead>
                                <TableHead className="font-headline">Action</TableHead>
                                <TableHead className="font-headline">Admin</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {item.logs && item.logs.length > 0 ? (
                                [...item.logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((log, index) => (
                                    <TableRow key={index} className="font-sans">
                                        <TableCell>{format(new Date(log.date), 'MMM d, yyyy, h:mm a')}</TableCell>
                                        <TableCell><Badge variant={log.action === 'Deleted' ? 'destructive' : 'secondary'}>{log.action}</Badge></TableCell>
                                        <TableCell>{log.adminName}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center font-sans">No activity logged for this item yet.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function ItemForm({ item, onSave, allCategories, open, onOpenChange }: { item?: InventoryItem | null, onSave: (formData: FormData) => Promise<{ message?: string; error?: string; }>, allCategories: string[], open: boolean, onOpenChange: (open: boolean) => void }) {
    const { toast } = useToast();
    const router = useRouter();
    
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [imageUrl, setImageUrl] = useState('');
    const [category, setCategory] = useState('');
    const [newCategory, setNewCategory] = useState('');

    const isEditing = !!item;

    useEffect(() => {
        if (open) {
            setName(item?.name || '');
            setQuantity(item?.quantity || 0);
            setImageUrl(item?.imageUrl || `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/600/400`);
            setCategory(item?.category || '');
            setNewCategory('');
        }
    }, [open, item]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const finalCategory = category === 'new-category' ? newCategory : category;

        if (!name || !finalCategory) {
            toast({ title: 'Error', description: 'Please fill out all required fields.', variant: 'destructive' });
            return;
        }
        
        const formData = new FormData();
        if (isEditing) formData.append('id', item.id);
        formData.append('name', name);
        formData.append('quantity', String(quantity));
        formData.append('category', finalCategory);
        formData.append('imageUrl', imageUrl);

        const result = await onSave(formData);
        
        if (result.error) {
            toast({ title: 'Error', description: result.error, variant: 'destructive' });
        } else {
            toast({ title: 'Success', description: result.message });
            onOpenChange(false);
            startTransition(() => {
                router.refresh();
            });
        }
    };
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl">{isEditing ? 'Edit Item' : 'Add New Item'}</DialogTitle>
                        <DialogDescription className="font-sans">
                            {isEditing ? `Update the details for ${item.name}.` : 'Fill in the details for the new inventory item.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4 font-sans">
                        <div className="space-y-2">
                            <Label htmlFor="item-name">Item Name</Label>
                            <Input id="item-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., MacBook Pro 16&quot;" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="item-quantity">Quantity</Label>
                            <Input id="item-quantity" type="number" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10))} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="item-category">Category</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger id="item-category">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                    <SelectItem value="new-category">Add New Category...</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {category === 'new-category' && (
                            <div className="space-y-2 pl-2">
                                <Label htmlFor="new-category-name">New Category Name</Label>
                                <Input id="new-category-name" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Enter new category" />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="item-image-url">Image URL</Label>
                            <Input id="item-image-url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.png" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit">{isEditing ? 'Save Changes' : 'Create Item'}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function ItemRow({ item, onSave, allCategories, onDelete }: { item: InventoryItem, onSave: (formData: FormData) => Promise<{ message?: string; error?: string; }>, allCategories: string[], onDelete: (formData: FormData) => Promise<{ message?: string; error?: string; }> }) {
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);
    const [isLogDialogOpen, setLogDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleDelete = async () => {
        const formData = new FormData();
        formData.append('itemId', item.id);
        const result = await onDelete(formData);

        if (result.error) {
            toast({ title: 'Error', description: result.error, variant: 'destructive'});
        } else {
            toast({ title: 'Success', description: result.message });
            setDeleteDialogOpen(false);
            startTransition(() => {
                router.refresh();
            });
        }
    }

    return (
        <TableRow className="font-sans">
            <TableCell>
                <div className="flex items-center gap-3">
                    <Image src={item.imageUrl} alt={item.name} width={40} height={40} data-ai-hint={item['data-ai-hint']} className="rounded-md object-cover" />
                    <span className="font-medium">{item.name}</span>
                </div>
            </TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell><Badge variant={getStatusVariant(item.quantity)}>{getStatusText(item.quantity)}</Badge></TableCell>
            <TableCell>{item.quantity}</TableCell>
            <TableCell className="text-right">
                <ItemForm item={item} onSave={onSave} allCategories={allCategories} open={isEditDialogOpen} onOpenChange={setEditDialogOpen} />
                <LogDialog item={item} open={isLogDialogOpen} onOpenChange={setLogDialogOpen} />

                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => setEditDialogOpen(true)}>
                                Edit
                            </DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                                 <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                                    Delete
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onSelect={() => setLogDialogOpen(true)} className="flex items-center gap-2">
                                <History className="h-4 w-4" />
                                Log
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="font-headline">Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription className="font-sans">
                                This action cannot be undone. This will permanently delete the item
                                <span className="font-semibold"> {item.name}</span> from the inventory.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </TableCell>
        </TableRow>
    );
}

export default function StockPage() {
    const [user, setUser] = useState<User | null>(null);
    const [inventoryItems, setInventoryItems] = useState(initialInventoryItems);
    const [allCategories, setAllCategories] = useState([...new Set(initialInventoryItems.map(item => item.category))]);
    const [isAddFormOpen, setAddFormOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();
    
    useEffect(() => {
        async function loadUser() {
            const authenticatedUser = await getAuthenticatedUser();
            setUser(authenticatedUser);
        }
        loadUser();
        setInventoryItems(initialInventoryItems);
        setAllCategories([...new Set(initialInventoryItems.map(item => item.category))]);
    }, [router]);


    const handleSaveItem = async (formData: FormData) => {
        return createOrUpdateItem(formData);
    };

    const handleDeleteItem = async (formData: FormData) => {
       return deleteItem(formData);
    }

    const filteredItems = useMemo(() => {
        if (!user) return [];

        let itemsForRole = user.role === 'superAdmin'
            ? inventoryItems
            : inventoryItems.filter(item => user.assignedCategories?.includes(item.category));
        
        if (searchQuery) {
            itemsForRole = itemsForRole.filter(item =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        
        return [...itemsForRole].sort((a, b) => a.category.localeCompare(b.category));
    }, [searchQuery, inventoryItems, user]);


    if (!user) {
        return (
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                <p>Loading...</p>
            </div>
        )
    }
    
    if (user?.role !== 'admin' && user?.role !== 'superAdmin') {
        return (
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                 <Card className="text-center p-8">
                    <h1 className="font-headline text-2xl font-bold">Access Denied</h1>
                    <p className="mt-2 text-muted-foreground font-sans">You do not have permission to view the stock page.</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-8">
             <div className="space-y-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold font-headline">Inventory Stock</h1>
                    <p className="text-muted-foreground font-sans">Manage, add, and edit inventory items.</p>
                </div>
                <div className="flex justify-between items-center gap-4">
                    <div className="relative w-full md:max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search by item or category..." 
                            className="pl-9" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => setAddFormOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Item
                    </Button>
                    <ItemForm onSave={handleSaveItem} allCategories={allCategories} open={isAddFormOpen} onOpenChange={setAddFormOpen} />
                </div>
            </div>
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-headline">Item</TableHead>
                                <TableHead className="font-headline">Category</TableHead>
                                <TableHead className="font-headline">Status</TableHead>
                                <TableHead className="font-headline">Quantity</TableHead>
                                <TableHead className="text-right font-headline">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredItems.length > 0 ? filteredItems.map(item => (
                                <ItemRow
                                    key={item.id}
                                    item={item}
                                    onSave={handleSaveItem}
                                    allCategories={allCategories}
                                    onDelete={handleDeleteItem}
                                />
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center font-sans">No stock items found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
