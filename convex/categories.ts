import { query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const stats = await ctx.db.query("stats").collect();
    return {
      totalServices: stats.find((s) => s.key === "totalServices")?.value || 150,
      totalProviders: stats.find((s) => s.key === "totalProviders")?.value || 500,
      totalBookings: stats.find((s) => s.key === "totalBookings")?.value || 2500,
    };
  },
});
