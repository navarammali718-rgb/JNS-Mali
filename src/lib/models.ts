import mongoose from "mongoose";

// --- Product Schema ---
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
  category: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  unit: { type: String, default: "Piece" },
  piecesPerUnit: { type: Number, default: 1 },
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
  heroImage: { type: String },
  adminEmails: { type: [String], default: ["sanjayparihar0625@gmail.com"] },
  adminFcmTokens: { type: [String], default: [] },
  adminLocationLat: { type: Number, default: 13.0285 }, // Yeshwanthpur, Bangalore
  adminLocationLng: { type: Number, default: 77.5462 },
  adminLocationAddress: { type: String, default: "Yeshwanthpur, Bengaluru, Karnataka, India" },
  deliveryRadiusKm: { type: Number, default: 10 },
  deliveryFee: { type: Number, default: 40 },
  deliveryFeePerKm: { type: Number, default: 0 },
  freeDeliveryThreshold: { type: Number, default: 499 },
  contactEmail: { type: String, default: "contact@jnsmali.com" },
  contactPhone: { type: String, default: "+91 98765 43210" },
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
    lat: { type: Number },
    lng: { type: Number },
  },
}, { timestamps: true });

export const Order = (mongoose.models['Order'] || mongoose.model("Order", orderSchema)) as mongoose.Model<any>;
