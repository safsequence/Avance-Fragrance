import { useState } from "react";
import { Search, Eye, ArrowLeft, Package, Clock, CheckCircle, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { formatPrice } from "@/lib/currency";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type OrderWithItems } from "@shared/schema";

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: orders = [], isLoading } = useQuery<OrderWithItems[]>({
    queryKey: ["/api/orders"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      await apiRequest("PUT", `/api/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Status updated",
        description: "Order status has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toString().includes(searchTerm) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return Clock;
      case "processing":
        return Package;
      case "shipped":
        return Truck;
      case "delivered":
        return CheckCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-600 text-white";
      case "processing":
        return "bg-blue-600 text-white";
      case "shipped":
        return "bg-purple-600 text-white";
      case "delivered":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
  ];

  const orderStatuses = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="ghost" className="text-gold hover:text-gold/80">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Admin
                </Button>
              </Link>
              <div className="h-6 w-px bg-border"></div>
              <h1 className="text-2xl font-playfair font-bold text-gold">Order Management</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by order ID, customer name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-luxury"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 input-luxury">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-secondary rounded-xl p-6 animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="bg-gray-700 h-4 w-32 rounded"></div>
                    <div className="bg-gray-700 h-3 w-48 rounded"></div>
                  </div>
                  <div className="bg-gray-700 h-6 w-20 rounded"></div>
                </div>
                <div className="bg-gray-700 h-3 w-full rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-24 w-24 mx-auto text-gray-400 mb-8" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {searchTerm || statusFilter !== "all" ? "No orders found" : "No orders yet"}
            </h3>
            <p className="text-gray-400">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "Orders will appear here once customers start purchasing"
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <Card key={order.id} className="card-luxury">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            Order #{order.id}
                          </h3>
                          <Badge className={getStatusColor(order.status)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {order.status}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-400">
                          <p>Customer: {order.customerName}</p>
                          <p>Email: {order.customerEmail}</p>
                          <p>Phone: {order.customerPhone}</p>
                          <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gold mb-2">
                          {formatPrice(order.totalAmount)}
                        </p>
                        <div className="flex space-x-2">
                          <Select
                            value={order.status}
                            onValueChange={(status) => 
                              updateStatusMutation.mutate({ id: order.id, status })
                            }
                          >
                            <SelectTrigger className="w-32 input-luxury">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {orderStatuses.map(status => (
                                <SelectItem key={status.value} value={status.value}>
                                  {status.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-gold text-gold hover:bg-gold hover:text-black"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl bg-background border-border">
                              <DialogHeader>
                                <DialogTitle className="text-gold">
                                  Order Details - #{order.id}
                                </DialogTitle>
                              </DialogHeader>
                              {selectedOrder && (
                                <div className="space-y-6">
                                  {/* Customer Info */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <h4 className="font-semibold text-foreground mb-2">Customer Information</h4>
                                      <div className="space-y-1 text-sm text-gray-400">
                                        <p>Name: {selectedOrder.customerName}</p>
                                        <p>Email: {selectedOrder.customerEmail}</p>
                                        <p>Phone: {selectedOrder.customerPhone}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-foreground mb-2">Order Information</h4>
                                      <div className="space-y-1 text-sm text-gray-400">
                                        <p>Order Date: {new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                                        <p>Status: {selectedOrder.status}</p>
                                        <p>Total: {formatPrice(selectedOrder.totalAmount)}</p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Shipping Address */}
                                  <div>
                                    <h4 className="font-semibold text-foreground mb-2">Shipping Address</h4>
                                    <p className="text-sm text-gray-400">{selectedOrder.shippingAddress}</p>
                                  </div>

                                  {/* Order Items */}
                                  <div>
                                    <h4 className="font-semibold text-foreground mb-4">Order Items</h4>
                                    <div className="space-y-3">
                                      {selectedOrder.items?.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-4 p-4 bg-secondary rounded-lg">
                                          <img
                                            src={item.product.imageUrl}
                                            alt={item.product.name}
                                            className="w-16 h-16 object-cover rounded"
                                          />
                                          <div className="flex-1">
                                            <p className="font-medium text-foreground">{item.product.name}</p>
                                            <p className="text-sm text-gray-400">
                                              Quantity: {item.quantity} × {formatPrice(item.price)}
                                            </p>
                                          </div>
                                          <div className="text-right">
                                            <p className="font-bold text-gold">
                                              {formatPrice(Number(item.price) * item.quantity)}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                    
                    {/* Order Items Preview */}
                    <div className="border-t border-border pt-4">
                      <h4 className="font-medium text-foreground mb-3">Items ({order.items?.length || 0})</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {order.items?.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center space-x-3 p-3 bg-secondary rounded-lg">
                            <img
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-foreground text-sm">{item.product.name}</p>
                              <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                        {(order.items?.length || 0) > 3 && (
                          <div className="flex items-center justify-center p-3 bg-secondary rounded-lg">
                            <p className="text-sm text-gray-400">
                              +{(order.items?.length || 0) - 3} more items
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
