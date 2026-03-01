"use client";

import { useMemo, useState } from "react";
import Breadcrumb from "../components/Breadcrumb";
import { FiChevronDown } from "react-icons/fi";

type FaqCategory = "Orders" | "Shipping" | "Returns" | "Payments" | "Account";

type FaqItem = {
    category: FaqCategory;
    question: string;
    answer: string;
};

const FAQS: FaqItem[] = [
    {
        category: "Orders",
        question: "How do I place an order?",
        answer:
            "Browse products, add items to your cart, then proceed to checkout. You’ll receive an order confirmation after payment is completed.",
    },
    {
        category: "Orders",
        question: "Can I cancel or change my order after placing it?",
        answer:
            "If your order hasn’t been processed yet, we can help you update or cancel it. Please contact us as soon as possible using the Contact Us page.",
    },
    {
        category: "Shipping",
        question: "How long does delivery take within CAMANAVA?",
        answer:
            "Typical delivery within CAMANAVA is 1–3 business days depending on rider availability and order volume.",
    },
    {
        category: "Shipping",
        question: "Do you offer same-day delivery?",
        answer:
            "Same-day delivery may be available for select areas in CAMANAVA. Availability depends on cut-off time and rider capacity.",
    },
    {
        category: "Returns",
        question: "What is your return policy?",
        answer:
            "We accept returns within 7 days of delivery for unused items with tags and original packaging. Some items may be non-returnable for hygiene reasons.",
    },
    {
        category: "Returns",
        question: "How do I request a return or exchange?",
        answer:
            "Go to Contact Us and choose Email. Include your order number, the item(s), and the reason for return/exchange.",
    },
    {
        category: "Payments",
        question: "What payment methods do you accept?",
        answer:
            "We accept common local payment methods (e.g., GCash, bank transfer) and any enabled payment options on checkout.",
    },
    {
        category: "Payments",
        question: "Is payment secure?",
        answer:
            "Yes. We use secure payment processing and do not store full card details on our servers.",
    },
    {
        category: "Account",
        question: "Do I need an account to order?",
        answer:
            "You can checkout as a guest, but creating an account helps you track orders and save your details for faster checkout.",
    },
    {
        category: "Account",
        question: "I forgot my password. What should I do?",
        answer:
            "Use the 'Forgot Password' option on the login page to reset your password through your email.",
    },
];

const CATEGORIES: FaqCategory[] = [
    "Orders",
    "Shipping",
    "Returns",
    "Payments",
    "Account",
];

export default function FAQPage() {
    const [activeCategory, setActiveCategory] = useState<FaqCategory>("Orders");
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [query, setQuery] = useState("");

 
    // - If searching: search across ALL categories
    // - If not searching: filter by selected category
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        if (q.length > 0) {
            return FAQS.filter(
                (item) =>
                    item.question.toLowerCase().includes(q) ||
                    item.answer.toLowerCase().includes(q)
            );
        }

        return FAQS.filter((item) => item.category === activeCategory);
    }, [activeCategory, query]);

    return (
        <div className="min-h-screen bg-white">
            <main className="max-w-[1100px] mx-auto px-6 md:px-10 py-12 md:py-20">
                <Breadcrumb
                    items={[
                        { label: "Home", href: "/" },
                        { label: "FAQ" },
                    ]}
                />

                {/* Title */}
                <section className="text-center mt-10">
                    <h1 className="uppercase tracking-[0.18em] text-[32px] md:text-[56px] font-light text-[#003049] leading-tight">
                        FREQUENTLY ASKED
                        <br />
                        <span className="text-[#C1121F] font-normal">QUESTIONS</span>
                    </h1>

                    <p className="mt-4 text-[12px] md:text-[14px] uppercase tracking-[0.14em] text-[#003049]/70">
                        Find quick answers about orders, shipping, returns, and more
                    </p>
                </section>

                {/* Controls */}
                <section className="mt-14">
                    <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                        {/* Search */}
                        <div className="w-full md:max-w-[520px]">
                            <input
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setOpenIndex(0); // reset accordion here
                                }}
                                placeholder="Search (e.g., delivery, return, payment)"
                                className="
                  w-full border border-gray-300 bg-white
                  px-4 py-4 text-sm outline-none
                  focus:border-[#003049]
                  focus:ring-2 focus:ring-[#003049]/15
                "
                            />
                        </div>

                        {/* Category Pills */}
                        <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                            {CATEGORIES.map((cat) => {
                                const isActive = cat === activeCategory;
                                return (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => {
                                            setActiveCategory(cat);
                                            setOpenIndex(0); // reset accordion here 
                                        }}
                                        className={[
                                            "px-4 py-2 rounded-full text-sm font-medium transition",
                                            isActive
                                                ? "bg-[#003049] text-white shadow-sm"
                                                : "bg-gray-100 text-[#003049] hover:bg-gray-200",
                                        ].join(" ")}
                                    >
                                        {cat}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* FAQ List */}
                <section className="mt-12">
                    <div className="border border-gray-200">
                        {filtered.length === 0 ? (
                            <div className="p-8 text-center text-[#003049]/70">
                                No results found. Try a different keyword.
                            </div>
                        ) : (
                            filtered.map((item, idx) => {
                                const isOpen = openIndex === idx;

                                return (
                                    <div
                                        key={`${item.question}-${idx}`}
                                        className="border-b last:border-b-0 border-gray-200"
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpenIndex(isOpen ? null : idx)}
                                            className="w-full px-6 md:px-8 py-5 flex items-center justify-between text-left"
                                        >
                                            <div>
                                                <p className="text-[12px] uppercase tracking-[0.14em] text-[#003049]/60">
                                                    {item.category}
                                                </p>
                                                <h3 className="mt-1 text-[16px] md:text-[18px] font-semibold text-[#003049]">
                                                    {item.question}
                                                </h3>
                                            </div>

                                            <span
                                                className={[
                                                    "ml-4 shrink-0 transition-transform duration-200",
                                                    isOpen ? "rotate-180" : "rotate-0",
                                                ].join(" ")}
                                            >
                                                <FiChevronDown className="text-xl text-[#003049]" />
                                            </span>
                                        </button>

                                        <div
                                            className={[
                                                "grid transition-all duration-300 ease-out",
                                                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                                            ].join(" ")}
                                        >
                                            <div className="overflow-hidden">
                                                <div className="px-6 md:px-8 pb-6 text-[15px] leading-relaxed text-[#003049]/85">
                                                    {item.answer}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-10 text-center text-sm text-gray-500">
                        Still need help? Visit{" "}
                        <a href="/contact-us" className="text-[#C1121F] hover:underline">
                            Contact Us
                        </a>
                        .
                    </div>
                </section>
            </main>
        </div>
    );
}