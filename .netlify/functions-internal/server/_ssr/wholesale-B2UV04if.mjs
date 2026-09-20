import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime, l as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { o as products, r as formatPrice, s as useStore } from "./store-context-bavYrowS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wholesale-B2UV04if.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Wholesale() {
	const { add } = useStore();
	const [qty, setQty] = (0, import_react.useState)({});
	const total = products.reduce((s, p) => s + (qty[p.id] ?? 0) * p.price, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-foreground text-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4 py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-bold text-secondary",
					children: "FOR SHOPS, OFFICES & INSTITUTIONS"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 max-w-3xl text-4xl font-black sm:text-5xl",
					children: "Bulk buying without phone calls or hidden prices."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-2xl opacity-70",
					children: "Mix products, choose quantities and see your approximate order total instantly. Tier prices apply in your cart."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-7 grid max-w-2xl grid-cols-3 gap-3 text-center",
					children: [
						["12+", "items"],
						["Up to 25%", "savings"],
						["GST", "invoice"]
					].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-background/20 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "block text-xl text-secondary",
							children: x[0]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs opacity-60",
							children: x[1]
						})]
					}, x[0]))
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-7xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-3xl font-black",
					children: "Build your bulk order"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "Enter pack quantities. Minimum combined quantity: 12."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden text-right sm:block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Estimated retail total"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
						className: "text-2xl",
						children: formatPrice(total)
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 overflow-x-auto rounded-lg border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[680px] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4",
								children: "Product"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Retail" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "12+ price" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "48+ price" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-4",
								children: "Quantity"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: products.slice(0, 7).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "flex items-center gap-3 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: p.image,
									alt: "",
									className: "size-12 rounded object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: p.name })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: formatPrice(p.price) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "font-bold text-primary",
								children: formatPrice(p.bulk[0]?.[1] ?? p.price)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "font-bold text-primary",
								children: formatPrice(p.bulk[1]?.[1] ?? p.price)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: "0",
									value: qty[p.id] ?? 0,
									onChange: (e) => setQty((q) => ({
										...q,
										[p.id]: Math.max(0, Number(e.target.value))
									})),
									className: "w-20 rounded-md border border-input bg-background px-3 py-2"
								})
							})
						]
					}, p.id)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "sticky bottom-14 mt-5 flex items-center justify-between rounded-lg bg-foreground p-4 text-background shadow-xl sm:bottom-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [Object.values(qty).reduce((a, b) => a + b, 0), " packs"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs opacity-60",
					children: ["Estimated ", formatPrice(total)]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					disabled: !Object.values(qty).some(Boolean),
					onClick: () => Object.entries(qty).forEach(([id, n]) => n && add(id, n)),
					children: "Add bulk order to cart"
				})]
			})
		]
	})] });
}
//#endregion
export { Wholesale as component };
