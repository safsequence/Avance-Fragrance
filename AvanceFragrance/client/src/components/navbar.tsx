import { Link, useLocation } from "wouter";
import { Search, ShoppingCart, User, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CartOverlay } from "./cart-overlay";

export function Navbar() {
  const [location] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { itemCount, toggleCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { href: "/", label: "Home", active: location === "/" },
    { href: "/products", label: "Products", active: location === "/products" },
    { href: "/#about", label: "About", active: false },
    { href: "/#contact", label: "Contact", active: false },
  ];

  return (
    <>
      <nav className="bg-background/95 backdrop-blur-sm fixed w-full top-0 z-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/">
              <div className="text-2xl font-playfair font-bold text-gold cursor-pointer">
                Avancé
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span className={`text-gray-300 hover:text-gold transition-colors cursor-pointer ${
                    item.active ? 'text-gold' : ''
                  }`}>
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="text-gray-300 hover:text-gold"
                >
                  <Search className="h-5 w-5" />
                </Button>
                {isSearchOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-lg shadow-lg p-4">
                    <Input
                      placeholder="Search products..."
                      className="w-full bg-secondary border-border"
                    />
                  </div>
                )}
              </div>

              {/* Cart */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleCart}
                  className="text-gray-300 hover:text-gold"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gold text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </div>

              {/* User */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-300 hover:text-gold"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background border-border">
                    <DropdownMenuItem className="text-gray-300">
                      Welcome, {user?.firstName}!
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={logout}
                      className="text-gray-300 hover:text-gold cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/login">
                    <Button variant="ghost" className="text-gray-300 hover:text-gold">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-gold text-black hover:bg-gold/90">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}

              {/* Admin Button */}
              <Link href="/admin">
                <Button className="bg-gold text-black hover:bg-gold/90">
                  Admin
                </Button>
              </Link>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-background border-border">
                  <div className="flex flex-col space-y-4 mt-8">
                    {navItems.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <span className={`text-gray-300 hover:text-gold transition-colors cursor-pointer text-lg ${
                          item.active ? 'text-gold' : ''
                        }`}>
                          {item.label}
                        </span>
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <CartOverlay />
    </>
  );
}
