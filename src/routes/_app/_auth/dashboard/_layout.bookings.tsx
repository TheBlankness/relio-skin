import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Calendar, Clock, MapPin, User } from "lucide-react";

export const Route = createFileRoute("/_app/_auth/dashboard/_layout/bookings")({
  component: BookingsPage,
});

function BookingsPage() {
  // Mock data - replace with actual Convex query
  const bookings = [
    {
      id: "1",
      therapist: "Sarah Chen",
      specialty: "Anti-Aging Specialist",
      treatmentType: "Anti-Aging Facial",
      date: "2025-11-05",
      time: "14:00",
      duration: "90 mins",
      address: "123 Jalan Ampang, Kuala Lumpur",
      status: "confirmed",
      price: "RM80",
    },
    {
      id: "2",
      therapist: "Aisha Rahman",
      specialty: "Acne & Problem Skin",
      treatmentType: "Acne Treatment",
      date: "2025-11-10",
      time: "10:00",
      duration: "60 mins",
      address: "45 Jalan SS2, Petaling Jaya",
      status: "pending",
      price: "RM75",
    },
    {
      id: "3",
      therapist: "Emily Tan",
      specialty: "Brightening & Glow",
      treatmentType: "Brightening Facial",
      date: "2025-10-20",
      time: "16:00",
      duration: "75 mins",
      address: "78 Jalan USJ 1, Subang Jaya",
      status: "completed",
      price: "RM85",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      confirmed: "default",
      pending: "secondary",
      completed: "outline",
      cancelled: "destructive",
    };

    return (
      <Badge variant={variants[status] || "outline"} className="capitalize">
        {status}
      </Badge>
    );
  };

  const upcomingBookings = bookings.filter(b => b.status === "confirmed" || b.status === "pending");
  const pastBookings = bookings.filter(b => b.status === "completed" || b.status === "cancelled");

  return (
    <div className="mx-auto w-full max-w-screen-xl px-6 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">My Bookings</h1>
          <p className="text-muted-foreground">
            View and manage your facial treatment appointments
          </p>
        </div>

      {/* Upcoming Bookings */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-foreground">Upcoming Bookings</h2>
        <div className="grid gap-4">
          {upcomingBookings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No upcoming bookings</p>
              </CardContent>
            </Card>
          ) : (
            upcomingBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{booking.treatmentType}</CardTitle>
                      <CardDescription className="mt-1">
                        with {booking.therapist}
                      </CardDescription>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(booking.date).toLocaleDateString('en-MY', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.time} ({booking.duration})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.address}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="font-semibold text-primary">{booking.price}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Past Bookings */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-foreground">Past Bookings</h2>
        <div className="grid gap-4">
          {pastBookings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No past bookings</p>
              </CardContent>
            </Card>
          ) : (
            pastBookings.map((booking) => (
              <Card key={booking.id} className="opacity-75">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{booking.treatmentType}</CardTitle>
                      <CardDescription className="mt-1">
                        with {booking.therapist}
                      </CardDescription>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(booking.date).toLocaleDateString('en-MY', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.time} ({booking.duration})</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="font-semibold">{booking.price}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
