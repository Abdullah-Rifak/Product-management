'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleEditSubmit = (updatedData: Omit<Product, 'id' | 'createdAt'>) => {
    onEdit({
      ...product,
      ...updatedData,
    });
    setIsEditOpen(false);
  };

  const handleDelete = () => {
    onDelete(product.id);
    toast.success('Product deleted', {
      description: 'The product has been successfully removed.',
    });
    setIsDeleteOpen(false);
  };

  return (
    <Card className="group h-full max-w-full hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 animate-card-rise hover:-translate-y-2 hover:scale-[1.02]">
      <CardHeader className="pb-2 sm:pb-3">
        <div className="relative h-28 sm:h-36 rounded-xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted mb-2 sm:mb-3 animate-soft-float">
          {product.image && !imageError ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-primary/10 to-secondary/10">
              📦
            </div>
          )}
        </div>

        <CardTitle className="font-bold text-base sm:text-lg line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 sm:space-y-3 pb-3 sm:pb-4">
        <div className="flex items-baseline gap-2">
          <Badge className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg">
            ${product.price.toFixed(2)}
          </Badge>
          <CardDescription className="text-xs text-muted-foreground uppercase tracking-wide">
            per unit
          </CardDescription>
        </div>

        <CardDescription className="text-sm leading-relaxed line-clamp-3 sm:line-clamp-2 sm:h-12">
          {product.description}
        </CardDescription>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <Button
            variant="default"
            size="sm"
            className="h-9 w-full bg-amber-400 text-black hover:bg-amber-500 border border-amber-500 transition-all duration-200"
            onClick={() => setIsEditOpen(true)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="default"
            size="sm"
            className="h-9 w-full bg-red-600 text-white hover:bg-red-700 border border-red-700 transition-all duration-200"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="animate-dialog-pop border-blue-200 bg-blue-50/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{product.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              className="border-blue-400 bg-blue-50 text-blue-800 hover:bg-blue-100 hover:text-blue-900"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="bg-red-600 text-white hover:bg-red-700 border border-red-700"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ProductForm
        initialData={product}
        onSubmit={handleEditSubmit}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        showTrigger={false}
      />
    </Card>
  );
};