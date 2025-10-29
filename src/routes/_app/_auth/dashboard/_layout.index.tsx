import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Users, TrendingUp, Clock } from "lucide-react";
import { cn } from "@/utils/misc.js";
import { buttonVariants } from "@/ui/button-util";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import siteConfig from "~/site.config";

export const Route = createFileRoute("/_app/_auth/dashboard/_layout/")({
  component: Dashboard,
  beforeLoad: () => ({
    title: `${siteConfig.siteTitle} - Dashboard`,
    headerTitle: "Dashboard",
    headerDescription: "Your RelioSkin Dashboard - Book treatments and manage appointments",
  }),
});

export default function Dashboard() {
  // Mock data - replace with actual Convex queries
  const stats = {
    upcomingBookings: 2,
    completedTreatments: 8,
    favoriteTherapists: 3,
  };

  const upcomingBooking = {
    therapist: "Sarah Chen",
    treatment: "Anti-Aging Facial",
    date: "Nov 5, 2025",
    time: "14:00",
  };

  return (
    <div className="mx-auto w-full max-w-screen-xl px-6 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">Welcome Back!</h1>
          <p className="text-muted-foreground">
            Here's an overview of your RelioSkin activity
          </p>
        </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Bookings
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingBookings}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled appointments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Treatments
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedTreatments}</div>
            <p className="text-xs text-muted-foreground">
              Total sessions completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Favorite Therapists
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.favoriteTherapists}</div>
            <p className="text-xs text-muted-foreground">
              Trusted professionals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Next Appointment */}
      {upcomingBooking && (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Next Appointment</CardTitle>
            <CardDescription>Your upcoming facial treatment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {upcomingBooking.treatment}
                </p>
                <p className="text-sm text-muted-foreground">
                  with {upcomingBooking.therapist}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{upcomingBooking.date} at {upcomingBooking.time}</span>
              </div>
            </div>
            <Link
              to="/dashboard/bookings"
              className={cn(buttonVariants({ size: "sm" }), "w-full")}
            >
              View All Bookings
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary">
          <Link to="/dashboard/therapists">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Browse Therapists
              </CardTitle>
              <CardDescription>
                Find and book certified facial therapists near you
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary">
          <Link to="/dashboard/bookings">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                My Bookings
              </CardTitle>
              <CardDescription>
                View and manage your upcoming and past appointments
              </CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>
      </div>
    </div>
  );
}
