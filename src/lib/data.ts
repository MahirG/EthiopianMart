import type { Product, Category, Order, PaymentMethod, Notification, Vendor, MembershipTier } from './types'

export const categories: Category[] = [
  { id: 'groceries', name: 'Groceries', nameAm: 'ሸቄሎ', icon: '🛒', color: 'from-emerald-500 to-green-600', productCount: 12450 },
  { id: 'electronics', name: 'Electronics', nameAm: 'ኤሌክትሮኒክስ', icon: '📱', color: 'from-amber-500 to-orange-600', productCount: 8930 },
  { id: 'fashion', name: 'Fashion', nameAm: 'ፋሽን', icon: '👗', color: 'from-rose-500 to-pink-600', productCount: 15670 },
  { id: 'home', name: 'Home & Living', nameAm: 'ቤት', icon: '🏠', color: 'from-teal-500 to-cyan-600', productCount: 9840 },
  { id: 'furniture', name: 'Furniture', nameAm: 'የቤት እቃዎች', icon: '🛋️', color: 'from-stone-500 to-amber-700', productCount: 4210 },
  { id: 'beauty', name: 'Beauty', nameAm: 'ውበት', icon: '💄', color: 'from-pink-500 to-rose-600', productCount: 6720 },
  { id: 'pharmacy', name: 'Pharmacy', nameAm: 'ፋርማሲ', icon: '💊', color: 'from-red-500 to-rose-600', productCount: 3890 },
  { id: 'coffee', name: 'Coffee & Spices', nameAm: 'ቡና', icon: '☕', color: 'from-amber-700 to-yellow-900', productCount: 2150 },
  { id: 'agriculture', name: 'Agriculture', nameAm: 'ግብርና', icon: '🌾', color: 'from-lime-500 to-green-700', productCount: 3450 },
  { id: 'automotive', name: 'Automotive', nameAm: 'መኪና', icon: '🚗', color: 'from-slate-500 to-gray-700', productCount: 1890 },
  { id: 'baby', name: 'Baby Products', nameAm: 'ህፃን', icon: '🍼', color: 'from-sky-400 to-blue-500', productCount: 2780 },
  { id: 'books', name: 'Books', nameAm: 'መጻሕፍት', icon: '📚', color: 'from-violet-500 to-purple-600', productCount: 5640 },
  { id: 'sports', name: 'Sports', nameAm: 'ስፖርት', icon: '⚽', color: 'from-orange-500 to-red-600', productCount: 3120 },
  { id: 'handmade', name: 'Handmade', nameAm: 'የእጅ ሥራ', icon: '🎨', color: 'from-yellow-500 to-amber-600', productCount: 1890 },
  { id: 'construction', name: 'Construction', nameAm: 'ግንባታ', icon: '🔨', color: 'from-zinc-500 to-stone-700', productCount: 2340 },
  { id: 'traditional', name: 'Traditional Wear', nameAm: 'ባህላዊ', icon: '🧵', color: 'from-red-600 to-amber-700', productCount: 1450 },
]

export const products: Product[] = [
  {
    id: 'p1', name: 'Yirgacheffe Premium Coffee 1kg', nameAm: 'ይርጋጨፌ ቡና',
    category: 'coffee', categoryIcon: '☕', price: 850, originalPrice: 1100,
    rating: 4.9, reviewCount: 2840, vendor: 'Addis Coffee Co.', vendorId: 'v1',
    location: 'Yirgacheffe, SNNPR', inStock: true, deliveryDays: 2,
    isLocal: true, isOrganic: true, tags: ['bestseller', 'ethiopian'],
    discount: 23, bundleSavings: 230, predictedPriceDrop: 5, bestTimeToBuy: 'Friday',
    description: 'Single-origin Yirgacheffe coffee beans, hand-picked and sun-dried. World-renowned floral and citrus notes.',
  },
  {
    id: 'p2', name: 'Samsung Galaxy A15 128GB', nameAm: 'ሳምሰንግ ጋላክሲ',
    category: 'electronics', categoryIcon: '📱', price: 18900, originalPrice: 22500,
    rating: 4.6, reviewCount: 1540, vendor: 'TechHub Addis', vendorId: 'v2',
    location: 'Addis Ababa, Bole', inStock: true, deliveryDays: 1,
    tags: ['trending', 'popular'], discount: 16, bundleSavings: 1200,
    bestTimeToBuy: 'Friday', description: '6.5" Super AMOLED, 50MP camera, 5000mAh battery. Perfect for Ethiopian networks.',
  },
  {
    id: 'p3', name: 'Berbere Spice Mix 500g', nameAm: 'በርበሬ',
    category: 'coffee', categoryIcon: '🌶️', price: 320, originalPrice: 420,
    rating: 4.8, reviewCount: 980, vendor: 'Spice Garden Ethiopia', vendorId: 'v3',
    location: 'Gondar, Amhara', inStock: true, deliveryDays: 3,
    isLocal: true, isOrganic: true, tags: ['traditional', 'ethiopian'],
    discount: 24, bundleSavings: 100, description: 'Authentic Ethiopian berbere blend. Perfect for doro wat and other traditional dishes.',
  },
  {
    id: 'p4', name: 'Habesha Kemis - Wedding Edition', nameAm: 'ሐበሻ ቀሚስ',
    category: 'traditional', categoryIcon: '👗', price: 4500, originalPrice: 6500,
    rating: 4.9, reviewCount: 670, vendor: 'Maru Habesha Fashion', vendorId: 'v4',
    location: 'Addis Ababa, Merkato', inStock: true, deliveryDays: 5,
    isLocal: true, isHandmade: true, tags: ['handmade', 'traditional'],
    discount: 31, bundleSavings: 500, description: 'Hand-woven cotton dress with intricate Tilet embroidery. Made by master artisans.',
  },
  {
    id: 'p5', name: 'Teff Flour 5kg - Organic', nameAm: 'ጤፍ ዱብ',
    category: 'groceries', categoryIcon: '🌾', price: 480, originalPrice: 580,
    rating: 4.7, reviewCount: 3210, vendor: 'Highland Grains', vendorId: 'v5',
    location: 'Adama, Oromia', inStock: true, deliveryDays: 2,
    isLocal: true, isOrganic: true, tags: ['staple', 'ethiopian'],
    discount: 17, bundleSavings: 150, bestTimeToBuy: 'Saturday',
    description: '100% organic teff flour for authentic injera. Rich in iron and calcium.',
  },
  {
    id: 'p6', name: 'Olive Cooking Oil 5L', nameAm: 'የሮማ ዘይት',
    category: 'groceries', categoryIcon: '🛒', price: 1850, originalPrice: 2400,
    rating: 4.4, reviewCount: 2100, vendor: 'Family Mart', vendorId: 'v6',
    location: 'Addis Ababa, Piassa', inStock: true, deliveryDays: 1,
    tags: ['essential'], discount: 23, bundleSavings: 400,
    bestTimeToBuy: 'Friday', description: 'Premium cooking oil. Heart-healthy blend for everyday cooking.',
  },
  {
    id: 'p7', name: 'Injera Mitad (Clay Plate)', nameAm: 'ምጣድ',
    category: 'home', categoryIcon: '🍳', price: 1200, originalPrice: 1800,
    rating: 4.8, reviewCount: 540, vendor: 'Traditional Crafts Ethiopia', vendorId: 'v7',
    location: 'Awasa, SNNPR', inStock: true, deliveryDays: 4,
    isLocal: true, isHandmade: true, tags: ['handmade', 'traditional'],
    discount: 33, bundleSavings: 200, description: 'Authentic clay mitad for perfect injera. Hand-crafted by skilled artisans.',
  },
  {
    id: 'p8', name: 'JBL Flip 6 Bluetooth Speaker', nameAm: 'ጄቢኤል ድምጽ',
    category: 'electronics', categoryIcon: '🔊', price: 6800, originalPrice: 8500,
    rating: 4.7, reviewCount: 890, vendor: 'Sound World', vendorId: 'v8',
    location: 'Addis Ababa, Kazanchis', inStock: true, deliveryDays: 1,
    tags: ['trending'], discount: 20, bundleSavings: 800,
    bestTimeToBuy: 'Friday', description: 'Waterproof portable speaker with 12 hours of playtime. Perfect for any gathering.',
  },
  {
    id: 'p9', name: 'Shea Butter Body Lotion 250ml', nameAm: 'ሺባ ቅባት',
    category: 'beauty', categoryIcon: '💧', price: 450, originalPrice: 620,
    rating: 4.6, reviewCount: 1230, vendor: 'Natural Beauty ET', vendorId: 'v9',
    location: 'Bahir Dar, Amhara', inStock: true, deliveryDays: 2,
    isLocal: true, isOrganic: true, tags: ['organic', 'natural'],
    discount: 27, bundleSavings: 120, description: 'Pure Ethiopian shea butter. Deeply moisturizes and nourishes skin.',
  },
  {
    id: 'p10', name: 'Macchiato Espresso Maker', nameAm: 'የማኪያቶ ማሽን',
    category: 'home', categoryIcon: '☕', price: 8900, originalPrice: 12000,
    rating: 4.5, reviewCount: 340, vendor: 'TechHub Addis', vendorId: 'v2',
    location: 'Addis Ababa, Bole', inStock: true, deliveryDays: 2,
    tags: ['popular'], discount: 26, bundleSavings: 1500,
    description: 'Professional espresso machine. Perfect for Ethiopian macchiato at home.',
  },
  {
    id: 'p11', name: 'Wot Baladerno (Leather Bag)', nameAm: 'ቆዳ ቦርሳ',
    category: 'fashion', categoryIcon: '👜', price: 2800, originalPrice: 3500,
    rating: 4.9, reviewCount: 420, vendor: 'Maru Habesha Fashion', vendorId: 'v4',
    location: 'Addis Ababa, Merkato', inStock: true, deliveryDays: 3,
    isLocal: true, isHandmade: true, tags: ['handmade', 'leather'],
    discount: 20, bundleSavings: 300, description: 'Genuine Ethiopian leather handbag. Hand-stitched with traditional patterns.',
  },
  {
    id: 'p12', name: 'Paracetamol 500mg (100 tabs)', nameAm: 'ፓራሲታሞል',
    category: 'pharmacy', categoryIcon: '💊', price: 85, originalPrice: 120,
    rating: 4.8, reviewCount: 5600, vendor: 'Addis Pharmacy', vendorId: 'v10',
    location: 'Addis Ababa, 4 Kilo', inStock: true, deliveryDays: 1,
    tags: ['essential', 'medicine'], discount: 29, bundleSavings: 35,
    description: 'Effective pain relief and fever reducer. Pharmacy-verified quality.',
  },
]

export const orders: Order[] = [
  {
    id: 'ORD-2024-7841', date: '2024-12-10', status: 'on_the_way',
    items: [
      { name: 'Yirgacheffe Premium Coffee 1kg', quantity: 2, price: 850, image: '☕' },
      { name: 'Berbere Spice Mix 500g', quantity: 1, price: 320, image: '🌶️' },
    ],
    total: 2020, vendor: 'Addis Coffee Co.',
    driver: { name: 'Dawit Bekele', phone: '+251911234567', rating: 4.9, vehicle: 'Motorcycle • AA-45321' },
    eta: '25 min', progress: 70, deliveryAddress: 'Bole, Addis Ababa, near Edna Mall',
    paymentMethod: 'Telebirr',
  },
  {
    id: 'ORD-2024-7835', date: '2024-12-09', status: 'delivered',
    items: [
      { name: 'Samsung Galaxy A15', quantity: 1, price: 18900, image: '📱' },
      { name: 'Phone Case', quantity: 1, price: 350, image: '📱' },
    ],
    total: 19250, vendor: 'TechHub Addis', progress: 100,
    deliveryAddress: 'Bole, Addis Ababa', paymentMethod: 'CBE Birr',
  },
  {
    id: 'ORD-2024-7829', date: '2024-12-08', status: 'delivered',
    items: [
      { name: 'Teff Flour 5kg', quantity: 2, price: 480, image: '🌾' },
      { name: 'Olive Cooking Oil 5L', quantity: 1, price: 1850, image: '🛢️' },
    ],
    total: 2810, vendor: 'Highland Grains', progress: 100,
    deliveryAddress: 'Bole, Addis Ababa', paymentMethod: 'Cash on Delivery',
  },
]

export const paymentMethods: PaymentMethod[] = [
  { id: 'telebirr', name: 'Telebirr', type: 'mobile', icon: '📱', color: 'from-emerald-500 to-green-600', description: 'Ethio Telecom mobile payment', balance: 4520 },
  { id: 'cbe', name: 'CBE Birr', type: 'mobile', icon: '🏦', color: 'from-amber-500 to-yellow-600', description: 'Commercial Bank of Ethiopia', balance: 12300 },
  { id: 'chapa', name: 'Chapa', type: 'mobile', icon: '💳', color: 'from-rose-500 to-pink-600', description: 'Instant digital payments' },
  { id: 'santim', name: 'SantimPay', type: 'mobile', icon: '⚡', color: 'from-violet-500 to-purple-600', description: 'Fast & secure transfers' },
  { id: 'bank', name: 'Bank Transfer', type: 'bank', icon: '🏛️', color: 'from-slate-500 to-gray-700', description: 'Direct bank deposit' },
  { id: 'visa', name: 'Visa Card', type: 'card', icon: '💳', color: 'from-blue-500 to-indigo-600', description: 'International cards accepted' },
  { id: 'mastercard', name: 'Mastercard', type: 'card', icon: '💳', color: 'from-orange-500 to-red-600', description: 'Worldwide payment network' },
  { id: 'cod', name: 'Cash on Delivery', type: 'cash', icon: '💵', color: 'from-green-500 to-emerald-600', description: 'Pay when you receive' },
  { id: 'wallet', name: 'Gebeya Wallet', type: 'wallet', icon: '👛', color: 'from-teal-500 to-cyan-600', description: 'Your digital wallet', balance: 2840 },
  { id: 'qr', name: 'QR Payment', type: 'wallet', icon: '📷', color: 'from-fuchsia-500 to-pink-600', description: 'Scan & pay instantly' },
]

export const notifications: Notification[] = [
  { id: 'n1', type: 'price_drop', title: 'Price Drop Alert!', message: 'Samsung Galaxy A15 dropped by 3,600 Birr. Buy now and save!', time: '2 min ago', read: false, icon: '📉' },
  { id: 'n2', type: 'delivery', title: 'Order on the way', message: 'Your coffee order is 25 minutes away. Driver Dawit is en route.', time: '15 min ago', read: false, icon: '🚀' },
  { id: 'n3', type: 'flash_sale', title: 'Flash Sale Live!', message: 'Up to 40% off on electronics. Ends in 2 hours!', time: '1 hour ago', read: false, icon: '⚡' },
  { id: 'n4', type: 'savings', title: 'You saved 530 Birr!', message: 'Smart bundle purchase detected. Keep saving with AI recommendations.', time: '3 hours ago', read: true, icon: '💰' },
  { id: 'n5', type: 'wishlist', title: 'Wishlist item available', message: 'Habesha Kemis is back in stock in your size!', time: '5 hours ago', read: true, icon: '❤️' },
  { id: 'n6', type: 'new_arrival', title: 'New Ethiopian Coffee', message: 'Fresh Yirgacheffe harvest just arrived. Limited stock!', time: '1 day ago', read: true, icon: '☕' },
]

export const vendors: Vendor[] = [
  { id: 'v1', name: 'Addis Coffee Co.', rating: 4.9, productCount: 145, sales: 12450, revenue: 8450000, location: 'Yirgacheffe', verified: true },
  { id: 'v2', name: 'TechHub Addis', rating: 4.6, productCount: 890, sales: 31200, revenue: 28900000, location: 'Addis Ababa', verified: true },
  { id: 'v3', name: 'Spice Garden Ethiopia', rating: 4.8, productCount: 78, sales: 8900, revenue: 2340000, location: 'Gondar', verified: true },
  { id: 'v4', name: 'Maru Habesha Fashion', rating: 4.9, productCount: 234, sales: 6700, revenue: 18900000, location: 'Addis Ababa', verified: true },
  { id: 'v5', name: 'Highland Grains', rating: 4.7, productCount: 56, sales: 18900, revenue: 4520000, location: 'Adama', verified: true },
]

export const membershipTiers: MembershipTier[] = [
  {
    name: 'Silver', price: 0, color: 'from-slate-400 to-slate-600',
    benefits: ['Standard delivery (3-5 days)', 'Basic AI recommendations', '5% cashback on select items', 'Community support'],
  },
  {
    name: 'Gold', price: 299, color: 'from-amber-400 to-yellow-600', popular: true,
    benefits: ['Free delivery on orders 500+', 'Advanced AI assistant', '10% cashback everywhere', 'Early access to sales', 'Priority support'],
  },
  {
    name: 'Platinum', price: 599, color: 'from-violet-400 to-purple-600',
    benefits: ['Free unlimited delivery', 'VIP AI concierge', '20% cashback + bonus', 'Exclusive member deals', '24/7 white-glove support', 'Free returns'],
  },
]

// AI Assistant quick prompts
export const aiQuickPrompts = [
  'Find me the cheapest Samsung phone under 25,000 Birr',
  'Compare these washing machines',
  'Which cooking oil saves more money?',
  'Suggest groceries for a family of six',
  'Find locally made products',
  'Recommend alternatives',
  'Best coffee for gifting?',
  'Track my spending this month',
]

export const aiSuggestions = [
  'You can save 530 Birr by buying this bundle 🎉',
  'Wait until Friday to save 18% on this item',
  'This nearby store is 12% cheaper',
  'Bundle these 3 items and save 450 Birr',
  'Price prediction: Buy now, prices rising next week',
]
