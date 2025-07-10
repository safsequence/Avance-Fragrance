import { Heart, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { type Product } from "@shared/schema";
import { formatPrice } from "@/lib/currency";
import { useCart } from "@/hooks/use-cart";
import { Link } from "wouter";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="card-luxury group cursor-pointer">
        <div className="relative overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-64 object-cover product-card-hover"
          />
          <div className="absolute top-4 left-4">
            {product.stock < 5 && product.stock > 0 && (
              <Badge variant="destructive">Low Stock</Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="secondary">Out of Stock</Badge>
            )}
          </div>
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-gold hover:text-white hover:bg-gold/20"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Heart className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 gap-1">
            <h3 className="text-lg sm:text-xl font-playfair font-semibold text-foreground">
              {product.name}
            </h3>
            <span className="text-gold text-xs sm:text-sm font-medium">
              {product.category}
            </span>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <Rating 
              rating={Number(product.averageRating) || 0} 
              size="sm" 
              showNumber={false}
            />
            <span className="text-xs text-muted-foreground">
              ({product.totalReviews || 0} reviews)
            </span>
          </div>
          
          <p className="text-luxury-muted text-xs sm:text-sm mb-4 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-xl sm:text-2xl font-bold text-gold">
              {formatPrice(product.price)}
            </span>
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-gold text-black hover:bg-gold/90 w-full sm:w-auto text-sm"
              size="sm"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Add to Cart</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
