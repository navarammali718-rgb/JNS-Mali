import { o as __toESM } from "../_runtime.mjs";
import { c as require_jsx_runtime, l as require_react } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { _ as useRouter, c as HeadContent, d as Outlet, f as lazyRouteComponent, g as useNavigate, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as Package, n as UserRound, s as ShoppingCart, t as X, u as Search, v as Menu, x as Heart } from "../_libs/lucide-react.mjs";
import { s as useStore, t as StoreProvider } from "./store-context-bavYrowS.mjs";
import { t as Route$21 } from "./category._slug-GJ9Bzx_U.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Route$22 } from "./product._id-BOXViBoe.mjs";
import { t as Route$23 } from "./shop-BcU2c7dd.mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BAhhW7NR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var nav = [
	{
		label: "Home",
		to: "/"
	},
	{
		label: "Shop",
		to: "/shop"
	},
	{
		label: "About Us",
		to: "/about"
	},
	{
		label: "Contact Us",
		to: "/contact"
	}
];
function SiteShell({ children }) {
	const { cartCount, wishlist } = useStore();
	const [menu, setMenu] = (0, import_react.useState)(false);
	const [q, setQ] = (0, import_react.useState)("");
	const navigate = useNavigate();
	const search = (e) => {
		e.preventDefault();
		navigate({
			to: "/shop",
			search: {
				q: q || void 0,
				category: void 0
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-primary px-4 py-2 text-center text-xs font-semibold text-primary-foreground",
				children: [
					"Free delivery above ₹499 ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-2 opacity-60",
						children: "•"
					}),
					" COD available ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "hidden sm:inline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mx-2 opacity-60",
							children: "•"
						}), " Extra savings on bulk orders"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "lg:hidden",
								onClick: () => setMenu(!menu),
								"aria-label": "Toggle menu",
								children: menu ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								className: "hidden shrink-0 items-center gap-2 sm:flex",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid size-10 place-items-center rounded-lg bg-primary text-xl font-black text-primary-foreground",
									children: "GH"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
									className: "block text-xl leading-none",
									children: "JNS MALI"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
									className: "text-[10px] font-bold uppercase text-muted-foreground",
									children: "Har ghar ka saathi"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: search,
								className: "mx-auto flex w-full max-w-2xl",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: q,
									onChange: (e) => setQ(e.target.value),
									placeholder: "Search scrubbers, loofahs, brushes…",
									"aria-label": "Search products",
									className: "h-11 rounded-r-none border-r-0 bg-muted/60"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "h-11 rounded-l-none px-4",
									"aria-label": "Search",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
								className: "flex items-center justify-end gap-0.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										variant: "ghost",
										size: "icon",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/wishlist",
											"aria-label": `Wishlist with ${wishlist.length} items`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, {})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										variant: "ghost",
										size: "icon",
										className: "hidden sm:inline-flex",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/account",
											"aria-label": "Account",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, {})
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										variant: "secondary",
										className: "relative px-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/cart",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, {}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "hidden sm:inline",
													children: "Cart"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "grid size-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground",
													children: cartCount
												})
											]
										})
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: `${menu ? "flex" : "hidden"} flex-col gap-1 border-t border-border py-3 lg:flex lg:flex-row lg:items-center lg:border-0 lg:py-0`,
						children: [nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: item.to,
							className: "px-3 py-2 text-sm font-semibold text-foreground/80 hover:text-primary",
							activeProps: { className: "text-primary" },
							children: item.label
						}, item.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/orders",
							className: "ml-auto flex items-center gap-2 px-3 py-2 text-sm font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-4" }), "Track order"]
						})]
					})]
				})
			}),
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t border-border bg-background p-1 sm:hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "p-2 text-center text-xs font-semibold",
						children: "Home"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						className: "p-2 text-center text-xs font-semibold",
						children: "Shop"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/wishlist",
						className: "p-2 text-center text-xs font-semibold",
						children: "Wishlist"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/cart",
						className: "p-2 text-center text-xs font-semibold",
						children: [
							"Cart (",
							cartCount,
							")"
						]
					})
				]
			})
		]
	});
}
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "mt-16 border-t border-border bg-foreground text-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "sm:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "text-2xl",
							children: "JNS MALI"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-sm text-sm opacity-70",
							children: "Dependable cleaning and household essentials at honest prices, delivered across India."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm font-semibold",
							children: "UPI · Cards · Netbanking · COD"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterGroup, {
					title: "Shop",
					links: [
						["All products", "/shop"],
						["Wholesale", "/wholesale"],
						["Wishlist", "/wishlist"]
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterGroup, {
					title: "Help",
					links: [
						["FAQs", "/faq"],
						["Contact us", "/contact"],
						["Track order", "/orders"]
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterGroup, {
					title: "JNS MALI",
					links: [
						["About us", "/about"],
						["Shipping", "/shipping"],
						["Returns", "/returns"],
						["Privacy", "/privacy"]
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-background/15 px-4 py-5 text-center text-xs opacity-60",
			children: "© 2026 JNS MALI. Frontend demonstration store."
		})]
	});
}
function FooterGroup({ title, links }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
		className: "font-bold",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-3 space-y-2 text-sm opacity-70",
		children: links.map(([l, to]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to,
			children: l
		}) }, to))
	})] });
}
var styles_default = "/assets/styles-BJwdKBtP.css";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$20 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "JNS MALI — Household Essentials" },
			{
				name: "description",
				content: "Affordable cleaning and household essentials for homes and shops across India."
			},
			{
				name: "author",
				content: "JNS MALI"
			},
			{
				property: "og:title",
				content: "JNS MALI — Household Essentials"
			},
			{
				property: "og:description",
				content: "Affordable cleaning and household essentials for homes and shops across India."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$20.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) })
	});
}
var $$splitComponentImporter$19 = () => import("./routes-BK3-dWj_.mjs");
var Route$19 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "JNS MALI — Cleaning & Household Essentials" },
		{
			name: "description",
			content: "Shop affordable scrubbers, brushes, loofahs, camphor and household essentials with retail and wholesale pricing."
		},
		{
			property: "og:title",
			content: "JNS MALI — Cleaning & Household Essentials"
		},
		{
			property: "og:description",
			content: "Everyday cleaning essentials at honest prices, delivered across India."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./about-DGJETIXh.mjs");
var Route$18 = createFileRoute("/about")({
	head: () => ({ meta: [
		{ title: "About JNS MALI — Everyday Value" },
		{
			name: "description",
			content: "Why JNS MALI chooses useful, affordable products for Indian homes and businesses."
		},
		{
			property: "og:title",
			content: "About JNS MALI — Everyday Value"
		},
		{
			property: "og:description",
			content: "Practical home essentials chosen for value and dependability."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./account-BsdLjHxT.mjs");
var Route$17 = createFileRoute("/account")({
	head: () => ({ meta: [
		{ title: "My Account — JNS MALI" },
		{
			name: "description",
			content: "Manage your demo JNS MALI account and orders."
		},
		{
			property: "og:title",
			content: "My Account — JNS MALI"
		},
		{
			property: "og:description",
			content: "Manage orders, saved items and addresses."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./admin-DvyXTzXX.mjs");
var Route$16 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./cart-BrYJP3Gx.mjs");
var Route$15 = createFileRoute("/cart")({
	head: () => ({ meta: [
		{ title: "Shopping Cart — JNS MALI" },
		{
			name: "description",
			content: "Review your JNS MALI shopping cart."
		},
		{
			property: "og:title",
			content: "Shopping Cart — JNS MALI"
		},
		{
			property: "og:description",
			content: "Review household essentials in your cart."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./checkout-BEcxWRif.mjs");
var Route$14 = createFileRoute("/checkout")({
	head: () => ({ meta: [
		{ title: "Secure Checkout — JNS MALI" },
		{
			name: "description",
			content: "Complete your simulated JNS MALI order."
		},
		{
			property: "og:title",
			content: "Secure Checkout — JNS MALI"
		},
		{
			property: "og:description",
			content: "Fast, simple checkout for household essentials."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./contact-BFUcT8aU.mjs");
var Route$13 = createFileRoute("/contact")({
	head: () => ({ meta: [
		{ title: "Contact JNS MALI" },
		{
			name: "description",
			content: "Get help with products, orders and wholesale shopping."
		},
		{
			property: "og:title",
			content: "Contact JNS MALI"
		},
		{
			property: "og:description",
			content: "Friendly help for products, orders and wholesale enquiries."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./faq-C1nRQDyd.mjs");
var Route$12 = createFileRoute("/faq")({
	head: () => ({ meta: [
		{ title: "FAQs & Help — JNS MALI" },
		{
			name: "description",
			content: "Answers about delivery, payments, returns and wholesale orders."
		},
		{
			property: "og:title",
			content: "FAQs & Help — JNS MALI"
		},
		{
			property: "og:description",
			content: "Help with JNS MALI shopping, delivery and bulk orders."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./order-confirmation-Dowke7A1.mjs");
var Route$11 = createFileRoute("/order-confirmation")({
	head: () => ({ meta: [
		{ title: "Order Confirmed — JNS MALI" },
		{
			name: "description",
			content: "Your JNS MALI demo order is confirmed."
		},
		{
			property: "og:title",
			content: "Order Confirmed — JNS MALI"
		},
		{
			property: "og:description",
			content: "Your household essentials are on their way."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./orders-CGjBnXFx.mjs");
var Route$10 = createFileRoute("/orders")({
	head: () => ({ meta: [
		{ title: "Orders & Tracking — JNS MALI" },
		{
			name: "description",
			content: "Track your simulated JNS MALI orders."
		},
		{
			property: "og:title",
			content: "Orders & Tracking — JNS MALI"
		},
		{
			property: "og:description",
			content: "Follow your household essentials from packing to delivery."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./privacy-S4rapV6X.mjs");
var Route$9 = createFileRoute("/privacy")({
	head: () => ({ meta: [
		{ title: "Privacy policy — JNS MALI" },
		{
			name: "description",
			content: "How this frontend demonstration handles information."
		},
		{
			property: "og:title",
			content: "Privacy policy — JNS MALI"
		},
		{
			property: "og:description",
			content: "How this frontend demonstration handles information."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./returns-DR7WCm2W.mjs");
var Route$8 = createFileRoute("/returns")({
	head: () => ({ meta: [
		{ title: "Returns & refunds — JNS MALI" },
		{
			name: "description",
			content: "Understand JNS MALI’s simple seven-day return policy."
		},
		{
			property: "og:title",
			content: "Returns & refunds — JNS MALI"
		},
		{
			property: "og:description",
			content: "Understand JNS MALI’s simple seven-day return policy."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./shipping-BNumz5yy.mjs");
var Route$7 = createFileRoute("/shipping")({
	head: () => ({ meta: [
		{ title: "Shipping information — JNS MALI" },
		{
			name: "description",
			content: "Clear delivery times and charges for JNS MALI orders."
		},
		{
			property: "og:title",
			content: "Shipping information — JNS MALI"
		},
		{
			property: "og:description",
			content: "Clear delivery times and charges for JNS MALI orders."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./wholesale-B2UV04if.mjs");
var Route$6 = createFileRoute("/wholesale")({
	head: () => ({ meta: [
		{ title: "Wholesale Household Products — JNS MALI" },
		{
			name: "description",
			content: "Build a mixed bulk order with automatic wholesale savings and GST billing."
		},
		{
			property: "og:title",
			content: "Wholesale Household Products — JNS MALI"
		},
		{
			property: "og:description",
			content: "Transparent bulk prices for shops, offices and institutions."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./wishlist-DPJ8wyO1.mjs");
var Route$5 = createFileRoute("/wishlist")({
	head: () => ({ meta: [
		{ title: "My Wishlist — JNS MALI" },
		{
			name: "description",
			content: "Your saved JNS MALI products."
		},
		{
			property: "og:title",
			content: "My Wishlist — JNS MALI"
		},
		{
			property: "og:description",
			content: "Saved household products for later."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./admin.index-C9V-Smrn.mjs");
var Route$4 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./admin.categories-DPX_4Z-1.mjs");
var Route$3 = createFileRoute("/admin/categories")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./admin.orders-os6-U6gZ.mjs");
var Route$2 = createFileRoute("/admin/orders")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./admin.products-D9BMaVdM.mjs");
var Route$1 = createFileRoute("/admin/products")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./admin.storefront-C9VdJoQv.mjs");
var Route = createFileRoute("/admin/storefront")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$19.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$20
});
var AboutRoute = Route$18.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$20
});
var AccountRoute = Route$17.update({
	id: "/account",
	path: "/account",
	getParentRoute: () => Route$20
});
var AdminRoute = Route$16.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$20
});
var CartRoute = Route$15.update({
	id: "/cart",
	path: "/cart",
	getParentRoute: () => Route$20
});
var CheckoutRoute = Route$14.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$20
});
var ContactRoute = Route$13.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$20
});
var FaqRoute = Route$12.update({
	id: "/faq",
	path: "/faq",
	getParentRoute: () => Route$20
});
var OrderConfirmationRoute = Route$11.update({
	id: "/order-confirmation",
	path: "/order-confirmation",
	getParentRoute: () => Route$20
});
var OrdersRoute = Route$10.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => Route$20
});
var PrivacyRoute = Route$9.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => Route$20
});
var ReturnsRoute = Route$8.update({
	id: "/returns",
	path: "/returns",
	getParentRoute: () => Route$20
});
var ShippingRoute = Route$7.update({
	id: "/shipping",
	path: "/shipping",
	getParentRoute: () => Route$20
});
var ShopRoute = Route$23.update({
	id: "/shop",
	path: "/shop",
	getParentRoute: () => Route$20
});
var WholesaleRoute = Route$6.update({
	id: "/wholesale",
	path: "/wholesale",
	getParentRoute: () => Route$20
});
var WishlistRoute = Route$5.update({
	id: "/wishlist",
	path: "/wishlist",
	getParentRoute: () => Route$20
});
var AdminIndexRoute = Route$4.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var AdminCategoriesRoute = Route$3.update({
	id: "/categories",
	path: "/categories",
	getParentRoute: () => AdminRoute
});
var AdminOrdersRoute = Route$2.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => AdminRoute
});
var AdminProductsRoute = Route$1.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => AdminRoute
});
var AdminStorefrontRoute = Route.update({
	id: "/storefront",
	path: "/storefront",
	getParentRoute: () => AdminRoute
});
var CategorySlugRoute = Route$21.update({
	id: "/category/$slug",
	path: "/category/$slug",
	getParentRoute: () => Route$20
});
var ProductIdRoute = Route$22.update({
	id: "/product/$id",
	path: "/product/$id",
	getParentRoute: () => Route$20
});
var AdminRouteChildren = {
	AdminCategoriesRoute,
	AdminOrdersRoute,
	AdminProductsRoute,
	AdminStorefrontRoute,
	AdminIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	AccountRoute,
	AdminRoute: AdminRoute._addFileChildren(AdminRouteChildren),
	CartRoute,
	CheckoutRoute,
	ContactRoute,
	FaqRoute,
	OrderConfirmationRoute,
	OrdersRoute,
	PrivacyRoute,
	ReturnsRoute,
	ShippingRoute,
	ShopRoute,
	WholesaleRoute,
	WishlistRoute,
	CategorySlugRoute,
	ProductIdRoute
};
var routeTree = Route$20._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
