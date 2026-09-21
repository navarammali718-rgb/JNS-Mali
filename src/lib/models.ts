import mongoose from "mongoose";

// --- Product Schema ---
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  category: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
}, { timestamps: true });

export const Product = (mongoose.models['Product'] || mongoose.model("Product", productSchema)) as mongoose.Model<any>;

// --- User Schema ---
const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  firstName: String,
  lastName: String,
  role: { type: String, default: "customer" },
}, { timestamps: true });

export const User = (mongoose.models['User'] || mongoose.model("User", userSchema)) as mongoose.Model<any>;

// --- Category Schema ---
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  blurb: { type: String },
  image: { type: String },
}, { timestamps: true });

export const Category = (mongoose.models['Category'] || mongoose.model("Category", categorySchema)) as mongoose.Model<any>;

// --- Storefront Schema (Singleton) ---
const storefrontSchema = new mongoose.Schema({
  announcement: { type: String, default: "Free delivery on orders over ₹499" },
  heroSubtitle: { type: String, default: "Retail prices. Wholesale savings." },
  heroTitle: { type: String, default: "Everyday essentials that work hard at home." },
  heroText: { type: String, default: "From tough kitchen scrubbers to soft bath loofahs—stock your home or shop with dependable products at sensible prices." },
  heroImage: { type: String },
  adminEmails: { type: [String], default: ["sanjayparihar0625@gmail.com"] },
}, { timestamps: true });

export const Storefront = (mongoose.models['Storefront'] || mongoose.model("Storefront", storefrontSchema)) as mongoose.Model<any>;

// --- Order Schema ---
const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Store Clerk user ID for simplicity
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    image: { type: String },
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "pending" }, // pending, shipped, delivered, cancelled
  paymentMethod: { type: String, default: "COD" },
  shippingDetails: {
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    phone: { type: String, required: true },
  },
}, { timestamps: true });

export const Order = (mongoose.models['Order'] || mongoose.model("Order", orderSchema)) as mongoose.Model<any>;
