'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Star, Plus, Minus, ShoppingCart, Heart, Share2, ArrowLeft, ChevronRight, Tag, Clock, Check, Ban } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Separator } from "@/components/ui/separator";
import Base64Image from '@/components/Base64Image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

interface Product {
  _id: string;
  name: string;
  description: string;
  gender: string;
  price: number;
  imageData?: string; // Base64-encoded image string (if available)
  rating?: number;    // Optional rating out of 5
  category?: string;
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
  userId?: string;
  username?: string;
  createdAt?: string;
}

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [showViewCartButton, setShowViewCartButton] = useState<boolean>(false);
  const router = useRouter();

  // Mock data for product images and specifications - would come from backend in real app
  const productImages = [0, 1, 2, 3].map(() => product?.imageData);
  const mockSpecs = [
    { name: "Material", value: "100% Cotton" },
    { name: "Color", value: "Multiple options" },
    { name: "Size", value: "S, M, L, XL" },
    { name: "Weight", value: "0.5 kg" },
    { name: "Country of Origin", value: "USA" }
  ];

  const mockRelatedProducts = [
    { id: "1", name: "Similar Product 1", price: 59.99, image: product?.imageData, rating: 4.3 },
    { id: "2", name: "Similar Product 2", price: 69.99, image: product?.imageData, rating: 4.7 },
    { id: "3", name: "Similar Product 3", price: 49.99, image: product?.imageData, rating: 4.1 },
    { id: "4", name: "Similar Product 4", price: 79.99, image: product?.imageData, rating: 4.8 }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the product details
        const productRes = await axios.get(`http://localhost:3002/api/products/${id}`);
        const fetchedProduct: Product = productRes.data.product || productRes.data;
        setProduct(fetchedProduct);

        // Fetch the reviews for this product
        const reviewRes = await axios.get(`http://localhost:3007/api/reviews/product/${id}`);
        setReviews(reviewRes.data.reviews);

      } catch (error) {
        console.error('Error fetching product data:', error);
        toast.error('Failed to load product data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10;
  };

  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');

    if (!userId) {
      toast.error('Please login to leave a review');
      router.push('/login');
      return;
    }

    const reviewPayload = {
      rating: newRating,
      comment: newComment,
      productId: id,
      userId: userId
    };

    try {
      await axios.post(`http://localhost:3007/api/reviews`, reviewPayload);
      // Refresh reviews list:
      const reviewRes = await axios.get(`http://localhost:3007/api/reviews/product/${id}`);
      setReviews(reviewRes.data.reviews);
      setNewRating(5);
      setNewComment('');
      toast.success('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => Math.min(prev + 1, 10));
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name || 'Check out this product',
        text: product?.description || 'Great product from our store',
        url: window.location.href,
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  // Handle Add to Cart functionality
  const handleAddToCart = async () => {
    try {
      await axios.post('http://localhost:3005/api/cart', {
        userId: localStorage.getItem('userId') || 'demoUser123',
        productId: id,
        quantity: quantity,
      });

      toast.success(`${quantity} ${product?.name} added to cart!`);
      setShowViewCartButton(true);
    } catch (error: any) {
      console.error('Error adding item to cart:', error.response?.data || error.message);
      toast.error('Failed to add item to cart');
    }
  };

  const handleBuyNow = async () => {
    try {
      await axios.post('http://localhost:3005/api/cart', {
        userId: localStorage.getItem('userId') || 'demoUser123',
        productId: id,
        quantity: quantity,
      });

      router.push('/cart');
    } catch (error: any) {
      console.error('Error adding item to cart:', error.response?.data || error.message);
      toast.error('Failed to process purchase');
    }
  };

  const navigateBack = () => {
    router.back();
  };

  const goToCategory = (category: string) => {
    router.push(`/categories/${category}`);
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto p-8 pt-24">
          <div className="animate-pulse">
            <div className="h-6 w-24 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-8 bg-gray-200 rounded w-28"></div>
                <div className="h-10 bg-gray-200 rounded w-full mt-6"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32">
          <div className="bg-white p-8 rounded-xl shadow-sm max-w-md text-center">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
            <Button onClick={navigateBack} size="lg">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const averageRating = getAverageRating();

  return (
    <>
      <Navbar />
      <div className="bg-gray-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <button onClick={() => router.push('/')} className="hover:text-primary">Home</button>
            <ChevronRight className="h-4 w-4 mx-2" />
            <button onClick={() => router.push('/products')} className="hover:text-primary">Products</button>
            {product.category && (
              <>
                <ChevronRight className="h-4 w-4 mx-2" />
                <button onClick={() => goToCategory(product.category as string)} className="hover:text-primary">
                  {product.category}
                </button>
              </>
            )}
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-700 font-medium">{product.name}</span>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-8">
              {/* Left Column - Image Gallery */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border"
                >
                  {productImages[activeImage] ? (
                    <img
                      src={`data:image/png;base64,${productImages[activeImage]}`}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full bg-gray-100">
                      <Tag className="h-16 w-16 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    <Button size="sm" variant="secondary" onClick={toggleFavorite}>
                      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button size="sm" variant="secondary" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>

                {/* Thumbnails */}
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {productImages.filter(Boolean).map((img, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setActiveImage(index)}
                      className={`w-20 h-20 rounded-md overflow-hidden border-2 flex-shrink-0 ${activeImage === index ? 'border-primary' : 'border-transparent'
                        }`}
                    >
                      <img
                        src={`data:image/png;base64,${img}`}
                        alt={`${product.name} - view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Right Column - Product Details */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col"
              >
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 px-2 py-0.5">
                    {product.gender}
                  </Badge>
                  <Badge variant="outline" className="px-2 py-0.5">
                    {product.category || 'Fashion'}
                  </Badge>
                  <Badge variant="secondary" className="px-2 py-0.5">
                    <Check className="h-3 w-3 mr-1" /> In Stock
                  </Badge>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>

                <div className="flex items-center mb-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`h-5 w-5 ${index < averageRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">{averageRating}/5</span>
                  <span className="ml-1 text-gray-500">({reviews.length} reviews)</span>
                </div>

                <div className="mb-4">
                  <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
                  <span className="ml-2 text-lg text-gray-400 line-through">${(product.price * 1.2).toFixed(2)}</span>
                  <span className="ml-2 text-sm bg-red-500 text-white px-2 py-0.5 rounded-sm">20% OFF</span>
                </div>

                <p className="text-gray-700 mb-6">{product.description}</p>

                <Separator className="my-6" />

                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="h-10 w-10 rounded-none rounded-l-md"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="h-10 w-12 flex items-center justify-center border-x">
                      {quantity}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={incrementQuantity}
                      disabled={quantity >= 10}
                      className="h-10 w-10 rounded-none rounded-r-md"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button className="flex-1" size="lg" onClick={handleAddToCart}>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>
                </div>

                {showViewCartButton && (
                  <div className="mb-6">
                    <Button
                      id="view-cart-button"
                      variant="outline"
                      size="lg"
                      className="w-full"
                      onClick={() => router.push('/cart')}
                    >
                      View Cart
                    </Button>
                  </div>
                )}

                <Button
                  variant="default"
                  size="lg"
                  className="mb-6 bg-black hover:bg-gray-800 text-white"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </Button>

                <div className="flex items-center text-sm text-gray-500 gap-4">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    <span>Free shipping</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Fast delivery</span>
                  </div>
                  <div className="flex items-center">
                    <Ban className="h-4 w-4 mr-1" />
                    <span>30-day returns</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden p-8">
            <Tabs defaultValue="details">
              <TabsList className="grid grid-cols-3 w-full max-w-md mb-8">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="py-4">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold mb-4">Product Details</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">{product.description}</p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Experience the perfect blend of style and comfort with our {product.name}.
                    Designed for the modern consumer, this product embodies quality craftsmanship
                    and attention to detail. Whether you're looking for everyday wear or something
                    special, this item is a versatile addition to your collection.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Our products are made with sustainable materials and ethical manufacturing
                    practices, ensuring you can feel good about your purchase.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="specifications" className="py-4">
                <h3 className="text-xl font-semibold mb-4">Technical Specifications</h3>
                <div className="bg-gray-50 rounded-lg overflow-hidden border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="divide-y divide-gray-200">
                      {mockSpecs.map((spec, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {spec.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="py-4">
                <div className="mb-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Customer Reviews</h3>
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      Write a Review
                    </Button>
                  </div>

                  {reviews.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <p className="text-gray-500 mb-4">No reviews yet. Be the first to review this product!</p>
                      <Button
                        onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
                      >
                        Write a Review
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((review, index) => (
                        <motion.div
                          key={review._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gray-50 p-6 rounded-lg border"
                        >
                          <div className="flex items-start">
                            <Avatar className="h-10 w-10 mr-4">
                              <AvatarFallback>{(review.username || 'User').substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold">{review.username || 'Anonymous User'}</span>
                                <div className="flex items-center">
                                  {Array.from({ length: 5 }).map((_, index) => (
                                    <Star
                                      key={index}
                                      className={`h-4 w-4 ${index < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                        }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-700 mb-2">{review.comment}</p>
                              <p className="text-gray-500 text-sm">
                                {review.createdAt
                                  ? new Date(review.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })
                                  : 'Recently added'
                                }
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Review Form */}
                <div id="review-form" className="bg-gray-50 p-6 rounded-lg border">
                  <h3 className="text-xl font-semibold mb-6">Write a Review</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium">
                        Rating
                      </label>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setNewRating(rating)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`h-8 w-8 ${rating <= newRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="review-comment" className="block text-sm font-medium">
                        Your Review
                      </label>
                      <textarea
                        id="review-comment"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        rows={4}
                        placeholder="Share your experience with this product..."
                      ></textarea>
                    </div>
                    <Button type="submit" className="w-full md:w-auto">
                      Submit Review
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockRelatedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm overflow-hidden border hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    {product.image ? (
                      <img
                        src={`data:image/png;base64,${product.image}`}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full">
                        <Tag className="h-12 w-12 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-1 line-clamp-1">{product.name}</h3>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="ml-1 text-xs text-gray-500">({product.rating.toFixed(1)})</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                      <span className="ml-2 text-sm text-gray-400 line-through">${(product.price * 1.2).toFixed(2)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
