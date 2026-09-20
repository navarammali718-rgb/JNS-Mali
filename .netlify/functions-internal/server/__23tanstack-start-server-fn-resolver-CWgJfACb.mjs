//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-CWgJfACb.js
var manifest = {
	"0d68844b25591b9f3bb3611f7dac4a8100003f75220d753cec1b6f2197737e8d": {
		functionName: "createOrderFn_createServerFn_handler",
		importer: () => import("./_ssr/server-functions-CRDY62P5.mjs")
	},
	"11b8827871b9a336ea5ebc15fa8ae6e4a48573a71c509d805460ffed389435d7": {
		functionName: "updateOrderStatusFn_createServerFn_handler",
		importer: () => import("./_ssr/server-functions-CRDY62P5.mjs")
	},
	"273d0a37a7a7c09caea33d62dfbcd21c41fe2d7dec76210ce3763329b9f8edd2": {
		functionName: "updateCategoryFn_createServerFn_handler",
		importer: () => import("./_ssr/server-functions-CRDY62P5.mjs")
	},
	"36970b57ab68079eeb48395fc16b08d5d1345f6a9f9f79ae5c919eb578559882": {
		functionName: "syncUserFn_createServerFn_handler",
		importer: () => import("./_ssr/server-functions-CRDY62P5.mjs")
	},
	"3901569cb3498546706be2d0b718f10118d9d06754b4645b88e5ed3e4f5d8b1c": {
		functionName: "getCategoriesFn_createServerFn_handler",
		importer: () => import("./_ssr/server-functions-CRDY62P5.mjs")
	},
	"3d60fe2fb029c6feb964d788196b27463e6f5ddfda5429f474bfc8fc96a80903": {
		functionName: "createCategoryFn_createServerFn_handler",
		importer: () => import("./_ssr/server-functions-CRDY62P5.mjs")
	},
	"40c24af1c6d1ca20bce06eb2356831aa98ee37340e16c891aa49a07be261f163": {
		functionName: "deleteProductFn_createServerFn_handler",
		importer: () => import("./_ssr/server-functions-CRDY62P5.mjs")
	},
	"4ca89039aed116cd093530a41088f2c886d5c7a4e0a9859c0d84ad9904f52521": {
		functionName: "getCloudinarySignatureFn_createServerFn_handler",
		importer: () => import("./_ssr/server-functions-CRDY62P5.mjs")
	},
	"56cd82cefea652fa73132831ab2772a76bd43b11bcbbb7fceda041c048c509d9": {
		functionName: "getProductsFn_createServerFn_handler",
		importer: () => import("./_ssr/server-functions-CRDY62P5.mjs")
	},
	"6c3a3a3d35afbb688ec6be09203c3247fea00dfca2fd78c0e5304cd659f958af": {
		functionName: "getUserOrdersFn_createServerFn_handler",
		importer: () => import("./_ssr/server-functions-CRDY62P5.mjs")
	},
	"7a3b14266dbf97fd43bbad96c96803e1d7b03b99ff1d6c10e5c4ad13ff2d588c": {
		functionName: "deleteCategoryFn_createServerFn_handler",
		importer: () => import("./_ssr/server-functions-CRDY62P5.mjs")
	},
	"8288201fee337c675452954dda0cea294fa7d12e6b52c5907d1cc7c7d4e28316": {
		functionName: "getStorefrontFn_createServerFn_handler",
		importer: () => import("./_ssr/server-functions-CRDY62P5.mjs")
	},
	"b97309368b9de0d118818aabef2122084fff68825c88694e21ec0765c3c65199": {
		functionName: "updateStorefrontFn_createServerFn_handler",
		importer: () => import("./_ssr/server-functions-CRDY62P5.mjs")
	},
	"d4f439b2f84f5e8dcb1d6c681fd2455cdf96d989284e30cf705cb06e88052a37": {
		functionName: "getProductByIdFn_createServerFn_handler",
		importer: () => import("./_ssr/server-functions-CRDY62P5.mjs")
	},
	"d82f4568c62b7f5ee40a3f4469aa6b1bebe679ecdb51d54fbd7d7845675e1953": {
		functionName: "getProductsByIdsFn_createServerFn_handler",
		importer: () => import("./_ssr/server-functions-CRDY62P5.mjs")
	},
	"dc1d2f79597409ea99ecf12ea4ae3167bbc113f7cbe1f1a6279f2385e8d3743f": {
		functionName: "getAllOrdersFn_createServerFn_handler",
		importer: () => import("./_ssr/server-functions-CRDY62P5.mjs")
	},
	"ec318bdc47db83a940e1e4613254d236080f84753a4616c90bd1dbdb30a15e1b": {
		functionName: "createProductFn_createServerFn_handler",
		importer: () => import("./_ssr/server-functions-CRDY62P5.mjs")
	},
	"ed9d1e2ae4e2f2a248ab8e315fa77454f81810fe92f49ab7c2a16bb22e079b77": {
		functionName: "updateProductFn_createServerFn_handler",
		importer: () => import("./_ssr/server-functions-CRDY62P5.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
