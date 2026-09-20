import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime, l as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Star, f as Plus, g as Minus, l as ShieldCheck, r as Truck, x as Heart } from "../_libs/lucide-react.mjs";
import { o as products, r as formatPrice, s as useStore } from "./store-context-bavYrowS.mjs";
import { t as ProductCard } from "./product-card-CY_wTLgk.mjs";
import { t as Route } from "./product._id-BOXViBoe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._id-BP7yIp7F.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Product() {
	const p = Route.useLoaderData();
	const { add, toggleWish, wishlist } = useStore();
	const [qty, setQty] = (0, import_react.useState)(1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-7xl px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "mb-5 text-sm text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						children: "Shop"
					}),
					" / ",
					p.name
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-8 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-lg bg-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: p.image,
						alt: p.name,
						width: 1008,
						height: 1008,
						className: "aspect-square w-full object-cover"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm font-bold uppercase text-primary",
							children: [
								p.pack,
								" · ",
								p.stock
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 text-3xl font-black sm:text-4xl",
							children: p.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center gap-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-4 fill-rating text-rating" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: p.rating }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [p.reviews, " verified ratings"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl font-black",
									children: formatPrice(p.price)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 text-muted-foreground line-through",
									children: formatPrice(p.mrp)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-2 font-bold text-deal",
									children: [
										"Save ",
										Math.round((1 - p.price / p.mrp) * 100),
										"%"
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 leading-7 text-muted-foreground",
							children: p.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 rounded-lg border border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border-b border-border bg-muted px-4 py-3 font-bold",
								children: "Bulk price breaks"
							}), p.bulk.map(([n, price]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between border-b border-border px-4 py-3 text-sm last:border-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [n, "+ packs"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", {
									className: "text-primary",
									children: [formatPrice(price), " each"]
								})]
							}, n))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex h-11 items-center rounded-md border border-input",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											onClick: () => setQty(Math.max(1, qty - 1)),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-8 text-center font-bold",
											children: qty
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											onClick: () => setQty(qty + 1),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {})
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "lg",
									className: "flex-1",
									onClick: () => add(p.id, qty),
									children: [
										"Add ",
										qty,
										" to cart"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "icon",
									className: "size-11",
									onClick: () => toggleWish(p.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: wishlist.includes(p.id) ? "fill-primary text-primary" : "" })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 grid grid-cols-2 gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "size-5 text-primary" }), "Delivery in 2–4 days"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-5 text-primary" }), "7-day replacement"]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-14",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-black",
					children: "You may also need"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 grid grid-cols-2 gap-3 md:grid-cols-4",
					children: products.filter((x) => x.id !== p.id).slice(0, 4).map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: x }, x.id))
				})]
			})
		]
	});
}
//#endregion
export { Product as component };
