"use client";

import Link from "next/link";
import Image from "next/image";
import { MdArrowOutward, MdFavoriteBorder } from "react-icons/md";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from 'next/navigation';


const BUCKET_NAME = "images";

type MensProduct = {
  id: number;
  name: string;
  price: string;
  image: string;
};

export default function MensWear() {
  const [mensWearData, setMensWearData] = useState<MensProduct[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchMensWear() {
      const supabase = createClient();

      const { data: items, error } = await supabase
        .from("items")
        .select("id, name, image_id")
        .contains("tags", ["Men"]);

      if (error || !items) {
        console.error("Error fetching mens wear:", error);
        return;
      }

      const itemIds = items.map((i) => i.id);

      const { data: prices } = await supabase
        .from("prices")
        .select("item_id, price")
        .in("item_id", itemIds);

      const priceMap: Record<number, number> = {};
      if (prices) {
        for (const p of prices) {
          if (!(p.item_id in priceMap)) priceMap[p.item_id] = p.price;
        }
      }

      const mapped: MensProduct[] = items.map((item) => {
        const firstImageId = item.image_id?.[0] ?? null;
        const imageUrl = firstImageId
          ? supabase.storage.from(BUCKET_NAME).getPublicUrl(firstImageId).data.publicUrl
          : "/images/placeholder.jpg";

        const rawPrice = priceMap[item.id];
        const formattedPrice = rawPrice != null ? `₱${rawPrice.toLocaleString()}` : "Price unavailable";

        return {
          id: item.id,
          name: item.name ?? "Unnamed",
          price: formattedPrice,
          image: imageUrl,
        };
      });

      setMensWearData(mapped);
    }

    fetchMensWear();
  }, []);

  return (
    <section className="w-full bg-[#f8f9fa] py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        {/* Top Divider */}
        <div className="border-t border-slate-300 w-full mb-12" />
      </div>

      <div className="relative flex flex-col lg:flex-row gap-12 items-center lg:pr-[calc((100vw-1280px)/2+2rem)] pr-8">
        
        {/* LEFT PANEL */}
        <div className="flex-1 min-w-0 flex relative justify-end">
          
          {/* SCROLL CONTAINER */}
          <div className="flex items-center gap-6 px-6 py-8 overflow-x-auto hide-scrollbar scroll-smooth">
            
            {mensWearData.length === 0 ? (
              <p className="text-slate-400 text-sm px-4">No items found.</p>
            ) : (
              mensWearData.map((item) => (
                <div 
                  key={item.id} 
                  className="shrink-0 w-[280px] sm:w-[300px] group cursor-pointer"
                  onClick={() => router.push(`/products/${item.id}`)} 

                >
                  <div className="aspect-[3.5/4] rounded-3xl overflow-hidden mb-5 relative transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-black/20">
                    
                    {/* IMAGE */}
                    <Image
                      src={item.image}         
                      alt={item.name}
                      fill                      
                      className="object-cover"  
                      priority
                    />
                    
                    {/* WISHLIST BUTTON */}
                    <button 
                      title="Heart"
                      type="button"
                      className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors text-slate-900"
                    >
                      <MdFavoriteBorder size={20} />
                    </button>
                  </div>

                  {/* TEXT */}
                  <div className="text-white space-y-1">
                    <h3 className="font-medium text-[#003049] text-xl tracking-wide">{item.name}</h3>
                    <p className="font-regular text-[#1E293B]">{item.price}</p>
                  </div>
                </div>
              ))
            )}
            
            {/* Padding at the end so last card isn't flush to edge */}
            <div className="w-20 shrink-0" />
          </div>
        </div>

        {/* RIGHT SIDE: Text Content */}
        <div className="lg:w-[420px] w-full pl-8 lg:pl-0 flex flex-col justify-between lg:items-end text-center lg:text-right order-1 lg:order-2 shrink-0 min-h-[400px]">
          <div className="space-y-4 pt-4">
            <h2 className="text-4xl md:text-6xl font-semibold tracking-wide mb-3 text-[#003049]">
              Men&apos;s Wear
            </h2>
            <p className="text-3xl font-regular tracking-wide opacity-90">
              Made for him.
            </p>
          </div>
          
          <Link 
            href="/mens" 
            className="inline-flex items-center gap-2 border-b border-slate-900 pb-1 text-slate-900 hover:opacity-70 transition group"
          >
            <span className="text-xl text-[#003049] font-medium group-hover:text-[#003049]-100 transition">
              View All Product
            </span>
            <MdArrowOutward className="text-2xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform ml-4" />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8">
        {/* Bottom Divider */}
        <div className="border-t border-slate-300 w-full mt-12" />
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}