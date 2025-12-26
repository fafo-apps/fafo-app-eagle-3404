"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const [qty, setQty] = useState(0);
  useEffect(() => {
    const read = () => {
      const raw = localStorage.getItem("cart");
      const cart = raw ? JSON.parse(raw) : { items: [] };
      setQty(cart.items.reduce((n: number, i: any) => n + i.qty, 0));
    };
    read();
    window.addEventListener("cart:updated", read);
    return () => window.removeEventListener("cart:updated", read);
  }, []);

  return (
    <nav className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-900">
            Aesthetic Co.
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm text-zinc-700 hover:text-zinc-900">Shop</Link>
          <Link href="/cart" className="relative text-sm text-zinc-700 hover:text-zinc-900">
            Cart
            {qty > 0 && (
              <span className="absolute -right-3 -top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-900 px-1 text-[11px] text-white">{qty}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
