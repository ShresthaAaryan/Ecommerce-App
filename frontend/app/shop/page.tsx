"use client";

import { useState } from "react";
import { Filter, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import ProductCard from "@/components/product-card";
import { featuredProducts } from "@/lib/data";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function ShopPage() {
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortOption, setSortOption] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories = [
    { id: "men", label: "Men" },
    { id: "women", label: "Women" },
    { id: "accessories", label: "Accessories" },
    { id: "footwear", label: "Footwear" },
    { id: "jewelry", label: "Jewelry" },
    { id: "bags", label: "Bags" },
  ];

  const brands = [
    { id: "nike", label: "Nike" },
    { id: "adidas", label: "Adidas" },
    { id: "puma", label: "Puma" },
    { id: "zara", label: "Zara" },
    { id: "hm", label: "H&M" },
    { id: "gucci", label: "Gucci" },
  ];

  const sizes = [
    { id: "xs", label: "XS" },
    { id: "s", label: "S" },
    { id: "m", label: "M" },
    { id: "l", label: "L" },
    { id: "xl", label: "XL" },
    { id: "xxl", label: "XXL" },
  ];

  const colors = [
    { id: "black", label: "Black", hex: "#000000" },
    { id: "white", label: "White", hex: "#ffffff" },
    { id: "red", label: "Red", hex: "#ff0000" },
    { id: "blue", label: "Blue", hex: "#0000ff" },
    { id: "green", label: "Green", hex: "#00ff00" },
    { id: "yellow", label: "Yellow", hex: "#ffff00" },
  ];

  const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="py-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">{title}</h3>
        <ChevronDown className="h-4 w-4" />
      </div>
      {children}
    </div>
  );

  const FilterSidebar = () => (
    <div className="space-y-1">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="sm">
          Clear All
        </Button>
      </div>
      <Separator />
      <div className="p-4 space-y-6">
        <FilterSection title="Categories">
          <div className="space-y-2 mt-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox id={`category-${category.id}`} />
                <label
                  htmlFor={`category-${category.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category.label}
                </label>
              </div>
            ))}
          </div>
        </FilterSection>
        <Separator />
        <FilterSection title="Price Range">
          <div className="mt-6 px-2">
            <Slider
              defaultValue={[0, 500]}
              max={1000}
              step={10}
              value={priceRange}
              onValueChange={setPriceRange}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm">${priceRange[0]}</span>
              <span className="text-sm">${priceRange[1]}</span>
            </div>
          </div>
        </FilterSection>
        <Separator />
        <FilterSection title="Brands">
          <div className="space-y-2 mt-2">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center space-x-2">
                <Checkbox id={`brand-${brand.id}`} />
                <label
                  htmlFor={`brand-${brand.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {brand.label}
                </label>
              </div>
            ))}
          </div>
        </FilterSection>
        <Separator />
        <FilterSection title="Sizes">
          <div className="flex flex-wrap gap-2 mt-2">
            {sizes.map((size) => (
              <div
                key={size.id}
                className="flex h-8 w-8 items-center justify-center rounded-md border text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground"
              >
                {size.label}
              </div>
            ))}
          </div>
        </FilterSection>
        <Separator />
        <FilterSection title="Colors">
          <div className="flex flex-wrap gap-2 mt-2">
            {colors.map((color) => (
              <div
                key={color.id}
                className="h-8 w-8 rounded-full cursor-pointer border border-gray-200"
                style={{ backgroundColor: color.hex }}
                title={color.label}
              />
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );

  return (
    <>
    <Navbar />
      <div className="container py-8 lg:ml-16 md:ml-4">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold">Shop</h1>
            <p className="text-muted-foreground">Browse our collection of products</p>
          </div>
          <div className="flex items-center space-x-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <FilterSidebar />
              </SheetContent>
            </Sheet>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-8 md:w-[200px] lg:w-[300px]" />
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="hidden md:block">
            <FilterSidebar />
          </div>
          <div className="md:col-span-3 lg:col-span-4">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{featuredProducts.length}</span> products
              </p>
              <div className="flex items-center space-x-2">
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <Button variant="outline">Load More</Button>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
}