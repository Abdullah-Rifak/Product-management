'use client';

import { useEffect, useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, List, Grid, DollarSign, X, Filter, Moon, Sun } from 'lucide-react';
import { ProductTable } from '@/components/ProductTable';
import { ProductForm } from '@/components/ProductForm';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types/product';
import { toast } from 'sonner';

type SortOption = 'newest' | 'oldest' | 'priceAsc' | 'priceDesc';
type ImageFilter = 'all' | 'withImage' | 'withoutImage';
type ThemeMode = 'light' | 'dark';

export default function Home() {
  const { products, loading, addProduct, updateProduct, deleteProduct, searchProducts, stats } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [imageFilter, setImageFilter] = useState<ImageFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'light';

    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return storedTheme === 'dark' || (storedTheme === null && prefersDark) ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  const filteredProducts = useMemo(() => {
    const min = minPrice.trim() ? Number(minPrice) : null;
    const max = maxPrice.trim() ? Number(maxPrice) : null;

    let next = searchProducts(searchQuery).filter((product) => {
      if (min !== null && !Number.isNaN(min) && product.price < min) return false;
      if (max !== null && !Number.isNaN(max) && product.price > max) return false;

      if (imageFilter === 'withImage') return Boolean(product.image);
      if (imageFilter === 'withoutImage') return !product.image;

      return true;
    });

    next = [...next].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'priceAsc':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return next;
  }, [searchProducts, searchQuery, minPrice, maxPrice, imageFilter, sortBy]);

  const hasActiveFilters = Boolean(searchQuery || minPrice || maxPrice || imageFilter !== 'all');

  const handleAddProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    addProduct(productData);
    setIsAddDialogOpen(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    toast.message('Search cleared', {
      description: 'Showing all products.',
    });
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setImageFilter('all');
    setSortBy('newest');
    toast.message('Filters cleared', {
      description: 'Showing all products with default sorting.',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Loader2 className="w-12 h-12 animate-spin text-white" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Loading Products</h2>
          <p className="text-muted-foreground">Loading your product catalog from storage...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen main-corner-background animate-page-enter">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-xl border-b border-border/70 sticky top-0 z-50 animate-fade-up">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="absolute right-4 top-4 sm:right-6 sm:top-6 z-10">
            <Button
              type="button"
              variant="outline"
              onClick={toggleTheme}
              className="group h-10 px-3 bg-card/90 border-border/80 hover:bg-card"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-sky-700" />
              )}
              <span
                className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 -translate-x-1 transition-all duration-300 ease-out group-hover:max-w-[130px] group-hover:opacity-100 group-hover:translate-x-0"
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            </Button>
          </div>
          <div className="text-center mb-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-sky-700 via-cyan-700 to-amber-600 bg-clip-text text-transparent mb-4 drop-shadow-lg animate-shimmer">
              Product Management
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Effortlessly manage your product catalog with search, and 
              beautiful responsive views.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Stats & Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Add Product Button */}
            <ProductForm
              onSubmit={handleAddProduct}
              open={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
              title="Add New Product"
            />

            {/* Stats Cards */}
            <div className="space-y-4 animate-fade-up">
              <div className="bg-card/75 backdrop-blur-xl rounded-2xl p-8 border border-border/70 shadow-xl hover:shadow-2xl transition-all duration-300 animate-soft-float">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <List className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Total Products</p>
                  </div>
                </div>
                <div className="text-4xl font-black text-foreground">{stats.total}</div>
              </div>

              <div className="bg-card/75 backdrop-blur-xl rounded-2xl p-8 border border-border/70 shadow-xl hover:shadow-2xl transition-all duration-300 animate-soft-float">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Total Value</p>
                  </div>
                </div>
                <div className="text-4xl font-black text-foreground">${stats.totalValue.toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6 animate-fade-up">
            {/* Search & View Toggle */}
            <div className="bg-card/75 backdrop-blur-xl rounded-2xl p-6 border border-border/70 shadow-xl animate-fade-up animate-soft-float">
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search products by name or description..."
                    className="pl-12 h-12 bg-background/70 backdrop-blur-sm border-2 border-border focus:border-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                      onClick={handleClearSearch}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:flex gap-2 animate-fade-up">
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    size="sm"
                    className="h-12 w-full sm:w-auto px-4 gap-2 shadow-lg"
                    onClick={() => setViewMode('table')}
                  >
                    <List className="w-4 h-4" />
                    Table
                  </Button>
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'outline'}
                    size="sm"
                    className="h-12 w-full sm:w-auto px-4 gap-2 shadow-lg"
                    onClick={() => setViewMode('cards')}
                  >
                    <Grid className="w-4 h-4" />
                    Cards
                  </Button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 animate-fade-up">
                <div className="flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 h-10 text-sm text-muted-foreground">
                  <Filter className="w-4 h-4" />
                  Filters
                </div>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Min price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="h-10 bg-background/70"
                />
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Max price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="h-10 bg-background/70"
                />
                <select
                  value={imageFilter}
                  onChange={(e) => setImageFilter(e.target.value as ImageFilter)}
                  className="h-10 rounded-lg border border-border bg-background/70 px-3 text-sm outline-none focus:border-ring"
                >
                  <option value="all">All images</option>
                  <option value="withImage">With image</option>
                  <option value="withoutImage">Without image</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="h-10 rounded-lg border border-border bg-background/70 px-3 text-sm outline-none focus:border-ring"
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="oldest">Sort: Oldest</option>
                  <option value="priceAsc">Sort: Price low to high</option>
                  <option value="priceDesc">Sort: Price high to low</option>
                </select>
              </div>
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
                {hasActiveFilters && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>

            {/* Products Content */}
            <div className="space-y-6">
              {filteredProducts.length === 0 ? (
                <div className="bg-card/75 backdrop-blur-xl rounded-2xl border border-border/70 p-16 text-center shadow-xl">
                  <div className="w-24 h-24 mx-auto mb-8 p-6 bg-gradient-to-br from-muted to-muted/30 rounded-2xl flex items-center justify-center">
                    {searchQuery ? (
                      <Search className="w-12 h-12 text-muted-foreground" />
                    ) : (
                      <List className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {hasActiveFilters ? 'No products found' : 'No products yet'}
                  </h3>
                  <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto leading-relaxed">
                    {hasActiveFilters
                      ? 'Try different filter values or clear filters.'
                      : 'Get started by adding your first product using the button above.'
                    }
                  </p>
                  <ProductForm onSubmit={handleAddProduct} />
                </div>
              ) : viewMode === 'table' ? (
                <ProductTable
                  products={filteredProducts}
                  onEdit={updateProduct}
                  onDelete={deleteProduct}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                  {filteredProducts.map((product, index) => (
                    <div key={product.id} style={{ animationDelay: `${index * 70}ms` }} className="animate-card-rise">
                      <ProductCard
                        product={product}
                        onEdit={(p) => updateProduct(p.id, p)}
                        onDelete={deleteProduct}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}