import { createServerFn } from "@tanstack/react-start";
import { connectDB } from "./lib/db";
import { Product } from "./lib/models";
import { v2 as cloudinary } from "cloudinary";

export const getCloudinarySignatureFn = createServerFn({ method: "POST" }).handler(async () => {
  cloudinary.config({
    cloud_name: process.env['VITE_CLOUDINARY_CLOUD_NAME'] as string,
    api_key: process.env['VITE_CLOUDINARY_API_KEY'] as string,
    api_secret: process.env['CLOUDINARY_API_SECRET'] as string,
  });

  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
    },
    process.env['CLOUDINARY_API_SECRET'] as string
  );
  
  return { 
    timestamp, 
    signature, 
    cloudName: process.env['VITE_CLOUDINARY_CLOUD_NAME'] as string, 
    apiKey: process.env['VITE_CLOUDINARY_API_KEY'] as string 
  };
});

export const getProductsFn = createServerFn({ method: "GET" }).handler(async () => {
  await connectDB();
  // Only return products that are available (or where isAvailable is not explicitly false)
  const products = await Product.find({ isAvailable: { $ne: false } }).sort({ createdAt: -1 }).lean().exec();
  return JSON.parse(JSON.stringify(products));
});

export const getAdminProductsFn = createServerFn({ method: "GET" }).handler(async () => {
  await connectDB();
  // Return all products including unavailable ones for the admin panel
  const products = await Product.find({}).sort({ createdAt: -1 }).lean().exec();
  return JSON.parse(JSON.stringify(products));
});

export const getProductByIdFn = createServerFn({ method: "GET" })
  .validator((data: string) => data)
  .handler(async ({ data }) => {
    await connectDB();
    const product = await Product.findById(data).lean().exec();
    if (!product) return null;
    return JSON.parse(JSON.stringify(product));
});

export const createProductFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    // TODO: Add auth check here later
    await connectDB();
    const newProduct = new Product(data);
    await newProduct.save();
    return JSON.parse(JSON.stringify(newProduct));
});

export const updateProductFn = createServerFn({ method: "POST" })
  .validator((data: { id: string, updates: any }) => data)
  .handler(async ({ data }) => {
    await connectDB();
    const updated = await Product.findByIdAndUpdate(data.id, data.updates, { returnDocument: 'after' }).lean().exec();
    return JSON.parse(JSON.stringify(updated));
});

export const deleteProductFn = createServerFn({ method: "POST" })
  .validator((data: string) => data)
  .handler(async ({ data }) => {
    await connectDB();
    await Product.findByIdAndDelete(data).exec();
    return { success: true };
});

export const getProductsByIdsFn = createServerFn({ method: "POST" })
  .validator((data: string[]) => data)
  .handler(async ({ data }) => {
    await connectDB();
    // Validate valid object IDs to prevent cast errors
    const validIds = data.filter(id => id && id.length === 24);
    const products = await Product.find({ _id: { $in: validIds } }).lean().exec();
    return JSON.parse(JSON.stringify(products));
});

import { User, Order, Storefront, Category } from "./lib/models";

export const syncUserFn = createServerFn({ method: "POST" })
  .validator((data: { clerkId: string; email: string; firstName?: string; lastName?: string }) => data)
  .handler(async ({ data }) => {
    await connectDB();
    let user = await User.findOne({ clerkId: data.clerkId }).exec();
    if (!user) {
      user = new User({ ...data, role: "customer" });
      await user.save();
    }
    return JSON.parse(JSON.stringify(user));
});

export const createOrderFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    await connectDB();
    const order = new Order(data);
    await order.save();
    
    return JSON.parse(JSON.stringify(order));
});

export const getUserOrdersFn = createServerFn({ method: "POST" })
  .validator((data: { userId: string }) => data)
  .handler(async ({ data }) => {
    await connectDB();
    const orders = await Order.find({ userId: data.userId }).sort({ createdAt: -1 }).lean().exec();
    return JSON.parse(JSON.stringify(orders));
});

export const getAllOrdersFn = createServerFn({ method: "GET" }).handler(async () => {
  await connectDB();
  const orders = await Order.find({}).sort({ createdAt: -1 }).lean().exec();
  return JSON.parse(JSON.stringify(orders));
});

export const updateOrderStatusFn = createServerFn({ method: "POST" })
  .validator((data: { id: string, status: string }) => data)
  .handler(async ({ data }) => {
    await connectDB();
    const order = await Order.findByIdAndUpdate(data.id, { status: data.status }, { returnDocument: 'after' }).exec();
    return JSON.parse(JSON.stringify(order));
});

export const getStorefrontFn = createServerFn({ method: "GET" }).handler(async () => {
  await connectDB();
  let storefront = await Storefront.findOne({}).lean().exec();
  if (!storefront) {
    const doc = new Storefront({});
    await doc.save();
    storefront = doc.toObject();
  }
  return JSON.parse(JSON.stringify(storefront));
});

export const updateStorefrontFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    await connectDB();
    const updated = await Storefront.findOneAndUpdate({}, data, { upsert: true, returnDocument: 'after' }).lean().exec();
    return JSON.parse(JSON.stringify(updated));
});

export const getCategoriesFn = createServerFn({ method: "GET" }).handler(async () => {
  await connectDB();
  const categories = await Category.find({}).lean().exec();
  return JSON.parse(JSON.stringify(categories));
});

export const createCategoryFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    await connectDB();
    const category = new Category(data);
    await category.save();
    return JSON.parse(JSON.stringify(category));
});

export const updateCategoryFn = createServerFn({ method: "POST" })
  .validator((data: { id: string, updates: any }) => data)
  .handler(async ({ data }) => {
    await connectDB();
    const updated = await Category.findByIdAndUpdate(data.id, data.updates, { returnDocument: 'after' }).lean().exec();
    return JSON.parse(JSON.stringify(updated));
});

export const deleteCategoryFn = createServerFn({ method: "POST" })
  .validator((data: string) => data)
  .handler(async ({ data }) => {
    await connectDB();
    await Category.findByIdAndDelete(data).exec();
    return { success: true };
});
