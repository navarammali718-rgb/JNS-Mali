import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as ShoppingBag, f as Plus, g as Minus, i as Trash2 } from "../_libs/lucide-react.mjs";
import { o as products, r as formatPrice, s as useStore } from "./store-context-bavYrowS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-BrYJP3Gx.js
var import_jsx_runtime = require_jsx_runtime();
function Cart() {
	const { cart, setQty, subtotal } = useStore();
	const items = products.filter((p) => cart[p.id]);
	const delivery = subtotal >= 499 ? 0 : 49;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-4xl font-black",
			children: "Your cart"
		}), items.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-7 grid gap-7 lg:grid-cols-[1fr_360px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "space-y-3",
				children: items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "grid grid-cols-[90px_minmax(0,1fr)_auto] gap-4 rounded-lg border border-border bg-card p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: p.image,
							alt: "",
							className: "size-[90px] rounded-md object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/product/$id",
									params: { id: p.id },
									className: "font-bold",
									children: p.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: p.pack
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex w-fit items-center rounded-md border border-input",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											onClick: () => setQty(p.id, (cart[p.id] ?? 0) - 1),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
											className: "w-7 text-center",
											children: cart[p.id] ?? 0
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											onClick: () => setQty(p.id, (cart[p.id] ?? 0) + 1),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {})
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: formatPrice(p.price * (cart[p.id] ?? 0)) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "mt-5 text-destructive",
								onClick: () => setQty(p.id, 0),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
							})]
						})
					]
				}, p.id))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "h-fit rounded-lg border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-black",
						children: "Order summary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						a: "Subtotal",
						b: formatPrice(subtotal)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
						a: "Delivery",
						b: delivery ? "₹49" : "FREE"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex justify-between border-t border-border pt-4 text-lg font-black",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatPrice(subtotal + delivery) })]
					}),
					subtotal < 499 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 rounded-md bg-secondary/60 p-3 text-xs font-semibold",
						children: [
							"Add ",
							formatPrice(499 - subtotal),
							" more for free delivery."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						className: "mt-5 w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/checkout",
							children: "Proceed to checkout"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						className: "mt-3 block text-center text-sm font-bold text-primary",
						children: "Continue shopping"
					})
				]
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 rounded-lg border border-dashed p-14 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "mx-auto size-12 text-muted-foreground" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-bold",
					children: "Your cart is empty"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						children: "Start shopping"
					})
				})
			]
		})]
	});
}
function Row({ a, b }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 flex justify-between text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: a
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: b })]
	});
}
//#endregion
export { Cart as component };
