import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-BcU2c7dd.js
var $$splitComponentImporter = () => import("./shop-CY_kdpCr.mjs");
var schema = objectType({
	q: stringType().optional(),
	category: stringType().optional()
});
var Route = createFileRoute("/shop")({
	validateSearch: schema,
	head: () => ({ meta: [
		{ title: "Shop Household Products — JNS MALI" },
		{
			name: "description",
			content: "Browse affordable kitchen, bath, cleaning and home utility products."
		},
		{
			property: "og:title",
			content: "Shop Household Products — JNS MALI"
		},
		{
			property: "og:description",
			content: "Browse practical home essentials at retail and wholesale prices."
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
