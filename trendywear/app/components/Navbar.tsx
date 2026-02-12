"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingCart, User } from "lucide-react";

export default function Navbar() {
    const navItems = ["Products", "New In", "Sales"];
    const [activeNav, setActiveNav] = useState("Products");
    const [activeIcon, setActiveIcon] = useState<string | null>(null);

    return (
        <header className="bg-white border-b border-black/10">
            <nav className="max-w-[1440px] mx-auto px-10 h-[130px] flex items-center justify-between relative">
                {/* LEFT LINKS */}
                <div className="flex items-center gap-2">
                    {navItems.map((item) => {
                        const hrefMap: Record<string, string> = {
                            Products: "/",
                            "New In": "/new-in",
                            Sales: "/sales",
                        };

                        const isActive = activeNav === item;

                        return (
                            <Link
                                key={item}
                                href={hrefMap[item]}
                                onClick={() => setActiveNav(item)}
                                className={`px-10 py-2 text-[21px] rounded-full transition ${isActive
                                        ? "bg-[#1E293B] text-white"
                                        : "text-[#003049] hover:bg-gray-100"
                                    }`}
                            >
                                {item}
                            </Link>
                        );
                    })}
                </div>

                {/* CENTER LOGO */}
                <div className="absolute left-1/2 -translate-x-1/2">
                    <Link
                        href="/"
                        className="text-[#C1121F] font-semibold tracking-[0.35em] text-[28px]"
                    >
                        TRENDY WEAR
                    </Link>
                </div>

                {/* RIGHT ICONS */}
                <div className="flex items-center gap-4">
                    {[
                        { name: "search", icon: Search },
                        { name: "heart", icon: Heart },
                        { name: "cart", icon: ShoppingCart },
                        { name: "user", icon: User },
                    ].map(({ name, icon: Icon }) => {
                        const isActive = activeIcon === name;

                        return (
                            <button
                                key={name}
                                onClick={() => setActiveIcon(name)}
                                className={`w-11 h-11 rounded-full border flex items-center justify-center ${isActive
                                        ? "bg-[#C1121F] border-[#C1121F]"
                                        : "border-[#003049]"
                                    }`}
                            >
                                <Icon
                                    size={20}
                                    className={isActive ? "text-white" : "text-[#003049]"}
                                />
                            </button>
                        );
                    })}
                </div>
            </nav>
        </header>
    );
}
