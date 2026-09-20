import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime, l as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { o as SlidersHorizontal } from "../_libs/lucide-react.mjs";
import { n as categories, o as products } from "./store-context-bavYrowS.mjs";
import { t as ProductCard } from "./product-card-CY_wTLgk.mjs";
import { t as Route } from "./shop-BcU2c7dd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-CY_kdpCr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Shop() {
	const search = Route.useSearch();
	const [cat, setCat] = (0, import_react.useState)(search.category ?? "all");
	const [sort, setSort] = (0, import_react.useState)("popular");
	const list = (0, import_react.useMemo)(() => {
		return [...products.filter((p) => (cat === "all" || p.category === cat) && (!search.q || p.name.toLowerCase().includes(search.q.toLowerCase())))].sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : b.rating - a.rating);
	}, [
		cat,
		sort,
		search.q
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-7xl px-4 py-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-bold text-primary",
					children: search.q ? `Results for “${search.q}”` : "Everyday essentials"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-4xl font-black",
					children: "Shop all products"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-muted-foreground",
					children: [list.length, " useful products, ready to dispatch."]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "text-sm font-semibold",
				children: ["Sort by ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: sort,
					onChange: (e) => setSort(e.target.value),
					className: "ml-2 rounded-md border border-input bg-background px-3 py-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "popular",
							children: "Popularity"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "low",
							children: "Price: low to high"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "high",
							children: "Price: high to low"
						})
					]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-7 grid gap-6 lg:grid-cols-[220px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center gap-2 font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-4" }), " Categories"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 overflow-x-auto pb-2 lg:flex-col",
					children: [{
						slug: "all",
						name: "All products"
					}, ...categories].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: cat === c.slug ? "default" : "outline",
						className: "justify-start",
						onClick: () => setCat(c.slug),
						children: c.name
					}, c.slug))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-7 hidden border-t border-border pt-5 lg:block",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Price" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-3 block text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								className: "mr-2"
							}), "Under ₹100"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-2 block text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								className: "mr-2"
							}), "₹100–₹250"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "mt-6 block",
							children: "Availability"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-3 block text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								defaultChecked: true,
								className: "mr-2"
							}), "In stock"]
						})
					]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", { children: list.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4",
				children: list.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-dashed border-border p-12 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-bold",
					children: "No matching products"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-muted-foreground",
					children: "Try a broader search or another category."
				})]
			}) })]
		})]
	});
}
//#endregion
export { Shop as component };
