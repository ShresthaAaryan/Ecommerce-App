"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { cartItems } from "@/lib/data";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function CartPage() {
  const { toast } = useToast();
  const [items, setItems] = useState(cartItems);
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setItems(
      items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
    });
  };

  const applyCoupon = () => {
    if (!couponCode) return;
    
    setIsApplyingCoupon(true);
    setTimeout(() => {
      setIsApplyingCoupon(false);
      toast({
        title: "Coupon applied",
        description: `Coupon "${couponCode}" has been applied to your order.`,
      });
    }, 1000);
  };

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const discount = 0; // Would be calculated based on applied coupons
  const total = subtotal + shipping - discount;

  return (
    <><Navbar /><div className="container py-8 lg:ml-20 md:ml-6">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground">Shopping Cart</span>
      </div>

      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Looks like you haven't added anything to your cart yet. Browse our products and find something you'll love.
          </p>
          <Button size="lg" asChild>
            <Link href="/shop">
              Continue Shopping
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
          <div className="md:col-span-2 lg:col-span-3">
            <div className="rounded-lg border bg-card">
              <div className="p-6">
                <div className="hidden md:grid md:grid-cols-6 text-sm text-muted-foreground mb-4">
                  <div className="col-span-3">Product</div>
                  <div className="text-center">Price</div>
                  <div className="text-center">Quantity</div>
                  <div className="text-right">Total</div>
                </div>
                <Separator className="mb-6 hidden md:block" />
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                      <div className="col-span-3 flex items-center space-x-4">
                        <div className="h-20 w-20 rounded-md overflow-hidden bg-muted">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <span className="capitalize">{item.color}</span>
                            <span className="mx-2">•</span>
                            <span className="uppercase">{item.size}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-muted-foreground hover:text-destructive mt-1 md:hidden"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                      <div className="text-center md:block hidden">
                        ${item.price.toFixed(2)}
                      </div>
                      <div className="flex items-center justify-between md:justify-center">
                        <div className="flex md:hidden">
                          <span className="text-muted-foreground mr-2">Qty:</span>
                        </div>
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-r-none"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <div className="h-8 w-10 flex items-center justify-center border-y">
                            {item.quantity}
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-l-none"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end">
                        <div className="flex md:hidden">
                          <span className="text-muted-foreground mr-2">Total:</span>
                        </div>
                        <div className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive ml-4 hidden md:flex"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Separator className="col-span-6 md:hidden" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Coupon code"
                    className="pr-24 w-full sm:w-[240px]"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)} />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-0 top-0 h-full rounded-l-none"
                    onClick={applyCoupon}
                    disabled={!couponCode || isApplyingCoupon}
                  >
                    {isApplyingCoupon ? "Applying..." : "Apply"}
                  </Button>
                </div>
              </div>
              <Button variant="outline" className="mt-4 sm:mt-0" asChild>
                <Link href="/shop">
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>

          <div>
            <div className="rounded-lg border bg-card">
              <div className="p-6">
                <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Discount</span>
                      <span className="text-destructive">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator className="my-4" />
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <Button className="w-full mt-6" size="lg" asChild>
                  <Link href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <div className="mt-4 text-xs text-center text-muted-foreground">
                  Taxes calculated at checkout
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer/></>
  );
}