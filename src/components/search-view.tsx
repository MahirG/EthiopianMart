'use client'

import { useDeferredValue } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { fetchCatalogCategories, fetchCatalogProducts } from '@/lib/catalog'
import { useAppStore } from '@/lib/store'
import { ProductCard } from './product-card'

const sortOptions = [
  ['relevance', 'Recommended'],
  ['newest', 'Newest'],
  ['rating', 'Top rated'],
  ['price_low', 'Price: low to high'],
  ['price_high', 'Price: high to low'],
] as const

export function SearchView() {
  const {
    catalogQuery, setCatalogQuery,
    catalogCategory, setCatalogCategory,
    catalogLocal, setCatalogLocal,
    catalogSort, setCatalogSort,
  } = useAppStore()
  const deferredQuery = useDeferredValue(catalogQuery)
  const categoriesQuery = useQuery({ queryKey: ['catalog-categories'], queryFn: fetchCatalogCategories })
  const productsQuery = useQuery({
    queryKey: ['catalog-products', deferredQuery, catalogCategory, catalogLocal, catalogSort],
    queryFn: () => fetchCatalogProducts({
      search: deferredQuery,
      category: catalogCategory === 'all' ? undefined : catalogCategory,
      isLocal: catalogLocal,
      sort: catalogSort,
      limit: 48,
    }),
  })

  const clear = () => {
    setCatalogQuery('')
    setCatalogCategory('all')
    setCatalogLocal(false)
  }
  const hasFilters = Boolean(catalogQuery || catalogCategory !== 'all' || catalogLocal)

  return (
    <div className="pb-8">
      <div className="border-b border-border pb-8">
        <p className="text-xs font-bold uppercase tracking-[.18em] text-primary">Marketplace</p>
        <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div><h1 className="text-3xl font-black tracking-[-0.045em] sm:text-4xl">Find something remarkable</h1><p className="mt-2 text-sm text-muted-foreground">Live products from EthiopianMart sellers.</p></div>
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={catalogQuery}
              onChange={(event) => setCatalogQuery(event.target.value)}
              placeholder="Search products or sellers"
              className="w-full rounded-full border border-border bg-card py-3 pl-11 pr-11 outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
              aria-label="Search catalog"
            />
            {catalogQuery && <button onClick={() => setCatalogQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"><X className="h-4 w-4" /></button>}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-start">
        <aside className="rounded-2xl border border-border bg-card p-4 lg:sticky lg:top-40 lg:w-60 lg:shrink-0" aria-label="Catalog filters">
          <div className="flex items-center justify-between"><h2 className="flex items-center gap-2 text-sm font-extrabold"><SlidersHorizontal className="h-4 w-4" /> Filters</h2>{hasFilters && <button onClick={clear} className="text-xs font-bold text-primary">Clear</button>}</div>
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-[10px] font-bold uppercase tracking-[.15em] text-muted-foreground">Category</p>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:grid lg:overflow-visible">
              <button onClick={() => setCatalogCategory('all')} className={`whitespace-nowrap rounded-xl px-3 py-2 text-left text-xs font-bold ${catalogCategory === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/70'}`}>All categories</button>
              {categoriesQuery.data?.map((category) => (
                <button key={category.id} onClick={() => setCatalogCategory(category.id)} className={`flex whitespace-nowrap rounded-xl px-3 py-2 text-left text-xs font-semibold ${catalogCategory === category.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                  <span className="mr-2">{category.icon}</span>{category.name}<span className="ml-auto hidden text-muted-foreground lg:inline">{category.productCount}</span>
                </button>
              ))}
            </div>
          </div>
          <label className="mt-5 flex cursor-pointer items-center justify-between border-t border-border pt-4 text-xs font-bold">
            Made in Ethiopia
            <input type="checkbox" checked={catalogLocal} onChange={(event) => setCatalogLocal(event.target.checked)} className="h-4 w-4 accent-[#0f5132]" />
          </label>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">{productsQuery.isLoading ? 'Loading products…' : `${productsQuery.data?.total ?? 0} products`}</p>
            <select value={catalogSort} onChange={(event) => setCatalogSort(event.target.value)} className="rounded-full border border-border bg-card px-4 py-2 text-xs font-bold outline-none" aria-label="Sort products">
              {sortOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>

          {productsQuery.isLoading && <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 12 }).map((_, index) => <div key={index} className="aspect-[.72] rounded-2xl skeleton-premium" />)}</div>}
          {productsQuery.isError && <div className="rounded-2xl border border-dashed border-border p-10 text-center"><h2 className="text-lg font-extrabold">The catalog couldn&apos;t be loaded</h2><p className="mt-2 text-sm text-muted-foreground">Check the database connection, then try again.</p><button onClick={() => productsQuery.refetch()} className="mt-4 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground">Try again</button></div>}
          {productsQuery.data?.products.length === 0 && <div className="rounded-2xl bg-muted/50 p-12 text-center"><Search className="mx-auto h-8 w-8 text-muted-foreground" /><h2 className="mt-4 text-lg font-extrabold">No products match yet</h2><p className="mt-2 text-sm text-muted-foreground">Try a broader search or clear a filter.</p><button onClick={clear} className="mt-4 text-sm font-bold text-primary">Clear all filters</button></div>}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {productsQuery.data?.products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
