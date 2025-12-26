import { NextResponse } from "next/server";
import { listProducts } from "@/app/db/repositories/ProductsRepository";

export async function GET() {
  try {
    const products = await listProducts();
    return NextResponse.json({ products });
  } catch (e) {
    console.error(e);
    return new NextResponse("Failed to load products", { status: 500 });
  }
}
