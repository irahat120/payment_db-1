'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string | null;
  category: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  itemCount: number;
  total: number;
}

interface CartAction {
  type: string;
  payload?: any;
}

const initialState: CartState = {
  items: [],
  itemCount: 0,
  total: 0,
};

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}>({
  state: initialState,
  dispatch: () => {},
});

// Cart Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'INITIALIZE_CART': {
      const items = action.payload;
      const itemCount = items.reduce((count: number, item: CartItem) => count + item.quantity, 0);
      const total = items.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
      
      return {
        ...state,
        items,
        itemCount,
        total
      };
    }
    
    case 'ADD_ITEM': {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(item => item.id === newItem.id);
      
      let updatedItems;
      if (existingItemIndex !== -1) {
        updatedItems = state.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        updatedItems = [...state.items, { ...newItem, quantity: 1 }];
      }
      
      const itemCount = updatedItems.reduce((count: number, item: CartItem) => count + item.quantity, 0);
      const total = updatedItems.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      
      return {
        ...state,
        items: updatedItems,
        itemCount,
        total
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity < 1) return state; // Don't allow quantities less than 1
      
      const updatedItems = state.items.map(item => 
        item.id === id ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0); // Remove items with 0 quantity
      
      const itemCount = updatedItems.reduce((count: number, item: CartItem) => count + item.quantity, 0);
      const total = updatedItems.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      
      return {
        ...state,
        items: updatedItems,
        itemCount,
        total
      };
    }
    
    case 'REMOVE_ITEM': {
      const id = action.payload;
      const updatedItems = state.items.filter(item => item.id !== id);
      
      const itemCount = updatedItems.reduce((count: number, item: CartItem) => count + item.quantity, 0);
      const total = updatedItems.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0);
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      
      return {
        ...state,
        items: updatedItems,
        itemCount,
        total
      };
    }
    
    case 'CLEAR_CART': {
      localStorage.removeItem('cart');
      return {
        ...state,
        items: [],
        itemCount: 0,
        total: 0
      };
    }
    
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Initialize cart from localStorage on mount
  React.useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      const items = JSON.parse(storedCart);
      dispatch({ type: 'INITIALIZE_CART', payload: items });
    }
  }, []);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};