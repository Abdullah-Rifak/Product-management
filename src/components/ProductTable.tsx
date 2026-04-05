'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProductForm } from './ProductForm';
import { Product } from '@/types/product';
import { toast } from 'sonner';
import { Edit, Trash2, Eye, Calendar, DollarSign } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  onEdit: (id: string, product: Partial<Product>) => void;
  onDelete: (id: string) => void;
}

export const ProductTable = ({ products, onEdit, onDelete }: ProductTableProps) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [brokenImageIds, setBrokenImageIds] = useState<string[]>([]);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleDeleteConfirm = () => {
    if (!deletingProduct) return;

    onDelete(deletingProduct.id);
    toast.success('Product Deleted', {
      description: `"${deletingProduct.name}" has been permanently removed.`,
      duration: 4000,
    });
    setDeletingProduct(null);
  };

  const handleEditSubmit = (updatedData: Partial<Product>) => {
    if (editingProduct) {
      onEdit(editingProduct.id, updatedData);
      setEditingProduct(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className="rounded-2xl border bg-card shadow-sm overflow-hidden overflow-x-auto">
        <Table className="min-w-[760px]">
          <TableHeader className="bg-gradient-to-r from-muted/50 to-muted/30">
            <TableRow>
              <TableHead className="w-20">Preview</TableHead>
              <TableHead className="w-56">Product Name</TableHead>
              <TableHead className="w-32">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Price
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right w-32">
                <div className="flex items-center gap-1 justify-end">
                  <Calendar className="w-4 h-4" />
                  Added
                </div>
              </TableHead>
              <TableHead className="text-right w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/50 transition-colors border-t">
                  <TableCell>
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                      {product.image && !brokenImageIds.includes(product.id) ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                          unoptimized
                          onError={() => {
                            setBrokenImageIds((prev) =>
                              prev.includes(product.id) ? prev : [...prev, product.id]
                            );
                          }}
                        />
                      ) : (
                        <span className="text-xl">📦</span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="font-semibold text-lg">{product.name}</TableCell>

                  <TableCell>
                    <Badge className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold shadow-md whitespace-nowrap">
                      ${product.price.toFixed(2)}
                    </Badge>
                  </TableCell>

                  <TableCell className="max-w-md">
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </TableCell>

                  <TableCell className="text-right">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(product.createdAt)}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 hover:bg-primary/10"
                        title="View Details"
                        onClick={() => setViewingProduct(product)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 hover:bg-primary/10"
                        title="Edit Product"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 w-9 p-0 hover:bg-destructive/10 text-destructive hover:text-destructive hover:bg-destructive/20"
                        title="Delete Product"
                        onClick={() => setDeletingProduct(product)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {editingProduct && (
        <ProductForm
          initialData={editingProduct}
          onSubmit={handleEditSubmit}
          open={!!editingProduct}
          onOpenChange={() => setEditingProduct(null)}
          showTrigger={false}
        />
      )}

      <Dialog open={!!viewingProduct} onOpenChange={() => setViewingProduct(null)}>
        <DialogContent className="max-w-2xl animate-dialog-pop">
          <DialogHeader>
            <DialogTitle>{viewingProduct?.name}</DialogTitle>
            <DialogDescription>{viewingProduct?.description}</DialogDescription>
          </DialogHeader>
          <div className="rounded-xl overflow-hidden bg-muted/40 border">
            {viewingProduct?.image && !brokenImageIds.includes(viewingProduct.id) ? (
              <Image
                src={viewingProduct.image}
                alt={viewingProduct.name}
                width={1000}
                height={700}
                className="w-full max-h-[70vh] object-contain bg-black/5"
                unoptimized
                onError={() => {
                  setBrokenImageIds((prev) =>
                    prev.includes(viewingProduct.id) ? prev : [...prev, viewingProduct.id]
                  );
                }}
              />
            ) : (
              <div className="h-72 flex items-center justify-center text-muted-foreground text-sm">
                No product image available
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingProduct} onOpenChange={() => setDeletingProduct(null)}>
        <DialogContent className="animate-dialog-pop border-blue-200 bg-blue-50/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deletingProduct?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              className="border-blue-400 bg-blue-50 text-blue-800 hover:bg-blue-100 hover:text-blue-900"
              onClick={() => setDeletingProduct(null)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="bg-red-600 text-white hover:bg-red-700 border border-red-700"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};