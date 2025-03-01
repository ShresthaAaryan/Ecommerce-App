import Link from "next/link";import { 
  ArrowRight, 
  ShoppingBag, 
  Truck, 
  Shield, 
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import ProductCard from "@/components/product-card";
import CategoryCard from "@/components/category-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { featuredProducts, categories, testimonials } from "@/lib/data";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
    <Navbar />
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[600px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10" />
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Fashion collection"
            className="absolute inset-0 w-full h-full object-cover" />
          <div className="container relative z-20 h-full flex flex-col justify-center ml-8">
            <div className="max-w-xl">
              <Badge className="mb-4">New Collection</Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Elevate Your Style This Season
              </h1>
              <p className="text-lg text-white/90 mb-8">
                Discover our latest collection of premium fashion pieces designed for the modern lifestyle.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" asChild>
                  <Link href="/shop">
                    Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20" asChild>
                  <Link href="/new-arrivals">
                    New Arrivals
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-muted/30">
          <div className="container lg:ml-20">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-bold mb-2">Shop by Category</h2>
                <p className="text-muted-foreground">Browse our wide range of categories</p>
              </div>
              <Button variant="ghost" className="mt-4 md:mt-0" asChild>
                <Link href="/categories">
                  View All Categories <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-16">
          <div className="container lg:ml-20">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
                <p className="text-muted-foreground">Handpicked by our style experts</p>
              </div>
              <Button variant="ghost" className="mt-4 md:mt-0" asChild>
                <Link href="/shop">
                  View All Products <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Promo Banner */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container lg:ml-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Summer Sale</h2>
                <p className="text-xl mb-6">Up to 50% off on selected items. Limited time offer.</p>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/sale">
                    Shop the Sale
                  </Link>
                </Button>
              </div>
              <div className="relative h-[300px] rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Summer sale"
                  className="absolute inset-0 w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* New Arrivals Carousel */}
        <section className="py-16">
          <div className="container lg:ml-16">
            <div className="flex flex-col md:flex-row justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-bold mb-2">New Arrivals</h2>
                <p className="text-muted-foreground">The latest additions to our collection</p>
              </div>
              <Button variant="ghost" className="mt-4 md:mt-0" asChild>
                <Link href="/new-arrivals">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <Carousel className="w-full">
              <CarouselContent>
                {featuredProducts.slice(8, 16).map((product) => (
                  <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <ProductCard product={product} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container lg:ml-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="bg-background border-none shadow-sm">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
                  <p className="text-sm text-muted-foreground">
                    Free shipping on all orders over $50
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background border-none shadow-sm">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <RotateCcw className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Easy Returns</h3>
                  <p className="text-sm text-muted-foreground">
                    30-day return policy for all items
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background border-none shadow-sm">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
                  <p className="text-sm text-muted-foreground">
                    Your payment information is always secure
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background border-none shadow-sm">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Quality Products</h3>
                  <p className="text-sm text-muted-foreground">
                    Curated selection of premium products
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="container lg:ml-16">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-background border-none shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground italic mb-4">"{testimonial.comment}"</p>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        {/* Newsletter */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container lg:ml-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
              <p className="mb-8">
                Subscribe to our newsletter and be the first to know about new collections, special offers and exclusive events.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60" />
                <Button variant="secondary">Subscribe</Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    <Footer />
  </>
  );
}