import { db } from '../src/lib/db'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'node:crypto'

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@ethiopianmart.local'
  const vendorEmail = process.env.SEED_VENDOR_EMAIL || 'vendor@ethiopianmart.local'
  const userEmail = process.env.SEED_USER_EMAIL || 'shopper@ethiopianmart.local'
  const adminPassword = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD || randomBytes(24).toString('base64url'), 12)
  const admin = await db.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Admin User',
      email: adminEmail,
      passwordHash: adminPassword,
      role: 'ADMIN',
      phone: '+251911000001',
    },
  })

  // Create vendor user
  const vendorPassword = await bcrypt.hash(process.env.SEED_VENDOR_PASSWORD || randomBytes(24).toString('base64url'), 12)
  const vendor = await db.user.upsert({
    where: { email: vendorEmail },
    update: {},
    create: {
      name: 'TechHub Addis',
      email: vendorEmail,
      passwordHash: vendorPassword,
      role: 'VENDOR',
      phone: '+251911000002',
    },
  })

  // Create regular user
  const userPassword = await bcrypt.hash(process.env.SEED_USER_PASSWORD || randomBytes(24).toString('base64url'), 12)
  const regularUser = await db.user.upsert({
    where: { email: userEmail },
    update: {},
    create: {
      name: 'Abebe Bekele',
      email: userEmail,
      passwordHash: userPassword,
      role: 'USER',
      phone: '+251911234567',
    },
  })

  console.log('✅ Users created:', admin.email, vendor.email, regularUser.email)

  // Create categories
  const categories = [
    { name: 'Electronics', slug: 'electronics', icon: '📱', color: 'from-blue-500 to-indigo-600', description: 'Phones, laptops, gadgets' },
    { name: 'Coffee & Spices', slug: 'coffee-spices', icon: '☕', color: 'from-orange-500 to-red-600', description: 'Ethiopian coffee and spices' },
    { name: 'Fashion', slug: 'fashion', icon: '👗', color: 'from-pink-500 to-rose-600', description: 'Clothing and accessories' },
    { name: 'Groceries', slug: 'groceries', icon: '🛒', color: 'from-green-500 to-emerald-600', description: 'Everyday essentials' },
    { name: 'Home & Living', slug: 'home-living', icon: '🏠', color: 'from-teal-500 to-cyan-600', description: 'Home essentials' },
    { name: 'Beauty', slug: 'beauty', icon: '💄', color: 'from-rose-500 to-pink-600', description: 'Beauty products' },
    { name: 'Pharmacy', slug: 'pharmacy', icon: '💊', color: 'from-red-500 to-rose-600', description: 'Health and medicine' },
    { name: 'Traditional Wear', slug: 'traditional-wear', icon: '🧵', color: 'from-amber-600 to-orange-700', description: 'Traditional Ethiopian clothing' },
  ]

  const categoryMap: Record<string, string> = {}
  for (const cat of categories) {
    const created = await db.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    categoryMap[cat.slug] = created.id
  }
  console.log('✅ Categories created:', categories.length)

  // Create products
  const products = [
    {
      name: 'Yirgacheffe Premium Coffee 1kg',
      slug: 'yirgacheffe-premium-coffee-1kg',
      description: 'Single-origin Yirgacheffe coffee beans, hand-picked and sun-dried. World-renowned floral and citrus notes. Direct from farmers in Yirgacheffe, SNNPR.',
      price: 850, originalPrice: 1100, sku: 'COF-YIR-1KG',
      stock: 120, categoryIcon: '☕', deliveryDays: 2,
      isLocal: true, isOrganic: true, isFeatured: true, isBestseller: true,
      tags: '["bestseller","ethiopian","coffee"]',
      categoryId: categoryMap['coffee-spices'], vendorId: vendor.id,
    },
    {
      name: 'Samsung Galaxy A15 128GB',
      slug: 'samsung-galaxy-a15-128gb',
      description: '6.5" Super AMOLED display, 50MP triple camera, 5000mAh battery, 128GB storage. Perfect for Ethiopian networks with dual SIM support.',
      price: 18900, originalPrice: 22500, sku: 'ELE-SAM-A15',
      stock: 45, categoryIcon: '📱', deliveryDays: 1,
      isFeatured: true, isBestseller: true,
      tags: '["trending","popular","samsung"]',
      categoryId: categoryMap['electronics'], vendorId: vendor.id,
    },
    {
      name: 'Berbere Spice Mix 500g',
      slug: 'berbere-spice-mix-500g',
      description: 'Authentic Ethiopian berbere blend. Perfect for doro wat and other traditional dishes. Hand-mixed from 12 spices.',
      price: 320, originalPrice: 420, sku: 'SPI-BER-500',
      stock: 200, categoryIcon: '🌶️', deliveryDays: 3,
      isLocal: true, isOrganic: true,
      tags: '["traditional","ethiopian","spice"]',
      categoryId: categoryMap['coffee-spices'], vendorId: vendor.id,
    },
    {
      name: 'Habesha Kemis - Wedding Edition',
      slug: 'habesha-kemis-wedding-edition',
      description: 'Hand-woven cotton dress with intricate Tilet embroidery. Made by master artisans in Addis Ababa. Perfect for weddings and special occasions.',
      price: 4500, originalPrice: 6500, sku: 'FAS-HAB-WED',
      stock: 15, categoryIcon: '👗', deliveryDays: 5,
      isLocal: true, isHandmade: true, isFeatured: true,
      tags: '["handmade","traditional","wedding"]',
      categoryId: categoryMap['traditional-wear'], vendorId: vendor.id,
    },
    {
      name: 'Teff Flour 5kg - Organic',
      slug: 'teff-flour-5kg-organic',
      description: '100% organic teff flour for authentic injera. Rich in iron, calcium, and protein. Sourced from highland farmers in Adama.',
      price: 480, originalPrice: 580, sku: 'GRO-TEF-5KG',
      stock: 300, categoryIcon: '🌾', deliveryDays: 2,
      isLocal: true, isOrganic: true, isBestseller: true,
      tags: '["staple","ethiopian","organic"]',
      categoryId: categoryMap['groceries'], vendorId: vendor.id,
    },
    {
      name: 'Olive Cooking Oil 5L',
      slug: 'olive-cooking-oil-5l',
      description: 'Premium cooking oil. Heart-healthy blend for everyday cooking. 5 liter jug for family use.',
      price: 1850, originalPrice: 2400, sku: 'GRO-OIL-5L',
      stock: 80, categoryIcon: '🛒', deliveryDays: 1,
      tags: '["essential","cooking"]',
      categoryId: categoryMap['groceries'], vendorId: vendor.id,
    },
    {
      name: 'JBL Flip 6 Bluetooth Speaker',
      slug: 'jbl-flip-6-bluetooth-speaker',
      description: 'Waterproof portable speaker with 12 hours of playtime. Bold JBL Original Pro Sound. Perfect for any gathering.',
      price: 6800, originalPrice: 8500, sku: 'ELE-JBL-FL6',
      stock: 35, categoryIcon: '🔊', deliveryDays: 1,
      isFeatured: true,
      tags: '["trending","electronics","audio"]',
      categoryId: categoryMap['electronics'], vendorId: vendor.id,
    },
    {
      name: 'Shea Butter Body Lotion 250ml',
      slug: 'shea-butter-body-lotion-250ml',
      description: 'Pure Ethiopian shea butter. Deeply moisturizes and nourishes skin. Natural and organic ingredients.',
      price: 450, originalPrice: 620, sku: 'BEA-SHE-250',
      stock: 150, categoryIcon: '💧', deliveryDays: 2,
      isLocal: true, isOrganic: true,
      tags: '["organic","natural","beauty"]',
      categoryId: categoryMap['beauty'], vendorId: vendor.id,
    },
    {
      name: 'Paracetamol 500mg (100 tabs)',
      slug: 'paracetamol-500mg-100-tabs',
      description: 'Effective pain relief and fever reducer. Pharmacy-verified quality. 100 tablets per bottle.',
      price: 85, originalPrice: 120, sku: 'PHA-PAR-100',
      stock: 500, categoryIcon: '💊', deliveryDays: 1,
      tags: '["essential","medicine"]',
      categoryId: categoryMap['pharmacy'], vendorId: vendor.id,
    },
    {
      name: 'Leather Handbag - Premium',
      slug: 'leather-handbag-premium',
      description: 'Genuine Ethiopian leather handbag. Hand-stitched with traditional patterns. Made in Addis Ababa by skilled artisans.',
      price: 2800, originalPrice: 3500, sku: 'FAS-LEA-BAG',
      stock: 25, categoryIcon: '👜', deliveryDays: 3,
      isLocal: true, isHandmade: true, isFeatured: true,
      tags: '["handmade","leather","fashion"]',
      categoryId: categoryMap['fashion'], vendorId: vendor.id,
    },
    {
      name: 'Macchiato Espresso Maker',
      slug: 'macchiato-espresso-maker',
      description: 'Professional espresso machine. Perfect for Ethiopian macchiato at home. 15-bar pressure pump.',
      price: 8900, originalPrice: 12000, sku: 'ELE-ESP-MAK',
      stock: 20, categoryIcon: '☕', deliveryDays: 2,
      tags: '["popular","kitchen"]',
      categoryId: categoryMap['electronics'], vendorId: vendor.id,
    },
    {
      name: 'Injera Mitad (Clay Plate)',
      slug: 'injera-mitad-clay-plate',
      description: 'Authentic clay mitad for perfect injera. Hand-crafted by skilled artisans in Awasa. Traditional cooking surface.',
      price: 1200, originalPrice: 1800, sku: 'HOM-MIT-CLY',
      stock: 40, categoryIcon: '🍳', deliveryDays: 4,
      isLocal: true, isHandmade: true,
      tags: '["handmade","traditional","kitchen"]',
      categoryId: categoryMap['home-living'], vendorId: vendor.id,
    },
  ]

  for (const product of products) {
    const existing = await db.product.findUnique({ where: { slug: product.slug } })
    if (!existing) {
      await db.product.create({ data: product })
    }
  }
  console.log('✅ Products created:', products.length)

  // Create sample reviews
  const allProducts = await db.product.findMany()
  for (const product of allProducts.slice(0, 6)) {
    const existingReview = await db.review.findFirst({
      where: { userId: regularUser.id, productId: product.id }
    })
    if (!existingReview) {
      await db.review.create({
        data: {
          userId: regularUser.id,
          productId: product.id,
          rating: 5,
          comment: 'Excellent product! Fast delivery and great quality. Highly recommended.',
          verified: true,
          helpful: Math.floor(Math.random() * 30) + 5,
        }
      })
    }
  }
  console.log('✅ Reviews created')

  // Create notifications for the regular user
  const notifs = [
    { type: 'price_drop', title: 'Price Drop Alert!', message: 'Samsung Galaxy A15 dropped by 3,600 ETB. Buy now and save!', icon: '📉', read: false },
    { type: 'flash_sale', title: 'Flash Sale Live!', message: 'Up to 40% off on electronics. Ends in 2 hours!', icon: '⚡', read: false },
    { type: 'savings', title: 'You saved 530 Birr!', message: 'Smart bundle purchase detected. Keep saving with AI recommendations.', icon: '💰', read: true },
    { type: 'new_arrival', title: 'New Ethiopian Coffee', message: 'Fresh Yirgacheffe harvest just arrived. Limited stock!', icon: '☕', read: true },
  ]

  for (const notif of notifs) {
    await db.notification.create({
      data: { ...notif, userId: regularUser.id }
    })
  }
  console.log('✅ Notifications created:', notifs.length)

  // Update product ratings
  for (const product of allProducts) {
    const reviews = await db.review.findMany({ where: { productId: product.id } })
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      await db.product.update({
        where: { id: product.id },
        data: { rating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length }
      })
    }
  }

  console.log('🎉 Seed completed successfully!')
  console.log('Seed account passwords are controlled through environment variables and are not printed.')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
