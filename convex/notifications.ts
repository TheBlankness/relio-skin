import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get notifications for current user
export const getMyNotifications = query({
  args: {
    unreadOnly: v.optional(v.boolean()),
    limit: v.optional(v.number()),
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

    let notificationsQuery = ctx.db
      .query("notifications")
      .withIndex("userId", (q) => q.eq("userId", user._id));

    const notifications = await notificationsQuery.collect();

    // Filter by read status if requested
    let filtered = notifications;
    if (args.unreadOnly) {
      filtered = filtered.filter((n) => !n.isRead);
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => b.createdAt - a.createdAt);

    // Limit results
    if (args.limit) {
      filtered = filtered.slice(0, args.limit);
    }

    return filtered;
  },
});

// Get unread count
export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return 0;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) {
      return 0;
    }

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .collect();

    return notifications.filter((n) => !n.isRead).length;
  },
});

// Mark notification as read
export const markAsRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const notification = await ctx.db.get(args.notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user || notification.userId !== user._id) {
      throw new Error("Not authorized");
    }

    await ctx.db.patch(args.notificationId, {
      isRead: true,
    });

    return args.notificationId;
  },
});

// Mark all notifications as read
export const markAllAsRead = mutation({
  args: {},
  handler: async (ctx) => {
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

    const notifications = await ctx.db
      .query("notifications")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .collect();

    const unreadNotifications = notifications.filter((n) => !n.isRead);

    await Promise.all(
      unreadNotifications.map((n) =>
        ctx.db.patch(n._id, {
          isRead: true,
        })
      )
    );

    return unreadNotifications.length;
  },
});
