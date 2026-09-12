import mongoose from 'mongoose';
import dns from 'dns';

// Force global IPv4 resolution for dns.lookup to prevent Render cloud IPv6 ENETUNREACH errors
const originalDnsLookup = dns.lookup;
(dns as any).lookup = function (hostname: any, options: any, callback: any) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  const opts = typeof options === 'object' ? { ...options, family: 4 } : { family: 4 };
  return (originalDnsLookup as any).call(dns, hostname, opts, callback);
};

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

export const connectDatabase = async (): Promise<void> => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error('❌ FATAL CONFIGURATION ERROR: MONGODB_URI environment variable is missing on server.');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas (Database: mindbloom)');
  } catch (err: any) {
    console.error('❌ MongoDB connection error:', err.message);
  }
};
