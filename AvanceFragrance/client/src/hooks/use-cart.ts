import React, { createContext, useContext, useReducer, type ReactNode } from "react";
import { type CartItem, type Product } from "@shared/schema";

interface CartState {
  items: CartItem[];
  total: number;
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product; quantity?: number }
  | { type: "REMOVE_ITEM"; productId: number }
  | { type: "UPDATE_QUANTITY"; productId: number; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "SET_CART_OPEN"; isOpen: boolean };

const initialState: CartState = {
  items: [],
  total: 0,
  isOpen: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(item => item.product.id === action.product.id);
      const quantity = action.quantity || 1;
      
      let newItems: CartItem[];
      if (existingItem) {
        newItems = state.items.map(item =>
          item.product.id === action.product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { product: action.product, quantity }];
      }
      
      const total = newItems.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
      
      return {
        ...state,
        items: newItems,
        total,
      };
    }
    
    case "REMOVE_ITEM": {
      const newItems = state.items.filter(item => item.product.id !== action.productId);
      const total = newItems.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
      
      return {
        ...state,
        items: newItems,
        total,
      };
    }
    
    case "UPDATE_QUANTITY": {
      const newItems = state.items.map(item =>
        item.product.id === action.productId
          ? { ...item, quantity: action.quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      const total = newItems.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
      
      return {
        ...state,
        items: newItems,
        total,
      };
    }
    
    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        total: 0,
      };
    
    case "TOGGLE_CART":
      return {
        ...state,
        isOpen: !state.isOpen,
      };
    
    case "SET_CART_OPEN":
      return {
        ...state,
        isOpen: action.isOpen,
      };
    
    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  return React.createElement(CartContext.Provider, { value: { state, dispatch } }, children);
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  
  const { state, dispatch } = context;
  
  return {
    items: state.items,
    total: state.total,
    isOpen: state.isOpen,
    itemCount: state.items.reduce((sum, item) => sum + item.quantity, 0),
    addItem: (product: Product, quantity?: number) => 
      dispatch({ type: "ADD_ITEM", product, quantity }),
    removeItem: (productId: number) => 
      dispatch({ type: "REMOVE_ITEM", productId }),
    updateQuantity: (productId: number, quantity: number) => 
      dispatch({ type: "UPDATE_QUANTITY", productId, quantity }),
    clearCart: () => dispatch({ type: "CLEAR_CART" }),
    toggleCart: () => dispatch({ type: "TOGGLE_CART" }),
    setCartOpen: (isOpen: boolean) => dispatch({ type: "SET_CART_OPEN", isOpen }),
  };
}