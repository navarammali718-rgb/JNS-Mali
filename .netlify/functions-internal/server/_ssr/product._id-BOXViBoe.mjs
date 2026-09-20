import { M as notFound, f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getProduct } from "./store-context-bavYrowS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._id-BOXViBoe.js
var $$splitComponentImporter = () => import("./product._id-BP7yIp7F.mjs");
var Route = createFileRoute("/product/$id")({
	loader: ({ params }) => {
		const p = getProduct(params.id);
		if (!p) throw notFound();
		return p;
	},
	head: ({ loaderData: p }) => ({ meta: [
		{ title: `${p?.name ?? "Product"} — JNS MALI` },
		{
			name: "description",
			content: p?.description ?? "Shop household essentials at JNS MALI."
		},
		{
			property: "og:title",
			content: `${p?.name ?? "Product"} — JNS MALI`
		},
		{
			property: "og:description",
			content: p?.description ?? "Shop household essentials at JNS MALI."
		},
		{
			property: "og:type",
			content: "product"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
