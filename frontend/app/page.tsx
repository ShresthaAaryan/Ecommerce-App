'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Search, Menu, X } from 'lucide-react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Product, Review } from '../lib/types';
import Base64Image from '../components/Base64Image';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<{ [key: string]: Review[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch products and reviews when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products from backend
        const { data: productsData } = await axios.get('http://localhost:3002/api/products');
        setProducts(productsData);

        // Create an array of review requests for each product
        const reviewRequests = productsData.map((product: Product) =>
          axios.get(`http://localhost:3007/api/reviews/product/${product._id}`)
        );
        
        const reviewResponses = await Promise.all(reviewRequests);

        // Map reviews to each product by its id
        const reviewsByProduct: { [key: string]: Review[] } = {};
        reviewResponses.forEach((res, index) => {
          reviewsByProduct[productsData[index]._id] = res.data.reviews;
        });
        setReviews(reviewsByProduct);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the average rating for a given product
  const getAverageRating = (productId: string) => {
    const productReviews = reviews[productId] || [];
    if (productReviews.length === 0) return 0;
    const total = productReviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((total / productReviews.length) * 10) / 10;
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-shrink-0 flex items-center"
              >
                <ShoppingCart className="h-8 w-8 text-primary" />
                <span className="ml-2 text-xl font-bold">EcoShop</span>
              </motion.div>
            </div>
            {/* Mobile Menu Button */}
            <div className="flex items-center sm:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
            {/* Desktop Menu */}
            <div className="hidden sm:flex sm:items-center sm:space-x-4">
              <Button variant="ghost">Home</Button>
              <Button variant="ghost">Categories</Button>
              <Button variant="ghost">Orders</Button>
              <Button variant="ghost">Profile</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-16 pb-8 md:pt-24 md:pb-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Discover Amazing Products
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Shop the latest trends with confidence
          </p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </motion.div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg" />
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                  <Base64Image
                    base64String={product.imageData}
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                  />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                    <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
                    <div className="flex items-center mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < getAverageRating(product._id)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-gray-600">{getAverageRating(product._id)}/5</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full">Add to Cart</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
