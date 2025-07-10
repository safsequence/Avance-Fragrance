import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/currency";
import { Link } from "wouter";

export function CartOverlay() {
  const { items, total, isOpen, setCartOpen, updateQuantity, removeItem } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="w-full max-w-md bg-background shadow-2xl h-full overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-playfair font-bold text-gold">Shopping Cart</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCartOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-400">Your cart is empty</p>
              <Button
                onClick={() => setCartOpen(false)}
                className="mt-4 bg-gold text-black hover:bg-gold/90"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <Card key={item.product.id} className="bg-secondary">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">
                            {item.product.name}
                          </h4>
                          <p className="text-luxury-muted text-sm">
                            {formatPrice(item.product.price)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="h-8 w-8 text-gray-400 hover:text-white"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="h-8 w-8 text-gray-400 hover:text-white"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.product.id)}
                          className="h-8 w-8 text-red-400 hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-luxury-muted">Subtotal:</span>
                  <span className="text-gold font-bold">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-luxury-muted">Shipping:</span>
                  <span className="text-gold font-bold">৳100</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-gold">Total:</span>
                  <span className="text-gold">{formatPrice(total + 100)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link href="/checkout">
                  <Button className="w-full bg-gold text-black hover:bg-gold/90" onClick={() => setCartOpen(false)}>
                    Checkout
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full border-gold text-gold hover:bg-gold hover:text-black"
                  onClick={() => setCartOpen(false)}
                >
                  Continue Shopping
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
