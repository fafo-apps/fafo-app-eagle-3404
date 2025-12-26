"use client";

export function AddToCart({ slug, name, price_cents, currency, image_url }: { slug: string; name: string; price_cents: number; currency: string; image_url?: string }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const raw = localStorage.getItem("cart");
        const cart = raw ? JSON.parse(raw) : { items: [] as any[] };
        const existing = cart.items.find((i: any) => i.slug === slug);
        if (existing) existing.qty += 1;
        else cart.items.push({ slug, name, price_cents, currency, image_url, qty: 1 });
        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cart:updated"));
      }}
    >
      <button type="submit" className="w-full rounded-full bg-zinc-900 px-6 py-3 text-white hover:bg-zinc-800">Add to cart</button>
    </form>
  );
}
