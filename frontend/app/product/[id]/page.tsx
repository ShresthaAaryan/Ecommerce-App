"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Minus, Plus, Heart, Share2, ShoppingCart, Truck, RotateCcw, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import ProductCard from "@/components/product-card";
import { featuredProducts } from "@/lib/data";

export default function ProductPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("m");
  const [selectedColor, setSelectedColor] = useState("black");
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Find the product by ID
  const product = featuredProducts.find((p) => p.id === params.id) || featuredProducts[0];

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${product.name} (${selectedSize.toUpperCase()}, ${selectedColor}) has been added to your cart.`,
    });
  };

  const handleToggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} has been ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
    });
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const colors = [
    { id: "black", name: "Black", hex: "#000000" },
    { id: "white", name: "White", hex: "#ffffff" },
    { id: "blue", name: "Blue", hex: "#0000ff" },
    { id: "red", name: "Red", hex: "#ff0000" },
  ];

  const sizes = [
    { id: "xs", label: "XS" },
    { id: "s", label: "S" },
    { id: "m", label: "M" },
    { id: "l", label: "L" },
    { id: "xl", label: "XL" },
  ];

  // Related products (excluding current product)
  const relatedProducts = featuredProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="container py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/shop" className="hover:text-foreground">
          Shop
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href={`/categories/${product.category.toLowerCase()}`} className="hover:text-foreground">
          {product.category}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground">{product.name}</span>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border">
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <div
                key={index}
                className="cursor-pointer overflow-hidden rounded-md border hover:border-primary"
              >
                <img
                  src={image}
                  alt={`${product.name} - Image ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="mt-2 flex items-center">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`h-5 w-5 ${i < product.rating ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm text-muted-foreground">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>

          <div className="mt-4">
            {product.discount > 0 ? (
              <div className="flex items-center">
                <span className="text-2xl font-bold text-destructive">
                  ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                </span>
                <span className="ml-2 text-lg text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="ml-2 rounded-md bg-destructive/10 px-2 py-1 text-xs font-medium text-destructive">
                  {product.discount}% OFF
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
            )}
          </div>

          <Separator className="my-6" />

          <div className="space-y-6">
            {/* Color Selection */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium">Color: <span className="capitalize">{selectedColor}</span></span>
              </div>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => (
                  <div
                    key={color.id}
                    className={`h-10 w-10 cursor-pointer rounded-full ${
                      selectedColor === color.id
                        ? "ring-2 ring-primary ring-offset-2"
                        : "ring-1 ring-border"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedColor(color.id)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium">Size: <span className="uppercase">{selectedSize}</span></span>
                <Button variant="link" className="h-auto p-0 text-xs">
                  Size Guide
                </Button>
              </div>
              <RadioGroup
                value={selectedSize}
                onValueChange={setSelectedSize}
                className="flex flex-wrap gap-3"
              >
                {sizes.map((size) => (
                  <div key={size.id}>
                    <RadioGroupItem
                      value={size.id}
                      id={`size-${size.id}`}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor={`size-${size.id}`}
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border bg-background text-sm font-medium ring-offset-background transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary"
                    >
                      {size.label}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Quantity */}
            <div>
              <span className="text-sm font-medium">Quantity</span>
              <div className="mt-2 flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button variant="outline" size="icon" onClick={incrementQuantity}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={`flex-1 ${isWishlisted ? "bg-primary/10 text-primary" : ""}`}
                onClick={handleToggleWishlist}
              >
                <Heart className={`mr-2 h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Product Features */}
          <div className="space-y-4">
            <div className="flex items-start">
              <Truck className="mr-3 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">Free standard shipping on orders over $50</p>
              </div>
            </div>
            <div className="flex items-start">
              <RotateCcw className="mr-3 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-muted-foreground">30-day return policy</p>
              </div>
            </div>
            <div className="flex items-start">
              <Shield className="mr-3 h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Secure Checkout</p>
                <p className="text-xs text-muted-foreground">SSL encrypted checkout</p>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Share */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Share:</span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start border-b rounded-none">
            <TabsTrigger value="description" className="rounded-none">Description</TabsTrigger>
            <TabsTrigger value="details" className="rounded-none">Details</TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-none">Reviews ({product.reviewCount})</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="pt-4">
            <div className="prose max-w-none">
              <p>
                {product.description || `Experience premium quality and style with the ${product.name}. This versatile piece is designed to elevate your wardrobe with its exceptional craftsmanship and attention to detail.`}
              </p>
              <p>
                Crafted from high-quality materials, this product offers both comfort and durability for everyday wear. The sleek design ensures a flattering fit while the thoughtful details add a touch of sophistication.
              </p>
              <p>
                Whether you're dressing up for a special occasion or looking for the perfect addition to your casual collection, this piece effortlessly transitions from day to night, making it an essential addition to any wardrobe.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="details" className="pt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium mb-2">Product Details</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Premium quality materials</li>
                  <li>Designed for comfort and style</li>
                  <li>Versatile for various occasions</li>
                  <li>Easy care instructions</li>
                  <li>Sustainable production methods</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Specifications</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Material</span>
                    <span>100% Premium Cotton</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Weight</span>
                    <span>0.5 kg</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Dimensions</span>
                    <span>30 × 40 cm</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Care Instructions</span>
                    <span>Machine wash cold</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Country of Origin</span>
                    <span>Italy</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="pt-4">
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center">
                    <span className="text-5xl font-bold">{product.rating}</span>
                    <div className="ml-4">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`h-5 w-5 ${i < product.rating ? "text-yellow-400" : "text-gray-300"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">Based on {product.reviewCount} reviews</p>
                    </div>
                  </div>
                </div>
                <Button className="mt-4 md:mt-0">Write a Review</Button>
              </div>

              <Separator />

              {/* Sample Reviews */}
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                          <img
                            src={`https://i.pravatar.cc/150?img=${20 + index}`}
                            alt="Reviewer"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <h4 className="font-medium">
                            {["Sarah Johnson", "Michael Chen", "Emma Davis"][index]}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {["March 15, 2025", "February 28, 2025", "April 2, 2025"][index]}
                          </p>
                        </div>
                      </div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < [5, 4, 5][index] ? "text-yellow-400" : "text-gray-300"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <h5 className="font-medium">
                      {[
                        "Absolutely love this product!",
                        "Great quality, but sizing runs small",
                        "Perfect addition to my wardrobe",
                      ][index]}
                    </h5>
                    <p className="text-sm text-muted-foreground">
                      {[
                        "I've been using this for a month now and I'm extremely satisfied with the quality. The material is durable yet comfortable, and it looks even better in person than in the photos. Highly recommend!",
                        "The quality of this product is excellent and the design is beautiful. However, I found that it runs a bit small compared to my usual size. I would recommend sizing up for a more comfortable fit.",
                        "This is exactly what I was looking for! The color is true to the pictures and the quality exceeds my expectations. It's versatile enough for both casual and more formal occasions. Will definitely purchase more items from this brand.",
                      ][index]}
                    </p>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <Button variant="outline">Load More Reviews</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}