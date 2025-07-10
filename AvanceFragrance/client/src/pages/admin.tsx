import { Users, Package, ShoppingCart, TrendingUp, Settings, LogOut } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Admin() {
  const adminFeatures = [
    {
      icon: TrendingUp,
      title: "Dashboard",
      description: "View sales analytics and key metrics",
      href: "/admin/dashboard",
      color: "text-green-400",
    },
    {
      icon: Package,
      title: "Products",
      description: "Manage your product catalog",
      href: "/admin/products",
      color: "text-blue-400",
    },
    {
      icon: ShoppingCart,
      title: "Orders",
      description: "Track and manage customer orders",
      href: "/admin/orders",
      color: "text-purple-400",
    },
    {
      icon: Users,
      title: "Customers",
      description: "View customer information and history",
      href: "/admin/customers",
      color: "text-orange-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <div className="text-2xl font-playfair font-bold text-gold cursor-pointer">
                  Avancé
                </div>
              </Link>
              <div className="h-6 w-px bg-border"></div>
              <h1 className="text-xl font-semibold text-foreground">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" className="border-gold text-gold hover:bg-gold hover:text-black">
                  <LogOut className="h-4 w-4 mr-2" />
                  Back to Site
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-playfair font-bold text-gold mb-4">
            Welcome to Admin Panel
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Manage your Avancé Apparel store with our comprehensive admin tools
          </p>
        </div>

        {/* Admin Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {adminFeatures.map((feature, index) => (
            <Link key={index} href={feature.href}>
              <Card className="card-luxury group cursor-pointer hover:scale-105 transition-transform duration-300">
                <CardContent className="p-8 text-center">
                  <div className={`mx-auto mb-4 ${feature.color}`}>
                    <feature.icon className="h-12 w-12" />
                  </div>
                  <h3 className="text-xl font-playfair font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-secondary rounded-2xl p-8">
          <h3 className="text-2xl font-playfair font-bold text-gold mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/products">
              <Button className="w-full bg-gold text-black hover:bg-gold/90 py-6">
                <Package className="h-5 w-5 mr-2" />
                Add New Product
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant="outline" className="w-full border-gold text-gold hover:bg-gold hover:text-black py-6">
                <ShoppingCart className="h-5 w-5 mr-2" />
                View Recent Orders
              </Button>
            </Link>
            <Link href="/admin/dashboard">
              <Button variant="outline" className="w-full border-gold text-gold hover:bg-gold hover:text-black py-6">
                <TrendingUp className="h-5 w-5 mr-2" />
                View Analytics
              </Button>
            </Link>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-luxury">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">System Status</p>
                  <p className="text-2xl font-bold text-green-400">Online</p>
                </div>
                <div className="h-3 w-3 bg-green-400 rounded-full"></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-luxury">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Last Backup</p>
                  <p className="text-2xl font-bold text-foreground">2h ago</p>
                </div>
                <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-luxury">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Server Load</p>
                  <p className="text-2xl font-bold text-yellow-400">23%</p>
                </div>
                <div className="h-3 w-3 bg-yellow-400 rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
