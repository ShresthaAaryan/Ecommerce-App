"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { toast } = useToast();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} has been ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
    });
  };

  return (
    <Card className="group overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow duration-300">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.discount > 0 && (
            <Badge className="absolute top-3 left-3 bg-destructive hover:bg-destructive">
              -{product.discount}%
            </Badge>
          )}
          {product.isNew && (
            <Badge className="absolute top-3 right-3">New</Badge>
          )}
          <div className="absolute inset-0 bg-black/0 flex items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:bg-black/20 group-hover:opacity-100">
            <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4" />
              <span className="sr-only">Add to cart</span>
            </Button>
            <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full" onClick={handleToggleWishlist}>
              <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
              <span className="sr-only">Add to wishlist</span>
            </Button>
            <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full" asChild>
              <Link href={`/product/${product.id}`}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">Quick view</span>
              </Link>
            </Button>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="mb-1 text-sm text-muted-foreground">{product.category}</div>
          <h3 className="font-medium line-clamp-1">{product.name}</h3>
          <div className="mt-2 flex items-center">
            {product.discount > 0 ? (
              <>
                <span className="font-medium text-destructive">${product.price * (1 - product.discount / 100)}</span>
                <span className="ml-2 text-sm text-muted-foreground line-through">${product.price}</span>
              </>
            ) : (
              <span className="font-medium">${product.price}</span>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`h-4 w-4 ${i < product.rating ? "text-yellow-400" : "text-gray-300"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-1 text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ProductCard;