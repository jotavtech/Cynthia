"use client";

import { useSyncExternalStore } from "react";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "cynthia-cart-v1";

// Store externo em nivel de modulo: evita setState em effect (hidratacao segura
// via useSyncExternalStore) e sincroniza o carrinho entre abas.
let items: CartItem[] = [];
let initialized = false;
const listeners = new Set<() => void>();
const serverSnapshot: CartItem[] = [];

function readStorage(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function ensureInitialized() {
  if (initialized || typeof window === "undefined") return;
  items = readStorage();
  initialized = true;
}

function emit() {
  for (const listener of listeners) listener();
}

function setItems(next: CartItem[]) {
  items = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignora falhas de storage (modo privado, cota, etc.).
  }
  emit();
}

function subscribe(listener: () => void) {
  ensureInitialized();
  listeners.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      items = readStorage();
      emit();
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): CartItem[] {
  ensureInitialized();
  return items;
}

function getServerSnapshot(): CartItem[] {
  return serverSnapshot;
}

function addItem(item: Omit<CartItem, "quantity">, quantity = 1) {
  const existing = items.find((entry) => entry.id === item.id);
  if (existing) {
    setItems(
      items.map((entry) =>
        entry.id === item.id
          ? { ...entry, quantity: entry.quantity + quantity }
          : entry,
      ),
    );
  } else {
    setItems([...items, { ...item, quantity }]);
  }
}

function updateQuantity(id: string, quantity: number) {
  setItems(
    items
      .map((entry) =>
        entry.id === id ? { ...entry, quantity: Math.max(0, quantity) } : entry,
      )
      .filter((entry) => entry.quantity > 0),
  );
}

function removeItem(id: string) {
  setItems(items.filter((entry) => entry.id !== id));
}

function clear() {
  setItems([]);
}

/**
 * Mantido como passthrough para preservar o ponto de composicao no layout.
 * O estado vive no store de modulo acima.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useCart(): CartContextValue {
  const current = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const totalItems = current.reduce((sum, entry) => sum + entry.quantity, 0);
  const totalPrice = current.reduce(
    (sum, entry) => sum + entry.price * entry.quantity,
    0,
  );

  return {
    items: current,
    totalItems,
    totalPrice,
    addItem,
    updateQuantity,
    removeItem,
    clear,
  };
}
