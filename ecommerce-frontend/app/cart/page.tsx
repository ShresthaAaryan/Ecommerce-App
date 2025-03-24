'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Base64Image from '@/components/Base64Image';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface CartItem {
  productId: string;
  quantity: number;
}

interface Product {
  imageData: string;
  _id: string;
  name: string;
  imageUrl: string;
  price: number;
}

export default function CartPage() {
  const [userId] = useState('demoUser123');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:3005/api/cart?userId=${userId}`);
      const cartData = response.data.cart;
      const items: CartItem[] = Object.entries(cartData || {}).map(([productId, quantity]) => ({
        productId,
        quantity: Number(quantity),
      }));
      setCartItems(items);

      const productPromises = items.map(item =>
        axios.get(`http://localhost:3002/api/products/${item.productId}`)
      );
      const productResponses = await Promise.all(productPromises);
      const productsMap: Record<string, Product> = {};
      productResponses.forEach((res) => {
        const productData: Product = res.data.product || res.data;
        productsMap[productData._id] = productData;
      });
      setProducts(productsMap);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Failed to load cart items');
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartItem = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      setIsUpdating(true);
      await axios.put(`http://localhost:3005/api/cart/item/${productId}`, { userId, quantity: newQuantity });
      await fetchCart();
      toast.success('Cart updated successfully');
    } catch (error) {
      console.error('Error updating cart item:', error);
      toast.error('Failed to update cart item');
    } finally {
      setIsUpdating(false);
    }
  };

  const removeCartItem = async (productId: string) => {
    try {
      setIsUpdating(true);
      await axios.delete(`http://localhost:3005/api/cart/item/${productId}`, { data: { userId } });
      await fetchCart();
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing cart item:', error);
      toast.error('Failed to remove item from cart');
    } finally {
      setIsUpdating(false);
    }
  };

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => {
    const product = products[item.productId];
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar /><br/><br/>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/products">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Shopping Cart</h1>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-500">Loading your cart...</p>
          </div>
        ) : cartItems.length === 0 ? (
          <Card className="p-8 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {cartItems.map(item => {
                const product = products[item.productId];
                return (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-lg shadow-sm p-6"
                  >
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="w-full md:w-1/4">
                        {product ? (
                          <Base64Image
                            base64String={product.imageData}
                            alt={product.name}
                            className="object-cover w-full h-32 rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-32 rounded-lg bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400">No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 w-full">
                        <h2 className="text-xl font-semibold mb-2">{product ? product.name : item.productId}</h2>
                        {product && (
                          <p className="text-lg font-medium text-primary mb-4">${product.price.toFixed(2)}</p>
                        )}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border rounded-md">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateCartItem(item.productId, item.quantity - 1)}
                              disabled={isUpdating}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateCartItem(item.productId, item.quantity + 1)}
                              disabled={isUpdating}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => removeCartItem(item.productId)}
                            disabled={isUpdating}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <Card className="p-6 mt-8">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-lg font-medium">Total Items: {totalQuantity}</p>
                  <p className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</p>
                </div>
                <div className="flex gap-4">
                  <Link href="/products">
                    <Button variant="outline">Continue Shopping</Button>
                  </Link>
                  <Button size="lg" onClick={() => toast.info('Checkout functionality coming soon!')}>
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
