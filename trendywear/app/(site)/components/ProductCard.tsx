"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { addToWishlist } from "@/app/actions/user/AddToWishlist";
import { removeFromWishlist } from "@/app/actions/user/RemoveFromWishlist";

type ProductCardProps = {
    id: number;
    name: string;
    images: string[]; // <-- updated
    oldPrice?: number;
    price: number;
    rating: number;
    reviews: number;
    is_liked:boolean;
    colors: string[];
};

export default function ProductCard({
    id,
    name,
    images,
    oldPrice,
    price,
    rating,
    reviews,
    is_liked,
    colors,
}: ProductCardProps) {
    const [liked, setLiked] = useState(false);

    // fallback to placeholder if images array is empty
    const mainImage = images && images.length > 0 ? images[0] : "/placeholder.jpg";

    const [topModalOpen, setTopModalOpen] = useState(false);
    const [topModalMessage, setTopModalMessage] = useState("");
    const [topModalTimer, setTopModalTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

    useEffect(()=>{
        setLiked(is_liked)
    },[])

    const showTopModal = (
        message: string,
        options?: { autoCloseMs?: number }
        ) => {
        setTopModalMessage(message);
        setTopModalOpen(true);

        // clear previous timer if any
        if (topModalTimer) clearTimeout(topModalTimer);

        const ms = options?.autoCloseMs ?? 3500; // default 3.5s
        const t = setTimeout(() => {
            setTopModalOpen(false);
        }, ms);

    setTopModalTimer(t);
    };

    const closeTopModal = () => {
    if (topModalTimer) clearTimeout(topModalTimer);
    setTopModalOpen(false);
    };

    return (
        <div className="group">
            {topModalOpen && (
            <div className="fixed inset-0 z-[9999] pointer-events-none">
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-lg pointer-events-auto">
                <div className="rounded-xl border border-red-200 bg-white shadow-xl px-4 py-3">
                    <div className="flex items-start gap-3">
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#C1121F]" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-[#003049]">
                        {topModalMessage}
                        </p>
                    </div>
                    <button
                        onClick={closeTopModal}
                        className="text-gray-400 hover:text-gray-700 transition"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                    </div>
                </div>
                </div>
            </div>
            )}
            {/* IMAGE CARD */}
            <Link href={`/products/${id}`}>
                <div
                    className="relative bg-gray border border-[#A0A0A0] rounded-2xl p-0 overflow-hidden transition-all duration-300
                    group-hover:-translate-y-1 group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.15)]"
                >
                    <div className="relative h-64 rounded-xl overflow-hidden">
                        <Image
                            src={mainImage}
                            alt={name}
                            fill
                            sizes = "100vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    </div>

                    {/* HEART */}
                    <button
                        onClick={async (e) => {
                            e.preventDefault();

                            if (liked) {
                            const res = await removeFromWishlist(id);

                            if (res?.success) {
                                setLiked(false);
                            } else {
                                showTopModal("Failed to remove from wishlist.");
                            }

                            } else {
                            const res = await addToWishlist(id);

                            if (res?.success) {
                                setLiked(true);
                            } else {
                                showTopModal("Failed to add to wishlist.");
                            }
                            }
                        }}
                        className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition border
              ${liked
                                ? "bg-[#C1121F] border-[#C1121F]"
                                : "bg-[#FBFBFB] border-[#FBFBFB]"
                            }`}
                    >
                        <Heart
                            size={16}
                            className={liked ? "text-white" : "text-black"}
                        />
                    </button>
                </div>
            </Link>

            {/* INFO OUTSIDE CARD */}
            <div className="mt-3">
                {/* COLORS */}
                <div className="flex gap-2 mb-2">
                    {colors.map((color, i) => (
                        <span
                            key={i}
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>

                {/* NAME */}
                <p className="text-base font-medium">{name}</p>

                {/* PRICE */}
                <div className="flex items-center gap-2 text-sm mt-1">
                    {oldPrice && (
                        <span className="text-gray-500 line-through">
                            PHP {oldPrice.toLocaleString()}.00
                        </span>
                    )}
                    <span className="text-[#C1121F] font-medium">
                        PHP {price.toLocaleString()}.00
                    </span>
                </div>

                {/* RATING */}
                <div className="flex items-center gap-1 text-sm mt-1">
                    <span>★</span>
                    <span className="font-medium">{rating}</span>
                    <span className="text-gray-500">({reviews})</span>
                </div>
            </div>
        </div>
    );
}
