'use client';

import { useState, useEffect } from 'react';
import NextImage from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Product } from '@/types/product';
import { Plus, X, Image as ImageIcon, CheckCircle } from 'lucide-react';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

interface ProductFormProps {
  onSubmit: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  initialData?: Partial<Product> | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  showTrigger?: boolean;
}

export const ProductForm = ({
  onSubmit,
  initialData,
  open,
  onOpenChange,
  title = 'Add New Product',
  showTrigger = true,
}: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        price: initialData.price?.toString() || '',
        description: initialData.description || '',
        image: initialData.image || '',
      });
      setImagePreview(initialData.image || null);
      setSelectedImageName('');
    } else {
      setFormData({ name: '', price: '', description: '', image: '' });
      setImagePreview(null);
      setSelectedImageName('');
    }
    setErrors({});
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    else if (formData.name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
    
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      onSubmit({
        name: formData.name.trim(),
        price: Number(formData.price),
        description: formData.description.trim(),
        image: formData.image.trim() || undefined,
      });
      
      toast.success(
        initialData ? 'Product Updated!' : 'Product Created!', 
        {
          description: `"${formData.name}" has been ${initialData ? 'updated' : 'created'} successfully.`,
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        }
      );
      
      setFormData({ name: '', price: '', description: '', image: '' });
      setImagePreview(null);
      if (onOpenChange) onOpenChange(false);
    } catch {
      toast.error('Something went wrong!', {
        description: 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', {
        description: 'Please select an image file.',
      });
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error('Image too large', {
        description: 'Please upload an image smaller than 5MB.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setFormData((prev) => ({ ...prev, image: result }));
      setImagePreview(result || null);
      setSelectedImageName(file.name);
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors.image;
        return nextErrors;
      });
    };
    reader.onerror = () => {
      toast.error('Failed to read image', {
        description: 'Please try another file.',
      });
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', description: '', image: '' });
    setErrors({});
    setImagePreview(null);
    setSelectedImageName('');
    if (onOpenChange) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {showTrigger && (
        <DialogTrigger asChild>
          <Button className="mb-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="w-5 h-5 mr-2" />
            {title}
          </Button>
        </DialogTrigger>
      )}
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 sm:p-6 animate-dialog-pop">
        <DialogHeader className="px-6 pb-4 pt-6 sm:pb-6">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent">
            {initialData ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {initialData 
              ? 'Update the product details below.' 
              : 'Enter all product details. Image is required.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Product Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={errors.name ? 'border-destructive focus:border-destructive' : ''}
              placeholder="iPhone 15 Pro Max"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium">
              Price ($) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className={errors.price ? 'border-destructive focus:border-destructive' : ''}
              placeholder="999.99"
              disabled={isSubmitting}
            />
            {errors.price && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.price}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={errors.description ? 'border-destructive focus:border-destructive' : ''}
              placeholder="Enter a detailed product description..."
              rows={4}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.description}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-sm font-medium flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Product Image <span className="text-destructive">*</span>
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              required={!initialData?.image}
              className={errors.image ? 'border-destructive focus:border-destructive' : ''}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              Upload JPG, PNG, WebP, or GIF up to 5MB.
            </p>
            {errors.image && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <X className="w-4 h-4" />
                {errors.image}
              </p>
            )}
            {selectedImageName && (
              <p className="text-xs text-muted-foreground">Selected: {selectedImageName}</p>
            )}
            {imagePreview && (
              <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Preview:</p>
                <div className="relative w-full max-w-sm h-32 overflow-hidden rounded-lg shadow-md">
                  <NextImage
                    src={imagePreview}
                    alt="Preview"
                    fill
                    sizes="(max-width: 640px) 100vw, 384px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-3 pt-8 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="flex items-center gap-2 h-12 px-6"
              disabled={isSubmitting}
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  {initialData ? 'Update Product' : 'Create Product'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};