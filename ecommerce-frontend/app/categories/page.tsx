'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layers, ArrowRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Define the categories with images, titles, and descriptions
const categories = [
    {
        id: 'electronics',
        title: 'Electronics',
        description: 'Smartphones, laptops, gadgets, and more',
        image: '/images/electronics.jpg',
        color: 'bg-blue-500'
    },
    {
        id: 'clothing',
        title: 'Clothing',
        description: 'Fashion for men, women, and children',
        image: '/images/clothing.jpg',
        color: 'bg-pink-500'
    },
    {
        id: 'home',
        title: 'Home & Kitchen',
        description: 'Furniture, appliances, and decor',
        image: '/images/home.jpg',
        color: 'bg-amber-500'
    },
    {
        id: 'books',
        title: 'Books',
        description: 'Fiction, non-fiction, and educational',
        image: '/images/books.jpg',
        color: 'bg-emerald-500'
    },
    {
        id: 'beauty',
        title: 'Beauty & Personal Care',
        description: 'Skincare, makeup, and grooming',
        image: '/images/beauty.jpg',
        color: 'bg-purple-500'
    },
    {
        id: 'sports',
        title: 'Sports & Outdoors',
        description: 'Fitness, camping, and outdoor activities',
        image: '/images/sports.jpg',
        color: 'bg-red-500'
    },
    {
        id: 'toys',
        title: 'Toys & Games',
        description: 'For children and the young at heart',
        image: '/images/toys.jpg',
        color: 'bg-yellow-500'
    },
    {
        id: 'health',
        title: 'Health & Wellness',
        description: 'Supplements, fitness equipment, and health aids',
        image: '/images/health.jpg',
        color: 'bg-green-500'
    }
];

export default function CategoriesPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCategories, setFilteredCategories] = useState(categories);

    useEffect(() => {
        // Filter categories based on search term
        const results = categories.filter(category =>
            category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCategories(results);
    }, [searchTerm]);

    const handleCategoryClick = (categoryId: string) => {
        router.push(`/products?category=${categoryId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="container mx-auto px-4 py-8 mt-16">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-4">Product Categories</h1>
                    <p className="text-muted-foreground mb-6">
                        Browse our wide selection of products across different categories
                    </p>

                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredCategories.map((category) => (
                        <Card
                            key={category.id}
                            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => handleCategoryClick(category.id)}
                        >
                            <div className={`h-3 ${category.color}`} />
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full ${category.color} flex items-center justify-center mr-2`}>
                                        <Layers className="h-4 w-4 text-white" />
                                    </div>
                                    {category.title}
                                </CardTitle>
                                <CardDescription>{category.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="relative h-40 w-full rounded-md overflow-hidden bg-gray-100">
                                    {/* Replace with actual images when available */}
                                    <div className={`absolute inset-0 ${category.color} opacity-10`} />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Layers className={`h-16 w-16 ${category.color.replace('bg-', 'text-')} opacity-50`} />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between items-center">
                                <Button variant="ghost" size="sm">
                                    View Products
                                </Button>
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {filteredCategories.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No categories found matching "{searchTerm}"</p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => setSearchTerm('')}
                        >
                            Show all categories
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}
