import { Facebook, Instagram, Twitter, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-background py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-playfair font-bold text-gold mb-4">Avancé</div>
            <p className="text-luxury-muted mb-4">
              Crafting exceptional fragrances for the discerning individual.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gold">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gold">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gold">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-luxury-muted">
              <li>
                <Link href="/">
                  <span className="hover:text-gold transition-colors cursor-pointer">Home</span>
                </Link>
              </li>
              <li>
                <Link href="/products">
                  <span className="hover:text-gold transition-colors cursor-pointer">Products</span>
                </Link>
              </li>
              <li>
                <a href="#about" className="hover:text-gold transition-colors">About</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-gold transition-colors">Contact</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gold mb-4">Categories</h4>
            <ul className="space-y-2 text-luxury-muted">
              <li>
                <Link href="/products?category=men">
                  <span className="hover:text-gold transition-colors cursor-pointer">Men's Fragrances</span>
                </Link>
              </li>
              <li>
                <Link href="/products?category=women">
                  <span className="hover:text-gold transition-colors cursor-pointer">Women's Perfumes</span>
                </Link>
              </li>
              <li>
                <Link href="/products?category=unisex">
                  <span className="hover:text-gold transition-colors cursor-pointer">Unisex Scents</span>
                </Link>
              </li>
              <li>
                <Link href="/products?category=limited">
                  <span className="hover:text-gold transition-colors cursor-pointer">Limited Editions</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gold mb-4">Newsletter</h4>
            <p className="text-luxury-muted mb-4">
              Stay updated with our latest fragrances and offers.
            </p>
            <div className="flex">
              <Input
                placeholder="Your email"
                className="flex-1 rounded-r-none bg-secondary border-border"
              />
              <Button className="rounded-l-none bg-gold text-black hover:bg-gold/90">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-luxury-muted">
          <p>&copy; 2024 Avancé Apparel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
