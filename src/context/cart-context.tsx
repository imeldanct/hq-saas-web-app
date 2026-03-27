
'use client';

import React, { createContext, useState } from 'react';
import type { InventoryItem } from '@/lib/types';
import { inventoryItems } from '@/lib/data';

export interface CartItem extends InventoryItem {
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addItem: (item: InventoryItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setCartOpen: (isOpen: boolean) => void;
  browseMode: boolean;
  setBrowseMode: (isBrowsing: boolean) => void;
  openCart: (browse?: boolean) => void;
}

export const CartContext = createContext<CartContextType>({
  cart: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  isCartOpen: false,
  setCartOpen: () => {},
  browseMode: false,
  setBrowseMode: () => {},
  openCart: () => {},
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [browseMode, setBrowseMode] = useState(false);

  const openCart = (browse = false) => {
    setBrowseMode(browse);
    setCartOpen(true);
  }

  const addItem = (item: InventoryItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        // If item exists, increase its quantity
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      // If item doesn't exist, add it to the cart with quantity 1
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    const itemInStock = inventoryItems.find(i => i.id === itemId);
    if(itemInStock && quantity > itemInStock.quantity) {
        // Maybe show a toast message
        return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{ cart, addItem, removeItem, updateQuantity, clearCart, isCartOpen, setCartOpen, browseMode, setBrowseMode, openCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
