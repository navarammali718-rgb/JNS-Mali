import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Clock, T as Check, h as PackageCheck, r as Truck } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-CGjBnXFx.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-5xl px-4 py-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-4xl font-black",
			children: "Orders & tracking"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "mt-7 rounded-lg border border-border bg-card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap justify-between gap-3 border-b border-border p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "ORDER #GH24871 · 17 SEP 2026"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-black",
					children: "Arriving by 23 September"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						children: "Buy again"
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4 gap-1",
					children: [
						{
							icon: Check,
							title: "Confirmed"
						},
						{
							icon: PackageCheck,
							title: "Packed"
						},
						{
							icon: Truck,
							title: "Shipped"
						},
						{
							icon: Clock,
							title: "Delivered"
						}
					].map(({ icon: Icon, title }, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `mx-auto grid size-9 place-items-center rounded-full ${i < 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `mt-2 h-1 ${i < 1 ? "bg-primary" : "bg-muted"}` }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs font-bold",
								children: title
							})
						]
					}, title))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-7 rounded-md bg-accent/40 p-4 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Packed at Pune warehouse" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Your parcel will be handed to the delivery partner shortly."
						})
					]
				})]
			})]
		})]
	});
}
//#endregion
export { Page as component };
