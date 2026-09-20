import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { c as require_jsx_runtime, l as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { _ as MessageCircle, b as Mail, p as Phone } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-BFUcT8aU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
function Page() {
	const [sent, setSent] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-5xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-bold text-primary",
				children: "WE’RE HERE TO HELP"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-4xl font-black",
				children: "Contact us"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-7 md:grid-cols-[1fr_1.4fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "space-y-3",
					children: [
						{
							icon: Phone,
							title: "Call us",
							sub: "Mon–Sat, 9 am–7 pm"
						},
						{
							icon: MessageCircle,
							title: "WhatsApp",
							sub: "Quick product and order help"
						},
						{
							icon: Mail,
							title: "Email",
							sub: "Replies within one working day"
						}
					].map(({ icon: Icon, title, sub }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3 rounded-lg border border-border bg-card p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: sub
						})] })]
					}, title))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						setSent(true);
					},
					className: "rounded-lg border border-border bg-card p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl font-black",
							children: "Send a message"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid gap-4 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									required: true,
									placeholder: "Your name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									required: true,
									type: "email",
									placeholder: "Email address"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "sm:col-span-2",
									placeholder: "Order number (optional)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									required: true,
									className: "sm:col-span-2 min-h-32",
									placeholder: "How can we help?"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-4",
							type: "submit",
							children: "Send message"
						}),
						sent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm font-bold text-primary",
							children: "Message received. This demo did not send data anywhere."
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { Page as component };
