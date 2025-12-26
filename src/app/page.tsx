import Link from "next/link";
import { listProducts } from "@/app/db/repositories/ProductsRepository";

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);
}

export default async function Home() {
  const products = await listProducts();

  return (
    <div className="bg-zinc-50">
      <header className="mx-auto max-w-5xl px-4 pt-12 pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">New Arrivals</h1>
        <p className="mt-2 text-zinc-600">A minimal edit for everyday ease.</p>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Link key={p.id} href={`/products/${p.slug}`} className="group rounded-xl bg-white p-3 shadow-sm ring-1 ring-zinc-200 transition hover:shadow-md">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-zinc-100">
                {p.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image_url} alt={p.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                )}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-900">{p.name}</p>
                <p className="text-sm text-zinc-700">{formatPrice(p.price_cents, p.currency)}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
