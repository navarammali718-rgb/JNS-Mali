import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { products } from "@/lib/catalog";
type StoreValue={cart:Record<string,number>; wishlist:string[]; add:(id:string,qty?:number)=>void; setQty:(id:string,qty:number)=>void; toggleWish:(id:string)=>void; cartCount:number; subtotal:number};
const StoreContext=createContext<StoreValue|undefined>(undefined);
export function StoreProvider({children}:{children:ReactNode}){
 const [cart,setCart]=useState<Record<string,number>>({"power-scrub-sponges":1,"pure-camphor":1});
 const [wishlist,setWishlist]=useState<string[]>(["mesh-loofah"]);
 const add=(id:string,qty=1)=>setCart(c=>({...c,[id]:(c[id]??0)+qty}));
 const setQty=(id:string,qty:number)=>setCart(c=>{const n={...c}; if(qty<=0) delete n[id]; else n[id]=qty; return n});
 const toggleWish=(id:string)=>setWishlist(w=>w.includes(id)?w.filter(x=>x!==id):[...w,id]);
 const cartCount=Object.values(cart).reduce((a,b)=>a+b,0);
 const subtotal=useMemo(()=>products.reduce((s,p)=>s+p.price*(cart[p.id]??0),0),[cart]);
 return <StoreContext.Provider value={{cart,wishlist,add,setQty,toggleWish,cartCount,subtotal}}>{children}</StoreContext.Provider>
}
export function useStore(){const v=useContext(StoreContext);if(!v) throw new Error("StoreProvider missing");return v}
