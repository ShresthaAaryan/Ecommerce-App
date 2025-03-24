'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Product {
  _id: string;
  name: string;
  description: string;
  gender: string;
  price: number;
  imageData?: string; // Base64-encoded image string (if available)
  rating?: number;    // Optional rating out of 5
}

interface Review {
  _id: string;
  rating: number;
  comment: string;
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
  const router = useRouter();

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
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };
  

  // Handle Add to Cart functionality
  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await axios.post('http://localhost:3005/api/cart', {
        userId: 'demoUser123', // Replace with real user ID in production
        productId: id,
        quantity: 1,
      });
      alert('Item added to cart!');
      router.push('/cart'); // Navigates to the cart page
    } catch (error: any) {
      console.error('Error adding item to cart:', error.response?.data || error.message);
      alert('Failed to add item to cart: ' + (error.response?.data?.message || error.message));
    }
  };

  if (isLoading) return <div className="text-center py-12">Loading...</div>;
  if (!product) return <div className="text-center py-12">Product not found.</div>;

  const averageRating = getAverageRating();

  return (
    <>
      <Navbar /><br/>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image Section */}
          <div>
            {product.imageData ? (
              <img
                src={`data:image/png;base64,${product.imageData}`}
                alt={product.name}
                className="w-full h-auto rounded-lg shadow-lg object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No Image Available</span>
              </div>
            )}
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-lg text-gray-600 mb-4">{product.description}</p>
            <p className="text-xl font-semibold text-primary mb-4">${product.price.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mb-2">Gender: {product.gender}</p>
            <div className="flex items-center mb-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`h-6 w-6 ${
                    index < averageRating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-gray-600">{averageRating}/5</span>
            </div>
            <div className="flex space-x-4 mt-6">
              <Button variant="default" size="lg">
                Buy Now
              </Button>
              <Button variant="outline" size="lg" onClick={handleAddToCart}>
                Add to Cart
              </Button>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="p-4 border rounded-lg">
                  <div className="flex items-center mb-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`h-5 w-5 ${
                          index < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-gray-600">{review.rating}/5</span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New Section: Review Comments */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Review Comments</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500">No comments available.</p>
          ) : (
            <ul className="list-disc list-inside">
              {reviews.map((review) => (
                <li key={review._id} className="text-gray-700 mb-2">
                  {review.comment}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Add Review Form */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">Write a Review</h3>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="block">Rating (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={newRating}
                onChange={(e) => setNewRating(Number(e.target.value))}
                required
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="block">Comment</label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
                className="mt-1 p-2 border rounded w-full"
                rows={4}
              ></textarea>
            </div>
            <Button type="submit" variant="default" size="lg">
              Submit Review
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
