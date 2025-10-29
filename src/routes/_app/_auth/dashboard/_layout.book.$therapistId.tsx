import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { Calendar, Clock, MapPin, User, DollarSign, CheckCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/_auth/dashboard/_layout/book/$therapistId")({
  component: BookTherapistPage,
});


function BookTherapistPage() {
  const { therapistId } = Route.useParams();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedTreatment, setSelectedTreatment] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Mock data - replace with actual Convex query using therapistId
  const therapist = {
    id: therapistId,
    name: "Sarah Chen",
    specialty: "Anti-Aging Specialist",
    rating: 4.9,
    reviews: 127,
    experience: "8 years",
    location: "Kuala Lumpur",
    image: "SC",
  };

  const treatments = [
    { id: "1", name: "Classic Facial", duration: "60 mins", price: 80 },
    { id: "2", name: "Anti-Aging Treatment", duration: "90 mins", price: 120 },
    { id: "3", name: "Deep Cleansing Facial", duration: "75 mins", price: 95 },
    { id: "4", name: "Hydration Therapy", duration: "60 mins", price: 85 },
  ];

  const availableTimes = [
    "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  // Generate next 14 days
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return date.toISOString().split('T')[0];
  });

  const selectedTreatmentData = treatments.find(t => t.id === selectedTreatment);

  const handleBooking = () => {
    // Here you would call your Convex mutation to create the booking
    console.log({
      therapistId,
      treatment: selectedTreatmentData,
      date: selectedDate,
      time: selectedTime,
      address,
      notes,
    });

    // Navigate to bookings page
    navigate({ to: "/dashboard/bookings" });
  };

  const canBook = selectedDate && selectedTime && selectedTreatment && address;

  return (
    <div className="mx-auto w-full max-w-screen-xl px-6 py-8">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-foreground">Book Appointment</h1>
          <p className="text-muted-foreground">
            Schedule your facial treatment with {therapist.name}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Therapist Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-2xl font-bold text-primary">
                    {therapist.image}
                  </div>
                  <div>
                    <CardTitle>{therapist.name}</CardTitle>
                    <CardDescription>{therapist.specialty}</CardDescription>
                    <div className="flex items-center gap-2 mt-1 text-sm">
                      <MapPin className="h-3 w-3" />
                      <span>{therapist.location}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Treatment Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Treatment</CardTitle>
                <CardDescription>Choose the facial treatment you'd like</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {treatments.map((treatment) => (
                    <div
                      key={treatment.id}
                      className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                        selectedTreatment === treatment.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedTreatment(treatment.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{treatment.name}</p>
                          <p className="text-sm text-muted-foreground">{treatment.duration}</p>
                        </div>
                        <p className="font-semibold text-primary">RM{treatment.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Date Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
                <CardDescription>Choose an available date</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                  {availableDates.map((date) => {
                    const dateObj = new Date(date);
                    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                    const dayNum = dateObj.getDate();

                    return (
                      <button
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`flex flex-col items-center gap-1 rounded-lg border-2 p-3 transition-all ${
                          selectedDate === date
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <span className="text-xs text-muted-foreground">{dayName}</span>
                        <span className="text-lg font-semibold">{dayNum}</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Time Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Time</CardTitle>
                <CardDescription>Choose your preferred time slot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`rounded-lg border-2 p-3 text-sm font-medium transition-all ${
                        selectedTime === time
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Address & Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Service Location</CardTitle>
                <CardDescription>Where should we come to?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Your Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter your full address..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Special Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special requirements or preferences..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTreatmentData && (
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{selectedTreatmentData.name}</p>
                        <p className="text-xs text-muted-foreground">{selectedTreatmentData.duration}</p>
                      </div>
                    </div>

                    {selectedDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">
                          {new Date(selectedDate).toLocaleDateString('en-MY', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    )}

                    {selectedTime && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">{selectedTime}</p>
                      </div>
                    )}

                    <div className="border-t pt-3 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Service Fee</span>
                        <span className="font-semibold">RM{selectedTreatmentData.price}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-semibold">Total</span>
                        <span className="text-lg font-bold text-primary">RM{selectedTreatmentData.price}</span>
                      </div>
                    </div>
                  </div>
                )}

                {!selectedTreatmentData && (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Select a treatment to see booking details
                  </p>
                )}

                <Button
                  className="w-full"
                  disabled={!canBook}
                  onClick={handleBooking}
                >
                  Confirm Booking
                </Button>

                {!canBook && (
                  <p className="text-xs text-center text-muted-foreground">
                    Please complete all fields above
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
