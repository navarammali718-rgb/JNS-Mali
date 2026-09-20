import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { x as Heart } from "../_libs/lucide-react.mjs";
import { o as products, s as useStore } from "./store-context-bavYrowS.mjs";
import { t as ProductCard } from "./product-card-CY_wTLgk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wishlist-DPJ8wyO1.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	const { wishlist } = useStore();
	const list = products.filter((p) => wishlist.includes(p.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-7xl px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-4xl font-black",
				children: "My wishlist"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted-foreground",
				children: "Your saved everyday essentials."
			}),
			list.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-7 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5",
				children: list.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 rounded-lg border border-dashed p-14 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "mx-auto size-12" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 text-xl font-bold",
						children: "Nothing saved yet"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "mt-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop",
							children: "Browse products"
						})
					})
				]
			})
		]
	});
}
//#endregion
export { Page as component };
