import { M as notFound, f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as getCategory } from "./store-context-bavYrowS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/category._slug-GJ9Bzx_U.js
var $$splitComponentImporter = () => import("./category._slug-CMJw1MNK.mjs");
var Route = createFileRoute("/category/$slug")({
	loader: ({ params }) => {
		const category = getCategory(params.slug);
		if (!category) throw notFound();
		return category;
	},
	head: ({ loaderData }) => ({ meta: [
		{ title: `${loaderData?.name ?? "Category"} — JNS MALI` },
		{
			name: "description",
			content: `Shop ${loaderData?.blurb ?? "household essentials"} at honest prices.`
		},
		{
			property: "og:title",
			content: `${loaderData?.name ?? "Category"} — JNS MALI`
		},
		{
			property: "og:description",
			content: `Shop ${loaderData?.blurb ?? "household essentials"} at honest prices.`
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
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
