import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as ArrowRight, E as BadgeIndianRupee, d as RotateCcw, l as ShieldCheck, r as Truck } from "../_libs/lucide-react.mjs";
import { n as categories, o as products } from "./store-context-bavYrowS.mjs";
import { t as ProductCard } from "./product-card-CY_wTLgk.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-CWgJfACb.mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BK3-dWj_.js
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
createServerFn({ method: "POST" }).handler(createSsrRpc("4ca89039aed116cd093530a41088f2c886d5c7a4e0a9859c0d84ad9904f52521"));
createServerFn({ method: "GET" }).handler(createSsrRpc("56cd82cefea652fa73132831ab2772a76bd43b11bcbbb7fceda041c048c509d9"));
createServerFn({ method: "GET" }).validator((data) => data).handler(createSsrRpc("d4f439b2f84f5e8dcb1d6c681fd2455cdf96d989284e30cf705cb06e88052a37"));
createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("ec318bdc47db83a940e1e4613254d236080f84753a4616c90bd1dbdb30a15e1b"));
createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("ed9d1e2ae4e2f2a248ab8e315fa77454f81810fe92f49ab7c2a16bb22e079b77"));
createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("40c24af1c6d1ca20bce06eb2356831aa98ee37340e16c891aa49a07be261f163"));
createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("d82f4568c62b7f5ee40a3f4469aa6b1bebe679ecdb51d54fbd7d7845675e1953"));
createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("36970b57ab68079eeb48395fc16b08d5d1345f6a9f9f79ae5c919eb578559882"));
createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("0d68844b25591b9f3bb3611f7dac4a8100003f75220d753cec1b6f2197737e8d"));
createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("6c3a3a3d35afbb688ec6be09203c3247fea00dfca2fd78c0e5304cd659f958af"));
createServerFn({ method: "GET" }).handler(createSsrRpc("dc1d2f79597409ea99ecf12ea4ae3167bbc113f7cbe1f1a6279f2385e8d3743f"));
createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("11b8827871b9a336ea5ebc15fa8ae6e4a48573a71c509d805460ffed389435d7"));
var getStorefrontFn = createServerFn({ method: "GET" }).handler(createSsrRpc("8288201fee337c675452954dda0cea294fa7d12e6b52c5907d1cc7c7d4e28316"));
createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("b97309368b9de0d118818aabef2122084fff68825c88694e21ec0765c3c65199"));
createServerFn({ method: "GET" }).handler(createSsrRpc("3901569cb3498546706be2d0b718f10118d9d06754b4645b88e5ed3e4f5d8b1c"));
createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("3d60fe2fb029c6feb964d788196b27463e6f5ddfda5429f474bfc8fc96a80903"));
createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("273d0a37a7a7c09caea33d62dfbcd21c41fe2d7dec76210ce3763329b9f8edd2"));
createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("7a3b14266dbf97fd43bbad96c96803e1d7b03b99ff1d6c10e5c4ad13ff2d588c"));
function Home() {
	const { data: storefront } = useQuery({
		queryKey: ["storefront"],
		queryFn: () => getStorefrontFn()
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-secondary/40",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-7xl items-center gap-7 px-4 py-8 lg:grid-cols-[.9fr_1.1fr] lg:py-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 text-sm font-extrabold uppercase text-primary",
							children: "Retail prices. Wholesale savings."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl",
							children: "Everyday essentials that work hard at home."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 text-base leading-7 text-muted-foreground sm:text-lg",
							children: "From tough kitchen scrubbers to soft bath loofahs—stock your home or shop with dependable products at sensible prices."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-7 flex flex-wrap gap-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/shop",
									children: ["Shop all products ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✅ COD available" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✅ GST invoice" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "✅ 7-day returns" })
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-lg bg-accent",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: storefront?.heroImage || "/assets/ghar-safai-hero-C49jePc2.jpg",
						alt: "Colourful JNS MALI cleaning and household essentials",
						width: 1600,
						height: 1104,
						className: "aspect-[4/3] w-full object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute bottom-3 left-3 rounded-md bg-background/95 px-4 py-3 shadow-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Combo offer"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-black",
							children: "Kitchen Starter Pack A • ₹249"
						})]
					})]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-y border-border bg-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-border px-4 md:grid-cols-4 md:divide-y-0",
				children: [
					{
						icon: Truck,
						title: "Free delivery",
						sub: "Orders over ₹499"
					},
					{
						icon: ShieldCheck,
						title: "Quality checked",
						sub: "Useful, durable picks"
					},
					{
						icon: RotateCcw,
						title: "Easy returns",
						sub: "Within 7 days"
					},
					{
						icon: BadgeIndianRupee,
						title: "Better in bulk",
						sub: "Automatic tier prices"
					}
				].map(({ icon: I, title, sub }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(I, { className: "size-6 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
						className: "text-sm",
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: sub
					})] })]
				}, title))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-7xl px-4 py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-bold text-primary",
					children: "Find it faster"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-3xl font-black",
					children: "Shop by category"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "link",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/shop",
						children: ["View all ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4",
				children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/category/$slug",
					params: { slug: c.slug },
					className: "group overflow-hidden rounded-lg border border-border bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: c.image,
						alt: c.name,
						loading: "lazy",
						width: 1008,
						height: 1008,
						className: "aspect-[4/3] w-full object-cover transition group-hover:scale-[1.03]"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold",
							children: c.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								c.blurb,
								" · ",
								c.count,
								" items"
							]
						})]
					})]
				}, c.slug))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-muted/60",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-7xl px-4 py-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-bold text-primary",
						children: "Customer favourites"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-3xl font-black",
							children: "Most reordered"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop",
							className: "text-sm font-bold text-primary",
							children: "See everything →"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5",
						children: products.slice(0, 5).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "mx-auto max-w-7xl px-4 py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid overflow-hidden rounded-lg bg-foreground text-background lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-7 sm:p-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-bold text-secondary",
							children: "JNS MALI WHOLESALE"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 text-3xl font-black",
							children: "Running a shop, hostel or office?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-lg text-sm leading-6 opacity-75",
							children: "Add cartons or mixed cases, see your savings instantly and get a GST-ready order summary. No calls or bargaining required."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "secondary",
							size: "lg",
							className: "mt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/wholesale",
								children: "Open bulk shopping"
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 border-t border-background/15 lg:border-l lg:border-t-0",
					children: [
						["12+", "minimum pieces"],
						["Up to 25%", "bulk savings"],
						["48 hrs", "dispatch"]
					].map(([a, b]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid place-content-center border-r border-background/15 p-5 text-center last:border-r-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
							className: "text-2xl text-secondary",
							children: a
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs opacity-65",
							children: b
						})]
					}, a))
				})]
			})
		})
	] });
}
//#endregion
export { Home as component };
