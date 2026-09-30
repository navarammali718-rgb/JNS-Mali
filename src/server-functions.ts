import { createServerFn } from "@tanstack/react-start";
import { messaging } from "./lib/fcm";
import { connectDB } from "./lib/db";
import { Product, User, Order, Category, Storefront } from "./lib/models";
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
    
    // Send push notification to admin
    try {
      const storefront = await Storefront.findOne({}).lean().exec();
      const tokens = storefront?.adminFcmTokens || [];
      console.log(`[Push] Storefront found: ${!!storefront}, FCM tokens count: ${tokens.length}`);
      
      if (tokens.length > 0) {
        const message = {
          notification: {
            title: 'New Order Received! 🛍️',
            body: `Order total: ₹${order.totalAmount} from ${data.shippingDetails?.fullName || 'Customer'}`,
          },
          tokens: tokens,
        };
        console.log('[Push] Sending multicast to', tokens.length, 'device(s)...');
        const result = await messaging.sendEachForMulticast(message);
        console.log(`[Push] ✅ Success: ${result.successCount}, ❌ Failures: ${result.failureCount}`);
        
        // Log individual failures for debugging
        if (result.failureCount > 0) {
          result.responses.forEach((resp, idx) => {
            if (!resp.success) {
              console.error(`[Push] Token #${idx} failed:`, resp.error?.code, resp.error?.message);
            }
          });
        }
      } else {
        console.log('[Push] ⚠️ No FCM tokens registered — no admin has opened the app yet');
      }
    } catch (e) {
      console.error("[Push] ❌ Failed to send push notification:", e);
    }
    
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

export const cancelOrderFn = createServerFn({ method: "POST" })
  .validator((data: { orderId: string; userId: string }) => data)
  .handler(async ({ data }) => {
    await connectDB();
    const order = await Order.findById(data.orderId).exec();
    if (!order) throw new Error("Order not found.");
    if (order.userId !== data.userId) throw new Error("Unauthorized.");
    if (order.status !== "pending") throw new Error("Only pending orders can be cancelled.");
    order.status = "cancelled";
    await order.save();
    return JSON.parse(JSON.stringify(order));
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
    const updated = await Storefront.findOneAndUpdate(
      {},
      { $set: data },
      { upsert: true, returnDocument: 'after' }
    ).lean().exec();
    return JSON.parse(JSON.stringify(updated));
});

export const registerAdminFcmTokenFn = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    await connectDB();
    // Add token to array if it doesn't already exist
    const updated = await Storefront.findOneAndUpdate(
      {}, 
      { $addToSet: { adminFcmTokens: data.token } },
      { upsert: true, returnDocument: 'after' }
    ).lean().exec();
    return { success: true };
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

// --- Push Notification Diagnostic ---
export const testPushNotificationFn = createServerFn({ method: "POST" }).handler(async () => {
  const results: Record<string, any> = {};
  results['envVars'] = {
    FIREBASE_PROJECT_ID: process.env['FIREBASE_PROJECT_ID'] ? '✅ set' : '❌ MISSING',
    FIREBASE_CLIENT_EMAIL: process.env['FIREBASE_CLIENT_EMAIL'] ? '✅ set' : '❌ MISSING',
    FIREBASE_PRIVATE_KEY: process.env['FIREBASE_PRIVATE_KEY'] ? `✅ set (${process.env['FIREBASE_PRIVATE_KEY']!.length} chars)` : '❌ MISSING',
  };
  try {
    const { getApps } = await import('firebase-admin/app');
    results['firebaseInitialized'] = getApps().length > 0 ? '✅ Yes' : '❌ No apps initialized';
  } catch (e: any) {
    results['firebaseInitialized'] = '❌ Error: ' + e.message;
  }
  try {
    await connectDB();
    const storefront = await Storefront.findOne({}).lean().exec();
    const tokens = storefront?.adminFcmTokens || [];
    results['storedTokens'] = { count: tokens.length, tokens: tokens.map((t: string) => t.substring(0, 20) + '...') };
  } catch (e: any) {
    results['storedTokens'] = '❌ Error: ' + e.message;
  }
  try {
    const storefront = await Storefront.findOne({}).lean().exec();
    const tokens = storefront?.adminFcmTokens || [];
    if (tokens.length === 0) {
      results['testSend'] = '⚠️ No tokens to send to — open the Android app first';
    } else {
      const result = await messaging.sendEachForMulticast({ notification: { title: '🔔 Test Notification', body: 'Push notifications are working!' }, tokens });
      results['testSend'] = { successCount: result.successCount, failureCount: result.failureCount };
    }
  } catch (e: any) {
    results['testSend'] = '❌ Error: ' + e.message;
  }
  return results;
});

// --- User Management ---
export const upsertUserFn = createServerFn({ method: "POST" })
  .validator((data: { clerkId: string; email: string; firstName?: string; lastName?: string }) => data)
  .handler(async ({ data }) => {
    await connectDB();
    await User.findOneAndUpdate(
      { clerkId: data.clerkId },
      { $set: { email: data.email, firstName: data.firstName, lastName: data.lastName } },
      { upsert: true, returnDocument: 'after' }
    ).exec();
    return { ok: true };
  });

export const checkUserBlockedFn = createServerFn({ method: "POST" })
  .validator((data: { clerkId: string }) => data)
  .handler(async ({ data }) => {
    await connectDB();
    const user = await User.findOne({ clerkId: data.clerkId }).lean().exec();
    if (!user) return { isBlocked: false };
    return { isBlocked: !!user.isBlocked, reason: user.blockedReason || "" };
  });

export const getAllUsersFn = createServerFn({ method: "GET" }).handler(async () => {
  await connectDB();
  const users = await User.find({}).sort({ createdAt: -1 }).lean().exec();
  // Attach order counts
  const orderCounts = await Order.aggregate([
    { $group: { _id: "$userId", count: { $sum: 1 }, total: { $sum: "$totalAmount" } } }
  ]);
  const countMap: Record<string, { count: number; total: number }> = {};
  for (const o of orderCounts) countMap[o._id] = { count: o.count, total: o.total };
  return JSON.parse(JSON.stringify(users.map((u: any) => ({
    ...u,
    orderCount: countMap[u.clerkId]?.count ?? 0,
    orderTotal: countMap[u.clerkId]?.total ?? 0,
  }))));
});

export const blockUserFn = createServerFn({ method: "POST" })
  .validator((data: { clerkId: string; isBlocked: boolean; reason?: string }) => data)
  .handler(async ({ data }) => {
    await connectDB();
    await User.findOneAndUpdate(
      { clerkId: data.clerkId },
      { $set: { isBlocked: data.isBlocked, blockedReason: data.reason || "" } }
    ).exec();
    return { ok: true };
  });
