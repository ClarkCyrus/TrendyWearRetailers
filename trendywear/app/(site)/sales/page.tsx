"use client";

import Breadcrumb from "../components/Breadcrumb";
import { useState, useEffect } from "react";
import { Search, ChevronRight } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { createClient } from "@/utils/supabase/client";

type Product = {
    id: number;
    name: string;
    images: string[];
    oldPrice?: number;
    price: number;
    rating: number;
    reviews: number;
    colors: string[];
};

const BUCKET_NAME = "images";

export default function Page() {
  const [selectedSize, setSelectedSize] = useState("XS");
  const [activeCategory, setActiveCategory] = useState("Best Sellers");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePage, setActivePage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const totalPages = 4;

  const categories = ["Polo Shirts", "Jackets", "Shirts", "Best Sellers"];
  const filters = ["Category", "Colors", "Price Range", "Fit", "Length", "Ratings"];

  useEffect(() => {
      async function fetchProducts() {
          const supabase = createClient();

          const { data: items, error } = await supabase
              .from("items")
              .select("id, name, image_id");

          if (error || !items) {
              console.error("Error fetching items:", error);
              setLoading(false);
              return;
          }

          const itemIds = items.map((i) => i.id);
          const now = new Date().toISOString();

          const { data: prices } = await supabase
              .from("prices")
              .select("item_id, price")
              .in("item_id", itemIds)
              .lte("valid_from", now)
              .or(`valid_to.is.null,valid_to.gte.${now}`)
              .order("priority", { ascending: false });

          const priceMap: Record<number, number> = {};
          if (prices) {
              for (const p of prices) {
                  if (!(p.item_id in priceMap)) priceMap[p.item_id] = p.price;
              }
          }

          const mapped = items.map((item) => {
              const imageUrls = (item.image_id ?? []).map(
                  (imgId: string) =>
                      supabase.storage.from(BUCKET_NAME).getPublicUrl(imgId).data.publicUrl
              );
              return {
                  id: item.id,
                  name: item.name ?? "Unnamed",
                  images: imageUrls.length > 0 ? imageUrls : ["/placeholder.jpg"],
                  price: priceMap[item.id] ?? 0,
                  rating: 0,
                  reviews: 0,
                  colors: [],
              };
          });

          setProducts(mapped);
          setLoading(false);
      }

      fetchProducts();
    }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <main className="max-w-[1440px] mx-auto px-10 py-10">
        <div className="grid grid-cols-[260px_1fr] gap-14 items-start">
          {/* FILTERS */}
          <aside className="mt-42">
            <h2 className="text-[24px] font-semibold mb-8">Filters</h2>

            {/* SIZE */}
            <div className="mb-10">
              <p className="text-[22px] font-medium mb-3">Size</p>
              <div className="flex gap-2">
                {["XS", "S", "M", "L", "XL"].map((size) => {
                  const isSelected = size === selectedSize;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-9 h-9 rounded-full text-xs border flex items-center justify-center ${isSelected
                        ? "bg-[#A52A2A] border-[#A52A2A] text-white"
                        : "bg-[#D9D9D9] border-[#D9D9D9] text-black"
                        }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FILTER LIST */}
            <div className="divide-y divide-[#C5C5C5] font-bold">
              {filters.map((item, index) => {
                const isLast = index === filters.length - 1;
                const largeFontItems = [
                  "Category",
                  "Colors",
                  "Price Range",
                  "Fit",
                  "Length",
                  "Ratings",
                ];
                const fontSizeClass = largeFontItems.includes(item)
                  ? "text-[18px]"
                  : "text-sm";

                return (
                  <a
                    key={item}
                    href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className={`flex items-end justify-between w-full py-4 text-gray-700 hover:text-[#C1121F] ${fontSizeClass} ${isLast ? "border-b border-[#C5C5C5]" : ""
                      }`}
                  >
                    <span>{item}</span>
                    <ChevronRight className="w-4 h-4 text-[#22223B]" />
                  </a>
                );
              })}
            </div>
          </aside>

          {/* RIGHT COLUMN */}
          <section>
            {/* BREADCRUMB */}
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Products" },
              ]}
            />

            {/* TITLE */}
            <h1 className="text-4xl font-bold text-[#C1121F] mb-4">
              All Products
            </h1>

            {/* SEARCH + CATEGORIES */}
            <div className="mb-8 flex items-center justify-between">
              {/* SEARCH */}
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-full border border-gray-300 focus:outline-none"
                />
              </div>

              {/* CATEGORIES */}
              <div className="flex gap-2">
                {categories.map((cat) => {
                  const isActive = cat === activeCategory;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 text-xs border rounded-lg transition ${isActive
                        ? "bg-[#A52A2A] border-[#A52A2A] text-white"
                        : "bg-[#D9D9D9] border-[#D9D9D9] text-black"
                        }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PRODUCTS GRID */}
            <div className="grid grid-cols-4 gap-10">
              {loading ? (
                  <p className="text-gray-400 text-sm col-span-4">Loading products...</p>
              ) : (
                  products.map((product) => (
                      <ProductCard key={product.id} {...product} />
                  ))
              )}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-start gap-4 mt-14 text-sm">
              <button
                onClick={() => setActivePage((p) => Math.max(p - 1, 1))}
                disabled={activePage === 1}
                className={`px-2 py-1 font-semibold ${activePage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:text-[#C1121F]"
                  }`}
              >
                &lt;
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setActivePage(page)}
                    className={`px-2 py-1 font-semibold ${activePage === page
                      ? "text-[#C1121F]"
                      : "text-gray-500 hover:text-[#C1121F]"
                      }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => setActivePage((p) => Math.min(p + 1, totalPages))}
                disabled={activePage === totalPages}
                className={`px-2 py-1 font-semibold ${activePage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:text-[#C1121F]"
                  }`}
              >
                &gt;
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
