import Image from "next/image";
import Link from "next/link";
import { getProductBySlug } from "@/app/db/repositories/ProductsRepository";

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16">
        <p className="text-zinc-600">Product not found.</p>
        <Link href="/" className="mt-4 inline-block text-sm text-zinc-900 underline">Back to shop</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-100">
          {product.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
          )}
        </div>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">{product.name}</h1>
            <p className="mt-2 text-xl text-zinc-900">{formatPrice(product.price_cents, product.currency)}</p>
          </div>
          {product.description && (
            <p className="text-zinc-600 leading-7">{product.description}</p>
          )}
          {product.sizes?.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-medium text-zinc-700">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button key={s} className="rounded-full border border-zinc-300 px-4 py-2 text-sm hover:border-zinc-900" data-size={s}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          <AddToCart slug={product.slug} name={product.name} price_cents={product.price_cents} currency={product.currency} image_url={product.image_url ?? undefined} />
          <div>
            <Link href="/" className="text-sm text-zinc-900 underline">Continue shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddToCart({ slug, name, price_cents, currency, image_url }: { slug: string; name: string; price_cents: number; currency: string; image_url?: string }) {
  // client hydration free: simple link to cart with params could work, but here a form posts to client cart via JS we add below
  return (
    <form action="#" onSubmit={(e) => {
      e.preventDefault();
      const raw = localStorage.getItem("cart");
      const cart = raw ? JSON.parse(raw) : { items: [] as any[] };
      const existing = cart.items.find((i: any) => i.slug === slug);
      if (existing) existing.qty += 1; else cart.items.push({ slug, name, price_cents, currency, image_url, qty: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart:updated"));
    }}>
      <button type="submit" className="w-full rounded-full bg-zinc-900 px-6 py-3 text-white hover:bg-zinc-800">Add to cart</button>
    </form>
  );
}
