import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime, l as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-context-bavYrowS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var kitchen_cleaning_default = "/assets/kitchen-cleaning-ZBmfOZYj.jpg";
var bath_care_default = "/assets/bath-care-C6AvU-8D.jpg";
var home_utility_default = "/assets/home-utility-CU9iLHoz.jpg";
var categories = [
	{
		slug: "kitchen-cleaning",
		name: "Kitchen Cleaning",
		image: kitchen_cleaning_default,
		count: 18,
		blurb: "Scrubbers, pads & brushes"
	},
	{
		slug: "bath-care",
		name: "Bath Care",
		image: bath_care_default,
		count: 12,
		blurb: "Loofahs & body brushes"
	},
	{
		slug: "home-utility",
		name: "Home Utility",
		image: home_utility_default,
		count: 16,
		blurb: "Everyday home helpers"
	},
	{
		slug: "camphor",
		name: "Camphor & More",
		image: home_utility_default,
		count: 8,
		blurb: "Pure daily essentials"
	}
];
var products = [
	{
		id: "power-scrub-sponges",
		name: "Power Scrub Sponge — Pack of 4",
		category: "kitchen-cleaning",
		price: 79,
		mrp: 110,
		rating: 4.7,
		reviews: 624,
		pack: "4 pieces",
		image: kitchen_cleaning_default,
		badge: "Bestseller",
		description: "Dual-layer sponge with a tough green scouring surface and soft absorbent foam for everyday dishes.",
		stock: "In stock",
		bulk: [[12, 69], [48, 59]]
	},
	{
		id: "steel-scrubber",
		name: "Stainless Steel Scrubber",
		category: "kitchen-cleaning",
		price: 45,
		mrp: 60,
		rating: 4.6,
		reviews: 418,
		pack: "Pack of 3",
		image: kitchen_cleaning_default,
		badge: "28% off",
		description: "Rust-resistant spiral scrubbers for stubborn stains on steel cookware and kadais.",
		stock: "In stock",
		bulk: [[12, 39], [60, 34]]
	},
	{
		id: "scouring-pads",
		name: "Heavy Duty Scouring Pads",
		category: "kitchen-cleaning",
		price: 55,
		mrp: 80,
		rating: 4.5,
		reviews: 281,
		pack: "Pack of 5",
		image: kitchen_cleaning_default,
		description: "Long-lasting fibre pads that cut grease while retaining shape through repeated use.",
		stock: "In stock",
		bulk: [[10, 49], [50, 41]]
	},
	{
		id: "dish-brush",
		name: "Easy Grip Dish Brush",
		category: "kitchen-cleaning",
		price: 99,
		mrp: 139,
		rating: 4.4,
		reviews: 156,
		pack: "1 piece",
		image: kitchen_cleaning_default,
		badge: "New",
		description: "Comfortable grip and firm rounded bristles for vessels, sinks and tile corners.",
		stock: "Only 7 left",
		bulk: [[12, 89], [36, 79]]
	},
	{
		id: "mesh-loofah",
		name: "CloudSoft Mesh Loofah",
		category: "bath-care",
		price: 69,
		mrp: 99,
		rating: 4.8,
		reviews: 902,
		pack: "Pack of 2",
		image: bath_care_default,
		badge: "Popular",
		description: "Soft, full mesh loofahs with hanging loops for a rich lather and gentle daily exfoliation.",
		stock: "In stock",
		bulk: [[12, 59], [48, 49]]
	},
	{
		id: "rope-bath-brush",
		name: "Nylon Rope Bath Scrubber",
		category: "bath-care",
		price: 119,
		mrp: 165,
		rating: 4.6,
		reviews: 337,
		pack: "1 piece",
		image: bath_care_default,
		description: "Long braided scrubber that reaches the back comfortably and dries quickly after use.",
		stock: "In stock",
		bulk: [[12, 105], [36, 94]]
	},
	{
		id: "long-bath-brush",
		name: "Long Handle Bath Brush",
		category: "bath-care",
		price: 179,
		mrp: 240,
		rating: 4.3,
		reviews: 194,
		pack: "1 piece",
		image: bath_care_default,
		description: "Curved handle and skin-friendly bristles for easy daily bathing and dry brushing.",
		stock: "In stock",
		bulk: [[8, 159], [24, 139]]
	},
	{
		id: "microfibre-cloths",
		name: "Everyday Microfibre Cloths",
		category: "home-utility",
		price: 149,
		mrp: 199,
		rating: 4.7,
		reviews: 513,
		pack: "Pack of 4",
		image: home_utility_default,
		badge: "Value pack",
		description: "Colour-coded, lint-free cleaning cloths for kitchen counters, glass and furniture.",
		stock: "In stock",
		bulk: [[10, 129], [40, 109]]
	},
	{
		id: "utility-brush",
		name: "Firm Grip Utility Brush",
		category: "home-utility",
		price: 89,
		mrp: 125,
		rating: 4.4,
		reviews: 209,
		pack: "1 piece",
		image: home_utility_default,
		description: "Dense angled bristles for floors, bathrooms, balconies and hard-to-reach edges.",
		stock: "In stock",
		bulk: [[12, 79], [48, 69]]
	},
	{
		id: "pure-camphor",
		name: "Pure Camphor Tablets",
		category: "camphor",
		price: 129,
		mrp: 160,
		rating: 4.8,
		reviews: 1204,
		pack: "100 g jar",
		image: home_utility_default,
		badge: "Top rated",
		description: "Clean-burning premium camphor tablets in a secure reusable jar for everyday puja.",
		stock: "In stock",
		bulk: [[12, 115], [48, 99]]
	}
];
var formatPrice = (n) => new Intl.NumberFormat("en-IN", {
	style: "currency",
	currency: "INR",
	maximumFractionDigits: 0
}).format(n);
var getProduct = (id) => products.find((p) => p.id === id);
var getCategory = (slug) => categories.find((c) => c.slug === slug);
var StoreContext = (0, import_react.createContext)(void 0);
function StoreProvider({ children }) {
	const [cart, setCart] = (0, import_react.useState)({});
	const [wishlist, setWishlist] = (0, import_react.useState)([]);
	const [isInitialized, setIsInitialized] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("jns-mali_cart");
			if (saved) try {
				setCart(JSON.parse(saved) || {});
			} catch (e) {}
			setIsInitialized(true);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		if (isInitialized && typeof window !== "undefined") localStorage.setItem("jns-mali_cart", JSON.stringify(cart));
	}, [cart, isInitialized]);
	const add = (id, qty = 1) => setCart((c) => ({
		...c,
		[id]: (c[id] ?? 0) + qty
	}));
	const setQty = (id, qty) => setCart((c) => {
		const n = { ...c };
		if (qty <= 0) delete n[id];
		else n[id] = qty;
		return n;
	});
	const toggleWish = (id) => setWishlist((w) => w.includes(id) ? w.filter((x) => x !== id) : [...w, id]);
	const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
	const subtotal = (0, import_react.useMemo)(() => products.reduce((s, p) => s + p.price * (cart[p.id] ?? 0), 0), [cart]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreContext.Provider, {
		value: {
			cart,
			wishlist,
			add,
			setQty,
			toggleWish,
			cartCount,
			subtotal
		},
		children
	});
}
function useStore() {
	const v = (0, import_react.useContext)(StoreContext);
	if (!v) throw new Error("StoreProvider missing");
	return v;
}
//#endregion
export { getProduct as a, getCategory as i, categories as n, products as o, formatPrice as r, useStore as s, StoreProvider as t };
