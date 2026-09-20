import { o as __toESM } from "../_runtime.mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-CIHAFgYl.mjs";
import { t as require_mongoose } from "../_libs/mongoose+mpath+mquery+ms+sift.mjs";
import { t as require_cloudinary } from "../_libs/cloudinary+lodash.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-functions-CRDY62P5.js
var import_mongoose = /* @__PURE__ */ __toESM(require_mongoose());
var import_cloudinary = require_cloudinary();
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var MONGODB_URI = process.env["VITE_MONGODB_URI"];
if (!MONGODB_URI) throw new Error("Please define the VITE_MONGODB_URI environment variable inside .env");
var cached = global["mongoose"];
if (!cached) cached = global["mongoose"] = {
	conn: null,
	promise: null
};
async function connectDB() {
	if (cached.conn) return cached.conn;
	if (!cached.promise) cached.promise = import_mongoose.default.connect(MONGODB_URI, { bufferCommands: false }).then((mongoose) => {
		console.log("Connected to MongoDB!");
		return mongoose;
	});
	try {
		cached.conn = await cached.promise;
	} catch (e) {
		cached.promise = null;
		throw e;
	}
	return cached.conn;
}
var productSchema = new import_mongoose.default.Schema({
	name: {
		type: String,
		required: true
	},
	price: {
		type: Number,
		required: true
	},
	stock: {
		type: Number,
		default: 0
	},
	category: {
		type: String,
		required: true
	},
	description: { type: String },
	imageUrl: { type: String }
}, { timestamps: true });
var Product = import_mongoose.default.models["Product"] || import_mongoose.default.model("Product", productSchema);
var userSchema = new import_mongoose.default.Schema({
	clerkId: {
		type: String,
		required: true,
		unique: true
	},
	email: {
		type: String,
		required: true
	},
	firstName: String,
	lastName: String,
	role: {
		type: String,
		default: "customer"
	}
}, { timestamps: true });
var User = import_mongoose.default.models["User"] || import_mongoose.default.model("User", userSchema);
var categorySchema = new import_mongoose.default.Schema({
	name: {
		type: String,
		required: true
	},
	slug: {
		type: String,
		required: true,
		unique: true
	},
	blurb: { type: String },
	image: { type: String }
}, { timestamps: true });
var Category = import_mongoose.default.models["Category"] || import_mongoose.default.model("Category", categorySchema);
var storefrontSchema = new import_mongoose.default.Schema({
	announcement: {
		type: String,
		default: "Free delivery on orders over ₹499"
	},
	heroSubtitle: {
		type: String,
		default: "Retail prices. Wholesale savings."
	},
	heroTitle: {
		type: String,
		default: "Everyday essentials that work hard at home."
	},
	heroText: {
		type: String,
		default: "From tough kitchen scrubbers to soft bath loofahs—stock your home or shop with dependable products at sensible prices."
	},
	heroImage: { type: String }
}, { timestamps: true });
var Storefront = import_mongoose.default.models["Storefront"] || import_mongoose.default.model("Storefront", storefrontSchema);
var orderSchema = new import_mongoose.default.Schema({
	userId: {
		type: String,
		required: true
	},
	items: [{
		productId: {
			type: import_mongoose.default.Schema.Types.ObjectId,
			ref: "Product",
			required: true
		},
		name: {
			type: String,
			required: true
		},
		quantity: {
			type: Number,
			required: true
		},
		price: {
			type: Number,
			required: true
		},
		image: { type: String }
	}],
	totalAmount: {
		type: Number,
		required: true
	},
	status: {
		type: String,
		default: "pending"
	},
	paymentMethod: {
		type: String,
		default: "COD"
	},
	shippingDetails: {
		fullName: {
			type: String,
			required: true
		},
		address: {
			type: String,
			required: true
		},
		city: {
			type: String,
			required: true
		},
		postalCode: {
			type: String,
			required: true
		},
		phone: {
			type: String,
			required: true
		}
	}
}, { timestamps: true });
var Order = import_mongoose.default.models["Order"] || import_mongoose.default.model("Order", orderSchema);
var getCloudinarySignatureFn_createServerFn_handler = createServerRpc({
	id: "4ca89039aed116cd093530a41088f2c886d5c7a4e0a9859c0d84ad9904f52521",
	name: "getCloudinarySignatureFn",
	filename: "src/server-functions.ts"
}, (opts) => getCloudinarySignatureFn.__executeServer(opts));
var getCloudinarySignatureFn = createServerFn({ method: "POST" }).handler(getCloudinarySignatureFn_createServerFn_handler, async () => {
	import_cloudinary.v2.config({
		cloud_name: process.env["VITE_CLOUDINARY_CLOUD_NAME"],
		api_key: process.env["VITE_CLOUDINARY_API_KEY"],
		api_secret: process.env["VITE_CLOUDINARY_API_SECRET"]
	});
	const timestamp = Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3);
	return {
		timestamp,
		signature: import_cloudinary.v2.utils.api_sign_request({ timestamp }, process.env["VITE_CLOUDINARY_API_SECRET"]),
		cloudName: process.env["VITE_CLOUDINARY_CLOUD_NAME"],
		apiKey: process.env["VITE_CLOUDINARY_API_KEY"]
	};
});
var getProductsFn_createServerFn_handler = createServerRpc({
	id: "56cd82cefea652fa73132831ab2772a76bd43b11bcbbb7fceda041c048c509d9",
	name: "getProductsFn",
	filename: "src/server-functions.ts"
}, (opts) => getProductsFn.__executeServer(opts));
var getProductsFn = createServerFn({ method: "GET" }).handler(getProductsFn_createServerFn_handler, async () => {
	await connectDB();
	const products = await Product.find({}).sort({ createdAt: -1 }).lean().exec();
	return JSON.parse(JSON.stringify(products));
});
var getProductByIdFn_createServerFn_handler = createServerRpc({
	id: "d4f439b2f84f5e8dcb1d6c681fd2455cdf96d989284e30cf705cb06e88052a37",
	name: "getProductByIdFn",
	filename: "src/server-functions.ts"
}, (opts) => getProductByIdFn.__executeServer(opts));
var getProductByIdFn = createServerFn({ method: "GET" }).validator((data) => data).handler(getProductByIdFn_createServerFn_handler, async ({ data }) => {
	await connectDB();
	const product = await Product.findById(data).lean().exec();
	if (!product) return null;
	return JSON.parse(JSON.stringify(product));
});
var createProductFn_createServerFn_handler = createServerRpc({
	id: "ec318bdc47db83a940e1e4613254d236080f84753a4616c90bd1dbdb30a15e1b",
	name: "createProductFn",
	filename: "src/server-functions.ts"
}, (opts) => createProductFn.__executeServer(opts));
var createProductFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createProductFn_createServerFn_handler, async ({ data }) => {
	await connectDB();
	const newProduct = new Product(data);
	await newProduct.save();
	return JSON.parse(JSON.stringify(newProduct));
});
var updateProductFn_createServerFn_handler = createServerRpc({
	id: "ed9d1e2ae4e2f2a248ab8e315fa77454f81810fe92f49ab7c2a16bb22e079b77",
	name: "updateProductFn",
	filename: "src/server-functions.ts"
}, (opts) => updateProductFn.__executeServer(opts));
var updateProductFn = createServerFn({ method: "POST" }).validator((data) => data).handler(updateProductFn_createServerFn_handler, async ({ data }) => {
	await connectDB();
	const updated = await Product.findByIdAndUpdate(data.id, data.updates, { new: true }).lean().exec();
	return JSON.parse(JSON.stringify(updated));
});
var deleteProductFn_createServerFn_handler = createServerRpc({
	id: "40c24af1c6d1ca20bce06eb2356831aa98ee37340e16c891aa49a07be261f163",
	name: "deleteProductFn",
	filename: "src/server-functions.ts"
}, (opts) => deleteProductFn.__executeServer(opts));
var deleteProductFn = createServerFn({ method: "POST" }).validator((data) => data).handler(deleteProductFn_createServerFn_handler, async ({ data }) => {
	await connectDB();
	await Product.findByIdAndDelete(data).exec();
	return { success: true };
});
var getProductsByIdsFn_createServerFn_handler = createServerRpc({
	id: "d82f4568c62b7f5ee40a3f4469aa6b1bebe679ecdb51d54fbd7d7845675e1953",
	name: "getProductsByIdsFn",
	filename: "src/server-functions.ts"
}, (opts) => getProductsByIdsFn.__executeServer(opts));
var getProductsByIdsFn = createServerFn({ method: "POST" }).validator((data) => data).handler(getProductsByIdsFn_createServerFn_handler, async ({ data }) => {
	await connectDB();
	const validIds = data.filter((id) => id && id.length === 24);
	const products = await Product.find({ _id: { $in: validIds } }).lean().exec();
	return JSON.parse(JSON.stringify(products));
});
var syncUserFn_createServerFn_handler = createServerRpc({
	id: "36970b57ab68079eeb48395fc16b08d5d1345f6a9f9f79ae5c919eb578559882",
	name: "syncUserFn",
	filename: "src/server-functions.ts"
}, (opts) => syncUserFn.__executeServer(opts));
var syncUserFn = createServerFn({ method: "POST" }).validator((data) => data).handler(syncUserFn_createServerFn_handler, async ({ data }) => {
	await connectDB();
	let user = await User.findOne({ clerkId: data.clerkId }).exec();
	if (!user) {
		user = new User({
			...data,
			role: "customer"
		});
		await user.save();
	}
	return JSON.parse(JSON.stringify(user));
});
var createOrderFn_createServerFn_handler = createServerRpc({
	id: "0d68844b25591b9f3bb3611f7dac4a8100003f75220d753cec1b6f2197737e8d",
	name: "createOrderFn",
	filename: "src/server-functions.ts"
}, (opts) => createOrderFn.__executeServer(opts));
var createOrderFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createOrderFn_createServerFn_handler, async ({ data }) => {
	await connectDB();
	const order = new Order(data);
	await order.save();
	for (const item of data.items) await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } }).exec();
	return JSON.parse(JSON.stringify(order));
});
var getUserOrdersFn_createServerFn_handler = createServerRpc({
	id: "6c3a3a3d35afbb688ec6be09203c3247fea00dfca2fd78c0e5304cd659f958af",
	name: "getUserOrdersFn",
	filename: "src/server-functions.ts"
}, (opts) => getUserOrdersFn.__executeServer(opts));
var getUserOrdersFn = createServerFn({ method: "POST" }).validator((data) => data).handler(getUserOrdersFn_createServerFn_handler, async ({ data }) => {
	await connectDB();
	const orders = await Order.find({ userId: data.userId }).sort({ createdAt: -1 }).lean().exec();
	return JSON.parse(JSON.stringify(orders));
});
var getAllOrdersFn_createServerFn_handler = createServerRpc({
	id: "dc1d2f79597409ea99ecf12ea4ae3167bbc113f7cbe1f1a6279f2385e8d3743f",
	name: "getAllOrdersFn",
	filename: "src/server-functions.ts"
}, (opts) => getAllOrdersFn.__executeServer(opts));
var getAllOrdersFn = createServerFn({ method: "GET" }).handler(getAllOrdersFn_createServerFn_handler, async () => {
	await connectDB();
	const orders = await Order.find({}).sort({ createdAt: -1 }).lean().exec();
	return JSON.parse(JSON.stringify(orders));
});
var updateOrderStatusFn_createServerFn_handler = createServerRpc({
	id: "11b8827871b9a336ea5ebc15fa8ae6e4a48573a71c509d805460ffed389435d7",
	name: "updateOrderStatusFn",
	filename: "src/server-functions.ts"
}, (opts) => updateOrderStatusFn.__executeServer(opts));
var updateOrderStatusFn = createServerFn({ method: "POST" }).validator((data) => data).handler(updateOrderStatusFn_createServerFn_handler, async ({ data }) => {
	await connectDB();
	const order = await Order.findByIdAndUpdate(data.id, { status: data.status }, { new: true }).exec();
	return JSON.parse(JSON.stringify(order));
});
var getStorefrontFn_createServerFn_handler = createServerRpc({
	id: "8288201fee337c675452954dda0cea294fa7d12e6b52c5907d1cc7c7d4e28316",
	name: "getStorefrontFn",
	filename: "src/server-functions.ts"
}, (opts) => getStorefrontFn.__executeServer(opts));
var getStorefrontFn = createServerFn({ method: "GET" }).handler(getStorefrontFn_createServerFn_handler, async () => {
	await connectDB();
	let storefront = await Storefront.findOne({}).lean().exec();
	if (!storefront) {
		const doc = new Storefront({});
		await doc.save();
		storefront = doc.toObject();
	}
	return JSON.parse(JSON.stringify(storefront));
});
var updateStorefrontFn_createServerFn_handler = createServerRpc({
	id: "b97309368b9de0d118818aabef2122084fff68825c88694e21ec0765c3c65199",
	name: "updateStorefrontFn",
	filename: "src/server-functions.ts"
}, (opts) => updateStorefrontFn.__executeServer(opts));
var updateStorefrontFn = createServerFn({ method: "POST" }).validator((data) => data).handler(updateStorefrontFn_createServerFn_handler, async ({ data }) => {
	await connectDB();
	const updated = await Storefront.findOneAndUpdate({}, data, {
		upsert: true,
		new: true
	}).lean().exec();
	return JSON.parse(JSON.stringify(updated));
});
var getCategoriesFn_createServerFn_handler = createServerRpc({
	id: "3901569cb3498546706be2d0b718f10118d9d06754b4645b88e5ed3e4f5d8b1c",
	name: "getCategoriesFn",
	filename: "src/server-functions.ts"
}, (opts) => getCategoriesFn.__executeServer(opts));
var getCategoriesFn = createServerFn({ method: "GET" }).handler(getCategoriesFn_createServerFn_handler, async () => {
	await connectDB();
	const categories = await Category.find({}).lean().exec();
	return JSON.parse(JSON.stringify(categories));
});
var createCategoryFn_createServerFn_handler = createServerRpc({
	id: "3d60fe2fb029c6feb964d788196b27463e6f5ddfda5429f474bfc8fc96a80903",
	name: "createCategoryFn",
	filename: "src/server-functions.ts"
}, (opts) => createCategoryFn.__executeServer(opts));
var createCategoryFn = createServerFn({ method: "POST" }).validator((data) => data).handler(createCategoryFn_createServerFn_handler, async ({ data }) => {
	await connectDB();
	const category = new Category(data);
	await category.save();
	return JSON.parse(JSON.stringify(category));
});
var updateCategoryFn_createServerFn_handler = createServerRpc({
	id: "273d0a37a7a7c09caea33d62dfbcd21c41fe2d7dec76210ce3763329b9f8edd2",
	name: "updateCategoryFn",
	filename: "src/server-functions.ts"
}, (opts) => updateCategoryFn.__executeServer(opts));
var updateCategoryFn = createServerFn({ method: "POST" }).validator((data) => data).handler(updateCategoryFn_createServerFn_handler, async ({ data }) => {
	await connectDB();
	const updated = await Category.findByIdAndUpdate(data.id, data.updates, { new: true }).lean().exec();
	return JSON.parse(JSON.stringify(updated));
});
var deleteCategoryFn_createServerFn_handler = createServerRpc({
	id: "7a3b14266dbf97fd43bbad96c96803e1d7b03b99ff1d6c10e5c4ad13ff2d588c",
	name: "deleteCategoryFn",
	filename: "src/server-functions.ts"
}, (opts) => deleteCategoryFn.__executeServer(opts));
var deleteCategoryFn = createServerFn({ method: "POST" }).validator((data) => data).handler(deleteCategoryFn_createServerFn_handler, async ({ data }) => {
	await connectDB();
	await Category.findByIdAndDelete(data).exec();
	return { success: true };
});
//#endregion
export { createCategoryFn_createServerFn_handler, createOrderFn_createServerFn_handler, createProductFn_createServerFn_handler, deleteCategoryFn_createServerFn_handler, deleteProductFn_createServerFn_handler, getAllOrdersFn_createServerFn_handler, getCategoriesFn_createServerFn_handler, getCloudinarySignatureFn_createServerFn_handler, getProductByIdFn_createServerFn_handler, getProductsByIdsFn_createServerFn_handler, getProductsFn_createServerFn_handler, getStorefrontFn_createServerFn_handler, getUserOrdersFn_createServerFn_handler, syncUserFn_createServerFn_handler, updateCategoryFn_createServerFn_handler, updateOrderStatusFn_createServerFn_handler, updateProductFn_createServerFn_handler, updateStorefrontFn_createServerFn_handler };
