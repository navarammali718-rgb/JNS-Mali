import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as Trigger2, c as require_jsx_runtime, i as Root2, l as require_react, n as Header, r as Item, t as Content2 } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { w as ChevronDown } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/faq-C1nRQDyd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Accordion = Root2;
var AccordionItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
	ref,
	className: cn("border-b", className),
	...props
}));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
	className: "flex",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Trigger2, {
		ref,
		className: cn("flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })]
	})
}));
AccordionTrigger.displayName = Trigger2.displayName;
var AccordionContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("pb-4 pt-0", className),
		children
	})
}));
AccordionContent.displayName = Content2.displayName;
var faqs = [
	["When will my order arrive?", "Most in-stock orders are dispatched within 48 hours and arrive in 2–4 business days."],
	["Is cash on delivery available?", "Yes, COD is available on eligible orders and PIN codes. This storefront simulates payment selection only."],
	["How does bulk pricing work?", "Lower prices apply automatically when a product reaches its listed quantity tier. You can also mix products in the wholesale builder."],
	["Can I return an item?", "Unused items in original packaging may be returned within seven days of delivery."],
	["Do I receive a GST invoice?", "Yes. Add your GST details during checkout for business purchases."]
];
function Page() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-4 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-bold text-primary",
				children: "HELP CENTRE"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-4xl font-black",
				children: "Frequently asked questions"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
				type: "single",
				collapsible: true,
				className: "mt-8",
				children: faqs.map(([q, a], i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
					value: String(i),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
						className: "text-left text-base",
						children: q
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
						className: "leading-6 text-muted-foreground",
						children: a
					})]
				}, q))
			})
		]
	});
}
//#endregion
export { Page as component };
