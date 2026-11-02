import mongoose from "mongoose";

const DEFAULT_MONGODB_URI =
  "mongodb+srv://navarammali718_db_user:jnsmali07@cluster0.nsmp0px.mongodb.net/?appName=Cluster0";

const envMongoUri =
  typeof process !== "undefined" && process.env ? process.env["MONGODB_URI"] : undefined;
const MONGODB_URI = envMongoUri || DEFAULT_MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

interface GlobalWithMongoose {
  mongoose?: MongooseCache;
}

const globalWithMongoose = globalThis as unknown as GlobalWithMongoose;

const cached: MongooseCache =
  globalWithMongoose.mongoose ||
  (globalWithMongoose.mongoose = { conn: null, promise: null });

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log("Connected to MongoDB!");
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
