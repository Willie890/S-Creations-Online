// client/context/CartContext.js
'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';

// Initial State
const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

// Reducer
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);

      let updatedItems;
      if (existingItem) {
        updatedItems = state.items.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        updatedItems = [...state.items, { ...newItem, quantity: newItem.quantity || 1 }];
      }

      return {
        ...state,
        items: updatedItems,
        totalQuantity: state.totalQuantity + (newItem.quantity || 1),
        totalAmount: state.totalAmount + newItem.price * (newItem.quantity || 1),
      };
    }

    case 'REMOVE_ITEM': {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      const updatedItems = state.items.filter((item) => item.id !== id);

      return {
        ...state,
        items: updatedItems,
        totalQuantity: state.totalQuantity - existingItem.quantity,
        totalAmount: state.totalAmount - existingItem.price * existingItem.quantity,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) return state;

      const existingItem = state.items.find((item) => item.id === id);
      const updatedItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );

      const quantityDiff = quantity - existingItem.quantity;

      return {
        ...state,
        items: updatedItems,
        totalQuantity: state.totalQuantity + quantityDiff,
        totalAmount: state.totalAmount + existingItem.price * quantityDiff,
      };
    }

    case 'CLEAR_CART':
      return initialState;

    default:
      return state;
  }
}

// Create Context
const CartContext = createContext();

// Custom Hook
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Provider
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      dispatch({ type: 'REPLACE_CART', payload: JSON.parse(savedCart) });
    }
  }, []);

  // Save cart to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });
  const updateQuantity = (id, quantity) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const value = {
    items: state.items,
    totalQuantity: state.totalQuantity,
    totalAmount: state.totalAmount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
