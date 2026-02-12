export type Product = {
    id: number;
    name: string;
    images: string[];
    oldPrice?: number;
    price: number;
    rating: number;
    reviews: number;
    colors: string[];

    // NEW
    description: string[];
    features: string[];
};

export const products: Product[] = [
    {
        id: 1,
        name: "Flannel Polo",
        images: [
            "/products/flannel-1.jpg",
            "/products/flannel-2.jpg",
            "/products/flannel-3.jpg",
            "/products/flannel-4.jpg",
        ],
        price: 1000,
        rating: 4.8,
        reviews: 594,
        colors: ["#F59E0B", "#B91C1C", "#0F172A"],

        description: [
            "Elevate your cool-weather rotation with a shirt that bridges rugged comfort and refined style. The Flannel Polo blends the softness of brushed cotton with the clean structure of a modern polo.",
            "Designed for versatility, it works effortlessly for casual Fridays, relaxed weekends, or layering during colder days."
        ],
        features: [
            "Ultra-soft brushed cotton fabric",
            "Structured polo collar that holds its shape",
            "Breathable mid-weight material",
            "Tailored modern fit",
            "Pre-shrunk for long-lasting wear"
        ],
    },

    {
        id: 2,
        name: "Windbreaker",
        images: [
            "/products/windbreaker-1.jpg",
            "/products/windbreaker-2.jpg",
            "/products/windbreaker-3.jpg",
            "/products/windbreaker-4.jpg",
        ],
        oldPrice: 2000,
        price: 1200,
        rating: 4.9,
        reviews: 650,
        colors: ["#DED7C6", "#4A4E69", "#198A13"],

        description: [
            "Built for unpredictable weather, this windbreaker delivers lightweight protection without sacrificing style.",
            "Its streamlined silhouette makes it perfect for urban wear or outdoor movement."
        ],
        features: [
            "Water-resistant outer shell",
            "Lightweight and breathable fabric",
            "Adjustable cuffs and hem",
            "Packable design for travel",
            "Durable zip closure"
        ],
    },

    {
        id: 3,
        name: "Full-Zip Hoodie",
        images: [
            "/products/full-zip-hoodie-1.jpg",
            "/products/full-zip-hoodie-2.jpg",
            "/products/full-zip-hoodie-3.jpg",
            "/products/full-zip-hoodie-4.jpg",
        ],
        price: 2400,
        rating: 4.9,
        reviews: 434,
        colors: ["#003049", "#A52A2A", "#F59E0B"],

        description: [
            "The Full-Zip Hoodie is crafted for everyday comfort with a premium feel.",
            "Whether worn indoors or layered outside, it delivers warmth without bulk."
        ],
        features: [
            "Soft fleece interior",
            "Full-length durable zipper",
            "Adjustable hood with drawstrings",
            "Ribbed cuffs and hem",
            "Relaxed everyday fit"
        ],
    },

    {
        id: 4,
        name: "Baggy Curved Jeans",
        images: [
            "/products/baggy-curved-jeans-1.jpg",
            "/products/baggy-curved-jeans-2.jpg",
            "/products/baggy-curved-jeans-3.jpg",
            "/products/baggy-curved-jeans-4.jpg",
        ],
        oldPrice: 2000,
        price: 1500,
        rating: 5.0,
        reviews: 245,
        colors: ["#657994", "#4A4E69", "#7E92AF"],

        description: [
            "Inspired by modern streetwear, the Baggy Curved Jeans redefine relaxed denim.",
            "Designed with a curved leg structure, they offer movement, comfort, and bold style."
        ],
        features: [
            "Premium heavyweight denim",
            "Relaxed baggy silhouette",
            "Curved leg construction",
            "Reinforced stitching",
            "Fade-resistant wash"
        ],
    },

    // DUPLICATES (same structure, different IDs)
    ...Array.from({ length: 8 }, (_, i) => ({
        id: i + 5,
        name: ["Flannel Polo", "Windbreaker", "Full-Zip Hoodie", "Baggy Curved Jeans"][i % 4],
        images:
            i % 4 === 0
                ? ["/products/flannel-1.jpg", "/products/flannel-2.jpg", "/products/flannel-3.jpg", "/products/flannel-4.jpg"]
                : i % 4 === 1
                    ? ["/products/windbreaker-1.jpg", "/products/windbreaker-2.jpg", "/products/windbreaker-3.jpg", "/products/windbreaker-4.jpg"]
                    : i % 4 === 2
                        ? ["/products/full-zip-hoodie-1.jpg", "/products/full-zip-hoodie-2.jpg", "/products/full-zip-hoodie-3.jpg", "/products/full-zip-hoodie-4.jpg"]
                        : ["/products/baggy-curved-jeans-1.jpg", "/products/baggy-curved-jeans-2.jpg", "/products/baggy-curved-jeans-3.jpg", "/products/baggy-curved-jeans-4.jpg"],
        price: [1000, 1200, 2400, 1500][i % 4],
        rating: 4.8,
        reviews: 300 + i * 20,
        colors: ["#003049", "#A52A2A", "#F59E0B"],

        description: [
            "A premium essential designed for comfort and everyday wear.",
            "Built with quality materials to ensure durability and style."
        ],
        features: [
            "High-quality fabric",
            "Modern silhouette",
            "Comfort-focused design",
            "Durable construction",
            "Easy maintenance"
        ],
    })),
];
