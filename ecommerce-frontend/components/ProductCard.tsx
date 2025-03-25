'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Tag, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    rating: number;
    category: string;
    tags?: string[];
    inStock?: boolean;
    isNew?: boolean;
    isSale?: boolean;
}

export default function ProductCard({
    id,
    name,
    price,
    originalPrice,
    image,
    rating,
    category,
    tags = [],
    inStock = true,
    isNew = false,
    isSale = false,
}: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const router = useRouter();

    const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            await axios.post('http://localhost:3005/api/cart', {
                userId: localStorage.getItem('userId') || 'demoUser123',
                productId: id,
                quantity: 1,
            });
            toast.success(`${name} added to cart!`);
            setTimeout(() => {
                router.push('/cart');
            }, 1500);
        } catch (error: any) {
            console.error('Error adding item to cart:', error.response?.data || error.message);
            toast.error('Failed to add item to cart');
        }
    };

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorite(!isFavorite);
        toast.success(isFavorite ? `${name} removed from wishlist` : `${name} added to wishlist`);
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/products/${id}`);
    };

    return (
        <Link href={`/products/${id}`}>
            <Card
                className="overflow-hidden h-full transition-all duration-300 group bg-white"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image Section with Badges */}
                <div className="relative h-64 overflow-hidden bg-gray-100">
                    {image ? (
                        <div className="w-full h-full">
                            <img
                                src={`data:image/png;base64,${image}`}
                                alt={name}
                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                            <Tag className="h-16 w-16 text-gray-400" />
                        </div>
                    )}

                    {/* Status badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {isNew && (
                            <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
                        )}
                        {isSale && discount > 0 && (
                            <Badge className="bg-red-500 hover:bg-red-600">-{discount}%</Badge>
                        )}
                        {!inStock && (
                            <Badge variant="secondary">Out of Stock</Badge>
                        )}
                    </div>

                    {/* Quick action buttons */}
                    <div
                        className={`absolute right-3 transition-all duration-300 flex flex-col gap-2 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                            }`}
                    >
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-primary hover:bg-gray-50"
                            onClick={handleToggleFavorite}
                        >
                            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-primary hover:bg-gray-50"
                            onClick={handleQuickView}
                        >
                            <Eye className="h-5 w-5" />
                        </motion.button>
                    </div>
                </div>

                {/* Content Section */}
                <CardContent className="p-4">
                    <div className="flex items-center gap-1.5 mb-2">
                        <Badge variant="outline" className="text-xs font-normal rounded-sm">
                            {category}
                        </Badge>
                        {tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs font-normal rounded-sm">
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    <h3 className="font-medium text-base mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                        {name}
                    </h3>

                    <div className="flex items-center mb-1">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">({rating.toFixed(1)})</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">${price.toFixed(2)}</span>
                        {originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>
                        )}
                    </div>
                </CardContent>

                {/* Footer with Add to Cart */}
                <CardFooter className="p-4 pt-0">
                    <Button
                        className="w-full"
                        onClick={handleAddToCart}
                        disabled={!inStock}
                    >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                </CardFooter>
            </Card>
        </Link>
    );
} 