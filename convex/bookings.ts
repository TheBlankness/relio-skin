import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { BOOKING_STATUS, bookingStatusValidator } from "./schema";

// Get bookings for customer
export const getMyBookings = query({
  args: {
    status: v.optional(bookingStatusValidator),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) {
      return [];
    }

    let bookingsQuery = ctx.db
      .query("bookings")
      .withIndex("customerId", (q) => q.eq("customerId", user._id));

    const bookings = await bookingsQuery.collect();

    // Filter by status if provided
    const filtered = args.status
      ? bookings.filter((b) => b.status === args.status)
      : bookings;

    // Enrich with therapist and payment info
    const enriched = await Promise.all(
      filtered.map(async (booking) => {
        const therapist = await ctx.db.get(booking.therapistProfileId);
        const therapistUser = therapist
          ? await ctx.db.get(therapist.userId)
          : null;
        const payment = await ctx.db
          .query("payments")
          .withIndex("bookingId", (q) => q.eq("bookingId", booking._id))
          .first();

        return {
          ...booking,
          therapist: therapist
            ? {
                ...therapist,
                userName: therapistUser?.name,
                userImage: therapistUser?.image,
              }
            : null,
          payment,
        };
      })
    );

    return enriched.sort((a, b) => b.scheduledDate - a.scheduledDate);
  },
});

// Get bookings for therapist (service provider)
export const getTherapistBookings = query({
  args: {
    status: v.optional(bookingStatusValidator),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) {
      return [];
    }

    let bookingsQuery = ctx.db
      .query("bookings")
      .withIndex("therapistId", (q) => q.eq("therapistId", user._id));

    const bookings = await bookingsQuery.collect();

    // Filter by status if provided
    const filtered = args.status
      ? bookings.filter((b) => b.status === args.status)
      : bookings;

    // Enrich with customer and payment info
    const enriched = await Promise.all(
      filtered.map(async (booking) => {
        const customer = await ctx.db.get(booking.customerId);
        const payment = await ctx.db
          .query("payments")
          .withIndex("bookingId", (q) => q.eq("bookingId", booking._id))
          .first();

        return {
          ...booking,
          customer: customer
            ? {
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                image: customer.image,
              }
            : null,
          payment,
        };
      })
    );

    return enriched.sort((a, b) => b.scheduledDate - a.scheduledDate);
  },
});

// Create a new booking
export const create = mutation({
  args: {
    therapistId: v.id("users"),
    therapistProfileId: v.id("therapists"),
    treatmentType: v.string(),
    scheduledDate: v.number(),
    scheduledTime: v.string(),
    duration: v.number(),
    address: v.string(),
    location: v.object({
      lat: v.optional(v.number()),
      lng: v.optional(v.number()),
    }),
    price: v.number(),
    currency: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Create booking
    const bookingId = await ctx.db.insert("bookings", {
      customerId: user._id,
      ...args,
      status: BOOKING_STATUS.PENDING,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Create notification for therapist
    await ctx.db.insert("notifications", {
      userId: args.therapistId,
      type: "new_booking",
      title: "New Booking Request",
      message: `You have a new booking request from ${user.name || "a customer"}`,
      relatedId: bookingId,
      relatedType: "booking",
      isRead: false,
      createdAt: Date.now(),
    });

    return bookingId;
  },
});

// Update booking status (therapist can confirm/cancel)
export const updateStatus = mutation({
  args: {
    bookingId: v.id("bookings"),
    status: bookingStatusValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const booking = await ctx.db.get(args.bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Only therapist or customer can update status
    if (booking.therapistId !== user._id && booking.customerId !== user._id) {
      throw new Error("Not authorized");
    }

    // Update booking
    await ctx.db.patch(args.bookingId, {
      status: args.status,
      updatedAt: Date.now(),
    });

    // Create notification for the other party
    const notifyUserId =
      booking.therapistId === user._id
        ? booking.customerId
        : booking.therapistId;

    let notificationMessage = "";
    if (args.status === BOOKING_STATUS.CONFIRMED) {
      notificationMessage = "Your booking has been confirmed!";
    } else if (args.status === BOOKING_STATUS.CANCELLED) {
      notificationMessage = "Your booking has been cancelled.";
    } else if (args.status === BOOKING_STATUS.COMPLETED) {
      notificationMessage = "Your booking has been completed.";
    }

    if (notificationMessage) {
      await ctx.db.insert("notifications", {
        userId: notifyUserId,
        type: "booking_status_update",
        title: "Booking Status Update",
        message: notificationMessage,
        relatedId: args.bookingId,
        relatedType: "booking",
        isRead: false,
        createdAt: Date.now(),
      });
    }

    return args.bookingId;
  },
});
