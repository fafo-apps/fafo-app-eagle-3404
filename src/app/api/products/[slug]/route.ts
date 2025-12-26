import { NextResponse } from "next/server";
import { getProductBySlug } from "@/app/db/repositories/ProductsRepository";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    const product = await getProductBySlug(params.slug);
    if (!product) return new NextResponse("Not found", { status: 404 });
    return NextResponse.json({ product });
  } catch (e) {
    console.error(e);
    return new NextResponse("Failed to load product", { status: 500 });
  }
}
