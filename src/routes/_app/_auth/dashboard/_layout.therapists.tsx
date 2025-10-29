import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button";
import { buttonVariants } from "@/ui/button-util";
import { cn } from "@/utils/misc";
import { Search, Filter, MapPin, Star } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/_auth/dashboard/_layout/therapists")({
  component: TherapistsPage,
});

function TherapistsPage() {
  // Mock data - replace with actual Convex query
  const therapists = [
    {
      id: "1",
      name: "Sarah Chen",
      specialty: "Anti-Aging Specialist",
      rating: 4.9,
      reviews: 127,
      experience: "8 years",
      price: "From RM80",
      location: "Kuala Lumpur",
      bio: "Certified anti-aging specialist with 8 years of experience in premium facial treatments.",
    },
    {
      id: "2",
      name: "Aisha Rahman",
      specialty: "Acne & Problem Skin",
      rating: 5.0,
      reviews: 98,
      experience: "6 years",
      price: "From RM75",
      location: "Petaling Jaya",
      bio: "Expert in treating acne and problem skin with natural and clinical methods.",
    },
    {
      id: "3",
      name: "Emily Tan",
      specialty: "Brightening & Glow",
      rating: 4.8,
      reviews: 156,
      experience: "10 years",
      price: "From RM85",
      location: "Subang Jaya",
      bio: "Specializing in brightening treatments and achieving that natural glow.",
    },
    {
      id: "4",
      name: "Maya Singh",
      specialty: "Hydration Therapy",
      rating: 4.9,
      reviews: 89,
      experience: "7 years",
      price: "From RM70",
      location: "Shah Alam",
      bio: "Deep hydration and moisture therapy specialist for dry and sensitive skin.",
    },
    {
      id: "5",
      name: "Lisa Wong",
      specialty: "Classic Facial",
      rating: 4.7,
      reviews: 142,
      experience: "12 years",
      price: "From RM60",
      location: "Cheras",
      bio: "Traditional and modern facial techniques for all skin types.",
    },
    {
      id: "6",
      name: "Fatima Abdullah",
      specialty: "Organic Treatments",
      rating: 5.0,
      reviews: 76,
      experience: "5 years",
      price: "From RM90",
      location: "Ampang",
      bio: "100% organic and natural facial treatments using premium botanical ingredients.",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-screen-xl px-6 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">Browse Therapists</h1>
          <p className="text-muted-foreground">
            Find certified therapists for your facial treatment needs
          </p>
        </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border bg-background px-4 py-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search therapists..."
                className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-3 rounded-lg border bg-background px-4 py-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Location"
                className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-3 rounded-lg border bg-background px-4 py-3">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <select className="flex-1 bg-transparent outline-none">
                <option>All Specialties</option>
                <option>Anti-Aging</option>
                <option>Acne Treatment</option>
                <option>Brightening</option>
                <option>Hydration</option>
                <option>Classic Facial</option>
                <option>Organic Treatments</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Therapists Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {therapists.map((therapist) => (
          <Card
            key={therapist.id}
            className="cursor-pointer transition-all hover:shadow-lg hover:border-primary"
          >
            <CardHeader>
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-3xl font-bold text-primary">
                {therapist.name.split(' ').map(n => n[0]).join('')}
              </div>
              <CardTitle className="text-xl">{therapist.name}</CardTitle>
              <CardDescription className="text-base font-medium text-primary">
                {therapist.specialty}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {therapist.bio}
              </p>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="font-semibold">{therapist.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({therapist.reviews} reviews)
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{therapist.location}</span>
              </div>
              <div className="flex items-center justify-between pt-3 border-t">
                <span className="text-sm text-muted-foreground">
                  {therapist.experience}
                </span>
                <span className="font-semibold text-primary">{therapist.price}</span>
              </div>
              <Link to="/dashboard/book/$therapistId" params={{ therapistId: therapist.id }}>
                <Button className="w-full mt-2">Book Now</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      </div>
    </div>
  );
}
