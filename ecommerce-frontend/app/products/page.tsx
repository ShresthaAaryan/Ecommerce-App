'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Search } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Product, Review } from '@/lib/types';
import Base64Image from '@/components/Base64Image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<{ [key: string]: Review[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter()
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

  // Handler for adding a product to the cart.
  // Stops propagation so that clicking the button does not trigger the parent Link.
  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement>,
    productId: string
  ) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      // Use your actual user ID here
      await axios.post('http://localhost:3005/api/cart', {
        userId: 'demoUser123',
        productId,
        quantity: 1,
      });
      alert('Item added to cart!');
      router.push('/cart');
    } catch (error: any) {
      console.error('Error adding item to cart:', error.response?.data || error.message);
      alert('Failed to add item to cart: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-16 pb-8 md:pt-24 md:pb-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
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
              // Wrap product details in a Link for product details page.
              <Link href={`/products/${product._id}`} key={product._id}>
                <motion.div
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
                      <h3 className="text-lg font-semibold mb-1 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        Gender: {product.gender}
                      </p>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {product.description}
                      </p>
                      <p className="text-xl font-bold text-primary">
                        ${product.price.toFixed(2)}
                      </p>
                      <div className="flex items-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < getAverageRating(product._id)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-gray-600">
                          {getAverageRating(product._id)}/5
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button
                        className="w-full"
                        onClick={(e) => handleAddToCart(e, product._id)}
                      >
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
}
