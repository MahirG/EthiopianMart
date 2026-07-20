import type { Language } from './types'

export const languages: { code: Language; name: string; nativeName: string; flag: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: 'EN' },
  { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: 'አማ' },
  { code: 'or', name: 'Oromo', nativeName: 'Afaan Oromoo', flag: 'OR' },
  { code: 'ti', name: 'Tigrinya', nativeName: 'ትግርኛ', flag: 'ትግ' },
  { code: 'so', name: 'Somali', nativeName: 'Soomaali', flag: 'SO' },
]

type TranslationKey =
  | 'home' | 'search' | 'cart' | 'assistant' | 'orders' | 'wallet' | 'profile'
  | 'vendor' | 'admin' | 'categories' | 'deals' | 'trending' | 'recommended'
  | 'savings' | 'delivery' | 'payments' | 'membership' | 'support' | 'security'
  | 'sellOn' | 'dashboard' | 'addtoCart' | 'buyNow' | 'inStock' | 'outOfStock'
  | 'freeDelivery' | 'bestPrice' | 'localProduct' | 'save' | 'off' | 'searchPlaceholder'
  | 'voiceSearch' | 'imageSearch' | 'barcodeSearch' | 'scanProduct' | 'askAnything'
  | 'yourCart' | 'subtotal' | 'deliveryFee' | 'total' | 'checkout' | 'emptyCart'
  | 'orderStatus' | 'trackOrder' | 'callDriver' | 'chatDriver' | 'delivered'
  | 'onTheWay' | 'confirmed' | 'packing' | 'placed' | 'paymentMethods' | 'walletBalance'
  | 'topUp' | 'transactions' | 'cashback' | 'rewards' | 'upgradeMembership'
  | 'accountSettings' | 'myOrders' | 'wishlist' | 'addresses' | 'helpCenter'
  | 'vendorDashboard' | 'salesToday' | 'revenue' | 'products' | 'orders' | 'customers'
  | 'adminPanel' | 'totalUsers' | 'activeVendors' | 'conversionRate' | 'revenueGrowth'
  | 'flashSale' | 'endingSoon' | 'viewAll' | 'newArrivals' | 'topRated' | 'nearbyStores'
  | 'priceHistory' | 'pricePrediction' | 'bestTimeToBuy' | 'bundleSavings'
  | 'joinNow' | 'perMonth' | 'trustedBy' | 'happyShoppers' | 'productsAvailable'
  | 'localVendors' | 'citiesServed' | 'welcomeBack' | 'goodMorning' | 'goodEvening'

type Translations = Record<TranslationKey, string>

const en: Translations = {
  home: 'Home', search: 'Search', cart: 'Cart', assistant: 'Assistant',
  orders: 'Orders', wallet: 'Wallet', profile: 'Profile', vendor: 'Sell',
  admin: 'Admin', categories: 'Categories', deals: 'Today\'s Deals',
  trending: 'Trending Now', recommended: 'Recommended For You',
  savings: 'Savings', delivery: 'Delivery', payments: 'Payments',
  membership: 'Membership', support: 'Support', security: 'Security',
  sellOn: 'Sell on EthiopianMart', dashboard: 'Dashboard',
  addtoCart: 'Add to Cart', buyNow: 'Buy Now', inStock: 'In Stock', outOfStock: 'Out of Stock',
  freeDelivery: 'Free Delivery', bestPrice: 'Best Price', localProduct: 'Local',
  save: 'Save', off: 'OFF', searchPlaceholder: 'Search products, brands, stores...',
  voiceSearch: 'Voice Search', imageSearch: 'Image Search', barcodeSearch: 'Barcode',
  scanProduct: 'Scan Product', askAnything: 'Ask me anything about shopping...',
  yourCart: 'Your Cart', subtotal: 'Subtotal', deliveryFee: 'Delivery Fee', total: 'Total',
  checkout: 'Proceed to Checkout', emptyCart: 'Your cart is empty',
  orderStatus: 'Order Status', trackOrder: 'Track Order', callDriver: 'Call Driver',
  chatDriver: 'Chat Driver', delivered: 'Delivered', onTheWay: 'On the Way',
  confirmed: 'Confirmed', packing: 'Packing', placed: 'Order Placed',
  paymentMethods: 'Payment Methods', walletBalance: 'Wallet Balance', topUp: 'Top Up',
  transactions: 'Transactions', cashback: 'Cashback', rewards: 'Rewards',
  upgradeMembership: 'Upgrade Membership',
  accountSettings: 'Account Settings', myOrders: 'My Orders', wishlist: 'Wishlist',
  addresses: 'Addresses', helpCenter: 'Help Center',
  vendorDashboard: 'Vendor Dashboard', salesToday: 'Sales Today', revenue: 'Revenue',
  products: 'Products', customers: 'Customers',
  adminPanel: 'Admin Panel', totalUsers: 'Total Users', activeVendors: 'Active Vendors',
  conversionRate: 'Conversion Rate', revenueGrowth: 'Revenue Growth',
  flashSale: 'Flash Sale', endingSoon: 'Ending Soon', viewAll: 'View All',
  newArrivals: 'New Arrivals', topRated: 'Top Rated', nearbyStores: 'Nearby Stores',
  priceHistory: 'Price History', pricePrediction: 'AI Price Prediction',
  bestTimeToBuy: 'Best Time to Buy', bundleSavings: 'Bundle Savings',
  joinNow: 'Join Now', perMonth: '/month',
  trustedBy: 'Trusted by', happyShoppers: 'Happy Shoppers', productsAvailable: 'Products',
  localVendors: 'Local Vendors', citiesServed: 'Cities Served',
  welcomeBack: 'Welcome back', goodMorning: 'Good morning', goodEvening: 'Good evening',
}

const am: Translations = {
  home: 'መነሻ', search: 'ፍለጋ', cart: 'ጋሪ', assistant: 'አጋዥ',
  orders: 'ትዕዛዞች', wallet: 'የኪስ ቦርሳ', profile: 'መገለጫ', vendor: 'ሸጥ',
  admin: 'አስተዳዳሪ', categories: 'ምድቦች', deals: 'የዛሬ ስርዓቶች',
  trending: 'አሁን በመስፋፋት ላይ', recommended: 'ለእርስዎ የተመከረ',
  savings: 'ቁጠባ', delivery: 'መላኪያ', payments: 'ክፍያ',
  membership: 'አባልነት', support: 'ድጋፍ', security: 'ደህንነት',
  sellOn: 'በገበያ ለይ', dashboard: 'ዳሽቦርድ',
  addtoCart: 'ወደ ጋሪ ጨምር', buyNow: 'አሁን ግዛ', inStock: 'አለ በገበያ', outOfStock: 'ጠፍቷል',
  freeDelivery: 'ነፃ መላኪያ', bestPrice: 'ምርጥ ዋጋ', localProduct: ' محلی',
  save: 'ቆጥብ', off: 'ቅናሽ', searchPlaceholder: 'ምርቶች፣ ስሞች፣ ሱቆች ይፈልጉ...',
  voiceSearch: 'የድምጽ ፍለጋ', imageSearch: 'የምስል ፍለጋ', barcodeSearch: 'ባርኮድ',
  scanProduct: 'ምርት ይቃኙ', askAnything: 'ስለ ግዢ ማንኛውንም ይጠይቁ...',
  yourCart: 'የእርስዎ ጋሪ', subtotal: 'ንዑስ ድምር', deliveryFee: 'የመላኪያ ክፍያ', total: 'ድምር',
  checkout: 'ወደ ክፍያ ይቀጥሉ', emptyCart: 'ጋሪዎ ባዶ ነው',
  orderStatus: 'የትዕዛዝ ሁኔታ', trackOrder: 'ትዕዛዝ ይከታተሉ', callDriver: 'ነጂ ይደውሉ',
  chatDriver: 'ነጂ ጋር ይጨዋወቱ', delivered: 'ተደርሷል', onTheWay: 'በመንገድ ላይ',
  confirmed: 'ተረጋግጧል', packing: 'በማሸጊያ ላይ', placed: 'ትዕዛዝ ተቀብሏል',
  paymentMethods: 'የክፍያ ዘዴዎች', walletBalance: 'የቦርሳ ሚዛን', topUp: 'መሙላት',
  transactions: 'ግብይቶች', cashback: 'ጥሬ ገንዘብ ይመልሱ', rewards: 'ሽልማቶች',
  upgradeMembership: 'አባልነት ያሻሽሉ',
  accountSettings: 'የመለያ ቅንብሮች', myOrders: 'የእኔ ትዕዛዞች', wishlist: 'የምፈልገው',
  addresses: 'አድራሻዎች', helpCenter: 'የእገዛ ማዕከል',
  vendorDashboard: 'የሻጭ ዳሽቦርድ', salesToday: 'የዛሬ ሽያጭ', revenue: 'ገቢ',
  products: 'ምርቶች', customers: 'ደንበኞች',
  adminPanel: 'የአስተዳዳሪ ፓናል', totalUsers: 'ጠቅላላ ተጠቃሚዎች', activeVendors: 'ንቁ ሻጮች',
  conversionRate: 'የመቀየር መጠን', revenueGrowth: 'የገቢ እድገት',
  flashSale: 'ፈጣን ሽያጭ', endingSoon: 'በቅርቡ ያበቃል', viewAll: 'ሁሉንም ይመልከቱ',
  newArrivals: 'አዲስ መጣዎች', topRated: 'ከፍተኛ ደረጃ', nearbyStores: 'ተቻችሎ ሱቆች',
  priceHistory: 'የዋጋ ታሪክ', pricePrediction: 'የማስታወቂያ ዋጋ ትንበያ',
  bestTimeToBuy: 'ምርጥ የግዢ ጊዜ', bundleSavings: 'የጥቅል ቁጠባ',
  joinNow: 'አሁን ይቀላቀሉ', perMonth: '/ወር',
  trustedBy: 'ይታመናል በ', happyShoppers: 'ደስተኛ ገዢዎች', productsAvailable: 'ምርቶች',
  localVendors: 'የአካባቢ ሻጮች', citiesServed: 'ከተሞች የሚሰሩ',
  welcomeBack: 'እንኳን በደህና መጡ', goodMorning: 'እንደሚነኩ ጠዋት', goodEvening: 'እንደሚነኩ ማታ',
}

const or: Translations = {
  home: 'Madda', search: 'Barbaadi', cart: 'Kaaraa', assistant: 'Gargaaraa',
  orders: 'Ajaja', wallet: 'Boorsaa', profile: 'Profaayilii', vendor: 'Gaddi',
  admin: 'Bulcha', categories: 'Gama', deals: 'Gurguraa Har\'aa',
  trending: 'Har\'a Daddabaa', recommended: 'Siif Gargaaru',
  savings: 'Qusachuu', delivery: 'Erguu', payments: 'Kaffaltii',
  membership: 'Paartii', support: 'Deggersa', security: 'Nageenya',
  sellOn: 'EthiopianMart irratti gaddi', dashboard: 'Daashboordii',
  addtoCart: 'Karaatti dabal', buyNow: 'Har\'a biti', inStock: 'Jira', outOfStock: 'Hin jiru',
  freeDelivery: 'Erguu Dogoggoraa', bestPrice: 'Galii Gaarii', localProduct: 'Naannoo',
  save: 'Qusadhaa', off: 'Gad-bu\'aa', searchPlaceholder: 'Maaloo barbaadi...',
  voiceSearch: 'Sagalee', imageSearch: 'Suuraa', barcodeSearch: 'Baarikoodii',
  scanProduct: 'Maamila Qaxxiuraa', askAnything: 'Waa\'ee bitaa gaafadhuu...',
  yourCart: 'Karaa kee', subtotal: 'Walumaagala xiqqaa', deliveryFee: 'Kaffaltii erguu', total: 'Walumaagala',
  checkout: 'Kaffaltiiitti darbi', emptyCart: 'Karaan kee duwwa',
  orderStatus: 'Haala Ajajaa', trackOrder: 'Ajaja hordofi', callDriver: 'Soomicha bilbili',
  chatDriver: 'Soomicha waliin haasawi', delivered: 'Geeye', onTheWay: 'Daangaaa jira',
  confirmed: 'Mirkaneeffame', packing: 'Kaffaltii keessa jira', placed: 'Ajajni qabame',
  paymentMethods: 'Akkaataa kaffaltii', walletBalance: 'Haala Boorsaa', topUp: 'Guuti',
  transactions: 'Kaffaltiiwwan', cashback: 'Qallii deebi\'aa', rewards: 'Badhaasa',
  upgradeMembership: 'Paartii guddisi',
  accountSettings: 'Qindaa\'ina akaawuntii', myOrders: 'Ajaja koo', wishlist: 'Fe\'aa koo',
  addresses: 'Teessoo', helpCenter: 'Madda gargaarsaa',
  vendorDashboard: 'Daashboordii Gaddaa', salesToday: 'Gurguraa Har\'aa', revenue: 'Galgii',
  products: 'Maamiloo', customers: 'Maamiltoota',
  adminPanel: 'Paanelii Bulchaa', totalUsers: 'Bay\'ee fayyadamaa', activeVendors: 'Gaddota socho\'an',
  conversionRate: 'Safuu Jijjiirraa', revenueGrowth: 'Guddina Galgii',
  flashSale: 'Gurguraa Saffisaa', endingSoon: 'Dhiyoo jira', viewAll: 'Hunda ilaali',
  newArrivals: 'Haaraa dhufe', topRated: 'Safuu Ol\'aa', nearbyStores: 'Waamicha dhiyoo jiran',
  priceHistory: 'Ta\'aa Galii', pricePrediction: 'Raajeffannaa Galii',
  bestTimeToBuy: 'Yeroo Bituu Gaarii', bundleSavings: 'Qusannaa Kuraa',
  joinNow: 'Har\'aitti makami', perMonth: '/Ji\'aa',
  trustedBy: 'Amantamtu', happyShoppers: 'Bittoota gammadoo', productsAvailable: 'Maamiloo',
  localVendors: 'Gaddota Naannoo', citiesServed: 'Magaalota tajaasilan',
  welcomeBack: 'Baga nagaan dhufte', goodMorning: 'Akkam bultan', goodEvening: 'Akkam galgalaa',
}

const ti: Translations = {
  home: 'መነሻ', search: 'ምልክት', cart: 'ካር', assistant: 'ሓጋዚ',
  orders: 'ትእዛዛት', wallet: 'ከሰይ', profile: 'መግለጺ', vendor: 'ሸይ',
  admin: 'ምሕደር', categories: 'ምድባት', deals: 'ሎሚ ሽያጣታት',
  trending: 'ሎሚ ኣብ ስፋት', recommended: 'ንዓኻ ዝተወሰነ',
  savings: 'ምድራት', delivery: 'ምስዓብ', payments: 'ክፍሊት',
  membership: 'መልህቕ', support: 'ሓገዝ', security: 'ውሑድነት',
  sellOn: 'ኣብ ገበያ ለይ', dashboard: 'ዳሽቦርድ',
  addtoCart: 'ናብ ካር ወስኽ', buyNow: 'ሎሚ ዓዲ', inStock: 'ኣሎ', outOfStock: 'የለን',
  freeDelivery: 'ብውሑድ ምስዓብ', bestPrice: 'ምርጥ ዋጋ', localProduct: 'ብዙሕ',
  save: 'ዑቕ', off: 'ምንም', searchPlaceholder: 'ምልክት ግበር...',
  voiceSearch: 'ቃል', imageSearch: 'ምስሊ', barcodeSearch: 'ባርኮድ',
  scanProduct: 'ምርት ስካን', askAnything: 'ብዛዕባ ምድራት ሕተት...',
  yourCart: 'ናትካ ካር', subtotal: 'ንእሽቶ ድምር', deliveryFee: 'ክፍሊት ምስዓብ', total: 'ድምር',
  checkout: 'ናብ ክፍሊት ኣትዝ', emptyCart: 'ካርካ ባዶ እዩ',
  orderStatus: 'ኩነታ ትእዛዝ', trackOrder: 'ትእዛዝ ተኸታተል', callDriver: 'ነፃኢ ተዘውትረ',
  chatDriver: 'ነፃኢ ተዘውትረ', delivered: 'በፅባሕ', onTheWay: 'ኣብ መንገዲ',
  confirmed: 'ተረኺቡ', packing: 'ኣብ ምስኣብ', placed: 'ትእዛዝ ተቐበለ',
  paymentMethods: 'ኣገባባታት ክፍሊት', walletBalance: 'ሚዛን ከሰይ', topUp: 'መልእኽ',
  transactions: 'ግብሪታት', cashback: 'ገንዘብ ምምላስ', rewards: 'ሽልማታት',
  upgradeMembership: 'መልህቕ ምምሕያሽ',
  accountSettings: 'ምድላዋት መለያ', myOrders: 'ትእዛዛተይ', wishlist: 'እተደሊኩ',
  addresses: 'ኣድራሻታት', helpCenter: 'ማእከል ሓገዝ',
  vendorDashboard: 'ዳሽቦርድ ሸይ', salesToday: 'ሎሚ ሽያጣ', revenue: 'ገቢ',
  products: 'ምርታት', customers: 'ደንበኛታት',
  adminPanel: 'ፓናል ምሕደር', totalUsers: 'ምሉእ ተጠቀምቲ', activeVendors: 'ሸይተኛታት እተሰርሑ',
  conversionRate: 'ምግባር ምቕያር', revenueGrowth: 'ዕቤታ ገቢ',
  flashSale: 'ቅልጡፍ ሽያጣ', endingSoon: 'ኣብ ቀረባ ክውዕብ', viewAll: 'ኩሉ ርአ',
  newArrivals: 'ሓዱሽ መጺእካ', topRated: 'ምርጥ ደረጃ', nearbyStores: 'ሱቓት ኣብ ረኺቡ',
  priceHistory: 'ታሪኽ ዋጋ', pricePrediction: 'ትንበያ ዋጋ',
  bestTimeToBuy: 'ምርጥ እዋን ምድራት', bundleSavings: 'ምድራት ጥቕላል',
  joinNow: 'ሎሚ ተኸፍት', perMonth: '/ወርሒ',
  trustedBy: 'ዝተኣመነት ብ', happyShoppers: 'ደስተኛ ገዛእቲ', productsAvailable: 'ምርታት',
  localVendors: 'ከባቢ ሸይተኛታት', citiesServed: 'ከተማታት ዝሰርሑ',
  welcomeBack: 'እንቋዕ ብደሓን መጻእኩም', goodMorning: 'ከመይ እዩ ናይ ሎሚ', goodEvening: 'ከመይ እዩ ናይ ማዓልቲ',
}

const so: Translations = {
  home: 'Hoyga', search: 'Raadi', cart: 'Gaari', assistant: 'Kaaliye',
  orders: 'Amaro', wallet: 'Bakhaar', profile: 'Profiil', vendor: 'Iibin',
  admin: 'Maamul', categories: 'Qaybaha', deals: 'Iibin Maanta',
  trending: 'Hadda Socda', recommended: 'Kuu Talo Geliyey',
  savings: 'Badbaad', delivery: 'Dhigista', payments: 'Bixinta',
  membership: 'Xubin', support: 'Taageero', security: 'Ammaanka',
  sellOn: 'Ku Iibso EthiopianMart', dashboard: 'Bogga Farsamada',
  addtoCart: 'Ku Daro Gaariga', buyNow: 'Hadda Iibso', inStock: 'Jira', outOfStock: 'Ma Jiro',
  freeDelivery: 'Dhigista Bilaash', bestPrice: 'Qiimaha Ugu Fiican', localProduct: 'Gudaha',
  save: 'Badbaadi', off: 'Dhac', searchPlaceholder: 'Raadi alaab, magacyo, dukan...',
  voiceSearch: 'Cod', imageSearch: 'Sawir', barcodeSearch: 'Barkood',
  scanProduct: 'Skan Alaab', askAnything: 'Wax weydiii iibinta...',
  yourCart: 'Gaariigaaga', subtotal: 'Wadarta yar', deliveryFee: 'Khidmada Dhigista', total: 'Wadarta',
  checkout: 'Sii wad Bixinta', emptyCart: 'Gaariigaaga waa madhan',
  orderStatus: 'Xaalada Amar', trackOrder: 'Raadi Amar', callDriver: 'Wac Darawalka',
  chatDriver: 'La hadal Darawalka', delivered: 'La soo gaarsiiyay', onTheWay: 'Jidka',
  confirmed: 'La xaqiyay', packing: 'Waxaa la wado qabista', placed: 'Amar la qaatay',
  paymentMethods: 'Hababka Bixinta', walletBalance: 'Hadhaaga Bakhaarka', topUp: 'Ku dar',
  transactions: 'Dhaq-dhaqaaqyada', cashback: 'Lacag Celin', rewards: 'Abaal-marino',
  upgradeMembership: 'Ku Wanaagsow Xubinnimada',
  accountSettings: 'Goobo Akaawnta', myOrders: 'Amarooyinkayga', wishlist: 'Rabitaankayga',
  addresses: 'Cinwaano', helpCenter: 'Xarunta Caawimaada',
  vendorDashboard: 'Bogga Iibiyaha', salesToday: 'Iibinta Maanta', revenue: 'Dakhli',
  products: 'Alaab', customers: 'Macaamiil',
  adminPanel: 'Bogga Maamul', totalUsers: 'Isticmaalayaasha Dhan', activeVendors: 'Iibiyayaasha Firfircoon',
  conversionRate: 'Heerka Bedelidda', revenueGrowth: 'Kor u qaadidda Dakhliga',
  flashSale: 'Iibinta Dhaqsaanta', endingSoon: 'Dhow dhammaatay', viewAll: 'Eeg Dhammaan',
  newArrivals: 'Kuwa cusub', topRated: 'Ugu Fiican', nearbyStores: 'Dukaannyo soo dhow',
  priceHistory: 'Taariikhda Qiimaha', pricePrediction: 'Saadaasha Qiimaha',
  bestTimeToBuy: 'Waqtiga Ugu Fiican ee Iibsashada', bundleSavings: 'Badbaadada Bundul',
  joinNow: 'Hadda La Dhexgal', perMonth: '/Bil',
  trustedBy: 'Lagu Kalsoolay', happyShoppers: 'Iibsadayaasha Faraxsan', productsAvailable: 'Alaab',
  localVendors: 'Iibiyayaasha Gudaha', citiesServed: 'Magaalooyinka La Adeegsanayo',
  welcomeBack: 'Soo dhawoow', goodMorning: 'Subax wanaagsan', goodEvening: 'Galab wanaagsan',
}

export const translations: Record<Language, Translations> = { en, am, or, ti, so }

export function t(lang: Language, key: TranslationKey): string {
  return translations[lang][key] || translations.en[key] || key
}
