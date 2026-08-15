"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "biblu_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setItems(JSON.parse(saved));
    } catch (e) {
      // ignore corrupt storage
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      // ignore quota errors
    }
  }, [items, loaded]);

  function addItem(item) {
    setItems((prev) => {
      const key = `${item.productId}-${item.size || ""}-${item.colour || ""}`;
      const existing = prev.find((p) => p.key === key);
      if (existing) {
        return prev.map((p) => (p.key === key ? { ...p, qty: p.qty + item.qty } : p));
      }
      return [...prev, { ...item, key }];
    });
    setOpen(true);
  }

  function removeItem(key) {
    setItems((prev) => prev.filter((p) => p.key !== key));
  }

  function updateQty(key, qty) {
    setItems((prev) => prev.map((p) => (p.key === key ? { ...p, qty: Math.max(1, qty) } : p)));
  }

  function clear() {
    setItems([]);
  }

  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clear, count, open, setOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside a CartProvider");
  return ctx;
}
