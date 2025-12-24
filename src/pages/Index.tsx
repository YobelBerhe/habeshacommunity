import { useState, useEffect } from "react";
import {
  Heart,
  Users,
  ShoppingBag,
  MessageCircle,
  Search,
  MapPin,
  ArrowRight,
  Star,
  Calendar,
  Briefcase,
  Award,
  Globe,
  CheckCircle,
  BookOpen,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate, Link } from "react-router-dom";
import AnimatedCounter from "@/components/AnimatedCounter";
import { useAuth } from "@/store/auth";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check onboarding status for logged-in users
  useEffect(() => {
    const checkOnboarding = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single();
        
        if (data && !data.onboarding_completed) {
          navigate('/onboarding/welcome');
        } else {
          navigate('/home');
        }
      }
    };
    
    checkOnboarding();
  }, [user, navigate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Navigation links
  const navLinks = [
    { label: "Spiritual", href: "/spiritual" },
    { label: "Match", href: "/match" },
    { label: "Mentor", href: "/mentor" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Community", href: "/community" },
  ];

  // Platform features
  const features = [
    {
      id: "spiritual",
      title: "Grow Spiritually",
      description: "Read the Bible, join reading plans, and track your spiritual journey",
      icon: BookOpen,
      href: "/spiritual",
      stats: "9+ Bible versions",
    },
    {
      id: "match",
      title: "Find Your Match",
      description: "Connect with compatible Habesha singles for meaningful relationships",
      icon: Heart,
      href: "/match",
      stats: "5.2K+ active members",
    },
    {
      id: "mentor",
      title: "Get Mentored",
      description: "Learn from experienced Habesha professionals and experts",
      icon: Award,
      href: "/mentor",
      stats: "350+ mentors",
    },
    {
      id: "marketplace",
      title: "Buy & Sell",
      description: "Trade products, find housing, jobs, and services",
      icon: ShoppingBag,
      href: "/marketplace",
      stats: "5.2K+ listings",
    },
    {
      id: "community",
      title: "Join Community",
      description: "Connect through forums, events, and groups worldwide",
      icon: Users,
      href: "/community",
      stats: "850+ events",
    },
    {
      id: "church",
      title: "Find Churches",
      description: "Discover Ethiopian and Eritrean churches near you",
      icon: Globe,
      href: "/churches",
      stats: "500+ churches",
    },
  ];

  // Stats
  const stats = [
    { label: "Active Members", value: 25, suffix: "K+" },
    { label: "Success Stories", value: 35, suffix: "K+" },
    { label: "Events Hosted", value: 850, suffix: "+" },
    { label: "Active Listings", value: 52, suffix: "K+" },
  ];

  // Testimonials
  const testimonials = [
    {
      quote: "Met my wife through Habesha Connect. Now we're planning our wedding!",
      author: "Michael T.",
      location: "Washington DC",
      avatar: "MT",
    },
    {
      quote: "My mentor helped me land my dream job at Google. Forever grateful!",
      author: "Sara W.",
      location: "San Francisco",
      avatar: "SW",
    },
    {
      quote: "Found the perfect apartment and connected with my community here.",
      author: "Daniel K.",
      location: "Seattle",
      avatar: "DK",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-foreground">
                Habesha<span className="text-primary">Community</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" onClick={() => navigate("/auth/login")}>
                Sign in
              </Button>
              <Button onClick={() => navigate("/auth/register")}>
                Get started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block py-2 text-foreground font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t space-y-3">
                <Button variant="outline" className="w-full" onClick={() => navigate("/auth/login")}>
                  Sign in
                </Button>
                <Button className="w-full" onClick={() => navigate("/auth/register")}>
                  Get started
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Your Habesha Community Hub
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-4">
              Connect, Learn, Trade & Grow Together
            </p>
            <p className="text-base text-muted-foreground mb-8">
              ሕብረተሰብና ኣብ ሓደ ቦታ • ንራኸበሉ • ንምሃረሉ • ንሕገዘሉ
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  type="text"
                  placeholder="Search for matches, mentors, products, events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 pl-12 pr-28 text-base border-2"
                />
                <Button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2">
                  Search
                </Button>
              </div>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={() => navigate("/auth/register")}>
                Get started free
                <ArrowRight className="ml-2" size={18} />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/match")}>
                Find your match
                <Heart className="ml-2" size={18} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                  <AnimatedCounter end={stat.value} />
                  <span className="text-2xl">{stat.suffix}</span>
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful platforms designed to help the Habesha community thrive
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.id}
                  className="p-6 hover:shadow-lg transition-all cursor-pointer border hover:border-primary/50 group"
                  onClick={() => navigate(feature.href)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="text-primary" size={24} />
                    </div>
                    <ChevronRight className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {feature.description}
                  </p>
                  <p className="text-xs font-medium text-primary">
                    {feature.stats}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Real Stories from Our Community
            </h2>
            <p className="text-lg text-muted-foreground">
              See how Habesha Connect is making a difference
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-amber-400 fill-amber-400" size={16} />
                  ))}
                </div>
                <p className="text-foreground mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin size={12} />
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Join Your Community?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of Habesha worldwide. It's free to get started.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={() => navigate("/auth/register")}>
                Create free account
                <ArrowRight className="ml-2" size={18} />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/auth/login")}>
                Sign in
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <Link to="/" className="text-lg font-bold text-foreground">
                Habesha<span className="text-primary">Community</span>
              </Link>
              <p className="mt-3 text-sm text-muted-foreground">
                Connecting the global Habesha community.
              </p>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Features</h4>
              <ul className="space-y-2">
                <li><Link to="/spiritual" className="text-sm text-muted-foreground hover:text-foreground">Spiritual</Link></li>
                <li><Link to="/match" className="text-sm text-muted-foreground hover:text-foreground">Matchmaking</Link></li>
                <li><Link to="/mentor" className="text-sm text-muted-foreground hover:text-foreground">Mentorship</Link></li>
                <li><Link to="/marketplace" className="text-sm text-muted-foreground hover:text-foreground">Marketplace</Link></li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Community</h4>
              <ul className="space-y-2">
                <li><Link to="/community/events" className="text-sm text-muted-foreground hover:text-foreground">Events</Link></li>
                <li><Link to="/community/forums" className="text-sm text-muted-foreground hover:text-foreground">Forums</Link></li>
                <li><Link to="/churches" className="text-sm text-muted-foreground hover:text-foreground">Churches</Link></li>
                <li><Link to="/community/groups" className="text-sm text-muted-foreground hover:text-foreground">Groups</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
                <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact Us</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Habesha Community. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
