'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, List, Grid, DollarSign, X } from 'lucide-react';
import { ProductTable } from '@/components/ProductTable';
import { ProductForm } from '@/components/ProductForm';
import { ProductCard } from '@/components/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types/product';
import { toast } from 'sonner';

export default function Home() {
  const { products, loading, addProduct, updateProduct, deleteProduct, searchProducts, stats } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  
  const filteredProducts = useMemo(() => 
    searchProducts(searchQuery), 
    [searchProducts, searchQuery]
  );

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
    <main className="min-h-screen main-corner-background">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-xl border-b border-border/70 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center mb-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-sky-700 via-cyan-700 to-amber-600 bg-clip-text text-transparent mb-4 drop-shadow-lg">
              Product Management
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Effortlessly manage your product catalog with full CRUD operations, search, and 
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
            <div className="space-y-4">
              <div className="bg-card/75 backdrop-blur-xl rounded-2xl p-8 border border-border/70 shadow-xl hover:shadow-2xl transition-all duration-300">
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

              <div className="bg-card/75 backdrop-blur-xl rounded-2xl p-8 border border-border/70 shadow-xl hover:shadow-2xl transition-all duration-300">
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
          <div className="lg:col-span-3 space-y-6">
            {/* Search & View Toggle */}
            <div className="bg-card/75 backdrop-blur-xl rounded-2xl p-6 border border-border/70 shadow-xl">
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
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    size="sm"
                    className="h-12 px-4 gap-2 shadow-lg"
                    onClick={() => setViewMode('table')}
                  >
                    <List className="w-4 h-4" />
                    Table
                  </Button>
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'outline'}
                    size="sm"
                    className="h-12 px-4 gap-2 shadow-lg"
                    onClick={() => setViewMode('cards')}
                  >
                    <Grid className="w-4 h-4" />
                    Cards
                  </Button>
                </div>
              </div>
              {searchQuery && (
                <p className="text-sm text-muted-foreground mt-3">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              )}
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
                    {searchQuery ? 'No products found' : 'No products yet'}
                  </h3>
                  <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto leading-relaxed">
                    {searchQuery 
                      ? 'Try different keywords or clear the search.' 
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEdit={(p) => updateProduct(p.id, p)}
                      onDelete={deleteProduct}
                    />
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