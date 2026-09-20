import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as Package, n as UserRound, x as Heart, y as MapPin } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-BsdLjHxT.js
var import_jsx_runtime = require_jsx_runtime();
var links = [
	{
		icon: Package,
		title: "My orders",
		sub: "Track, return or buy again",
		to: "/orders"
	},
	{
		icon: Heart,
		title: "Wishlist",
		sub: "1 product saved",
		to: "/wishlist"
	},
	{
		icon: MapPin,
		title: "Addresses",
		sub: "Manage delivery addresses",
		to: "/contact"
	}
];
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-14 place-items-center rounded-full bg-secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Welcome back"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-black",
					children: "Ananya"
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-4 md:grid-cols-3",
				children: links.map(({ icon: Icon, title, sub, to }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to,
					className: "rounded-lg border border-border bg-card p-5 hover:border-primary",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-4 text-xl font-bold",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: sub
						})
					]
				}, title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 rounded-lg border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-black",
						children: "Account details"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-4 text-sm sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Mobile"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "block",
							children: "+91 ••••• 43210"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "block",
							children: "ananya@example.com"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-xs text-muted-foreground",
						children: "Demo account details are not stored or authenticated."
					})
				]
			})
		]
	});
}
//#endregion
export { Page as component };
