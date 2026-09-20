import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { o as products } from "./store-context-bavYrowS.mjs";
import { t as Route } from "./category._slug-GJ9Bzx_U.mjs";
import { t as ProductCard } from "./product-card-CY_wTLgk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/category._slug-CMJw1MNK.js
var import_jsx_runtime = require_jsx_runtime();
function Category() {
	const c = Route.useLoaderData();
	const list = products.filter((p) => p.category === c.slug);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "bg-accent/40",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-7xl items-center gap-6 px-4 py-8 sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-bold text-primary",
					children: [c.count, " products"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 text-4xl font-black",
					children: c.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-muted-foreground",
					children: [
						"Reliable ",
						c.blurb.toLowerCase(),
						" for daily use, with better prices on larger quantities."
					]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: c.image,
				alt: c.name,
				width: 1008,
				height: 1008,
				className: "aspect-[2/1] w-full rounded-lg object-cover"
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-7xl px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4",
			children: list.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
		})
	})] });
}
//#endregion
export { Category as component };
