import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Star, f as Plus, x as Heart } from "../_libs/lucide-react.mjs";
import { r as formatPrice, s as useStore } from "./store-context-bavYrowS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-card-CY_wTLgk.js
var import_jsx_runtime = require_jsx_runtime();
function ProductCard({ product }) {
	const { add, toggleWish, wishlist } = useStore();
	const wished = wishlist.includes(product.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-lg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative overflow-hidden bg-muted",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/product/$id",
					params: { id: product.id },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: product.image,
						alt: product.name,
						loading: "lazy",
						width: 1008,
						height: 1008,
						className: "aspect-square w-full object-cover transition duration-300 group-hover:scale-[1.03]"
					})
				}),
				product.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute left-2 top-2 rounded-sm bg-deal px-2 py-1 text-[11px] font-bold text-deal-foreground",
					children: product.badge
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					size: "icon",
					"aria-label": wished ? "Remove from wishlist" : "Add to wishlist",
					onClick: () => toggleWish(product.id),
					className: "absolute right-2 top-2 rounded-full shadow-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: wished ? "fill-primary text-primary" : "" })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col p-3 sm:p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium text-muted-foreground",
					children: product.pack
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/product/$id",
					params: { id: product.id },
					className: "mt-1 line-clamp-2 min-h-10 text-sm font-bold leading-5 text-foreground hover:text-primary",
					children: product.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex items-center gap-1 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3.5 fill-rating text-rating" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: product.rating }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: [
								"(",
								product.reviews,
								")"
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto flex items-end justify-between gap-2 pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-lg font-extrabold",
						children: formatPrice(product.price)
					}), product.mrp && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-1 text-xs text-muted-foreground line-through",
						children: formatPrice(product.mrp)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => add(product.id),
						"aria-label": `Add ${product.name} to cart`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Add"
							})
						]
					})]
				})
			]
		})]
	});
}
//#endregion
export { ProductCard as t };
