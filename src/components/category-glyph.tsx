import {
  Coffee,
  Gem,
  Package,
  Pill,
  Shirt,
  ShoppingBasket,
  Smartphone,
  Sofa,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  beauty: Sparkles,
  'coffee-spices': Coffee,
  electronics: Smartphone,
  fashion: Shirt,
  groceries: ShoppingBasket,
  'home-living': Sofa,
  pharmacy: Pill,
  'traditional-wear': Gem,
}

export function CategoryGlyph({ category, className = 'h-7 w-7' }: { category: string; className?: string }) {
  const normalized = category.toLowerCase().trim().replace(/\s+/g, '-')
  const Icon = CATEGORY_ICONS[normalized] ?? Package
  return <Icon className={className} aria-hidden="true" />
}
