import { useState } from "react";
import { Search, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { type Product } from "@shared/schema";

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const categories = [
    { value: "all", label: "All Products" },
    { value: "men", label: "Men's" },
    { value: "women", label: "Women's" },
    { value: "unisex", label: "Unisex" },
    { value: "limited", label: "Limited Edition" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "name", label: "Name: A to Z" },
  ];

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return Number(a.price) - Number(b.price);
        case "price-high":
          return Number(b.price) - Number(a.price);
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  return (
    <>
      <Navbar />
      
      <div className="pt-16 min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-playfair font-bold text-gold mb-4">Our Collection</h1>
            <p className="text-xl text-gray-300">
              Discover our premium selection of fragrances crafted for the discerning individual
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 bg-secondary border-border">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 bg-secondary border-border">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-gold text-black" : "border-border"}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "bg-gold text-black" : "border-border"}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(category => (
              <Badge
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedCategory === category.value 
                    ? "bg-gold text-black" 
                    : "border-gold text-gold hover:bg-gold hover:text-black"
                }`}
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Badge>
            ))}
          </div>

          {/* Results */}
          <div className="mb-6">
            <p className="text-gray-300">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-secondary rounded-xl p-4 sm:p-6 animate-pulse">
                  <div className="bg-gray-700 h-48 sm:h-64 rounded mb-4"></div>
                  <div className="bg-gray-700 h-4 rounded mb-2"></div>
                  <div className="bg-gray-700 h-3 rounded mb-4"></div>
                  <div className="bg-gray-700 h-8 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl sm:text-6xl text-gray-400 mb-4">🔍</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-300 mb-2">No products found</h3>
              <p className="text-sm sm:text-base text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className={`grid gap-4 sm:gap-6 lg:gap-8 ${
              viewMode === "grid" 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"
            }`}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
