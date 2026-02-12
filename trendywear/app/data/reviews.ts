export type Review = {
    id: number;
    productId: number; // important for matching reviews to products
    name: string;
    avatar: string;
    comment: string;
    date: string;
    likes: number;
};

export const reviews: Review[] = [
    {
        id: 1,
        productId: 1,
        name: "Cathy B. Latco",
        avatar: "/avatar.jpg",
        comment:
            "Honestly, I’m impressed by the quality for the price. The collar holds its shape well and the material is incredibly soft.",
        date: "1 week ago",
        likes: 10,
    },
    {
        id: 2,
        productId: 1,
        name: "Jack Cole",
        avatar: "/avatar.jpg",
        comment:
            "Bought this as a gift for my husband who is notoriously picky about textures. He loves it!",
        date: "1 week ago",
        likes: 22,
    },
];
