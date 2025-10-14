import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const productId = searchParams.get("productId");

    let products;
    
    if (productId) {
      // Fetch a single product by ID
      products = await prisma.product.findMany({
        where: { id: parseInt(productId) },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Fetch products by category or all products
      const whereClause = category ? { category } : {};
      products = await prisma.product.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch products",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
