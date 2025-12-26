import { pool } from "@/app/db/pool";

export type Product = {
  id: number;
  name: string;
  slug: string;
  price_cents: number;
  currency: string;
  image_url: string | null;
  description: string | null;
  sizes: string[];
  tags: string[];
  stock: number;
  created_at: string;
};

export async function listProducts(): Promise<Product[]> {
  const { rows } = await pool.query<Product>(
    `select id, name, slug, price_cents, currency, image_url, description, sizes, tags, stock, created_at
     from products
     order by created_at desc`
  );
  return rows;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { rows } = await pool.query<Product>(
    `select id, name, slug, price_cents, currency, image_url, description, sizes, tags, stock, created_at
     from products
     where slug = $1
     limit 1`,
    [slug]
  );
  return rows[0] || null;
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = `%${query.toLowerCase()}%`;
  const { rows } = await pool.query<Product>(
    `select id, name, slug, price_cents, currency, image_url, description, sizes, tags, stock, created_at
     from products
     where lower(name) like $1 or $1 = '%%'
     order by created_at desc`,
    [q]
  );
  return rows;
}
