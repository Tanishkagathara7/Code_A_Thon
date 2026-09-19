import mongoose from 'mongoose';
import { Product } from '../models/Product';
import { Customer } from '../models/Customer';
import { StockHistory } from '../models/StockHistory';
import { logSeed } from './seed.utils';

export const DEMO_PRODUCTS = [
  {
    name: 'Basmati Rice Premium (25kg Bag)',
    sku: 'RICE-BAS-25',
    hsnCode: '1006',
    category: 'Grains & Pulses',
    unit: 'pack',
    purchasePrice: 1550,
    sellingPrice: 1850,
    gstApplicability: 'taxable',
    gstRate: 5,
    currentStock: 48,
    openingStock: 50,
    minStockAlert: 10,
    trackInventory: true,
  },
  {
    name: 'Cold-Pressed Groundnut Oil (15L Tin)',
    sku: 'OIL-GND-15L',
    hsnCode: '1508',
    category: 'Edible Oils',
    unit: 'tin',
    purchasePrice: 2400,
    sellingPrice: 2750,
    gstApplicability: 'taxable',
    gstRate: 5,
    currentStock: 22,
    openingStock: 25,
    minStockAlert: 8,
    trackInventory: true,
  },
  {
    name: 'Refined Wheat Flour (Maida 50kg)',
    sku: 'FLOUR-MAIDA-50',
    hsnCode: '1101',
    category: 'Grains & Pulses',
    unit: 'pack',
    purchasePrice: 1400,
    sellingPrice: 1650,
    gstApplicability: 'taxable',
    gstRate: 5,
    currentStock: 4,
    openingStock: 20,
    minStockAlert: 6,
    trackInventory: true,
  },
  {
    name: 'Toor Dal Premium Grade A (30kg Sack)',
    sku: 'DAL-TOOR-30',
    hsnCode: '0713',
    category: 'Grains & Pulses',
    unit: 'pack',
    purchasePrice: 3450,
    sellingPrice: 3900,
    gstApplicability: 'taxable',
    gstRate: 5,
    currentStock: 15,
    openingStock: 15,
    minStockAlert: 5,
    trackInventory: true,
  },
  {
    name: 'Modular Power Switch Socket 16A',
    sku: 'ELEC-SWT-16A',
    hsnCode: '8536',
    category: 'Electrical & Hardware',
    unit: 'piece',
    purchasePrice: 190,
    sellingPrice: 280,
    gstApplicability: 'taxable',
    gstRate: 18,
    currentStock: 65,
    openingStock: 70,
    minStockAlert: 15,
    trackInventory: true,
  },
  {
    name: 'Electrical LED Tube 20W (Pack of 10)',
    sku: 'ELEC-LED-20W',
    hsnCode: '8539',
    category: 'Electrical & Hardware',
    unit: 'box',
    purchasePrice: 1100,
    sellingPrice: 1450,
    gstApplicability: 'taxable',
    gstRate: 18,
    currentStock: 0,
    openingStock: 15,
    minStockAlert: 5,
    trackInventory: true,
  },
  {
    name: 'Cotton Bed Linen Single Set',
    sku: 'TEX-BL-SNG',
    hsnCode: '6302',
    category: 'Textiles & Linen',
    unit: 'piece',
    purchasePrice: 520,
    sellingPrice: 750,
    gstApplicability: 'taxable',
    gstRate: 12,
    currentStock: 18,
    openingStock: 20,
    minStockAlert: 5,
    trackInventory: true,
  },
  {
    name: 'Organic Jaggery Powder 1kg',
    sku: 'GROC-JAG-1KG',
    hsnCode: '1701',
    category: 'Organic Foods',
    unit: 'kg',
    purchasePrice: 65,
    sellingPrice: 95,
    gstApplicability: 'taxable',
    gstRate: 5,
    currentStock: 80,
    openingStock: 100,
    minStockAlert: 20,
    trackInventory: true,
  },
];

export const DEMO_CUSTOMERS = [
  {
    name: 'Rajesh Traders',
    mobile: '9825123456',
    email: 'rajesh.traders@gmail.com',
    customerType: 'business',
    state: 'Gujarat',
    stateCode: '24',
    gstin: '24AABCR1234F1Z9',
    businessName: 'Rajesh Commercial Trading Co',
    address: 'Shop 12, APMC Market Yard',
    city: 'Rajkot',
    pincode: '360003',
  },
  {
    name: 'Shreeji Electronics & Hardware',
    mobile: '9712345678',
    email: 'shreeji.electricals@yahoo.co.in',
    customerType: 'business',
    state: 'Gujarat',
    stateCode: '24',
    gstin: '24AAFPS9876G1Z2',
    businessName: 'Shreeji Electricals Wholesale',
    address: '45 Ring Road Circle, Near Gandhi Gate',
    city: 'Surat',
    pincode: '395002',
  },
  {
    name: 'Mumbai Textile Syndicate',
    mobile: '9820011223',
    email: 'accounts@mumbaitextiles.org',
    customerType: 'business',
    state: 'Maharashtra',
    stateCode: '27',
    gstin: '27AABCM5678J1Z4',
    businessName: 'Mumbai Textile Syndicate LLP',
    address: 'Kalbadevi Wholesale Bazaar, 2nd Cross Lane',
    city: 'Mumbai',
    pincode: '400002',
  },
  {
    name: 'Bangalore General Provisions',
    mobile: '9448099887',
    email: 'bgp.stores@gmail.com',
    customerType: 'business',
    state: 'Karnataka',
    stateCode: '29',
    gstin: '29AABCB4321K1Z1',
    businessName: 'Bangalore Provision Mart',
    address: 'Chickpet Commercial Area',
    city: 'Bengaluru',
    pincode: '560053',
  },
  {
    name: 'Rameshwar Retail Customer',
    mobile: '9898099112',
    customerType: 'individual',
    state: 'Gujarat',
    stateCode: '24',
    address: 'Block B-4, Royal Heights, University Road',
    city: 'Rajkot',
    pincode: '360005',
  },
];

export async function seedProductsAndCustomers(ownerId: mongoose.Types.ObjectId) {
  let productsCreated = 0;
  let customersCreated = 0;

  for (const p of DEMO_PRODUCTS) {
    const existing = await Product.findOne({ name: p.name, owner: ownerId });
    if (!existing) {
      const prod = new Product({
        ...p,
        owner: ownerId,
        isDemo: true,
      });
      await prod.save();

      if (p.currentStock > 0) {
        await StockHistory.create({
          product: prod._id,
          owner: ownerId,
          operationType: 'initial',
          previousQuantity: 0,
          quantityDelta: p.currentStock,
          newQuantity: p.currentStock,
          reason: 'Initial opening stock setup',
        });
      }
      productsCreated++;
    }
  }

  for (const c of DEMO_CUSTOMERS) {
    const existing = await Customer.findOne({ mobile: c.mobile, owner: ownerId });
    if (!existing) {
      await Customer.create({
        ...c,
        owner: ownerId,
        isDemo: true,
      });
      customersCreated++;
    }
  }

  logSeed(`🛒 Seeded ${productsCreated} products and ${customersCreated} customers for demo user.`);
}
