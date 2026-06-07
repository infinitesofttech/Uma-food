const products = [
  {
    id: 1,
    name: "Classic Urad Papad",
    slug: "classic-urad-papad",
    shortDesc: "The timeless classic made with premium black gram.",
    description: "Our signature Classic Urad Papad is crafted from the finest black gram (urad dal), hand-rolled to perfection. Each papad delivers a satisfying crunch with a subtle, authentic flavor that has delighted families for generations. Sun-dried naturally to preserve the purity of taste.",
    price: 120,
    original_price: 150,
    weight: "200g",
    image: "/images/product-urad.png",
    category: "classic",
    tags: ["bestseller", "classic"],
    rating: 4.8,
    reviews: 324,
    inStock: true,
    ingredients: ["Urad Dal", "Salt", "Black Pepper", "Asafoetida"],
    nutrition: { calories: "45 per papad", protein: "3g", carbs: "7g", fat: "0.5g" }
  },
  {
    id: 2,
    name: "Spicy Moong Papad",
    slug: "spicy-moong-papad",
    shortDesc: "A lighter alternative with a kick of spices.", /*
    description: "Light, crispy, and packed with flavor — our Spicy Moong Papad is made from premium green gram lentils. Infused with a blend of traditional spices, it offers a lighter texture with a bold, peppery kick that pairs perfectly with any meal.",
    */ description: "Light, crispy, and packed with flavor, our Spicy Moong Papad is made from premium green gram lentils. Infused with a blend of traditional spices, it offers a lighter texture with a bold, peppery kick that pairs perfectly with any meal.",
    price: 130,
    original_price: 160,
    weight: "200g",
    image: "/images/product-moong.png",
    category: "spicy",
    tags: ["popular"],
    rating: 4.6,
    reviews: 218,
    inStock: true,
    ingredients: ["Moong Dal", "Salt", "Red Chili", "Cumin Seeds", "Asafoetida"],
    nutrition: { calories: "40 per papad", protein: "3.5g", carbs: "6g", fat: "0.3g" }
  },
  {
    id: 3,
    name: "Jeera Special Papad",
    slug: "jeera-special-papad",
    shortDesc: "Flavored with roasted cumin seeds for a unique taste.",
    description: "Infused with the earthy warmth of hand-roasted cumin seeds, our Jeera Special Papad is a flavor-packed delight. The cumin adds a smoky depth to the crisp, golden papad, making it an irresistible companion for your meals or a standalone snack.",
    price: 140,
    original_price: 170,
    weight: "200g",
    image: "/images/product-jeera.png",
    category: "flavored",
    tags: ["new"],
    rating: 4.7,
    reviews: 156,
    inStock: true,
    ingredients: ["Urad Dal", "Cumin Seeds", "Salt", "Black Pepper"],
    nutrition: { calories: "43 per papad", protein: "3g", carbs: "7g", fat: "0.6g" }
  },
  {
    id: 4,
    name: "Garlic Lasun Papad",
    slug: "garlic-lasun-papad",
    shortDesc: "Rich garlic flavor combined with traditional crunch.",
    description: "For garlic lovers, our Lasun Papad is a masterpiece. Made with generous amounts of fresh garlic blended into the finest urad dal, every bite bursts with robust, aromatic garlic flavor. Perfectly sun-dried for the ultimate crispy experience.",
    price: 150,
    original_price: 180,
    weight: "200g",
    image: "/images/product-garlic.png",
    category: "flavored",
    tags: ["bestseller"],
    rating: 4.9,
    reviews: 287,
    inStock: true,
    ingredients: ["Urad Dal", "Garlic", "Salt", "Black Pepper", "Asafoetida"],
    nutrition: { calories: "46 per papad", protein: "3g", carbs: "7g", fat: "0.5g" }
  },
  {
    id: 5,
    name: "Chana Masala Papad",
    slug: "chana-masala-papad",
    shortDesc: "Protein-rich chickpea papad with special masalas.",
    description: "Our Chana Masala Papad brings together the protein-rich goodness of chickpea flour with a vibrant masala blend. The slightly thicker, rustic texture delivers an exceptional crunch, while the masala mix creates layers of complex, savory flavor.",
    price: 135,
    original_price: 165,
    weight: "200g",
    image: "/images/product-chana.png",
    category: "masala",
    tags: ["healthy"],
    rating: 4.5,
    reviews: 142,
    inStock: true,
    ingredients: ["Chana Dal", "Red Chili", "Cumin", "Coriander", "Salt"],
    nutrition: { calories: "48 per papad", protein: "4g", carbs: "6g", fat: "0.8g" }
  },
  {
    id: 6,
    name: "Mari Black Pepper Papad",
    slug: "mari-black-pepper-papad",
    shortDesc: "Extra spicy with crushed black pepper.", /*
    description: "Bold, fiery, and irresistible — our Mari Papad is loaded with freshly crushed black pepper that delivers a powerful, warming heat. Made from premium urad dal with a generous pepper punch, this is the choice for those who crave intensity.",
    */ description: "Bold, fiery, and irresistible, our Mari Papad is loaded with freshly crushed black pepper that delivers a powerful, warming heat. Made from premium urad dal with a generous pepper punch, this is the choice for those who crave intensity.",
    price: 145,
    original_price: 175,
    weight: "200g",
    image: "/images/product-pepper.png",
    category: "spicy",
    tags: ["popular", "spicy"],
    rating: 4.7,
    reviews: 198,
    inStock: true,
    ingredients: ["Urad Dal", "Black Pepper", "Salt", "Asafoetida"],
    nutrition: { calories: "44 per papad", protein: "3g", carbs: "7g", fat: "0.4g" }
  },
  {
    id: 7,
    name: "Extra Crispy Masala Papad",
    slug: "extra-crispy-masala-papad",
    shortDesc: "A premium masala-spiced papad with extra crunch.", /*
    description: "Our Extra Crispy Masala Papad is the answer to those who want it all — maximum crunch, maximum flavor. A proprietary spice blend is mixed into fine urad dal to create papads that shatter beautifully with every bite, releasing waves of spicy, tangy goodness.",
    */ description: "Our Extra Crispy Masala Papad is the answer to those who want it all: maximum crunch and maximum flavor. A proprietary spice blend is mixed into fine urad dal to create papads that shatter beautifully with every bite, releasing waves of spicy, tangy goodness.",
    price: 160,
    original_price: 200,
    weight: "250g",
    image: "/images/product-masala.png",
    category: "masala",
    tags: ["premium", "new"],
    rating: 4.8,
    reviews: 89,
    inStock: true,
    ingredients: ["Urad Dal", "Red Chili", "Cumin", "Coriander", "Turmeric", "Salt"],
    nutrition: { calories: "47 per papad", protein: "3g", carbs: "7g", fat: "0.7g" }
  },
  {
    id: 8,
    name: "Mini Party Pack Papad",
    slug: "mini-party-pack-papad",
    shortDesc: "Bite-sized papads perfect for parties and snacking.",
    description: "Fun-sized and flavor-packed, our Mini Party Pack contains bite-sized papads ideal for gatherings, parties, and quick snacking. Made from the same premium ingredients as our full-sized range, these mini papads fry up in seconds for instant crispy gratification.",
    price: 180,
    original_price: 220,
    weight: "300g",
    image: "/images/product-urad.png",
    category: "special",
    tags: ["party", "popular"],
    rating: 4.6,
    reviews: 176,
    inStock: true,
    ingredients: ["Urad Dal", "Moong Dal", "Mixed Spices", "Salt"],
    nutrition: { calories: "42 per serving", protein: "3g", carbs: "6g", fat: "0.5g" }
  }
];

export const categories = [
  { id: "all", name: "All Products", count: products.length },
  { id: "classic", name: "Classic", count: products.filter(p => p.category === "classic").length },
  { id: "spicy", name: "Spicy", count: products.filter(p => p.category === "spicy").length },
  { id: "flavored", name: "Flavored", count: products.filter(p => p.category === "flavored").length },
  { id: "masala", name: "Masala", count: products.filter(p => p.category === "masala").length },
  { id: "special", name: "Special", count: products.filter(p => p.category === "special").length },
];

export const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai, Maharashtra", /*
    text: "Uma Papad reminds me of my grandmother's kitchen. The crunch, the flavor, the aroma — it's pure nostalgia in every bite. Absolutely the best papad I've had!",
    */ text: "Uma Papad reminds me of my grandmother's kitchen. The crunch, the flavor, the aroma - it's pure nostalgia in every bite. Absolutely the best papad I've had!",
    rating: 5,
    avatar: "PS"
  },
  {
    id: 2,
    name: "Rajesh Patel",
    location: "Ahmedabad, Gujarat",
    text: "We've been ordering Uma Papad for our restaurant chain. The consistency in quality is remarkable. Our customers specifically ask for it by name!",
    rating: 5,
    avatar: "RP"
  },
  {
    id: 3,
    name: "Meera Desai",
    location: "Pune, Maharashtra",
    text: "The Garlic Lasun Papad is a game-changer. So much flavor in every piece! I've tried many brands but Uma Papad stands out for its authentic taste.",
    rating: 5,
    avatar: "MD"
  },
  {
    id: 4,
    name: "Amit Kumar",
    location: "Delhi",
    text: "Finally, a papad brand that delivers the real deal. The Jeera Special is my family's absolute favorite. Great quality and fast delivery too!",
    rating: 4,
    avatar: "AK"
  }
];

export default products;
