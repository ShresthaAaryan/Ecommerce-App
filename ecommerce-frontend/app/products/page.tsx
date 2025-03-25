'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Search, ShoppingBag, ChevronRight, Filter } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useRouter } from 'next/navigation';
import { Product, Review } from '@/lib/types';
import Base64Image from '@/components/Base64Image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { toast } from 'sonner';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<{ [key: string]: Review[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const router = useRouter();

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
        toast.error('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  // Extract unique categories from products
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean))) as string[];

  // Extract unique genders from products
  const genders = Array.from(new Set(products.map(p => p.gender).filter(Boolean))) as string[];

  // Filter products based on search term and selected filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesGender = !selectedGender || product.gender === selectedGender;

    return matchesSearch && matchesCategory && matchesGender;
  });

  // Calculate the average rating for a given product
  const getAverageRating = (productId: string) => {
    const productReviews = reviews[productId] || [];
    if (productReviews.length === 0) return 0;
    const total = productReviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((total / productReviews.length) * 10) / 10;
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedGender(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-primary/5 to-primary/10 pt-24 pb-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold mb-4 text-gray-900"
            >
              Discover Your Style
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 mb-8"
            >
              Explore our curated collection of premium products designed for your lifestyle
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 h-12 rounded-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="h-12 px-6 gap-2">
                    <Filter className="h-5 w-5" />
                    <span>Filters</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Products</SheetTitle>
                    <SheetDescription>
                      Narrow down your product selection
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-6 space-y-6">
                    {genders.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-3">Gender</h3>
                        <div className="flex flex-wrap gap-2">
                          {genders.map((gender) => (
                            <Badge
                              key={gender}
                              variant={selectedGender === gender ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => setSelectedGender(selectedGender === gender ? null : gender)}
                            >
                              {gender}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {categories.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-3">Categories</h3>
                        <div className="flex flex-wrap gap-2">
                          {categories.map((category) => (
                            <Badge
                              key={category}
                              variant={selectedCategory === category ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                            >
                              {category}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={resetFilters}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Active Filters */}
      {(selectedCategory || selectedGender || searchTerm) && (
        <div className="bg-white border-b py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500">Active filters:</span>

              {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-red-500">×</button>
                </Badge>
              )}

              {selectedCategory && (
                <Badge variant="secondary" className="gap-1">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory(null)} className="ml-1 hover:text-red-500">×</button>
                </Badge>
              )}

              {selectedGender && (
                <Badge variant="secondary" className="gap-1">
                  Gender: {selectedGender}
                  <button onClick={() => setSelectedGender(null)} className="ml-1 hover:text-red-500">×</button>
                </Badge>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="ml-auto text-xs"
              >
                Clear all
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-700 font-medium">Products</span>
          {selectedCategory && (
            <>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span className="text-gray-700 font-medium">{selectedCategory}</span>
            </>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results count */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
          </h2>

          {filteredProducts.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <select className="text-sm border rounded-md p-1">
                <option>Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
                <option>Newest</option>
              </select>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                <div className="h-6 bg-gray-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button onClick={resetFilters}>
              Reset all filters
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard
                  id={product._id}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.price * 1.2}
                  image={product.imageData || ''}
                  rating={getAverageRating(product._id)}
                  category={product.category || 'Fashion'}
                  tags={[product.gender]}
                  isNew={index % 5 === 0}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Newsletter signup */}
      <div className="bg-primary/5 py-16 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive updates on new products, special offers, and exclusive deals
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
            <Input
              type="email"
              placeholder="Your email address"
              className="flex-grow h-12"
            />
            <Button size="lg">
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
