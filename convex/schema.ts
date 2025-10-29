import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v, Infer } from "convex/values";

export const CURRENCIES = {
  USD: "usd",
  EUR: "eur",
} as const;
export const currencyValidator = v.union(
  v.literal(CURRENCIES.USD),
  v.literal(CURRENCIES.EUR),
);
export type Currency = Infer<typeof currencyValidator>;

export const INTERVALS = {
  MONTH: "month",
  YEAR: "year",
} as const;
export const intervalValidator = v.union(
  v.literal(INTERVALS.MONTH),
  v.literal(INTERVALS.YEAR),
);
export type Interval = Infer<typeof intervalValidator>;

export const PLANS = {
  FREE: "free",
  PRO: "pro",
} as const;
export const planKeyValidator = v.union(
  v.literal(PLANS.FREE),
  v.literal(PLANS.PRO),
);
export type PlanKey = Infer<typeof planKeyValidator>;

const priceValidator = v.object({
  stripeId: v.string(),
  amount: v.number(),
});
const pricesValidator = v.object({
  [CURRENCIES.USD]: priceValidator,
  [CURRENCIES.EUR]: priceValidator,
});

// User roles
export const USER_ROLES = {
  CUSTOMER: "customer",
  THERAPIST: "therapist",
} as const;
export const roleValidator = v.union(
  v.literal(USER_ROLES.CUSTOMER),
  v.literal(USER_ROLES.THERAPIST),
);
export type UserRole = Infer<typeof roleValidator>;

// Booking status
export const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;
export const bookingStatusValidator = v.union(
  v.literal(BOOKING_STATUS.PENDING),
  v.literal(BOOKING_STATUS.CONFIRMED),
  v.literal(BOOKING_STATUS.IN_PROGRESS),
  v.literal(BOOKING_STATUS.COMPLETED),
  v.literal(BOOKING_STATUS.CANCELLED),
);
export type BookingStatus = Infer<typeof bookingStatusValidator>;

// Payment status
export const PAYMENT_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;
export const paymentStatusValidator = v.union(
  v.literal(PAYMENT_STATUS.PENDING),
  v.literal(PAYMENT_STATUS.COMPLETED),
  v.literal(PAYMENT_STATUS.FAILED),
  v.literal(PAYMENT_STATUS.REFUNDED),
);
export type PaymentStatus = Infer<typeof paymentStatusValidator>;

const schema = defineSchema({
  ...authTables,
  users: defineTable({
    name: v.optional(v.string()),
    username: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    customerId: v.optional(v.string()),
    // Role-based fields
    role: v.optional(roleValidator),
    createdAt: v.optional(v.number()),
  })
    .index("email", ["email"])
    .index("customerId", ["customerId"])
    .index("role", ["role"]),
  plans: defineTable({
    key: planKeyValidator,
    stripeId: v.string(),
    name: v.string(),
    description: v.string(),
    prices: v.object({
      [INTERVALS.MONTH]: pricesValidator,
      [INTERVALS.YEAR]: pricesValidator,
    }),
  })
    .index("key", ["key"])
    .index("stripeId", ["stripeId"]),
  subscriptions: defineTable({
    userId: v.id("users"),
    planId: v.id("plans"),
    priceStripeId: v.string(),
    stripeId: v.string(),
    currency: currencyValidator,
    interval: intervalValidator,
    status: v.string(),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    cancelAtPeriodEnd: v.boolean(),
  })
    .index("userId", ["userId"])
    .index("stripeId", ["stripeId"]),
  categories: defineTable({
    name: v.string(),
    description: v.string(),
    icon: v.string(),
    slug: v.string(),
    providerCount: v.number(),
  }).index("slug", ["slug"]),
  stats: defineTable({
    key: v.string(),
    value: v.number(),
  }).index("key", ["key"]),

  // Therapist profiles (for users with therapist role)
  therapists: defineTable({
    userId: v.id("users"),
    specialty: v.string(),
    bio: v.optional(v.string()),
    experience: v.string(), // e.g., "8 years"
    certifications: v.optional(v.array(v.string())),
    location: v.string(),
    serviceArea: v.array(v.string()), // areas they serve
    rating: v.optional(v.number()),
    reviewCount: v.optional(v.number()),
    priceRange: v.object({
      min: v.number(),
      max: v.number(),
    }),
    availability: v.optional(v.array(v.object({
      day: v.string(), // "monday", "tuesday", etc.
      slots: v.array(v.string()), // ["09:00", "10:00", "11:00"]
    }))),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("userId", ["userId"])
    .index("location", ["location"])
    .index("specialty", ["specialty"])
    .index("isActive", ["isActive"]),

  // Bookings
  bookings: defineTable({
    customerId: v.id("users"),
    therapistId: v.id("users"),
    therapistProfileId: v.id("therapists"),
    treatmentType: v.string(),
    scheduledDate: v.number(),
    scheduledTime: v.string(), // e.g., "14:00"
    duration: v.number(), // in minutes
    address: v.string(),
    location: v.object({
      lat: v.optional(v.number()),
      lng: v.optional(v.number()),
    }),
    status: bookingStatusValidator,
    price: v.number(),
    currency: v.string(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("customerId", ["customerId"])
    .index("therapistId", ["therapistId"])
    .index("status", ["status"])
    .index("scheduledDate", ["scheduledDate"]),

  // Payments (for bookings)
  payments: defineTable({
    bookingId: v.id("bookings"),
    customerId: v.id("users"),
    therapistId: v.id("users"),
    amount: v.number(),
    currency: v.string(),
    status: paymentStatusValidator,
    stripePaymentIntentId: v.optional(v.string()),
    paymentMethod: v.optional(v.string()), // "card", "online_banking", etc.
    paidAt: v.optional(v.number()),
    refundedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("bookingId", ["bookingId"])
    .index("customerId", ["customerId"])
    .index("therapistId", ["therapistId"])
    .index("status", ["status"]),

  // Notifications
  notifications: defineTable({
    userId: v.id("users"),
    type: v.string(), // "booking_confirmed", "payment_received", "booking_reminder", etc.
    title: v.string(),
    message: v.string(),
    relatedId: v.optional(v.string()), // booking ID or payment ID
    relatedType: v.optional(v.string()), // "booking", "payment"
    isRead: v.boolean(),
    createdAt: v.number(),
  })
    .index("userId", ["userId"])
    .index("isRead", ["isRead"])
    .index("createdAt", ["createdAt"]),

  // Reviews
  reviews: defineTable({
    bookingId: v.id("bookings"),
    customerId: v.id("users"),
    therapistId: v.id("users"),
    rating: v.number(), // 1-5
    comment: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("bookingId", ["bookingId"])
    .index("customerId", ["customerId"])
    .index("therapistId", ["therapistId"]),
});

export default schema;
