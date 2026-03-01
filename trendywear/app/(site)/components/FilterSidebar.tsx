"use client";

import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";

type Section = "Category" | "Colors" | "Price Range" | "Fit" | "Ratings";

type Props = {
    selectedSize: string;
    onSelectSize: (size: string) => void;

    // main category from tabs
    activeCategory: string;

    // sub-categories (sidebar)
    selectedSubCategories: string[];
    onToggleSubCategory: (value: string) => void;

    // ✅ NEW: Colors
    selectedColors: string[];
    onToggleColor: (value: string) => void;

    // ✅ NEW: Price range (single slider)
    price: number;
    onPriceChange: (value: number) => void;

    // ✅ NEW: Fit
    selectedFits: string[];
    onToggleFit: (value: string) => void;

    // ✅ NEW: Ratings slider (0-5)
    rating: number;
    onRatingChange: (value: number) => void;

    // optional sticky behavior
    stickyTopClassName?: string;
};

const SECTIONS: Section[] = ["Category", "Colors", "Price Range", "Fit", "Ratings"];

// Example sub-categories per main tab (edit this to match DB/categories)
const SUBCATEGORY_BY_MAIN: Record<string, string[]> = {
    "Polo Shirts": ["Classic Polo", "Slim Polo", "Long Sleeve Polo"],
    Jackets: ["Windbreaker", "Denim Jacket", "Bomber Jacket"],
    Shirts: ["Button Down", "Graphic Tee", "Oversized Tee"],
    "Best Sellers": ["Top Rated", "Most Bought", "Trending"],
};

// Colors shown in sidebar
const COLOR_OPTIONS: { name: string; swatch: string }[] = [
    { name: "Black", swatch: "#111827" },
    { name: "White", swatch: "#FFFFFF" },
    { name: "Gray", swatch: "#9CA3AF" },
    { name: "Brown", swatch: "#8B5E3C" },
    { name: "Red", swatch: "#C1121F" },
    { name: "Blue", swatch: "#003049" },
    { name: "Green", swatch: "#16A34A" },
    { name: "Beige", swatch: "#E7D8C9" },
];

const FIT_OPTIONS = [
    "Slim Fit",
    "Regular Fit",
    "Relaxed Fit",
    "Oversized Fit",
    "Tailored Fit",
    "Skinny Fit",
    "Loose Fit",
] as const;

const MIN_PRICE = 200;
const MAX_PRICE = 25000;

function formatPeso(n: number) {
    // Lightweight formatter (no Intl needed)
    return `₱${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

function Stars({ value }: { value: number }) {
    const full = Math.round(value); // slider gives whole numbers (step=1)
    return (
        <div className="flex items-center gap-1" aria-label={`${full} out of 5 stars`}>
            {Array.from({ length: 5 }).map((_, i) => {
                const filled = i < full;
                return (
                    <span
                        key={i}
                        className={filled ? "text-[#A52A2A]" : "text-gray-300"}
                    >
                        ★
                    </span>
                );
            })}
            <span className="ml-2 text-xs text-gray-500 font-medium">{full}.0</span>
        </div>
    );
}

export default function FiltersSidebar({
    selectedSize,
    onSelectSize,
    activeCategory,
    selectedSubCategories,
    onToggleSubCategory,

    selectedColors,
    onToggleColor,

    price,
    onPriceChange,

    selectedFits,
    onToggleFit,

    rating,
    onRatingChange,

    stickyTopClassName = "top-24",
}: Props) {
    const [open, setOpen] = useState<Section>("Category");

    const subCats = useMemo(() => {
        return SUBCATEGORY_BY_MAIN[activeCategory] ?? [];
    }, [activeCategory]);

    return (
        <aside className={`mt-42 sticky ${stickyTopClassName} self-start`}>
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
                                type="button"
                                onClick={() => onSelectSize(size)}
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

            {/* ACCORDION LIST */}
            <div className="divide-y divide-[#C5C5C5] font-bold">
                {SECTIONS.map((section) => {
                    const isOpen = open === section;

                    return (
                        <div key={section}>
                            {/* header row */}
                            <button
                                type="button"
                                onClick={() =>
                                    setOpen((prev) => (prev === section ? "Category" : section))
                                }
                                className="flex items-end justify-between w-full py-4 text-gray-700 hover:text-[#C1121F] text-[18px]"
                            >
                                <span>{section}</span>
                                <ChevronRight
                                    className={`w-4 h-4 text-[#22223B] transition-transform ${isOpen ? "rotate-90" : "rotate-0"
                                        }`}
                                />
                            </button>

                            {/* panel */}
                            <div
                                className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]"
                                    }`}
                            >
                                <div className="overflow-hidden">
                                    {/* CATEGORY (sub-category) */}
                                    {section === "Category" && (
                                        <div className="space-y-3 pl-1">
                                            <p className="text-xs text-gray-500 font-medium">
                                                Sub-categories for:{" "}
                                                <span className="text-[#003049]">{activeCategory}</span>
                                            </p>

                                            {subCats.length === 0 ? (
                                                <p className="text-sm text-gray-400 font-medium">
                                                    No sub-categories yet.
                                                </p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {subCats.map((sc) => {
                                                        const checked = selectedSubCategories.includes(sc);
                                                        return (
                                                            <label
                                                                key={sc}
                                                                className="flex items-center gap-3 text-sm font-medium text-[#003049]"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={checked}
                                                                    onChange={() => onToggleSubCategory(sc)}
                                                                    className="h-4 w-4 accent-[#A52A2A]"
                                                                />
                                                                {sc}
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* COLORS */}
                                    {section === "Colors" && (
                                        <div className="space-y-3 pl-1">
                                            <p className="text-xs text-gray-500 font-medium">
                                                Choose one or more colors
                                            </p>

                                            <div className="space-y-2">
                                                {COLOR_OPTIONS.map((c) => {
                                                    const checked = selectedColors.includes(c.name);
                                                    return (
                                                        <label
                                                            key={c.name}
                                                            className="flex items-center gap-3 text-sm font-medium text-[#003049]"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={checked}
                                                                onChange={() => onToggleColor(c.name)}
                                                                className="h-4 w-4 accent-[#A52A2A]"
                                                            />

                                                            <span
                                                                className="w-4 h-4 rounded-sm border border-gray-300"
                                                                style={{ backgroundColor: c.swatch }}
                                                            />

                                                            <span>{c.name}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* PRICE RANGE (single slider) */}
                                    {section === "Price Range" && (
                                        <div className="space-y-3 pl-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs text-gray-500 font-medium">Price</p>
                                                <p className="text-sm font-semibold text-[#003049]">
                                                    {formatPeso(price)}
                                                </p>
                                            </div>

                                            <input
                                                type="range"
                                                min={MIN_PRICE}
                                                max={MAX_PRICE}
                                                step={50}
                                                value={price}
                                                onChange={(e) => onPriceChange(Number(e.target.value))}
                                                className="w-full accent-[#A52A2A]"
                                                aria-label="Price slider"
                                            />

                                            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                                                <span>{formatPeso(MIN_PRICE)}</span>
                                                <span>{formatPeso(MAX_PRICE)}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* FIT */}
                                    {section === "Fit" && (
                                        <div className="space-y-3 pl-1">
                                            <p className="text-xs text-gray-500 font-medium">
                                                Select fit type(s)
                                            </p>

                                            <div className="space-y-2">
                                                {FIT_OPTIONS.map((f) => {
                                                    const checked = selectedFits.includes(f);
                                                    return (
                                                        <label
                                                            key={f}
                                                            className="flex items-center gap-3 text-sm font-medium text-[#003049]"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={checked}
                                                                onChange={() => onToggleFit(f)}
                                                                className="h-4 w-4 accent-[#A52A2A]"
                                                            />
                                                            {f}
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* RATINGS (slider 0-5 with live stars) */}
                                    {section === "Ratings" && (
                                        <div className="space-y-3 pl-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs text-gray-500 font-medium">
                                                    Minimum Rating
                                                </p>
                                                <Stars value={rating} />
                                            </div>

                                            <input
                                                type="range"
                                                min={0}
                                                max={5}
                                                step={1}
                                                value={rating}
                                                onChange={(e) => onRatingChange(Number(e.target.value))}
                                                className="w-full accent-[#A52A2A]"
                                                aria-label="Rating slider"
                                            />

                                            <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                                                <span>0★</span>
                                                <span>5★</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                <div className="border-b border-[#C5C5C5]" />
            </div>
        </aside>
    );
}