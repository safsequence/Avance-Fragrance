import { Star, Shield, Gem, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { formatPrice } from "@/lib/currency";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Product } from "@shared/schema";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Home() {
  const { toast } = useToast();
  
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const featuredProducts = products.slice(0, 4);

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      await apiRequest("POST", "/api/contact-messages", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactForm) => {
    contactMutation.mutate(data);
  };

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section id="home" className="pt-16 min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 hero-background"></div>
        <div className="absolute inset-0 bg-cover bg-center opacity-20" 
             style={{
               backgroundImage: "url('https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
             }}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6 leading-tight">
                <span className="text-gold">INTRODUCING</span><br />
                <span className="text-white">AVA 2025</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Avancé's newest addition is ready to step into your Collection. Uncover the art of scent with Avancé — your destination for fragrance trends, signature tips, and elevated luxury.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/products">
                  <Button className="bg-gold text-black px-8 py-3 hover:bg-gold/90 font-semibold">
                    Shop Collection
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-gold text-gold px-8 py-3 hover:bg-gold hover:text-black font-semibold"
                >
                  Learn More
                </Button>
              </div>
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-gold" />
                  <span className="text-sm text-gray-300">High longevity</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-gold" />
                  <span className="text-sm text-gray-300">Perfect Protection</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Gem className="h-5 w-5 text-gold" />
                  <span className="text-sm text-gray-300">Remarkable Fragrances</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative luxury-shadow">
                <img
                  src="https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800"
                  alt="Luxury perfume bottle with gold accents"
                  className="w-full h-auto rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="products" className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-gold mb-4">Our Collection</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover our premium selection of fragrances crafted for the discerning individual
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products">
              <Button
                variant="outline"
                className="border-gold text-gold px-8 py-3 hover:bg-gold hover:text-black"
              >
                View All Products
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-playfair font-bold text-gold mb-6">The Art of Fragrance</h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                Since our inception, Avancé Apparel has been dedicated to crafting exceptional fragrances that tell stories, evoke emotions, and create lasting memories. Each bottle in our collection represents months of careful formulation and attention to detail.
              </p>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Based in Bangladesh, we combine traditional perfumery techniques with modern innovation to create scents that are both timeless and contemporary. Our commitment to quality and luxury is evident in every product we create.
              </p>
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gold mb-2">50+</div>
                  <div className="text-gray-400">Unique Fragrances</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gold mb-2">10K+</div>
                  <div className="text-gray-400">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gold mb-2">5+</div>
                  <div className="text-gray-400">Years Excellence</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=800"
                alt="Artisan perfumer creating luxury fragrances"
                className="w-full h-auto rounded-2xl luxury-shadow"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-gold mb-4">Get in Touch</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Have questions about our fragrances? We'd love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-playfair font-bold text-gold mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-gold p-3 rounded-full">
                    <i className="fas fa-map-marker-alt text-black"></i>
                  </div>
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-gray-300">Dhanmondi, Dhaka, Bangladesh</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-gold p-3 rounded-full">
                    <i className="fas fa-phone text-black"></i>
                  </div>
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-gray-300">+880 1234 567890</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-gold p-3 rounded-full">
                    <i className="fas fa-envelope text-black"></i>
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-300">info@avanceapparel.com</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="card-luxury p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First Name
                  </label>
                  <Input
                    {...form.register("firstName")}
                    placeholder="John"
                    className="input-luxury"
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-red-400 text-sm mt-1">
                      {form.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  <Input
                    {...form.register("lastName")}
                    placeholder="Doe"
                    className="input-luxury"
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-red-400 text-sm mt-1">
                      {form.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <Input
                  {...form.register("email")}
                  type="email"
                  placeholder="john@example.com"
                  className="input-luxury"
                />
                {form.formState.errors.email && (
                  <p className="text-red-400 text-sm mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <Textarea
                  {...form.register("message")}
                  rows={4}
                  placeholder="Tell us about your fragrance preferences..."
                  className="input-luxury"
                />
                {form.formState.errors.message && (
                  <p className="text-red-400 text-sm mt-1">
                    {form.formState.errors.message.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                disabled={contactMutation.isPending}
                className="w-full bg-gold text-black py-3 hover:bg-gold/90 font-semibold"
              >
                {contactMutation.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
