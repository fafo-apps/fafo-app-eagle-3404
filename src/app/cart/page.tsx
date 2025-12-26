"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

type CartItem = { slug: string; name: string; price_cents: number; currency: string; image_url?: string; qty: number };

type CartState = { items: CartItem[] };

export default function CartPage() {
  const [cart, setCart] = useState<CartState>({ items: [] });

  useEffect(() => {
    const raw = localStorage.getItem("cart");
    setCart(raw ? JSON.parse(raw) : { items: [] });
    const onUpdate = () => {
      const next = localStorage.getItem("cart");
      setCart(next ? JSON.parse(next) : { items: [] });
    };
    window.addEventListener("cart:updated", onUpdate);
    return () => window.removeEventListener("cart:updated", onUpdate);
  }, []);

  const subtotal = useMemo(() => cart.items.reduce((sum, i) => sum + i.price_cents * i.qty, 0), [cart]);
  const currency = cart.items[0]?.currency || "USD";

  function updateQty(slug: string, qty: number) {
    const next = { ...cart, items: cart.items.map((i) => (i.slug === slug ? { ...i, qty: Math.max(1, qty) } : i)) };
    localStorage.setItem("cart", JSON.stringify(next));
    setCart(next);
  }

  function removeItem(slug: string) {
    const next = { ...cart, items: cart.items.filter((i) => i.slug !== slug) };
    localStorage.setItem("cart", JSON.stringify(next));
    setCart(next);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-zinc-900">Your Cart</h1>
      {cart.items.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 p-8 text-zinc-600">
          Your cart is empty. <Link href="/" className="underline text-zinc-900">Continue shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.slug} className="flex gap-4 rounded-xl border border-zinc-200 p-4">
                {item.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image_url} alt={item.name} className="h-24 w-24 rounded-md object-cover" />
                )}
                <div className="flex flex-1 items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-zinc-900">{item.name}</p>
                    <p className="text-sm text-zinc-600">{formatPrice(item.price_cents, item.currency)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button className="h-8 w-8 rounded-full border" onClick={() => updateQty(item.slug, item.qty - 1)}>-</button>
                      <span className="w-8 text-center">{item.qty}</span>
                      <button className="h-8 w-8 rounded-full border" onClick={() => updateQty(item.slug, item.qty + 1)}>+</button>
                      <button className="ml-4 text-sm text-zinc-700 underline" onClick={() => removeItem(item.slug)}>Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-zinc-200 p-6">
            <div className="flex items-center justify-between text-zinc-900">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal, currency)}</span>
            </div>
            <p className="mt-2 text-sm text-zinc-600">Shipping and taxes calculated at checkout.</p>
            <button className="mt-4 w-full rounded-full bg-zinc-900 px-6 py-3 text-white hover:bg-zinc-800" onClick={() => alert("Checkout coming soon. We'll add Stripe when you're ready.")}>Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}
