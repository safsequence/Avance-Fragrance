import { useState } from "react";
import { ArrowLeft, CreditCard, Shield, Truck, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/currency";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const checkoutSchema = z.object({
  // Customer Information
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  
  // Shipping Address
  address: z.string().min(10, "Please provide a complete address"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Division is required"),
  zipCode: z.string().min(4, "ZIP/Postal code is required"),
  
  // Additional Options
  shippingMethod: z.enum(["standard", "express", "overnight"]),
  paymentMethod: z.enum(["card", "mobile", "cod"]),
  specialInstructions: z.string().optional(),
  subscribe: z.boolean().default(false),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, total, clearCart } = useCart();
  const { toast } = useToast();

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      shippingMethod: "standard",
      paymentMethod: "card",
      specialInstructions: "",
      subscribe: false,
    },
  });

  const shippingOptions = [
    { value: "standard", label: "Standard Delivery", price: 100, time: "5-7 business days" },
    { value: "express", label: "Express Delivery", price: 200, time: "2-3 business days" },
    { value: "overnight", label: "Overnight Delivery", price: 500, time: "Next business day" },
  ];

  const selectedShipping = shippingOptions.find(
    option => option.value === form.watch("shippingMethod")
  ) || shippingOptions[0];

  const subtotal = total;
  const shippingCost = selectedShipping.price;
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const finalTotal = subtotal + shippingCost + tax;

  const orderMutation = useMutation({
    mutationFn: async (data: CheckoutForm) => {
      const orderData = {
        customerName: `${data.firstName} ${data.lastName}`,
        customerEmail: data.email,
        customerPhone: data.phone,
        shippingAddress: `${data.address}, ${data.city}, ${data.state} ${data.zipCode}`,
        totalAmount: finalTotal.toString(),
        status: "pending",
      };

      const orderItems = items.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      await apiRequest("POST", "/api/orders", { order: orderData, items: orderItems });
    },
    onSuccess: () => {
      setIsProcessing(false);
      clearCart();
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase. You will receive a confirmation email shortly.",
      });
      setLocation("/");
    },
    onError: (error) => {
      setIsProcessing(false);
      toast({
        title: "Order failed",
        description: "There was an issue processing your order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: CheckoutForm) => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    orderMutation.mutate(data);
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="pt-16 min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-16">
              <h1 className="text-2xl font-bold text-gold mb-4">Your cart is empty</h1>
              <p className="text-gray-400 mb-8">Add some products to your cart before checking out.</p>
              <Link href="/products">
                <Button className="bg-gold text-black hover:bg-gold/90">
                  Shop Now
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
            <Link href="/cart">
              <Button variant="ghost" className="text-gold hover:text-gold/80">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Cart
              </Button>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-playfair font-bold text-gold mb-4">Checkout</h1>
            <p className="text-gray-300">Complete your order</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Customer Information */}
                <Card className="card-luxury">
                  <CardHeader>
                    <CardTitle className="text-gold">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          {...form.register("firstName")}
                          className="input-luxury"
                        />
                        {form.formState.errors.firstName && (
                          <p className="text-red-400 text-sm mt-1">
                            {form.formState.errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          {...form.register("lastName")}
                          className="input-luxury"
                        />
                        {form.formState.errors.lastName && (
                          <p className="text-red-400 text-sm mt-1">
                            {form.formState.errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...form.register("email")}
                        className="input-luxury"
                      />
                      {form.formState.errors.email && (
                        <p className="text-red-400 text-sm mt-1">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        {...form.register("phone")}
                        className="input-luxury"
                        placeholder="+880 1234 567890"
                      />
                      {form.formState.errors.phone && (
                        <p className="text-red-400 text-sm mt-1">
                          {form.formState.errors.phone.message}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card className="card-luxury">
                  <CardHeader>
                    <CardTitle className="text-gold">Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="address">Street Address *</Label>
                      <Textarea
                        id="address"
                        {...form.register("address")}
                        className="input-luxury"
                        placeholder="House number, street name, area"
                      />
                      {form.formState.errors.address && (
                        <p className="text-red-400 text-sm mt-1">
                          {form.formState.errors.address.message}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          {...form.register("city")}
                          className="input-luxury"
                        />
                        {form.formState.errors.city && (
                          <p className="text-red-400 text-sm mt-1">
                            {form.formState.errors.city.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="state">State/Division *</Label>
                        <Input
                          id="state"
                          {...form.register("state")}
                          className="input-luxury"
                        />
                        {form.formState.errors.state && (
                          <p className="text-red-400 text-sm mt-1">
                            {form.formState.errors.state.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                        <Input
                          id="zipCode"
                          {...form.register("zipCode")}
                          className="input-luxury"
                        />
                        {form.formState.errors.zipCode && (
                          <p className="text-red-400 text-sm mt-1">
                            {form.formState.errors.zipCode.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Method */}
                <Card className="card-luxury">
                  <CardHeader>
                    <CardTitle className="text-gold">Shipping Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={form.watch("shippingMethod")}
                      onValueChange={(value) => form.setValue("shippingMethod", value as any)}
                    >
                      {shippingOptions.map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-3 border border-border rounded-lg p-4"
                        >
                          <RadioGroupItem value={option.value} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-foreground">{option.label}</p>
                                <p className="text-sm text-gray-400">{option.time}</p>
                              </div>
                              <span className="text-gold font-bold">{formatPrice(option.price)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card className="card-luxury">
                  <CardHeader>
                    <CardTitle className="text-gold">Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={form.watch("paymentMethod")}
                      onValueChange={(value) => form.setValue("paymentMethod", value as any)}
                    >
                      <div className="flex items-center space-x-3 border border-border rounded-lg p-4">
                        <RadioGroupItem value="card" />
                        <CreditCard className="h-5 w-5 text-gold" />
                        <span className="font-medium text-foreground">Credit/Debit Card</span>
                      </div>
                      <div className="flex items-center space-x-3 border border-border rounded-lg p-4">
                        <RadioGroupItem value="mobile" />
                        <div className="h-5 w-5 bg-gold rounded"></div>
                        <span className="font-medium text-foreground">Mobile Banking (bKash/Nagad)</span>
                      </div>
                      <div className="flex items-center space-x-3 border border-border rounded-lg p-4">
                        <RadioGroupItem value="cod" />
                        <Truck className="h-5 w-5 text-gold" />
                        <span className="font-medium text-foreground">Cash on Delivery</span>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Special Instructions */}
                <Card className="card-luxury">
                  <CardHeader>
                    <CardTitle className="text-gold">Special Instructions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      {...form.register("specialInstructions")}
                      placeholder="Any special delivery instructions..."
                      className="input-luxury"
                    />
                    <div className="flex items-center space-x-2 mt-4">
                      <Checkbox
                        checked={form.watch("subscribe")}
                        onCheckedChange={(checked) => form.setValue("subscribe", !!checked)}
                      />
                      <label className="text-sm text-gray-400">
                        Subscribe to our newsletter for exclusive offers and updates
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="card-luxury sticky top-24">
                  <CardHeader>
                    <CardTitle className="text-gold">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Items */}
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.product.id} className="flex items-center space-x-3">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-foreground text-sm">
                              {item.product.name}
                            </p>
                            <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                          </div>
                          <span className="text-gold font-bold text-sm">
                            {formatPrice(Number(item.product.price) * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Totals */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Subtotal</span>
                        <span className="text-foreground">{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Shipping</span>
                        <span className="text-foreground">{formatPrice(shippingCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tax</span>
                        <span className="text-foreground">{formatPrice(tax)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-gold">Total</span>
                        <span className="text-gold">{formatPrice(finalTotal)}</span>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isProcessing || orderMutation.isPending}
                      className="w-full bg-gold text-black hover:bg-gold/90"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Place Order
                        </>
                      )}
                    </Button>

                    <div className="text-xs text-gray-400 text-center">
                      <p>By placing your order, you agree to our Terms of Service and Privacy Policy.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
