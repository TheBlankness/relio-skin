import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { USER_ROLES } from "./schema";

// Get all active therapists with optional filters
export const list = query({
  args: {
    location: v.optional(v.string()),
    specialty: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let therapistsQuery = ctx.db
      .query("therapists")
      .withIndex("isActive", (q) => q.eq("isActive", true));

    const therapists = await therapistsQuery.collect();

    // Filter by location if provided
    let filtered = therapists;
    if (args.location) {
      filtered = filtered.filter(
        (t) => t.location.toLowerCase().includes(args.location!.toLowerCase())
      );
    }

    // Filter by specialty if provided
    if (args.specialty) {
      filtered = filtered.filter(
        (t) => t.specialty.toLowerCase().includes(args.specialty!.toLowerCase())
      );
    }

    // Limit results
    if (args.limit) {
      filtered = filtered.slice(0, args.limit);
    }

    // Get user info for each therapist
    const therapistsWithUser = await Promise.all(
      filtered.map(async (therapist) => {
        const user = await ctx.db.get(therapist.userId);
        return {
          ...therapist,
          userName: user?.name,
          userImage: user?.image,
        };
      })
    );

    return therapistsWithUser;
  },
});

// Get a single therapist by ID
export const get = query({
  args: { id: v.id("therapists") },
  handler: async (ctx, args) => {
    const therapist = await ctx.db.get(args.id);
    if (!therapist) {
      return null;
    }

    const user = await ctx.db.get(therapist.userId);
    return {
      ...therapist,
      userName: user?.name,
      userEmail: user?.email,
      userPhone: user?.phone,
      userImage: user?.image,
    };
  },
});

// Get therapist profile for current user (if they are a therapist)
export const getMyProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user || user.role !== USER_ROLES.THERAPIST) {
      return null;
    }

    const therapist = await ctx.db
      .query("therapists")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .first();

    return therapist;
  },
});

// Create or update therapist profile
export const upsertProfile = mutation({
  args: {
    specialty: v.string(),
    bio: v.optional(v.string()),
    experience: v.string(),
    certifications: v.optional(v.array(v.string())),
    location: v.string(),
    serviceArea: v.array(v.string()),
    priceRange: v.object({
      min: v.number(),
      max: v.number(),
    }),
    availability: v.optional(
      v.array(
        v.object({
          day: v.string(),
          slots: v.array(v.string()),
        })
      )
    ),
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

    // Update user role to therapist if not already
    if (user.role !== USER_ROLES.THERAPIST) {
      await ctx.db.patch(user._id, {
        role: USER_ROLES.THERAPIST,
      });
    }

    // Check if therapist profile already exists
    const existingProfile = await ctx.db
      .query("therapists")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .first();

    if (existingProfile) {
      // Update existing profile
      await ctx.db.patch(existingProfile._id, {
        ...args,
      });
      return existingProfile._id;
    } else {
      // Create new profile
      const therapistId = await ctx.db.insert("therapists", {
        userId: user._id,
        ...args,
        rating: 0,
        reviewCount: 0,
        isActive: true,
        createdAt: Date.now(),
      });
      return therapistId;
    }
  },
});
