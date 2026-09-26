
import { connectDB } from './src/lib/db';
import { Storefront } from './src/lib/models';

async function run() {
  await connectDB();
  const storefront = await Storefront.findOne();
  console.log('Tokens:', storefront?.adminFcmTokens);
  process.exit(0);
}
run();
