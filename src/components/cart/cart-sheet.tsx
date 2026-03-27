
'use client';

import { useContext, useState, useActionState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { CartContext, CartItem } from '@/context/cart-context';
import { inventoryItems } from '@/lib/data';
import { ShoppingCart, PlusCircle, Trash2, Plus, Minus } from 'lucide-react';
import { EmptyState } from '../layout/empty-state';
import Image from 'next/image';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';
import { submitRequest } from '@/lib/actions';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

function EmptyCart({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <EmptyState message="Your cart is empty." />
      <Button onClick={onBrowse} className="mt-6">
        <PlusCircle className="mr-2 h-4 w-4" />
        Add Items to Cart
      </Button>
    </div>
  );
}

function BrowseItems({ onBack }: { onBack: () => void }) {
    const { addItem } = useContext(CartContext);
    const { toast } = useToast();

    const handleAddItem = (item: CartItem) => {
        addItem(item);
        toast({
            title: "Added to Cart",
            description: `${item.name} has been added to your cart.`,
        });
    }

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="p-6 border-b">
        <SheetTitle className="font-headline">Browse & Add Items</SheetTitle>
        <SheetDescription className="font-sans">Select items from the catalog to add to your cart.</SheetDescription>
      </SheetHeader>
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-4 font-sans">
          {inventoryItems.filter(i => i.quantity > 0).map(item => (
            <div key={item.id} className="flex items-center gap-4">
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={64}
                height={64}
                className="rounded-md object-cover w-16 h-16"
              />
              <div className="flex-1">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.category}</p>
              </div>
              <Button size="icon" variant="outline" onClick={() => handleAddItem(item)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
      <SheetFooter className="p-6 border-t">
        <Button variant="outline" onClick={onBack}>
          Back to Cart
        </Button>
      </SheetFooter>
    </div>
  );
}

function SubmitRequestForm({ onSuccessfulSubmit }: { onSuccessfulSubmit: () => void }) {
    const { cart, clearCart } = useContext(CartContext);
    const { toast } = useToast();
    const initialState = { message: '', error: '' };
    const [state, formAction] = useActionState(submitRequest, initialState);

    useEffect(() => {
        if (state.message) {
            toast({
                title: "Success",
                description: state.message,
            });
            clearCart();
            onSuccessfulSubmit();
        } else if (state.error) {
            toast({
                title: "Error Submitting Request",
                description: state.error,
                variant: "destructive",
            });
        }
    }, [state, toast, clearCart, onSuccessfulSubmit]);

    if (cart.length === 0) return null;

    return (
        <form action={formAction} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="reasonForNeed">Reason for Request (Required)</Label>
                <Textarea
                    id="reasonForNeed"
                    name="reasonForNeed"
                    placeholder="e.g., I need this for the new Q4 project..."
                    required
                />
                 {cart.map(item => (
                    <input key={item.id} type="hidden" name="itemIds[]" value={item.id} />
                ))}
            </div>
            
            <Button type="submit" className="w-full">
                Submit Request for {cart.length} Item(s)
            </Button>
            
        </form>
    )
}

export function CartSheet() {
  const { cart, removeItem, updateQuantity } = useContext(CartContext);
  const [view, setView] = useState<'cart' | 'browse'>('cart');
  const [open, setOpen] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
        setView('cart');
    }
  }

  const handleSuccessfulSubmit = () => {
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <ShoppingCart className="mr-2 h-4 w-4" />
          View Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0">
        {view === 'cart' ? (
          <>
            <SheetHeader className="p-6">
              <SheetTitle className="font-headline">Your Cart</SheetTitle>
              <SheetDescription className="font-sans">Review and submit your item requests.</SheetDescription>
            </SheetHeader>
            {cart.length === 0 ? (
              <EmptyCart onBrowse={() => setView('browse')} />
            ) : (
              <div className="flex-1 flex flex-col">
                <ScrollArea className="flex-1">
                    <div className="px-6 space-y-4 font-sans">
                        {cart.map((item) => (
                            <div key={item.id} className="flex items-center gap-4">
                                <Image
                                    src={item.imageUrl}
                                    alt={item.name}
                                    width={64}
                                    height={64}
                                    className="rounded-md object-cover w-16 h-16"
                                />
                                <div className="flex-1">
                                    <p className="font-semibold">{item.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                                            <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                                        <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                                <Button size="icon" variant="ghost" onClick={() => removeItem(item.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <SheetFooter className="p-6 mt-auto border-t">
                    <div className="w-full space-y-4">
                        <SubmitRequestForm onSuccessfulSubmit={handleSuccessfulSubmit} />
                         <Separator />
                         <Button variant="outline" className="w-full" onClick={() => setView('browse')}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add More Items
                        </Button>
                    </div>
                </SheetFooter>
              </div>
            )}
          </>
        ) : (
          <BrowseItems onBack={() => setView('cart')} />
        )}
      </SheetContent>
    </Sheet>
  );
}