

'use client';

import Image from "next/image";
import { PlusCircle, Search, ShoppingCart, User, Calendar, Tag, Package, Hash } from "lucide-react";
import { useState, useEffect, useContext, useActionState } from "react";

import { inventoryItems as initialInventoryItems, departments } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { InventoryItem, User as UserType } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogClose, DialogFooter } from "@/components/ui/dialog";
import { users } from "@/lib/data";
import { format } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getAuthenticatedUser } from "@/lib/auth-client";
import { CartContext } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitRequest } from "@/lib/actions";

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) return `${names[0][0]}${names[names.length - 1][0]}`;
    return name.substring(0, 2);
};

function DirectRequestDialog({ item, children }: { item: InventoryItem, children: React.ReactNode }) {
    const { toast } = useToast();
    const initialState = { message: '', error: '' };
    const [state, formAction] = useActionState(submitRequest, initialState);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (state.message) {
            toast({
                title: "Success",
                description: state.message,
            });
            setOpen(false);
        } else if (state.error) {
            toast({
                title: "Error Submitting Request",
                description: state.error,
                variant: "destructive",
            });
        }
    }, [state, toast]);
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>{children}</DialogTrigger>
            <DialogContent onPointerDownOutside={(e) => e.preventDefault()} onClick={(e) => e.stopPropagation()}>
                <form action={formAction}>
                    <DialogHeader>
                        <DialogTitle className="font-headline">Request: {item.name}</DialogTitle>
                        <DialogDescription className="font-sans">
                            Please provide details for requesting this item.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4 font-sans">
                        <input type="hidden" name="itemIds[]" value={item.id} />

                         <div className="space-y-2">
                            <Label htmlFor="department">Department</Label>
                            <Select name="department" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departments.map(dept => (
                                        <SelectItem key={dept.name} value={dept.name}>{dept.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="intendedUseDuration">Intended Use Duration</Label>
                            <Input id="intendedUseDuration" name="intendedUseDuration" placeholder="e.g., 3 months, For Q4 Project" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reasonForNeed">Reason for Request (Required)</Label>
                            <Textarea
                                id="reasonForNeed"
                                name="reasonForNeed"
                                placeholder="e.g., I need this for the new Q4 project..."
                                required
                            />
                        </div>

                         {state?.error && <p className="text-sm text-destructive font-sans pt-2">{state.error}</p>}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Submit Request</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function ItemCard({ item }: { item: InventoryItem }) {
  const { addItem } = useContext(CartContext);
  const { toast } = useToast();

  const status = item.quantity > 0 ? 'Available' : 'Unavailable';
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Available':
        return 'default';
      case 'Unavailable':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(item);
    toast({
        title: "Added to Cart",
        description: `${item.name} has been added to your cart.`,
    });
  }

  const assignedUser = item.assignedTo ? users.find(u => u.id === item.assignedTo) : null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="flex flex-col transition-all duration-300 hover:shadow-xl cursor-pointer">
          <CardHeader className="p-0">
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={600}
              height={400}
              data-ai-hint={item['data-ai-hint']}
              className="aspect-video w-full rounded-t-lg object-cover"
            />
          </CardHeader>
          <CardContent className="flex-1 p-4">
            <div className="flex justify-between items-start">
                <CardTitle className="font-headline text-lg leading-tight mb-2">{item.name}</CardTitle>
                <Badge variant={getStatusVariant(status)}>{status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground font-sans">{item.category}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex gap-2">
            <DirectRequestDialog item={item}>
                <Button className="w-full" disabled={status !== 'Available'}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Request
                </Button>
            </DirectRequestDialog>
            <Button variant="outline" className="w-full" disabled={status !== 'Available'} onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
          </CardFooter>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">{item.name}</DialogTitle>
          <DialogDescription className="font-sans">
            Detailed information about the inventory item.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 font-sans">
             <Image
              src={item.imageUrl}
              alt={item.name}
              width={600}
              height={400}
              data-ai-hint={item['data-ai-hint']}
              className="aspect-video w-full rounded-lg object-cover"
            />
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>Status: <Badge variant={getStatusVariant(status)}>{status}</Badge></span>
                </div>
                <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span>Quantity: {item.quantity}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span>Category: {item.category}</span>
                </div>
            </div>
            {assignedUser && (
                <Card className="bg-secondary/50">
                    <CardHeader>
                        <CardTitle className="text-base font-semibold flex items-center gap-2 font-headline">
                            <User className="h-4 w-4" />
                            Currently Assigned To
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src={assignedUser.avatar} alt={assignedUser.name} />
                            <AvatarFallback>{getInitials(assignedUser.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{assignedUser.name}</p>
                            <p className="text-xs text-muted-foreground">{assignedUser.email}</p>
                            {item.assignedSince && (
                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                                    <Calendar className="h-3 w-3" />
                                    Since {format(new Date(item.assignedSince), 'MMM d, yyyy')}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function CataloguePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(initialInventoryItems);
  const [welcomeMessage, setWelcomeMessage] = useState("Welcome");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    async function loadUser() {
        const authenticatedUser = await getAuthenticatedUser();
        setUser(authenticatedUser);

        if (authenticatedUser) {
            const firstName = authenticatedUser.name.split(' ')[0];
            const currentHour = new Date().getHours();
            let greeting = "Welcome";

            if (currentHour < 12) {
                greeting = "Good Morning";
            } else if (currentHour < 18) {
                greeting = "Good Afternoon";
            } else {
                greeting = "Good Evening";
            }
            setWelcomeMessage(`${greeting}, ${firstName}`);
        }
    }
    loadUser();
  }, []);
  
  const categories = [...new Set(initialInventoryItems.map(item => item.category))];

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-headline">{welcomeMessage}</h1>
          <p className="text-muted-foreground font-sans">Browse and request items from the inventory.</p>
        </div>
        <div className="flex flex-col md:flex-row w-full gap-2 font-sans">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search items..." 
              className="pl-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[240px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map(item => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}


