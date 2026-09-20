import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-DGJETIXh.js
var import_jsx_runtime = require_jsx_runtime();
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-secondary/40",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-4xl px-4 py-16 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-bold text-primary",
						children: "OUR STORY"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 text-4xl font-black sm:text-5xl",
						children: "Small products. A smoother everyday."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground",
						children: "JNS MALI is built around an uncomplicated idea: useful household goods should be easy to find, fairly priced and dependable enough to reorder."
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto grid max-w-5xl gap-8 px-4 py-12 md:grid-cols-3",
			children: [
				["Useful first", "We choose practical products that solve familiar household jobs."],
				["Honest value", "Clear pack sizes, visible savings and no confusing price games."],
				["For homes and shops", "Buy one pack for home or a mixed carton for your business."]
			].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-black",
				children: x[0]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 leading-7 text-muted-foreground",
				children: x[1]
			})] }, x[0]))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-5xl px-4 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop",
					children: "Explore the range"
				})
			})
		})
	] });
}
//#endregion
export { Page as component };
