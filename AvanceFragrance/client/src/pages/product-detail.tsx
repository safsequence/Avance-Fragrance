import { useState } from "react";
import { useParams } from "wouter";
import { Heart, ShoppingCart, Star, Shield, Gem, Minus, Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { formatPrice } from "@/lib/currency";
import { useCart } from "@/hooks/use-cart";
import { type Product } from "@shared/schema";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
    enabled: !!id,
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const relatedProducts = products
    .filter(p => p.id !== product?.id && p.category === product?.category)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="pt-16 min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-secondary rounded-xl h-96"></div>
                <div className="space-y-4">
                  <div className="bg-secondary h-8 rounded"></div>
                  <div className="bg-secondary h-4 rounded"></div>
                  <div className="bg-secondary h-12 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="pt-16 min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-16">
              <h1 className="text-2xl font-bold text-gold mb-4">Product Not Found</h1>
              <p className="text-gray-400 mb-8">The product you're looking for doesn't exist.</p>
              <Link href="/products">
                <Button className="bg-gold text-black hover:bg-gold/90">
                  Back to Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="pt-16 min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-8">
            <Link href="/products">
              <Button variant="ghost" className="text-gold hover:text-gold/80">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
            </Link>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-auto rounded-2xl luxury-shadow"
              />
              <div className="absolute top-4 left-4">
                {product.stock < 5 && product.stock > 0 && (
                  <Badge variant="destructive">Low Stock</Badge>
                )}
                {product.stock === 0 && (
                  <Badge variant="secondary">Out of Stock</Badge>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-4xl font-playfair font-bold text-foreground">
                    {product.name}
                  </h1>
                  <Button variant="ghost" size="icon" className="text-gold hover:text-gold/80">
                    <Heart className="h-6 w-6" />
                  </Button>
                </div>
                <div className="flex items-center space-x-4 mb-4">
                  <Badge variant="outline" className="border-gold text-gold">
                    {product.category}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                    ))}
                    <span className="text-sm text-gray-400 ml-2">(4.8) 127 reviews</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gold mb-4">
                  {formatPrice(product.price)}
                </p>
                <p className="text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 py-6">
                <div className="text-center">
                  <Star className="h-8 w-8 text-gold mx-auto mb-2" />
                  <p className="text-sm text-gray-400">High Longevity</p>
                </div>
                <div className="text-center">
                  <Shield className="h-8 w-8 text-gold mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Perfect Protection</p>
                </div>
                <div className="text-center">
                  <Gem className="h-8 w-8 text-gold mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Premium Quality</p>
                </div>
              </div>

              <Separator />

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-foreground font-medium">Quantity:</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="border-border"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                      className="border-border"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 bg-gold text-black hover:bg-gold/90"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gold text-gold hover:bg-gold hover:text-black"
                  >
                    Buy Now
                  </Button>
                </div>

                <div className="text-sm text-gray-400">
                  <p>Stock: {product.stock} units available</p>
                  <p>Free shipping on orders over ৳5,000</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <Tabs defaultValue="description" className="mb-16">
            <TabsList className="grid w-full grid-cols-3 bg-secondary">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <div className="card-luxury p-8">
                <h3 className="text-2xl font-playfair font-bold text-gold mb-4">
                  Product Description
                </h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  {product.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Fragrance Family</h4>
                    <p className="text-gray-400">Oriental Woody</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Longevity</h4>
                    <p className="text-gray-400">8-12 hours</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Projection</h4>
                    <p className="text-gray-400">Moderate to Strong</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Best For</h4>
                    <p className="text-gray-400">Evening, Special Occasions</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="ingredients" className="mt-6">
              <div className="card-luxury p-8">
                <h3 className="text-2xl font-playfair font-bold text-gold mb-4">
                  Fragrance Notes
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Top Notes</h4>
                    <p className="text-gray-400">Bergamot, Lemon, Pink Pepper</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Middle Notes</h4>
                    <p className="text-gray-400">Rose, Jasmine, Cedarwood</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Base Notes</h4>
                    <p className="text-gray-400">Amber, Musk, Vanilla, Sandalwood</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="card-luxury p-8">
                <h3 className="text-2xl font-playfair font-bold text-gold mb-4">
                  Customer Reviews
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="text-4xl font-bold text-gold">4.8</div>
                    <div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-gold text-gold" />
                        ))}
                      </div>
                      <p className="text-gray-400">Based on 127 reviews</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="border-b border-border pb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                          ))}
                        </div>
                        <span className="font-medium text-foreground">Excellent fragrance!</span>
                      </div>
                      <p className="text-gray-400">
                        "This perfume has incredible longevity and projection. The scent is sophisticated and perfect for evening wear."
                      </p>
                      <p className="text-sm text-gray-500 mt-2">- Rahman A.</p>
                    </div>
                    
                    <div className="border-b border-border pb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center space-x-1">
                          {[...Array(4)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                          ))}
                          <Star className="h-4 w-4 text-gold" />
                        </div>
                        <span className="font-medium text-foreground">Good quality</span>
                      </div>
                      <p className="text-gray-400">
                        "Nice fragrance with good performance. Would recommend to others."
                      </p>
                      <p className="text-sm text-gray-500 mt-2">- Sarah K.</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-3xl font-playfair font-bold text-gold mb-8">
                Related Products
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
