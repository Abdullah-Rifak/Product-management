'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this product?')) {
      onDelete(product.id);
      toast.success('Product deleted', {
        description: 'The product has been successfully removed.',
      });
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50">
      <CardHeader className="pb-4">
        {/* Image */}
        <div className="relative h-48 rounded-xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted mb-4">
          {product.image && !imageError ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-primary/10 to-secondary/10">
              📦
            </div>
          )}
        </div>

        <CardTitle className="font-bold text-xl line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pb-6">
        {/* Price */}
        <div className="flex items-baseline gap-2">
          <Badge className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg">
            ${product.price.toFixed(2)}
          </Badge>
          <CardDescription className="text-xs text-muted-foreground uppercase tracking-wide">
            per unit
          </CardDescription>
        </div>

        {/* Description */}
        <CardDescription className="text-sm leading-relaxed line-clamp-3 h-16">
          {product.description}
        </CardDescription>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-10 border-2 hover:border-primary hover:bg-primary/5 transition-all duration-200"
            onClick={() => onEdit(product)}
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="h-10 flex-1 hover:bg-destructive/90 transition-all duration-200"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};