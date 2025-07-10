import { TrendingUp, Package, ShoppingCart, Users, DollarSign, Eye, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { formatPrice } from "@/lib/currency";

interface AdminStats {
  totalSales: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalProducts: number;
  totalCustomers: number;
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: recentOrders = [] } = useQuery({
    queryKey: ["/api/orders"],
  });

  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
  });

  const recentOrdersLimited = recentOrders.slice(0, 5);
  const lowStockProducts = products.filter((product: any) => product.stock < 10);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-600 text-white";
      case "shipped":
        return "bg-blue-600 text-white";
      case "processing":
        return "bg-yellow-600 text-white";
      case "pending":
        return "bg-gray-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-secondary rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-secondary rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <h1 className="text-2xl font-playfair font-bold text-gold">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black">
                  <Eye className="h-4 w-4 mr-2" />
                  View Site
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-luxury">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Sales</p>
                  <p className="text-2xl font-bold text-gold">
                    {stats ? formatPrice(stats.totalSales) : "৳0"}
                  </p>
                </div>
                <div className="bg-gold p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-black" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-luxury">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-gold">
                    {stats?.totalOrders || 0}
                  </p>
                </div>
                <div className="bg-gold p-3 rounded-full">
                  <ShoppingCart className="h-6 w-6 text-black" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-luxury">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Products</p>
                  <p className="text-2xl font-bold text-gold">
                    {stats?.totalProducts || 0}
                  </p>
                </div>
                <div className="bg-gold p-3 rounded-full">
                  <Package className="h-6 w-6 text-black" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-luxury">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Customers</p>
                  <p className="text-2xl font-bold text-gold">
                    {stats?.totalCustomers || 0}
                  </p>
                </div>
                <div className="bg-gold p-3 rounded-full">
                  <Users className="h-6 w-6 text-black" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="text-gold">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrdersLimited.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">No orders yet</p>
                ) : (
                  recentOrdersLimited.map((order: any) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                      <div>
                        <p className="font-semibold text-foreground">
                          Order #{order.id}
                        </p>
                        <p className="text-sm text-gray-400">
                          {order.customerName}
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gold font-bold">
                          {formatPrice(order.totalAmount)}
                        </p>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4">
                <Link href="/admin/orders">
                  <Button variant="outline" className="w-full border-gold text-gold hover:bg-gold hover:text-black">
                    View All Orders
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Products */}
          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="text-gold">Low Stock Alert</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockProducts.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">All products are well stocked</p>
                ) : (
                  lowStockProducts.slice(0, 5).map((product: any) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-semibold text-foreground">
                            {product.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {product.category}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="destructive">
                          {product.stock} left
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4">
                <Link href="/admin/products">
                  <Button variant="outline" className="w-full border-gold text-gold hover:bg-gold hover:text-black">
                    Manage Products
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-luxury">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Pending Orders</p>
              <p className="text-2xl font-bold text-foreground">
                {stats?.pendingOrders || 0}
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-luxury">
            <CardContent className="p-6 text-center">
              <ShoppingCart className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Completed Orders</p>
              <p className="text-2xl font-bold text-foreground">
                {stats?.completedOrders || 0}
              </p>
            </CardContent>
          </Card>
          
          <Card className="card-luxury">
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 text-orange-400 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Low Stock Items</p>
              <p className="text-2xl font-bold text-foreground">
                {lowStockProducts.length}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
