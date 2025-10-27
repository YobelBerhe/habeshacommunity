import { useNavigate } from "react-router-dom";
import { Church, MapPin, Heart, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ChurchHome() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Church,
      title: "25+ Churches",
      description: "Orthodox, Catholic & Protestant",
      color: "text-primary",
    },
    {
      icon: MapPin,
      title: "Find Near You",
      description: "Worldwide church directory",
      color: "text-secondary",
    },
    {
      icon: Heart,
      title: "Save Favorites",
      description: "Build your church list",
      color: "text-accent",
    },
    {
      icon: Calendar,
      title: "Service Times",
      description: "View schedules & livestreams",
      color: "text-primary",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-background py-20 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Church className="h-5 w-5" />
            <span className="font-semibold">Phase 2: Church Finder</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold">
            Find Your{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Spiritual Home
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover Eritrean & Ethiopian churches worldwide. Connect with your community, find service times, and attend livestreams.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/churches/search")}>
              Browse Churches
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/churches/near-me")}>
              <MapPin className="h-5 w-5 mr-2" />
              Find Near Me
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything You Need
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Denominations Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            All Denominations Welcome
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="text-4xl">☦️</div>
                <h3 className="font-semibold text-xl">Orthodox</h3>
                <p className="text-muted-foreground">
                  Eritrean & Ethiopian Orthodox Tewahedo Churches
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="text-4xl">✝️</div>
                <h3 className="font-semibold text-xl">Catholic</h3>
                <p className="text-muted-foreground">
                  Ge'ez Rite Catholic Churches
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="text-4xl">⛪</div>
                <h3 className="font-semibold text-xl">Protestant</h3>
                <p className="text-muted-foreground">
                  Lutheran, Evangelical, Mekane Yesus & More
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Start Exploring Churches Today
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands finding their spiritual community
          </p>
          <Button size="lg" onClick={() => navigate("/churches/search")}>
            Browse All Churches
          </Button>
        </div>
      </section>
    </div>
  );
}
