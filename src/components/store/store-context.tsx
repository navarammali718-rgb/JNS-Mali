import { createContext, useContext, useMemo, useState, useEffect, type ReactNode } from "react";
import { getProductsFn } from "@/server-functions";

type StoreValue = {
  cart: Record<string, number>;
  wishlist: string[];
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clearCart: () => void;
  toggleWish: (id: string) => void;
  cartCount: number;
  subtotal: number;
  products: any[];
  isProductsLoading: boolean;
};

const StoreContext = createContext<StoreValue | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<any[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProductsFn();
        setProducts(data.map((p: any) => ({ ...p, id: p._id || p.id })));
      } catch (e) {
        console.error("Failed to load products for store:", e);
      } finally {
        setIsProductsLoading(false);
      }
    }
    load();
  }, []);

  const [cart, setCart] = useState<Record<string, number>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("jns_store_cart");
        if (saved) return JSON.parse(saved);
      } catch (e) { }
    }
    return {};
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("jns_store_wishlist");
        if (saved) return JSON.parse(saved);
      } catch (e) { }
    }
    return [];
  });

  const updateCart = (newCart: Record<string, number>) => {
    setCart(newCart);
    if (typeof window !== "undefined") localStorage.setItem("jns_store_cart", JSON.stringify(newCart));
  };

  const updateWishlist = (newWishlist: string[]) => {
    setWishlist(newWishlist);
    if (typeof window !== "undefined") localStorage.setItem("jns_store_wishlist", JSON.stringify(newWishlist));
  };

  const add = (id: string, qty = 1) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const currentQty = cart[id] ?? 0;
    const newQty = Math.min(product.stock, currentQty + qty);
    
    if (newQty > 0) {
      const newCart = { ...cart, [id]: newQty };
      updateCart(newCart);
    }
  };

  const setQty = (id: string, qty: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const n = { ...cart };
    if (qty <= 0) {
      delete n[id];
    } else {
      n[id] = Math.min(product.stock, qty);
    }
    updateCart(n);
  };

  const remove = (id: string) => {
    const n = { ...cart };
    delete n[id];
    updateCart(n);
  };

  const clearCart = () => {
    updateCart({});
  };

  const toggleWish = (id: string) => {
    const newWish = wishlist.includes(id) ? wishlist.filter(x => x !== id) : [...wishlist, id];
    updateWishlist(newWish);
  };

  // cartCount = distinct products
  const cartCount = useMemo(() => Object.keys(cart).length, [cart]);
  const subtotal = useMemo(() => products.reduce((s, p) => s + p.price * (cart[p.id] ?? 0), 0), [cart, products]);

  return (
    <StoreContext.Provider value={{ cart, wishlist, add, setQty, remove, clearCart, toggleWish, cartCount, subtotal, products, isProductsLoading }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const v = useContext(StoreContext);
  if (!v) throw new Error("StoreProvider missing");
  return v;
}
