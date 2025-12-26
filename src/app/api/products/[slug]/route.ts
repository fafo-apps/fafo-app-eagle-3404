import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getProductBySlug } from "@/app/db/repositories/ProductsRepository";

export async function GET(_req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const product = await getProductBySlug(slug);
    if (!product) return new NextResponse("Not found", { status: 404 });
    return NextResponse.json({ product });
  } catch (e) {
    console.error(e);
    return new NextResponse("Failed to load product", { status: 500 });
  }
}
