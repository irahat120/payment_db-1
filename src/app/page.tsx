import ProductList from "@/components/ProductList";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Online Payment system
          </h1>
          <Link
            href="/add-product"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
          >
            Add Product
          </Link>
        </div>
      </div>
      <ProductList />
      <div className="fixed bottom-6 right-6">
        <Link
          href="/add-product"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-full shadow-lg transition-colors duration-300 flex items-center"
        >
          <span className="mr-2">+</span> Add Product
        </Link>
      </div>
    </div>
  );
}
