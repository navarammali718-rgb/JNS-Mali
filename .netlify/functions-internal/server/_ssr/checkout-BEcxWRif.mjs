import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime, l as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as CreditCard, T as Check, r as Truck, y as MapPin } from "../_libs/lucide-react.mjs";
import { r as formatPrice, s as useStore } from "./store-context-bavYrowS.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-BEcxWRif.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Checkout() {
	const { subtotal } = useStore();
	const navigate = useNavigate();
	const [step, setStep] = (0, import_react.useState)(1);
	const [pay, setPay] = (0, import_react.useState)("upi");
	const total = subtotal + (subtotal >= 499 ? 0 : 49);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-5xl px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-4xl font-black",
				children: "Checkout"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid grid-cols-3 gap-2",
				children: [
					{
						n: 1,
						icon: MapPin,
						title: "Address"
					},
					{
						n: 2,
						icon: Truck,
						title: "Delivery"
					},
					{
						n: 3,
						icon: CreditCard,
						title: "Payment"
					}
				].map(({ n, icon: Icon, title }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex items-center gap-2 border-b-4 pb-3 text-sm font-bold ${step >= n ? "border-primary text-primary" : "border-border text-muted-foreground"}`,
					children: [step > n ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), title]
				}, title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-8 lg:grid-cols-[1fr_320px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-lg border border-border bg-card p-5 sm:p-7",
					children: [
						step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-black",
								children: "Delivery address"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 grid gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Full name",
										placeholder: "Ananya Sharma"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "Mobile number",
										placeholder: "98765 43210"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "sm:col-span-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
											label: "Address",
											placeholder: "Flat, building, street"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "City",
										placeholder: "Pune"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										label: "PIN code",
										placeholder: "411001"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								className: "mt-6 w-full",
								onClick: () => setStep(2),
								children: "Continue to delivery"
							})
						] }),
						step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-black",
								children: "Delivery method"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-5 flex cursor-pointer items-center justify-between rounded-lg border-2 border-primary bg-accent/30 p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Standard delivery" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
									className: "block text-muted-foreground",
									children: "Arrives in 2–4 business days"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: subtotal >= 499 ? "FREE" : "₹49" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								className: "mt-6 w-full",
								onClick: () => setStep(3),
								children: "Continue to payment"
							})
						] }),
						step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl font-black",
								children: "Choose payment"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-5 space-y-3",
								children: [
									{
										id: "upi",
										name: "UPI",
										sub: "Pay with any UPI app"
									},
									{
										id: "card",
										name: "Credit / debit card",
										sub: "Visa, Mastercard and RuPay"
									},
									{
										id: "cod",
										name: "Cash on delivery",
										sub: "Pay when your order arrives"
									}
								].map(({ id, name, sub }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: `flex cursor-pointer gap-3 rounded-lg border p-4 ${pay === id ? "border-primary bg-accent/30" : "border-border"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "radio",
										name: "pay",
										checked: pay === id,
										onChange: () => setPay(id)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										className: "block text-muted-foreground",
										children: sub
									})] })]
								}, id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "lg",
								className: "mt-6 w-full",
								onClick: () => void navigate({ to: "/order-confirmation" }),
								children: ["Place order · ", formatPrice(total)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-center text-xs text-muted-foreground",
								children: "Demo checkout—no payment will be charged."
							})
						] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "h-fit rounded-lg bg-muted p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-black",
							children: "Order summary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Items" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: formatPrice(subtotal) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Delivery" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: subtotal >= 499 ? "FREE" : "₹49" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex justify-between border-t border-border pt-4 text-xl font-black",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatPrice(total) })]
						})
					]
				})]
			})
		]
	});
}
function Field({ label, placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block text-sm font-semibold",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			className: "mt-1 h-11",
			placeholder
		})]
	});
}
//#endregion
export { Checkout as component };
